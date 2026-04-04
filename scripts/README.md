# Whisky Database Backup Script

Downloads all data from the Appwrite whisky-database and saves it locally.

**Output per run** (`backups/whisky-database-backup_YYYY-MM-DD/`):
- `data.json` — all documents from all collections
- `images/` — all files from the storage bucket

## Setup

```bash
cd scripts
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

```
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
```

The API key needs read access to the `whisky-database` database and the `whiskies` storage bucket. Create one in the Appwrite console under **Settings → API Keys**.

## Run

```bash
source .venv/bin/activate   # if not already active
python backup.py
```

Backups are written to `scripts/backups/` and are excluded from git.
