#!/usr/bin/env python3
"""
Appwrite Whisky Database Backup Script

Downloads all collection data to data.json and all storage images to images/
inside a dated backup directory.

Usage:
    python backup.py

Configuration via environment variables or a .env file:
    APPWRITE_ENDPOINT    - API endpoint (default: https://fra.cloud.appwrite.io/v1)
    APPWRITE_PROJECT_ID  - Appwrite project ID (required)
    APPWRITE_API_KEY     - Appwrite API key with read access (required)
    BACKUP_OUTPUT_DIR    - Output base directory (default: ./backups)
"""

from __future__ import annotations

import json
import os
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed; fall back to environment variables

from appwrite.client import Client
from appwrite.services.tables_db import TablesDB
from appwrite.services.storage import Storage
from appwrite.query import Query

# --- Constants ---
DATABASE_ID = "whisky-database"
BUCKET_ID = "whiskies"
COLLECTIONS = ["whiskies", "distilleries", "regions", "series", "bottlers"]
PAGE_SIZE = 100

# --- Configuration ---
ENDPOINT = os.environ.get("APPWRITE_ENDPOINT", "https://fra.cloud.appwrite.io/v1")
PROJECT_ID = os.environ.get("APPWRITE_PROJECT_ID", "")
API_KEY = os.environ.get("APPWRITE_API_KEY", "")
OUTPUT_DIR = os.environ.get("BACKUP_OUTPUT_DIR", "./backups")


def build_client() -> Client:
    if not PROJECT_ID:
        print("ERROR: APPWRITE_PROJECT_ID is not set.", file=sys.stderr)
        sys.exit(1)
    if not API_KEY:
        print("ERROR: APPWRITE_API_KEY is not set.", file=sys.stderr)
        sys.exit(1)

    client = Client()
    client.set_endpoint(ENDPOINT)
    client.set_project(PROJECT_ID)
    client.set_key(API_KEY)
    return client


def fetch_all_rows(tdb: TablesDB, table_id: str) -> list[dict]:
    """Fetch every row from a table using offset pagination."""
    rows = []
    offset = 0

    while True:
        result = tdb.list_rows(
            database_id=DATABASE_ID,
            table_id=table_id,
            queries=[Query.limit(PAGE_SIZE), Query.offset(offset)],
        )
        batch = result.rows
        rows.extend([row.to_dict() for row in batch])
        total = int(result.total)
        print(f"    {len(rows)} / {total} rows")
        if len(rows) >= total:
            break
        offset += PAGE_SIZE

    return rows


def fetch_all_file_metadata(storage: Storage) -> list:
    """List metadata for every file in the storage bucket using offset pagination."""
    files = []
    offset = 0

    while True:
        result = storage.list_files(
            bucket_id=BUCKET_ID,
            queries=[Query.limit(PAGE_SIZE), Query.offset(offset)],
        )
        batch = result.files
        files.extend(batch)
        total = int(result.total)
        print(f"    {len(files)} / {total} files listed")
        if len(files) >= total:
            break
        offset += PAGE_SIZE

    return files


def download_images(storage: Storage, files: list, images_dir: Path) -> None:
    """Download each file from the bucket to images_dir."""
    images_dir.mkdir(parents=True, exist_ok=True)

    for i, file in enumerate(files, 1):
        file_id = file.id
        filename = file.name
        dest = images_dir / filename
        print(f"    [{i}/{len(files)}] {filename}")
        data = storage.get_file_download(bucket_id=BUCKET_ID, file_id=file_id)
        dest.write_bytes(data)


def main() -> None:
    client = build_client()
    tdb = TablesDB(client)
    storage = Storage(client)

    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    backup_dir = Path(OUTPUT_DIR) / f"whisky-database-backup_{date_str}"
    backup_dir.mkdir(parents=True, exist_ok=True)

    exported_at = datetime.now(timezone.utc).isoformat()
    collection_data: dict[str, list] = {}

    # --- Export collections ---
    print("\nExporting collections...")
    for table_id in COLLECTIONS:
        print(f"  [{table_id}]")
        rows = fetch_all_rows(tdb, table_id)
        collection_data[table_id] = rows
        print(f"  -> {len(rows)} rows exported\n")

    data_file = backup_dir / "data.json"
    payload = {
        "exported_at": exported_at,
        "database_id": DATABASE_ID,
        "collections": collection_data,
    }
    data_file.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Data written to: {data_file}\n")

    # --- Export images ---
    print("Exporting images...")
    files = fetch_all_file_metadata(storage)

    if files:
        images_dir = backup_dir / "images"
        download_images(storage, files, images_dir)
        print(f"\n{len(files)} image(s) saved to: {images_dir}")
    else:
        print("  No files found in bucket.")

    # --- Zip the backup directory ---
    zip_base = str(backup_dir)
    zip_path = shutil.make_archive(zip_base, "zip", root_dir=backup_dir.parent, base_dir=backup_dir.name)
    shutil.rmtree(backup_dir)
    print(f"\nBackup complete: {zip_path}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
