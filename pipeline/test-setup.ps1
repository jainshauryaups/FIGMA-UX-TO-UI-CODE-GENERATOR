# Test Figma MCP Server Setup
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Testing Figma MCP Server Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Test 1: Check .env file
Write-Host "1. Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "FIGMA_ACCESS_TOKEN") {
        Write-Host "   ✓ .env file exists with FIGMA_ACCESS_TOKEN" -ForegroundColor Green
    } else {
        Write-Host "   ✗ FIGMA_ACCESS_TOKEN not found in .env" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "   ✗ .env file not found" -ForegroundColor Red
    $allGood = $false
}

# Test 2: Check server file
Write-Host "2. Checking server files..." -ForegroundColor Yellow
$requiredFiles = @(
    "figma-mcp-server.mjs",
    "fetch-figma-json.mjs",
    "automate-figma-llm.mjs"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file missing" -ForegroundColor Red
        $allGood = $false
    }
}

# Test 3: Check documentation
Write-Host "3. Checking documentation..." -ForegroundColor Yellow
$docFiles = @(
    "SETUP_COMPLETE.md",
    "QUICK_REFERENCE.md",
    "COMPLETE_GUIDE.md",
    "FIGMA_SETUP.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file missing" -ForegroundColor Red
        $allGood = $false
    }
}

# Test 4: Check Node.js
Write-Host "4. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Node.js $nodeVersion installed" -ForegroundColor Green
    } else {
        throw
    }
} catch {
    Write-Host "   ✗ Node.js not found" -ForegroundColor Red
    $allGood = $false
}

# Test 5: Check npm packages
Write-Host "5. Checking npm packages..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠ node_modules not found - run 'npm install'" -ForegroundColor Yellow
    $allGood = $false
}

# Test 6: Check output directories
Write-Host "6. Checking output directories..." -ForegroundColor Yellow
$dirs = @("figma-exports", "llm-processing")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Host "   ✓ $dir/ exists" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ $dir/ will be created on first use" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "  ✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your Figma MCP server is ready to use!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Start server:  npm run mcp-server" -ForegroundColor White
    Write-Host "  2. Fetch design:  npm run figma:fetch <fileKey> <nodeId>" -ForegroundColor White
    Write-Host "  3. Read docs:     code SETUP_COMPLETE.md" -ForegroundColor White
} else {
    Write-Host "  ⚠ SOME TESTS FAILED" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please fix the issues above." -ForegroundColor Yellow
    Write-Host ""
    if (-not (Test-Path "node_modules")) {
        Write-Host "Missing node_modules? Run:" -ForegroundColor Cyan
        Write-Host "  npm install" -ForegroundColor White
    }
}
Write-Host ""
