#!/bin/bash

# ================================================
# update_versions.sh
#
# This script updates the `versions.jsonc` file located inside
# AI_programming_tools_setup/agents/, but based on ROOT project
# versions and dependencies.
# ================================================

set -euo pipefail

echo "Updating versions..."

# -------------------------
# 1. Locate repo root
# -------------------------
# Get the root of the project (where .git is)
repo_root="$(git rev-parse --show-toplevel)"

# Define output file
output_file="$repo_root/AI_programming_tools_setup/agents/versions.jsonc"

# -------------------------
# 2. Capture Node.js version
# -------------------------
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')

# -------------------------
# 3. Capture Python version
# -------------------------
if command -v python &>/dev/null; then
    PYTHON_VERSION=$(python --version 2>&1 | awk '{print $2}')
elif command -v python3 &>/dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
else
    PYTHON_VERSION=""
fi

# -------------------------
# 4. Capture Node.js dependencies (from root package.json)
# -------------------------
NODE_DEPENDENCIES=""

if [ -f "$repo_root/package.json" ]; then
    if command -v jq &>/dev/null; then
        NODE_DEPENDENCIES=$(jq -r '.dependencies // {} | to_entries | map("\""+.key+"\": \""+.value+"\"") | join(",\n    ")' "$repo_root/package.json")
    else
        echo "Warning: 'jq' is not installed. Node dependencies will not be extracted."
    fi
fi

# -------------------------
# 5. Capture Python dependencies (from root requirements.txt)
# -------------------------
PYTHON_DEPENDENCIES=""

if [ -f "$repo_root/requirements.txt" ]; then
    while IFS= read -r line; do
        if [[ ! "$line" =~ ^#.*$ && ! -z "$line" ]]; then
            PACKAGE=$(echo $line | cut -d'=' -f1)
            VERSION=$(echo $line | cut -d'=' -f3)
            PYTHON_DEPENDENCIES+="\"$PACKAGE\": \"$VERSION\",\n    "
        fi
    done < "$repo_root/requirements.txt"
    PYTHON_DEPENDENCIES=$(echo -e "$PYTHON_DEPENDENCIES" | sed '$ s/,\n    $//')
fi

# -------------------------
# 6. Merge Dependencies
# -------------------------
DEPENDENCIES=""

if [ -n "$NODE_DEPENDENCIES" ] && [ -n "$PYTHON_DEPENDENCIES" ]; then
    DEPENDENCIES="$NODE_DEPENDENCIES,\n    $PYTHON_DEPENDENCIES"
elif [ -n "$NODE_DEPENDENCIES" ]; then
    DEPENDENCIES="$NODE_DEPENDENCIES"
elif [ -n "$PYTHON_DEPENDENCIES" ]; then
    DEPENDENCIES="$PYTHON_DEPENDENCIES"
fi

# -------------------------
# 7. Write to versions.jsonc
# -------------------------
cat > "$output_file" <<EOL
{
  // To be filled automatically once dependencies are installed.
  "node": "$NODE_VERSION",
  "python": "$PYTHON_VERSION",
  "dependencies": {
    $DEPENDENCIES
  }
}
EOL

echo "✅ versions.jsonc updated at AI_programming_tools_setup/agents/versions.jsonc"
