#!/usr/bin/env pwsh
# Reorganize repository structure

Write-Host "`n🔄 REORGANIZING REPOSITORY STRUCTURE`n" -ForegroundColor Cyan

# Move documentation files to docs/setup/
Write-Host "📁 Moving setup documentation..." -ForegroundColor Yellow
$setupDocs = @(
    'QUICK_START.md',
    'FIGMA_SETUP.md',
    'GITHUB_PUSH_INSTRUCTIONS.md',
    'GITHUB_SETUP.md',
    'IBM_AUTH_FIX.md',
    'SETUP_COMPLETE.md'
)
foreach($file in $setupDocs) {
    if(Test-Path $file) {
        Move-Item $file "docs/setup/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# Move guide documentation to docs/guides/
Write-Host "`n📁 Moving guide documentation..." -ForegroundColor Yellow
$guideDocs = @(
    'DEVELOPER_GUIDE.md',
    'BRANCH_WORKFLOW_GUIDE.md',
    'PREVIEW_GUIDE.md',
    'COMPLETE_GUIDE.md',
    'AI_PIPELINE_GUIDE.md',
    'QUICK_REFERENCE.md'
)
foreach($file in $guideDocs) {
    if(Test-Path $file) {
        Move-Item $file "docs/guides/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# Move reports to docs/reports/
Write-Host "`n📁 Moving reports..." -ForegroundColor Yellow
$reportDocs = @(
    'POC_SUMMARY.md',
    'POC_STATUS_DASHBOARD.md',
    'POC_PREVIEW.md',
    'FINAL_COMPLETION_REPORT.md',
    'FINAL_STATUS.md',
    'CODE_ANALYSIS_REPORT.md',
    'PROMPT_ANALYSIS.md'
)
foreach($file in $reportDocs) {
    if(Test-Path $file) {
        Move-Item $file "docs/reports/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# Move technical docs to docs/technical/
Write-Host "`n📁 Moving technical documentation..." -ForegroundColor Yellow
$techDocs = @(
    'TAILWIND_EXPLANATION.md',
    'DEBUG_WHITE_SCREEN.md',
    'PROMPT_FIX_SUMMARY.md',
    'GRANITE_READY.md'
)
foreach($file in $techDocs) {
    if(Test-Path $file) {
        Move-Item $file "docs/technical/" -Force
        Write-Host "  ✓ $file" -ForegroundColor Green
    }
}

# Move Angular app to generated-app/
Write-Host "`n📁 Moving Angular application..." -ForegroundColor Yellow
$angularItems = @(
    'src',
    'public',
    'angular.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.spec.json'
)
foreach($item in $angularItems) {
    if(Test-Path $item) {
        Move-Item $item "generated-app/" -Force
        Write-Host "  ✓ $item" -ForegroundColor Green
    }
}

# Move README files
Write-Host "`n📁 Moving README files..." -ForegroundColor Yellow
if(Test-Path "README_POC.md") {
    Remove-Item "README_POC.md" -Force
    Write-Host "  ✓ Removed README_POC.md (duplicate)" -ForegroundColor Green
}
if(Test-Path "figma-exports") {
    Move-Item "figma-exports" "pipeline/exports-temp" -Force
    Write-Host "  ✓ figma-exports → pipeline/exports-temp" -ForegroundColor Green
}
if(Test-Path "llm-processing") {
    Move-Item "llm-processing" "pipeline/processing-temp" -Force
    Write-Host "  ✓ llm-processing → pipeline/processing-temp" -ForegroundColor Green
}

Write-Host "`n✅ REORGANIZATION COMPLETE!`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update generate-with-preview.mjs paths" -ForegroundColor White
Write-Host "  2. Create separate package.json files" -ForegroundColor White
Write-Host "  3. Update .gitignore" -ForegroundColor White
Write-Host "  4. Test the pipeline" -ForegroundColor White
Write-Host ""
