# Complete Reorganization Script
# Run this to finish the repo structure cleanup

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "  COMPLETING REORGANIZATION" -ForegroundColor Cyan
Write-Host "=================================`n" -ForegroundColor Cyan

# 1. Move public folder
Write-Host "[1/6] Moving public folder..." -ForegroundColor Yellow
if (Test-Path "public") {
    if (Test-Path "generated-app/public") {
        Remove-Item "generated-app/public" -Recurse -Force
    }
    Copy-Item -Path "public" -Destination "generated-app/" -Recurse -Force
    Remove-Item "public" -Recurse -Force
    Write-Host "  ✓ public → generated-app/public" -ForegroundColor Green
}

# 2. Move .angular folder
Write-Host "`n[2/6] Moving .angular folder..." -ForegroundColor Yellow
if (Test-Path ".angular") {
    if (Test-Path "generated-app/.angular") {
        Remove-Item "generated-app/.angular" -Recurse -Force
    }
    Move-Item ".angular" "generated-app/" -Force
    Write-Host "  ✓ .angular → generated-app/.angular" -ForegroundColor Green
}

# 3. Move figma-exports and llm-processing
Write-Host "`n[3/6] Moving export/processing folders..." -ForegroundColor Yellow
if (Test-Path "figma-exports") {
    Copy-Item -Path "figma-exports\README.md" -Destination "pipeline/exports/" -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ figma-exports README copied to pipeline/exports/" -ForegroundColor Green
}
if (Test-Path "llm-processing") {
    Copy-Item -Path "llm-processing\README.md" -Destination "pipeline/processing/" -Force -ErrorAction SilentlyContinue  
    Write-Host "  ✓ llm-processing README copied to pipeline/processing/" -ForegroundColor Green
}

# 4. Clean up duplicate READMEs
Write-Host "`n[4/6] Cleaning up duplicate files..." -ForegroundColor Yellow
if (Test-Path "README_POC.md") {
    Remove-Item "README_POC.md" -Force
    Write-Host "  ✓ Removed README_POC.md (duplicate)" -ForegroundColor Green
}

#5. Update .gitignore
Write-Host "`n[5/6] Updating .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @"
# See http://help.github.com/ignore-files/ for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings

# System files
.DS_Store
Thumbs.db

# Environment variables (NEVER commit API keys!)
.env
.env.local
.env.*.local

# Preview folder (temporary)
pipeline/.preview/

# Copilot session (contains conversation history with tokens)
copilot-session.json

# Large exports
pipeline/exports/*.json
pipeline/processing/*.json

# Generated app specifics
generated-app/node_modules/
generated-app/.angular/
generated-app/dist/

# Old folders (to be deleted)
figma-exports/
llm-processing/
.preview/
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent -Force
Write-Host "  ✓ .gitignore updated with new paths" -ForegroundColor Green

# 6. Create README files for each section
Write-Host "`n[6/6] Creating section README files..." -ForegroundColor Yellow

# Pipeline README
$pipelineReadme = @"
# Pipeline Tools

This folder contains the Figma-to-Angular code generation pipeline.

## Main Generator

- **generate-with-preview.mjs** - Main code generator with preview workflow
- **figma-mcp-server.mjs** - Figma MCP server implementation
- **mcp-server.mjs** - Generic MCP server
- **fetch-figma-json.mjs** - Fetch Figma designs as JSON
- **automate-figma-llm.mjs** - Automated Figma → LLM pipeline
- **generate-from-figma.mjs** - Generate components from Figma
- **generate-component-simple.mjs** - Simple component generator
- **extract.js** - Extract utilities
- **start-figma.ps1** - Startup script for Figma pipeline
- **test-setup.ps1** - Test setup script

## Folders

- **servers/** - Test/experimental server implementations
- **exports/** - Figma design exports (JSON)
- **processing/** - LLM processing logs and prompts
- **.preview/** - Temporary preview files (gitignored)

## Usage

Run the main generator:
``````bash
node pipeline/generate-with-preview.mjs
``````

See docs/guides/DEVELOPER_GUIDE.md for full instructions.
"@

Set-Content -Path "pipeline/README.md" -Value $pipelineReadme -Force
Write-Host "  ✓ Created pipeline/README.md" -ForegroundColor Green

# Generated App README
$appReadme = @"
# Generated Angular Application

This is the Angular application where AI-generated components are placed.

## Structure

- **src/app/components/** - Generated components appear here
- **src/app/app.routes.ts** - Auto-updated by the pipeline
- **src/styles.scss** - UPS Brand CSS (53 approved classes)
- **src/ai-pipeline/** - Angular services for pipeline integration

## Running the App

``````bash
cd generated-app
npm install
npm start
``````

The app will be available at http://localhost:4200

## Development

Components are generated from Figma using the pipeline in ../pipeline/

When you approve a component (type 'A'), it:
1. Creates a feature branch (feat/figma-component-name)
2. Moves files to src/app/components/
3. Updates app.routes.ts
4. Commits with Figma metadata

See docs/guides/DEVELOPER_GUIDE.md for the full workflow.
"@

Set-Content -Path "generated-app/README.md" -Value $appReadme -Force
Write-Host "  ✓ Created generated-app/README.md" -ForegroundColor Green

# Docs README
$docsReadme = @"
# Documentation

## Setup Guides
- **setup/** - Installation and configuration guides

## Developer Guides  
- **guides/** - How to use the pipeline and workflows

## Reports
- **reports/** - POC status reports and completion summaries

## Technical Documentation
- **technical/** - Deep dives into technical decisions and debugging
"@

Set-Content -Path "docs/README.md" -Value $docsReadme -Force
Write-Host "  ✓ Created docs/README.md" -ForegroundColor Green

Write-Host "`n==================================" -ForegroundColor Green
Write-Host "  ✅ REORGANIZATION COMPLETE!" -ForegroundColor Green
Write-Host "=================================`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update package.json files (root vs generated-app)" -ForegroundColor White
Write-Host "  2. Update generate-with-preview.mjs paths" -ForegroundColor White
Write-Host "  3. Test the pipeline" -ForegroundColor White
Write-Host "  4. Commit changes to Git" -ForegroundColor White
Write-Host ""
