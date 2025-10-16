# UPS Tracking Page - Angular 20+ with Figma MCP Integration

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

A pixel-perfect implementation of the UPS tracking page design from Figma, built with Angular 20+ and standalone components.

## 🎨 NEW: Figma MCP Server Integration

This project now includes a complete Figma MCP (Model Context Protocol) server that enables:
- ✅ Direct Figma design fetching via API
- ✅ VS Code Copilot integration with Figma tools
- ✅ Automated LLM processing for design-to-code workflows
- ✅ Raw JSON exports for custom automation

### Quick Start with Figma
```powershell
# Interactive launcher
.\start-figma.ps1

# Or start MCP server directly
npm run mcp-server

# Fetch designs
npm run figma:fetch <fileKey> <nodeId>

# Automate with LLM
npm run figma:automate <fileKey> <nodeId> -- --llm=openai
```

📖 **See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for commands**  
📚 **See [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) for full documentation**

## Features

- **Modern Angular 20+**: Uses the latest Angular features with standalone components
- **Pixel-Perfect Design**: Matches the original Figma design exactly
- **UPS Brand Colors**: Implements official UPS color palette
- **Responsive**: Mobile-friendly responsive design
- **TypeScript**: Fully typed with strict TypeScript configuration
- **SCSS Styling**: Organized component-based styles with CSS custom properties

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── cursor/                    # Animated cursor component
│   │   ├── track-dyn-text/           # Dynamic "Track" text animation
│   │   └── tracking-page/            # Main page component
│   ├── app.component.ts              # Root component
│   └── app.routes.ts                 # Route configuration
├── assets/                           # Images and icons
├── styles.scss                       # Global styles and UPS design tokens
└── index.html                        # Main HTML template
```

## UPS Design System

The project implements the UPS brand guidelines with:

- **Colors**: UPS Gold (#FFC400), UPS Brown (#351C15), UPS Black (#121212)
- **Typography**: Roboto font family with various weights
- **Components**: Reusable UI components following UPS design patterns

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Figma Integration

### MCP Server
The Figma MCP server provides direct integration with Figma designs:

```powershell
npm run mcp-server  # Start server on http://127.0.0.1:3845
```

Available MCP tools:
- `mcp_figma_get_code` - Get design code/data
- `mcp_figma_get_metadata` - Get design structure
- `mcp_figma_get_screenshot` - Get design images
- `mcp_figma_get_variable_defs` - Get design variables

### Fetch Figma Designs
```powershell
npm run figma:fetch <fileKey> [nodeId]
```

Downloads raw Figma JSON to `./figma-exports/` directory.

### Automate with LLMs
```powershell
npm run figma:automate <fileKey> [nodeId] [--llm=openai|claude]
```

Processes designs and optionally analyzes with AI. Output saved to `./llm-processing/`.

### Documentation
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference
- **[COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)** - Comprehensive guide with examples
- **[FIGMA_SETUP.md](FIGMA_SETUP.md)** - Detailed setup instructions

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Implementation Notes

- Converted from React + Tailwind to Angular + SCSS
- Uses CSS custom properties for design tokens
- Implements responsive breakpoints for mobile/tablet
- Maintains exact visual fidelity to Figma design
- Uses Angular 20+ standalone components architecture
- Includes Figma MCP server for design automation