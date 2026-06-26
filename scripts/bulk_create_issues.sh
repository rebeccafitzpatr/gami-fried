#!/usr/bin/env bash
set -euo pipefail

# Bulk create GitHub issues from a CSV file.
# CSV format (header): title,body,labels,assignees,milestone
# - labels: comma-separated list of labels
# - assignees: comma-separated list of usernames (empty if unassigned)
# - milestone: optional; if empty, omit

CSV_PATH="${1:-/home/pop/Documents/repos/gami-fried/issues.csv}"
REPO="${2:-rebeccafitzpatr/gami-fried}"

# Logging setup
LOG_DIR="${LOG_DIR:-$(pwd)/logs}"
LOG_FILE="$LOG_DIR/bulk_create_issues.log"
PY_LOG="${LOG_DIR}/bulk_create_issues_py.log"

mkdir -p "$LOG_DIR"
# Mirror stdout/stderr to log file for full trace
exec > >(tee -a "$LOG_FILE") 2>&1

# Optional dry-run mode (set in environment or pass as 3rd arg to script)
DRY_RUN=${3:-false}
if [ "${DRY_RUN,,}" = "true" ]; then
  echo "DRY-RUN mode enabled: no GitHub calls will be executed."
fi

if ! command -v gh >/dev/null 1>&2; then
  echo "Error: gh CLI is not installed. Install it from https://cli.github.com/ and run gh auth login." >&2
  exit 1
fi

if [ ! -f "$CSV_PATH" ]; then
  echo "CSV file not found: $CSV_PATH" >&2
  exit 1
fi

# Ensure gh is authenticated
gh auth status >/dev/null 2>&1 || { echo "gh is not authenticated. Run: gh auth login"; exit 1; }

# Export environment vars for Python to read
export CSV_PATH
export REPO
export PY_LOG
export DRY_RUN

# Python block now reads from environment variables
python3 - << 'PY'
import csv, sys, os, subprocess, logging
csv_path = os.environ['CSV_PATH']
repo = os.environ['REPO']
log_path = os.environ.get('PY_LOG', '/tmp/bulk_create_issues_py.log')

os.makedirs(os.path.dirname(log_path), exist_ok=True)
logging.basicConfig(filename=log_path, level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
pylog = lambda msg: logging.info(msg)

total = 0
created = 0
failed = []

with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        total += 1
        title = (row.get('title') or '').strip()
        body = (row.get('body') or '').strip()
        labels_raw = (row.get('labels') or '')
        labels = [l.strip() for l in labels_raw.split(',') if l.strip()]
        assignees_raw = (row.get('assignees') or '')
        assignees = [a.strip() for a in assignees_raw.split(',') if a.strip()]
        milestone = (row.get('milestone') or '').strip()

        if not title:
            pylog(f'SKIP: Row {total} has empty title')
            continue

        cmd = ["gh", "issue", "create", "--repo", repo, "--title", title, "--body", body]
        for lab in labels:
            cmd += ["--label", lab]
        for asn in assignees:
            cmd += ["--assignee", asn]
        if milestone:
            cmd += ["--milestone", milestone]

        pylog("CMD: " + " ".join(cmd))
        if os.environ.get('DRY_RUN', 'false').lower() == 'true':
            pylog("DRY-RUN: would execute this GH command")
            created += 0
            continue

        res = subprocess.run(cmd, text=True, capture_output=True)
        if res.returncode == 0:
            url = (res.stdout or '').strip()
            pylog(f'CREATED: {url}')
            created += 1
        else:
            pylog(f'FAILED: {title} (exit {res.returncode})')
            pylog(f'STDERR: {res.stderr.strip()}')
            failed.append(title)

print("SUMMARY:", total, "total; created:", created, "failed:", len(failed))
if failed:
    pylog("Failed titles: " + ", ".join(failed))
PY

# End of Python block

echo "Bulk issue creation complete."
