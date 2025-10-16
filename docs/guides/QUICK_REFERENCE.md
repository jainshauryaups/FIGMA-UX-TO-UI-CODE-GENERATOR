# 🎯 QUICK REFERENCE - Figma MCP Server

## ⚡ Start Here

### 1. Start the MCP Server
```powershell
npm run mcp-server
```
Server runs at: `http://127.0.0.1:3845`  
Keep it running for VS Code Copilot integration

### 2. Fetch Raw Figma JSON
```powershell
npm run figma:fetch <fileKey> <nodeId>
```
Example:
```powershell
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652
```
Output: `./figma-exports/`

### 3. Automate with LLM
```powershell
npm run figma:automate <fileKey> <nodeId> -- --llm=openai
```
Example:
```powershell
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai
```
Output: `./llm-processing/`

---

## 📋 Extract Figma Info from URL

From: `https://figma.com/design/Cs2VvhCrMokQ1234567890/My-Design?node-id=255-2652`

- **File Key**: `Cs2VvhCrMokQ1234567890`
- **Node ID**: `255:2652` (change `-` to `:`)

---

## 🎨 Available MCP Tools

When server is running, these are available in Copilot:

| Tool | Purpose |
|------|---------|
| `mcp_figma_get_code` | Get design data/code |
| `mcp_figma_get_metadata` | Get structure overview |
| `mcp_figma_get_screenshot` | Get design image |
| `mcp_figma_get_variable_defs` | Get design variables |

---

## 📁 File Structure

```
figmaAngular/
├── figma-mcp-server.mjs      # MCP server
├── fetch-figma-json.mjs       # Fetch script
├── automate-figma-llm.mjs     # LLM automation
├── start-figma.ps1            # Interactive launcher
├── .env                       # Config (don't commit!)
├── figma-exports/             # Raw JSON outputs
└── llm-processing/            # Processed & analyzed data
```

---

## 🔧 Common Commands

```powershell
# Interactive start
.\start-figma.ps1

# Start MCP server
npm run mcp-server

# Health check
curl http://127.0.0.1:3845/health

# Fetch full file
npm run figma:fetch Cs2VvhCrMokQ1234567890

# Fetch specific node
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652

# Process without LLM
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652

# Process with OpenAI
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai

# Process with Claude
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=claude
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port in use | `netstat -ano \| findstr :3845` then `taskkill /PID <PID> /F` |
| 403 Error | Check `FIGMA_ACCESS_TOKEN` in `.env` |
| 404 Error | Verify fileKey and nodeId format (`255:2652` not `255-2652`) |
| No LLM response | Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to `.env` |

---

## 📚 Documentation

- **Complete Guide**: `COMPLETE_GUIDE.md` - Everything you need to know
- **Setup Guide**: `FIGMA_SETUP.md` - Detailed setup instructions
- **This File**: `QUICK_REFERENCE.md` - Quick commands reference

---

## ✅ Verification Checklist

- [ ] MCP server starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Can fetch Figma JSON
- [ ] VS Code detects MCP tools (check Copilot chat)
- [ ] Files saved to correct directories

Test:
```powershell
# 1. Start server
npm run mcp-server

# 2. In another terminal, check health
curl http://127.0.0.1:3845/health

# 3. Fetch a design
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652

# 4. Check output
ls figma-exports
```

---

## 🎯 Your File/Node IDs

Quick reference for your actual Figma file:

```powershell
# From your raw-255-2652.json file:
$fileKey = "YOUR_FILE_KEY"  # Extract from Figma URL
$nodeIds = @{
    "AppTeaser" = "255:2652"
    "TrackingForm" = "250:662"
    "NavItem" = "223:2026"
    # Add more as needed
}

# Fetch all
foreach ($name in $nodeIds.Keys) {
    Write-Host "Fetching $name..." -ForegroundColor Green
    npm run figma:fetch $fileKey $nodeIds[$name]
}
```

---

## 💡 Pro Tips

1. **Keep server running** while working in VS Code
2. **Use node IDs** from Figma's URL (copy link to selection)
3. **Save common commands** as PowerShell aliases
4. **Batch process** multiple nodes with a loop
5. **Version control** important exports in git

---

## 🚀 Next Steps

1. ✅ Setup complete - Server is ready!
2. 📥 Fetch your first design
3. 🤖 Try LLM automation
4. 🔄 Integrate into your workflow
5. 📖 Read COMPLETE_GUIDE.md for advanced usage

**Start now:**
```powershell
.\start-figma.ps1
```
