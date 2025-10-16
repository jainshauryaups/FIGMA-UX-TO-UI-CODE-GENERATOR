# 🎨 Figma MCP Server - Complete Setup & Usage Guide

## ✅ Setup Complete!

Your Figma MCP server is fully configured and ready to use. Here's everything you need to know:

---

## 🚀 Quick Start (30 seconds)

### Option 1: Interactive Start Script
```powershell
.\start-figma.ps1
```
This will guide you through starting the server or fetching designs.

### Option 2: Direct Commands
```powershell
# Start the MCP server
npm run mcp-server

# Fetch a Figma design
npm run figma:fetch <fileKey> <nodeId>

# Process with LLM
npm run figma:automate <fileKey> <nodeId> -- --llm=openai
```

---

## 📖 Understanding the Components

### 1. **Figma MCP Server** (`figma-mcp-server.mjs`)
- REST API server that provides MCP tools for Figma integration
- Runs on `http://127.0.0.1:3845`
- Integrates with GitHub Copilot through VS Code

**Start it:**
```powershell
npm run mcp-server
```

### 2. **Fetch Script** (`fetch-figma-json.mjs`)
- Downloads raw JSON from Figma designs
- Saves to `./figma-exports/` directory
- Great for getting raw data for any LLM

**Use it:**
```powershell
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652
```

### 3. **Automation Script** (`automate-figma-llm.mjs`)
- Fetches design data
- Processes it for LLM consumption
- Optionally sends to OpenAI or Claude
- Saves everything to `./llm-processing/` directory

**Use it:**
```powershell
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai
```

---

## 🎯 Common Workflows

### Workflow 1: Get Raw JSON for Manual LLM Processing

**Scenario:** You want to copy-paste Figma JSON into ChatGPT, Claude, or any other LLM.

```powershell
# 1. Fetch the design
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652

# 2. Find the JSON file in figma-exports/
# 3. Copy its contents
# 4. Paste into your LLM with a prompt like:
#    "Convert this Figma design to React components"
```

### Workflow 2: Automated LLM Processing

**Scenario:** You want automatic analysis and code generation.

```powershell
# Process and analyze with OpenAI GPT-4
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai

# Check llm-processing/ folder for:
# - processed data
# - generated prompt
# - LLM response
```

### Workflow 3: VS Code Copilot Integration

**Scenario:** You want to use Figma tools directly in VS Code with Copilot.

```powershell
# 1. Start the MCP server (keep it running)
npm run mcp-server

# 2. In VS Code, use Copilot chat:
#    "Get code for Figma node 255:2652"
#    "Show me the design metadata"
#    "Generate a screenshot of this component"
```

### Workflow 4: Batch Processing Multiple Designs

**Scenario:** You have multiple components to fetch.

Create `batch-fetch.ps1`:
```powershell
$fileKey = "Cs2VvhCrMokQ1234567890"
$nodes = @("255:2652", "300:2139", "223:2001", "443:1914")

foreach ($node in $nodes) {
    Write-Host "Fetching node $node..." -ForegroundColor Green
    npm run figma:fetch $fileKey $node
    Start-Sleep -Seconds 1  # Rate limiting
}

Write-Host "All nodes fetched!" -ForegroundColor Cyan
```

Then run:
```powershell
.\batch-fetch.ps1
```

---

## 🔍 How to Get File Key and Node ID

### From Figma URL

Given this URL:
```
https://figma.com/design/Cs2VvhCrMokQ1234567890/My-Design?node-id=255-2652&t=abc123
```

Extract:
- **File Key**: `Cs2VvhCrMokQ1234567890`
  - Located between `/design/` and the next `/`
- **Node ID**: `255:2652`
  - From `node-id=255-2652`, replace `-` with `:`

### From Figma Desktop App

1. Right-click on any layer/component
2. Click "Copy link to selection"
3. URL will be in clipboard
4. Extract fileKey and nodeId as above

---

## 📊 Output Directories

### `figma-exports/`
Contains raw Figma JSON files.

**Files:**
- `figma-{fileKey}-full-{timestamp}.json` - Full file
- `figma-{fileKey}-node-{nodeId}-{timestamp}.json` - Specific node

**Use for:**
- Manual LLM processing
- Documentation
- Backup

### `llm-processing/`
Contains processed data and LLM analysis.

**Files:**
- `raw-{fileKey}-{timestamp}.json` - Original data
- `processed-{fileKey}-{timestamp}.json` - Cleaned data
- `prompt-{fileKey}-{timestamp}.txt` - Generated prompt
- `llm-response-{fileKey}-{timestamp}.txt` - LLM analysis

**Use for:**
- Understanding design structure
- Implementation guidance
- Design documentation

---

## 🛠️ API Reference

### MCP Server Endpoints

When server is running at `http://127.0.0.1:3845`:

#### Get Code/Design Data
```bash
POST /mcp/get_code
Content-Type: application/json

{
  "fileKey": "Cs2VvhCrMokQ1234567890",
  "nodeId": "255:2652"
}
```

#### Get Metadata
```bash
POST /mcp/get_metadata
Content-Type: application/json

{
  "fileKey": "Cs2VvhCrMokQ1234567890",
  "nodeId": "255:2652"
}
```

