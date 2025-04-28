echo "Updating project structure..."



set -euo pipefail

# Get the root of the parent project (not AI_programming_tools_setup)
repo_root="$(git rev-parse --show-toplevel)"

# Make sure the output directory exists
mkdir -p "$repo_root/AI_programming_tools_setup/agents"

# Generate the tree, excluding AI_programming_tools_setup itself
tree -I ".git|AI_programming_tools_setup|node_modules|.vscode" -L 3 --dirsfirst --noreport "$repo_root" \
  > "$repo_root/AI_programming_tools_setup/agents/project-structure.txt"

echo "Project structure updated. Output at AI_programming_tools_setup/agents/project-structure.txt"