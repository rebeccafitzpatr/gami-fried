#!/usr/bin/env bash
set -euo pipefail

# Preflight: verify required labels exist in the target repo for bulk issue creation
# Usage:
#   ./scripts/prflight.sh [CSV_PATH] [REPO] [--apply]
# - CSV_PATH: path to issues.csv (default: issues.csv in repo root)
# - REPO: owner/repo (default: rebeccafitzpatr/gami-fried)
# - --apply: if present, create any missing labels via gh label create

CSV_PATH="${1:-issues.csv}"
REPO="${2:-rebeccafitzpatr/gami-fried}"
APPLY="${3:-}"

LOG_DIR="${LOG_DIR:-$(pwd)/logs}"
LOG_FILE="$LOG_DIR/prflight.log"

mkdir -p "$LOG_DIR"
# Mirror stdout/stderr to log file for full trace
exec > >(tee -a "$LOG_FILE") 2>&1

# Prerequisites
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

export CSV_PATH
export REPO
export APPLY

# Compute missing labels by parsing the CSV (robust parsing in Python)
missing_labels=$(python3 - << 'PY'
import csv, os, subprocess
csv_path = os.environ['CSV_PATH']
repo = os.environ['REPO']

# Fetch existing labels from the GitHub repo
try:
    proc = subprocess.run(['gh', 'label', 'list', '--repo', repo], capture_output=True, text=True, check=False)
    existing = set()
    if proc.returncode == 0:
        for line in proc.stdout.splitlines():
            if not line.strip():
                continue
            name = line.strip().split()[0]
            existing.add(name)
except Exception:
    existing = set()

# Collect labels used in the CSV
used = set()
with open(csv_path, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        for lab in [l.strip() for l in (row.get('labels') or '').split(',') if l.strip()]:
            used.add(lab)

missing = sorted(used - existing)
print("\n".join(missing))
PY
)

if [ -z "$missing_labels" ]; then
  echo "No missing labels detected."
else
  echo "Missing labels detected (to create):"; echo "$missing_labels";
fi

if [ "${APPLY,,}" = "--apply" ] || [ "${APPLY,,}" = "true" ]; then
  if [ -n "$missing_labels" ]; then
    echo "Applying missing labels..."
    while IFS= read -r lab; do
      if [ -n "$lab" ]; then
        gh label create "$lab" --repo "$REPO" --color "#E0E0E0" || echo "Warning: failed to create label '$lab'"
      fi
    done <<< "$missing_labels"
  else
    echo "No labels to apply."
  fi
fi

echo "Preflight complete."
