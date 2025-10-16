# LLM Processing Directory

This directory contains processed Figma design data and LLM analysis results.

Files are automatically saved here when you run:
```powershell
npm run figma:automate <fileKey> [nodeId] [--llm=openai|claude]
```

## File Types

### 1. Raw Data (`raw-*.json`)
Original Figma API response containing complete design data.

### 2. Processed Data (`processed-*.json`)
Cleaned and structured design data optimized for LLM consumption:
- Metadata (name, version, timestamp)
- Design hierarchy
- Styles catalog
- Components list

### 3. LLM Prompt (`prompt-*.txt`)
Generated prompt that includes:
- Design summary
- Structure analysis request
- Component identification request
- Recommendations request

### 4. LLM Response (`llm-response-*.txt`)
Analysis from the LLM including:
- Design structure summary
- UI components identified
- Color palette and typography
- Implementation recommendations
- Accessibility considerations

## Usage Examples

### Process Design Only
```powershell
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652
```

Creates:
- `raw-*.json`
- `processed-*.json`
- `prompt-*.txt`

### Process and Analyze with OpenAI
```powershell
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=openai
```

Creates all above files plus:
- `llm-response-*.txt` (with GPT-4 analysis)

### Process and Analyze with Claude
```powershell
npm run figma:automate Cs2VvhCrMokQ1234567890 255:2652 -- --llm=claude
```

Creates all above files plus:
- `llm-response-*.txt` (with Claude Opus analysis)

## Integration with Your Workflow

Use these files to:
1. Generate code from designs
2. Document design systems
3. Create implementation guides
4. Validate design consistency
5. Train custom models
