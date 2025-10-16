# Pipeline Tools

This folder contains the Figma-to-Angular code generation pipeline.

## Main Generator

- **generate-with-preview.mjs** - Main code generator with preview workflow
- **figma-mcp-server.mjs** - Figma MCP server implementation  
- **fetch-figma-json.mjs** - Fetch Figma designs as JSON
- **automate-figma-llm.mjs** - Automated Figma to LLM pipeline
- **start-figma.ps1** - Startup script for Figma pipeline

## Folders

- **servers/** - Test/experimental server implementations
- **exports/** - Figma design exports (JSON files)
- **processing/** - LLM processing logs and prompts

## Usage

```bash
node pipeline/generate-with-preview.mjs
```

See ../docs/guides/DEVELOPER_GUIDE.md for full instructions.
