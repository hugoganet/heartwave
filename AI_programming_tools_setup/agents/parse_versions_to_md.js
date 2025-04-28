#!/usr/bin/env node

// -----------------------------------------
// parse_versions_to_md.js
// -----------------------------------------
// This script reads a versions.jsonc file,
// strips comments, parses it,
// and outputs human-readable Markdown.
// -----------------------------------------

// Import the built-in 'fs' module for file operations
const fs = require('fs');

// Use an async IIFE to allow dynamic import of ESM-only packages
(async () => {
  // Dynamically import the ESM-only 'strip-json-comments' package
  const stripJsonComments = (await import('strip-json-comments')).default;

  // Get the file path from the command line arguments
  const [,, filePath] = process.argv;

  // If no file path is provided, print an error and exit
  if (!filePath) {
    console.error('❌ Error: No input file provided.');
    process.exit(1);
  }

  try {
    // Read the JSONC file as a string
    const jsoncContent = fs.readFileSync(filePath, 'utf-8');
    // Remove comments from the JSONC content
    const cleanJson = stripJsonComments(jsoncContent);
    // Parse the cleaned JSON string into an object
    const data = JSON.parse(cleanJson);

    // Output the Node.js version in Markdown format
    console.log(`### Node.js Version\n`);
    console.log(`- ${data.node || 'Not specified'}`);
    console.log(``);

    // Output the Python version in Markdown format
    console.log(`### Python Version\n`);
    console.log(`- ${data.python || 'Not specified'}`);
    console.log(``);

    // Output the dependencies in Markdown format
    console.log(`### Dependencies\n`);
    if (data.dependencies && Object.keys(data.dependencies).length > 0) {
      Object.entries(data.dependencies).forEach(([dep, version]) => {
        console.log(`- **${dep}**: ${version}`);
      });
    } else {
      console.log(`- No dependencies listed.`);
    }
  } catch (err) {
    // Print an error message if parsing fails and exit
    console.error('❌ Failed to parse versions file:', err.message);
    process.exit(1);
  }
})();
