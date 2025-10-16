# Quick Start Script for Figma MCP Server
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Figma MCP Server - Quick Start" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found!" -ForegroundColor Red
    Write-Host "  Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
FIGMA_ACCESS_TOKEN=your_figma_personal_access_token_here
MCP_SERVER_PORT=3845

# Optional: Add these for LLM automation
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
"@
    
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✓ .env file created" -ForegroundColor Green
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js $nodeVersion installed" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found! Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Available Commands:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "  npm run mcp-server" -ForegroundColor White
Write-Host "    Start the Figma MCP server" -ForegroundColor Gray
Write-Host ""
Write-Host "  npm run figma:fetch <fileKey> [nodeId]" -ForegroundColor White
Write-Host "    Download raw Figma JSON" -ForegroundColor Gray
Write-Host ""
Write-Host "  npm run figma:automate <fileKey> [nodeId] [--llm=openai|claude]" -ForegroundColor White
Write-Host "    Process design and send to LLM" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Ask user what to do
Write-Host "What would you like to do?" -ForegroundColor Yellow
Write-Host "  1. Start MCP server" -ForegroundColor White
Write-Host "  2. Fetch Figma design" -ForegroundColor White
Write-Host "  3. View setup guide" -ForegroundColor White
Write-Host "  4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting MCP server..." -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        npm run mcp-server
    }
    "2" {
        Write-Host ""
        $fileKey = Read-Host "Enter Figma file key"
        $nodeId = Read-Host "Enter node ID (or press Enter for full file)"
        
        Write-Host ""
        if ($nodeId) {
            npm run figma:fetch $fileKey $nodeId
        } else {
            npm run figma:fetch $fileKey
        }
        
        Write-Host ""
        Write-Host "Check the ./figma-exports/ folder for the downloaded JSON" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "Opening FIGMA_SETUP.md..." -ForegroundColor Green
        if (Test-Path "FIGMA_SETUP.md") {
            code FIGMA_SETUP.md
        } else {
            Write-Host "FIGMA_SETUP.md not found!" -ForegroundColor Red
        }
    }
    "4" {
        Write-Host "Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}