#### Get Screenshot
```bash
POST /mcp/get_screenshot
Content-Type: application/json

{
  "fileKey": "Cs2VvhCrMokQ1234567890",
  "nodeId": "255:2652",
  "scale": 2,
  "format": "png"
}
```

#### Get Variables
```bash
POST /mcp/get_variable_defs
Content-Type: application/json

{
  "fileKey": "Cs2VvhCrMokQ1234567890"
}
```

#### Health Check
```bash
GET /health
```

#### Get Raw File
```bash
GET /api/figma/file/:fileKey
GET /api/figma/file/:fileKey?nodeId=255:2652
```

---

## 🔐 Environment Variables

Required in `.env`:
```properties
FIGMA_ACCESS_TOKEN=your_figma_personal_access_token_here
MCP_SERVER_PORT=3845
```

Optional (for LLM automation):
```properties
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🐛 Troubleshooting

### Problem: Port 3845 already in use

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :3845

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Or change port in .env
# MCP_SERVER_PORT=3846
```

### Problem: Figma API returns 403

**Reasons:**
- Invalid access token
- Token doesn't have access to the file
- Token expired

**Solution:**
1. Go to Figma → Settings → Personal Access Tokens
2. Generate new token
3. Update `FIGMA_ACCESS_TOKEN` in `.env`

### Problem: Figma API returns 404

**Reasons:**
- Wrong file key
- Node ID doesn't exist
- Node ID format incorrect (use `:` not `-`)

**Solution:**
- Verify file key from Figma URL
- Check node exists in design
- Convert node ID: `255-2652` → `255:2652`

### Problem: LLM automation fails

**Reasons:**
- Missing API key
- Invalid API key
- Rate limit exceeded

**Solution:**
```powershell
# Check if API key is set
echo $env:OPENAI_API_KEY

# Add to .env if missing
# OPENAI_API_KEY=sk-...
```

---

## 💡 Pro Tips

### Tip 1: Use Node ID from Copilot
When working in Figma, select a component and the node ID appears in the URL. Copy it directly!

### Tip 2: Create Aliases for Common Tasks
Add to your PowerShell profile:
```powershell
function Get-FigmaDesign {
    param($nodeId)
    npm run figma:fetch Cs2VvhCrMokQ1234567890 $nodeId
}

# Usage: Get-FigmaDesign 255:2652
```

### Tip 3: Combine with VS Code Tasks
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Figma MCP Server",
      "type": "shell",
      "command": "npm run mcp-server",
      "isBackground": true
    }
  ]
}
```

### Tip 4: Use jq for JSON Processing
```powershell
# Install jq (if not installed)
# Then extract specific data:
cat figma-exports/figma-*.json | jq '.document.name'
```

---

## 📚 Real-World Examples

### Example 1: Component Library Documentation

```powershell
# Fetch all components
$components = @("button", "input", "card", "modal")
$fileKey = "Cs2VvhCrMokQ1234567890"

foreach ($comp in $components) {
    # Assuming you know the node IDs
    npm run figma:automate $fileKey $comp -- --llm=openai
}

# Result: Complete documentation for each component!
```

### Example 2: Design System Migration

```powershell
# 1. Export current design system
npm run figma:fetch OldFileKey

# 2. Process for comparison
npm run figma:automate OldFileKey -- --llm=openai

# 3. Export new design system
npm run figma:fetch NewFileKey

# 4. Compare the JSONs or LLM responses
```

### Example 3: Code Generation Pipeline

```powershell
# 1. Fetch design
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652

# 2. Process with custom prompt
$json = Get-Content "figma-exports/figma-*.json" -Raw
$prompt = "Convert this to Angular component: $json"

# 3. Send to your preferred LLM
# 4. Save generated code
```

---

## 🎓 Learning Resources

### Understanding Figma API
- [Figma API Documentation](https://www.figma.com/developers/api)
- Node structure and hierarchy
- Design tokens and variables

### MCP (Model Context Protocol)
- How MCP enables AI tool integration
- Building custom MCP tools
- VS Code Copilot integration

### LLM Integration
- Prompt engineering for design-to-code
- Structured data for better results
- Token optimization strategies

---

## 🔄 Keeping Data Fresh

### Auto-Refresh Script
Create `auto-sync.ps1`:
```powershell
$fileKey = "Cs2VvhCrMokQ1234567890"
$nodeId = "255:2652"

while ($true) {
    Write-Host "Syncing at $(Get-Date)" -ForegroundColor Cyan
    npm run figma:fetch $fileKey $nodeId
    Start-Sleep -Seconds 3600  # Every hour
}
```

### Webhook Integration (Advanced)
Set up Figma webhooks to trigger fetches when designs change.

---

## 🎉 You're Ready!

You now have a complete Figma-to-LLM pipeline:

✅ MCP server for real-time integration  
✅ Scripts for batch processing  
✅ Automated LLM analysis  
✅ VS Code Copilot integration  
✅ Raw JSON exports for flexibility  

**Start with:**
```powershell
.\start-figma.ps1
```

**Or dive right in:**
```powershell
npm run mcp-server
```

Happy coding! 🚀
