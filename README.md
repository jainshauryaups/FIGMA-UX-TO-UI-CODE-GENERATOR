# Figma UX to UI Code Generator

**AI-powered pipeline that transforms Figma designs into production-ready Angular components**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR)
[![Node](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-20+-red)](https://angular.io/)

## Overview

This repository contains a complete code generation pipeline that:
1. **Fetches** Figma designs via API
2. **Generates** Angular components using IBM Granite LLM
3. **Validates** strict UPS brand CSS compliance
4. **Previews** components with interactive approval
5. **Automates** Git branching and routing

Built for **UPS** to accelerate frontend development from Figma designs.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Figma Personal Access Token ([Get one here](https://www.figma.com/developers/api#access-tokens))
- IBM Granite API Key

### Installation

```bash
# 1. Clone repository
git clone https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR.git
cd FIGMA-UX-TO-UI-CODE-GENERATOR

# 2. Install pipeline dependencies
npm install

# 3. Install Angular app dependencies
cd generated-app
npm install
cd ..

# 4. Configure environment
cp .env.example .env
# Edit .env with your tokens
```

### Generate Your First Component

```bash
# Run the generator
npm run generate

# Follow the prompts:
# - Enter Figma file key
# - Enter node ID
# - Preview opens automatically
# - Type 'A' to approve
# - Component moves to generated-app/src/app/components/
# - Git branch created automatically
```

---

## 📂 Repository Structure

```
FIGMA-UX-TO-UI-CODE-GENERATOR/
│
├── pipeline/              🔧 Code generation tooling
│   ├── generate-with-preview.mjs  (main generator)
│   ├── figma-mcp-server.mjs       (Figma MCP server)
│   ├── servers/                   (test servers)
│   └── .preview/                  (temp previews)
│
├── generated-app/         🎨 Angular application
│   ├── src/app/components/        (generated components)
│   ├── src/app/app.routes.ts     (auto-updated)
│   └── src/styles.scss           (UPS Brand CSS)
│
├── docs/                  📚 Documentation
│   ├── setup/            (installation guides)
│   ├── guides/           (workflows & best practices)
│   ├── reports/          (POC summaries)
│   └── technical/        (technical deep dives)
│
├── .env                   🔐 Environment variables
└── package.json          📦 Pipeline dependencies
```

---

## 🎯 Features

### AI Code Generation
- **IBM Granite LLM** integration for intelligent code generation
- **Strict CSS validation** - Only approved UPS brand classes allowed
- **Angular 20+ syntax** - Modern standalone components
- **TypeScript-first** - Fully typed components

### Developer Experience
- **Interactive preview** - See components before committing
- **Automatic routing** - app.routes.ts updated automatically
- **Git automation** - Feature branches created (`feat/figma-*`)
- **VSCode integration** - Preview opens automatically

### Quality Assurance
- **53 approved CSS classes** from UPS brand guidelines
- **93% CSS compliance** achieved in testing
- **No Tailwind** - Prevents training bias issues
- **Inline styles** for gradients/opacity when needed

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [Quick Start](docs/setup/QUICK_START.md) | Get up and running in 5 minutes |
| [Developer Guide](docs/guides/DEVELOPER_GUIDE.md) | Complete workflow for developers |
| [Branch Workflow](docs/guides/BRANCH_WORKFLOW_GUIDE.md) | Visual guide to Git automation |
| [Complete Guide](docs/guides/COMPLETE_GUIDE.md) | Comprehensive documentation |
| [Migration Summary](MIGRATION_SUMMARY.md) | Repository reorganization details |

---

## 🔧 Commands

### Pipeline Commands (Root)
```bash
npm run generate         # Run code generator (main workflow)
npm run mcp-server       # Start Figma MCP server  
npm run figma:fetch      # Fetch Figma JSON
npm run figma:automate   # Run automation pipeline
```

### Angular App Commands (generated-app/)
```bash
cd generated-app
npm start               # Run dev server (localhost:4200)
npm build               # Build for production
npm test                # Run tests
```

---

## 🎨 Generated Components

Example components already generated:
- **track-page** - Main tracking interface
- **demo-component** - Feature showcase
- **quote-ship-page** - Shipping quote form

All components feature:
- ✅ UPS brand CSS compliance
- ✅ Responsive design
- ✅ TypeScript types
- ✅ Standalone architecture

---

## 🤝 Contributing

This is an internal UPS project. For questions or issues:

1. Check documentation in `docs/`
2. Review `MIGRATION_SUMMARY.md` for recent changes
3. Contact the development team

---

## 📄 License

**Proprietary** - Internal UPS tool

---

## 🔗 Links

- **Repository**: https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR
- **Figma API**: https://www.figma.com/developers/api
- **IBM Granite**: https://www.ibm.com/products/watsonx-ai
- **Angular**: https://angular.io

---

**Built with** ❤️ **by UPS Development Team**
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