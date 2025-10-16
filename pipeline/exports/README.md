# Figma Exports Directory

This directory contains raw JSON exports from Figma designs.

Files are automatically saved here when you run:
```powershell
npm run figma:fetch <fileKey> [nodeId]
```

## File Naming Convention

Files are named with the following pattern:
- `figma-{fileKey}-full-{timestamp}.json` - Full file export
- `figma-{fileKey}-node-{nodeId}-{timestamp}.json` - Specific node export

## Usage

The JSON files contain the complete Figma design data including:
- Node hierarchy
- Styles and colors
- Text content
- Layout properties
- Component definitions
- And more...

You can use these files:
1. With LLM APIs for code generation
2. For documentation
3. For automated design analysis
4. As backup of design state

## Example

```powershell
# Fetch a specific component
npm run figma:fetch Cs2VvhCrMokQ1234567890 255:2652

# Result: figma-Cs2VvhCrMokQ1234567890-node-255-2652-2025-10-15T12-30-45.json
```
