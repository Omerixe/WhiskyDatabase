# Requirements: Appwrite Database Backup Script

## Overview

A Python script that downloads all data from the Appwrite whisky-database and stores it in a timestamped JSON file, and downloads all images from the Appwrite Storage bucket to a local folder. Intended to run once or twice a week as a manual or scheduled task.

---

## Functional Requirements

### Data to Export

The script must export all documents from the following Appwrite database collections:

| Collection     | Collection ID    |
|----------------|-----------------|
| Whiskies       | `whiskies`      |
| Distilleries   | `distilleries`  |
| Regions        | `regions`       |
| Series         | `series`        |
| Bottlers       | `bottlers`      |

- **Database ID:** `whisky-database`
- **Appwrite endpoint:** `https://fra.cloud.appwrite.io/v1`
- All documents in each collection must be fetched, handling pagination where necessary (Appwrite returns max 25 documents per request by default).

### Images to Export

- **Storage bucket ID:** `whiskies`
- All files in the bucket must be listed and downloaded as their original binary files.
- Images are saved into a subdirectory `images/` inside the dated backup folder.
- Each file is saved using its original filename as stored in Appwrite.

### Output Format

- All output for a given run is placed in a dated directory: `./backups/whisky-database-backup_YYYY-MM-DD/`
- The directory contains:
  - `data.json` — all collection documents
  - `images/` — all downloaded image files from the storage bucket
- JSON structure of `data.json`:

```json
{
  "exported_at": "<ISO 8601 timestamp>",
  "database_id": "whisky-database",
  "collections": {
    "whiskies": [ ... ],
    "distilleries": [ ... ],
    "regions": [ ... ],
    "series": [ ... ],
    "bottlers": [ ... ]
  }
}
```

---

## Non-Functional Requirements

- Written in **Python 3.10+**
- Use the official **Appwrite Python SDK** (`appwrite` package on PyPI)
- Authentication via an **Appwrite API key** (not user session), read from environment variables or a `.env` file — never hardcoded
- The script must be runnable standalone: `python backup.py`
- Print progress to stdout (which collection is being fetched, how many documents retrieved, which images are being downloaded)
- Exit with a non-zero status code on failure

---

## Configuration

All sensitive and environment-specific values must be configurable via environment variables (or a `.env` file loaded with `python-dotenv`):

| Variable                    | Description                        |
|-----------------------------|------------------------------------|
| `APPWRITE_ENDPOINT`         | API endpoint URL                   |
| `APPWRITE_PROJECT_ID`       | Appwrite project ID                |
| `APPWRITE_API_KEY`          | Appwrite API key with read access  |
| `BACKUP_OUTPUT_DIR`         | (Optional) Output directory path   |

---

## Implementation Notes

- Use `appwrite.services.Databases` with `list_documents()` to fetch collection data.
- Implement pagination: loop using `Query.limit()` and `Query.offset()` (or cursor-based pagination if supported) until all documents are retrieved.
- The API key must have at least **read access** to the `whisky-database` database, all listed collections, and the `whiskies` storage bucket.
- Use `appwrite.services.Storage` with `list_files()` to enumerate bucket files, then download each file's content using `get_file_download()`.
- Pagination must also be handled for storage file listing.

---

## Out of Scope (v1)

- Automated scheduling (cron setup) — run manually or via system cron externally
- Restore/import functionality
- Incremental backups
- Backup rotation / cleanup of old files
