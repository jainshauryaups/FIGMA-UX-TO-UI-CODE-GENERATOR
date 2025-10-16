# Figma MCP Server Setup Guide

This guide will help you set up and use the Figma MCP server for your project.

## 🚀 Quick Start

### 1. Prerequisites

- Node.js installed (v18 or higher)
- Figma access token (already configured in `.env`)
- Your Figma file key and node IDs

### 2. Start the MCP Server

```powershell
npm run mcp-server
```

This starts the Figma MCP server on `http://127.0.0.1:3845`

## 📖 Getting Figma File Information

### Extract File Key and Node ID from URL

Given a Figma URL like:
```
https://figma.com/design/Cs2VvhCrMokQ1234567890/My-Design?node-id=255-2652
```

- **File Key**: `Cs2VvhCrMokQ1234567890` (between `/design/` and the next `/`)
- **Node ID**: `255:2652` (after `node-id=`, replace `-` with `:`)

## 🛠️ Available Tools

### 1. MCP Tools (for VS Code Copilot)

These tools are available when the MCP server is running:

#### `mcp_figma_get_code`
Get code/design data for a Figma node
```javascript
// POST http://127.0.0.1:3845/mcp/get_code
{
  "fileKey": "your-file-key",
  "nodeId": "255:2652"  // optional
}
```

#### `mcp_figma_get_metadata`
Get metadata structure of a Figma design
```javascript
// POST http://127.0.0.1:3845/mcp/get_metadata
{
  "fileKey": "your-file-key",
  "nodeId": "255:2652"  // optional
}
```

#### `mcp_figma_get_screenshot`
Get a screenshot/image of a Figma node
```javascript
// POST http://127.0.0.1:3845/mcp/get_screenshot
{
  "fileKey": "your-file-key",
  "nodeId": "255:2652",
  "scale": 2,      // optional, default 2
  "format": "png"  // optional, default "png"
}
```

#### `mcp_figma_get_variable_defs`
Get design variable definitions
```javascript
// POST http://127.0.0.1:3845/mcp/get_variable_defs
{
  "fileKey": "your-file-key"
}
```

### 2. Fetch Raw JSON Script

Download raw Figma JSON for LLM processing:

```powershell
# Fetch entire file
npm run figma:fetch Cs2VvhCrMokQ1234567890

# Fetch specific node
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652
```

Output saved to: `./figma-exports/`

### 3. Automated LLM Processing

Process Figma designs and optionally send to LLM:

```powershell
# Process design only (no LLM)
npm run figma:automate Cs2VvhCrMokQ1234567890

# Process and send to OpenAI
npm run figma:automate Cs2VvhCrMokQ1234567890 -- --llm=openai

# Process and send to Claude
npm run figma:automate Cs2VvhCrMokQ1234567890 -- --llm=claude

# Process specific node
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652
```

Output saved to: `./llm-processing/`

## 🔧 Configuration

### Environment Variables (.env)

```properties
FIGMA_ACCESS_TOKEN=your_figma_personal_access_token_here
MCP_SERVER_PORT=3845

# Optional: For LLM automation
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### VS Code MCP Integration

The MCP server is configured in `.vscode/settings.json` to work with GitHub Copilot.

When the server is running, you can use Figma tools directly in Copilot:
- `@figma get code for node 255:2652`
- `@figma get screenshot of design`

## 📁 Output Directories

- **`./figma-exports/`** - Raw JSON exports from Figma
- **`./llm-processing/`** - Processed data and LLM responses
  - `raw-*.json` - Original Figma data
  - `processed-*.json` - Cleaned/structured data
  - `prompt-*.txt` - Generated LLM prompt
  - `llm-response-*.txt` - LLM analysis (if requested)

## 🎯 Common Use Cases

### 1. Extract Design for Code Generation

```powershell
# Start MCP server
npm run mcp-server

# In another terminal, fetch the design
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652
```

Use the JSON file with any LLM to generate code.

### 2. Automated Design Analysis

```powershell
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai
```

This will:
1. Fetch the Figma design
2. Process it for LLM consumption
3. Generate analysis prompt
4. Send to OpenAI GPT-4
5. Save the analysis

### 3. Batch Processing Multiple Designs

Create a script `batch-process.ps1`:

```powershell
# List of node IDs to process
$nodes = @("255:2652", "300:2139", "223:2001")

foreach ($node in $nodes) {
    Write-Host "Processing node $node..."
    npm run figma:fetch Cs2VvhCrMokQ1234567890 $node
}
```

## 🐛 Troubleshooting

### Port Already in Use

If you get `EADDRINUSE` error:

```powershell
# Find process using port 3845
netstat -ano | findstr :3845

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Figma API 403 Error

- Check your `FIGMA_ACCESS_TOKEN` is valid
- Ensure you have access to the Figma file
- Token might need to be regenerated

### Figma API 404 Error

- Verify the file key is correct
- Check node ID format (use `:` not `-`)
- Ensure the node exists in the file

## 🔗 API Endpoints Reference

### Health Check
```
GET http://127.0.0.1:3845/health
```

### Get Figma File
```
GET http://127.0.0.1:3845/api/figma/file/:fileKey
GET http://127.0.0.1:3845/api/figma/file/:fileKey?nodeId=255:2652
```

### Get File Info
```
GET http://127.0.0.1:3845/api/figma/file/:fileKey/info
```

## 📚 Example Workflow

1. **Start the MCP server**
   ```powershell
   npm run mcp-server
   ```

2. **Get your design URL from Figma**
   ```
   https://figma.com/design/Cs2VvhCrMokQ1234567890/UPS-Tracking?node-id=255-2652
   ```

3. **Extract the specific component**
   ```powershell
   npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652
   ```

4. **Process with LLM for implementation guidance**
   ```powershell
   npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai
   ```

5. **Review the outputs**
   - Check `figma-exports/` for raw JSON
   - Check `llm-processing/` for analysis

## 🎨 Integration with Your Workflow

### With Angular Development

```powershell
# Terminal 1: Run Angular dev server
npm start

# Terminal 2: Run MCP server
npm run mcp-server

# Terminal 3: Fetch designs as needed
npm run figma:fetch <fileKey> <nodeId>
```

### With Other LLMs (Custom)

Edit `automate-figma-llm.mjs` to add your own LLM integration:

```javascript
async function sendToCustomLLM(prompt) {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama2',
            prompt: prompt
        })
    });
    return await response.json();
}
```

## ✅ Verification

Test your setup:

```powershell
# 1. Check server is running
curl http://127.0.0.1:3845/health

# 2. Test file fetch
npm run figma:fetch Cs2VvhCrMokQ1234567890

# 3. Verify output files exist
ls figma-exports
```

## 🎉 You're All Set!

You now have:
- ✅ Figma MCP server running
- ✅ Tools to fetch raw Figma JSON
- ✅ Automation scripts for LLM processing
- ✅ VS Code Copilot integration

Start using `@figma` in your Copilot chats or run the scripts to fetch your designs!
