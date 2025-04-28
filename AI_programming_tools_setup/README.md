# AI_programming_tools_setup

This folder contains tools and configuration files to help automate and document the structure and setup of your main project repository.

## Purpose

- **AI_programming_tools_setup** is designed to be cloned or copied into any project where you want to automate the capture and maintenance of your project's directory structure and other setup tasks.
- The main outputs are:
  - `agents/project-structure.txt`: a snapshot of your project's folder and file hierarchy.
  - `agents/versions.jsonc`: a file capturing the project's Node.js and Python versions and installed dependencies.

## What is `project-structure.txt`?

- `agents/project-structure.txt` is a text file containing a tree view of your project's directory structure (up to 3 levels deep), excluding `.git` and `AI_programming_tools_setup`.
- This file is useful for documentation, onboarding, and for AI tools that need to understand your project's layout.

## What is `versions.jsonc`?

- `agents/versions.jsonc` records:
  - Your project's **Node.js** and **Python** versions.
  - A list of installed **Node.js dependencies** (from `package.json`).
  - Optionally, **Python dependencies** (if a `requirements.txt` file is present).
- This file can be used to quickly understand the environment setup and dependencies without needing to manually check multiple files.

## How to Update the Project Structure

1. Open a terminal in your project root.
2. Run the update script:

   ```sh
   ./AI_programming_tools_setup/agents/update_project_structure.sh
   ```

- This will regenerate agents/project-structure.txt with the current structure of your project.
- The script will print the project root and a summary to the terminal.

## How to Update the Project Versions

1. Open a terminal in your project root.
2. Run the update script

   ```sh
   ./AI_programming_tools_setup/agents/update_versions.sh
   ```

- This will regenerate agents/versions.jsonc with:
  - Your current Node.js and Python versions.
  - Your installed project dependencies.
- The script will print a success message when complete.

## Requirements

- For update_project_structure.sh:
  - Requires the tree command.
    - On macOS: brew install tree
    - On Ubuntu/Debian: sudo apt-get install tree
- For update_versions.sh:
  - Requires Node.js and Python to be installed.
  - Optionally, jq is recommended for better dependency extraction from package.json.
    - On macOS: brew install jq
    - On Ubuntu/Debian: sudo apt-get install jq

## Notes

- Make sure the scripts are executable. If not, run:

  ```sh
  chmod +x ./AI_programming_tools_setup/agents/update_project_structure.sh
  chmod +x ./AI_programming_tools_setup/agents/update_versions.sh
  ```

- Both scripts are safe to run multiple times and will always reflect the latest project state.
