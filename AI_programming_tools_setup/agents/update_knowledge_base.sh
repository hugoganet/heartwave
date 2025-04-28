#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# Find the root of the repo
repo_root="$(git rev-parse --show-toplevel)"

echo "repo_root: $repo_root"

# Paths
output_file="$repo_root/AI_programming_tools_setup/agents/knowledge_base.md"
info_file="$repo_root/AI_programming_tools_setup/agents/project_info.md"
structure_file="$repo_root/AI_programming_tools_setup/agents/project-structure.txt"
versions_json="$repo_root/AI_programming_tools_setup/agents/versions.json"
versions_temp_md="$repo_root/AI_programming_tools_setup/agents/versions_temp.md"

# Create a temp versions.md by parsing the JSONC
node "$repo_root/AI_programming_tools_setup/agents/parse_versions_to_md.js" "$versions_json" > "$versions_temp_md"

# Start fresh
echo "" > "$output_file"

# 1. Add update date
echo "# Project Knowledge Base" >> "$output_file"
echo "" >> "$output_file"
echo "**Last updated:** $(date '+%Y-%m-%d')" >> "$output_file"
echo "" >> "$output_file"
echo "---" >> "$output_file"
echo "" >> "$output_file"

# 2. Add project_info.md if it exists
if [ -f "$info_file" ]; then
    echo "Adding project_info.md..."
    cat "$info_file" >> "$output_file"
    echo "" >> "$output_file"
    echo "---" >> "$output_file"
    echo "" >> "$output_file"
else
    echo "Warning: project_info.md not found, skipping."
fi

# 3. Add versions
echo "## Dependency Versions" >> "$output_file"
echo "" >> "$output_file"
cat "$versions_temp_md" >> "$output_file"
echo "" >> "$output_file"
echo "---" >> "$output_file"
echo "" >> "$output_file"

# 4. Add project structure
echo "## Project Structure" >> "$output_file"
echo "" >> "$output_file"
cat "$structure_file" >> "$output_file"

# Cleanup
rm "$versions_temp_md"

echo "✅ Knowledge base successfully updated at $output_file"
