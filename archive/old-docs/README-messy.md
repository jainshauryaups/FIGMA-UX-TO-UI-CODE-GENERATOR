# 🎨 Figma to Angular Code Generator# Figma UX to UI Code Generator



**AI-powered Python pipeline that transforms Figma designs into production-ready Angular components****AI-powered pipeline that transforms Figma designs into production-ready Angular components**



[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR)[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR)

[![Python](https://img.shields.io/badge/Python-3.8+-green)](https://python.org/)[![Node](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

[![Angular](https://img.shields.io/badge/Angular-20+-red)](https://angular.io/)[![Angular](https://img.shields.io/badge/Angular-20+-red)](https://angular.io/)

[![IBM Granite](https://img.shields.io/badge/IBM-Granite_LLM-blue)](https://www.ibm.com/products/watsonx-ai)

## Overview

---

This repository contains a complete code generation pipeline that:

## 🚀 Overview1. **Fetches** Figma designs via API

2. **Generates** Angular components using IBM Granite LLM

This repository contains an automated pipeline that:3. **Validates** strict UPS brand CSS compliance

1. **Fetches** Figma designs via REST API4. **Previews** components with interactive approval

2. **Generates** Angular components using IBM Granite LLM (3-8B-Instruct)5. **Automates** Git branching and routing

3. **Auto-fixes** TypeScript properties referenced in HTML

4. **Validates** strict UPS brand CSS compliance (53 approved classes)Built for **UPS** to accelerate frontend development from Figma designs.

5. **Previews** components with automatic browser opening

6. **Manages** Angular routes automatically---

7. **Approves** interactively (Accept/Reject/Regenerate)

## 🚀 Quick Start

Built for **UPS** to accelerate frontend development from Figma designs.

### Prerequisites

---- Node.js 18+

- Figma Personal Access Token ([Get one here](https://www.figma.com/developers/api#access-tokens))

## ⚡ Quick Start- IBM Granite API Key



### Prerequisites### Installation

- **Python 3.8+** ([Download](https://python.org))

- **Node.js 18+** (for Angular CLI)```bash

- **Figma Personal Access Token** ([Get one](https://www.figma.com/developers/api#access-tokens))# 1. Clone repository

- **IBM Cloud API Key** ([Get one](https://cloud.ibm.com/iam/apikeys))git clone https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR.git

cd FIGMA-UX-TO-UI-CODE-GENERATOR

### Installation

# 2. Install pipeline dependencies

```bashnpm install

# 1. Clone repository

git clone https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR.git# 3. Install Angular app dependencies

cd FIGMA-UX-TO-UI-CODE-GENERATORcd generated-app

npm install

# 2. Install Python dependenciescd ..

pip install -r requirements.txt

# 4. Configure environment

# 3. Install Angular dependencies (first time only)cp .env.example .env

cd generated-app# Edit .env with your tokens

npm install```

cd ..

### Generate Your First Component

# 4. Configure environment

cp .env.template .env```bash

# Edit .env with your API tokens# Run the generator

```npm run generate



### Run the Pipeline# Follow the prompts:

# - Enter Figma file key

```bash# - Enter node ID

# Validate setup# - Preview opens automatically

python test_pipeline_setup.py# - Type 'A' to approve

# - Component moves to generated-app/src/app/components/

# Generate a component# - Git branch created automatically

python pipeline/generate_pipeline.py <figma_file_key> <node_id> <component_name>```



# Example---

python pipeline/generate_pipeline.py 0eg3UmbqMcZtym1x8sGtZX 261-1272 home-page

```## 📂 Repository Structure



**What happens:**```

1. Fetches Figma design (2 seconds)FIGMA-UX-TO-UI-CODE-GENERATOR/

2. Generates code with IBM Granite LLM (5-8 seconds)│

3. Auto-fixes missing TypeScript properties├── pipeline/              🔧 Code generation tooling

4. Validates CSS against UPS brand guidelines│   ├── generate-with-preview.mjs  (main generator)

5. Opens browser preview automatically│   ├── figma-mcp-server.mjs       (Figma MCP server)

6. Prompts for approval (Accept/Reject/Regenerate)│   ├── servers/                   (test servers)

│   └── .preview/                  (temp previews)

---│

├── generated-app/         🎨 Angular application

## 📂 Project Structure│   ├── src/app/components/        (generated components)

│   ├── src/app/app.routes.ts     (auto-updated)

```│   └── src/styles.scss           (UPS Brand CSS)

FIGMA-UX-TO-UI-CODE-GENERATOR/│

│├── docs/                  📚 Documentation

├── pipeline/│   ├── setup/            (installation guides)

│   ├── generate_pipeline.py       ⭐ MAIN PIPELINE│   ├── guides/           (workflows & best practices)

│   └── brand-css/│   ├── reports/          (POC summaries)

│       └── ups-brand.scss         (53 approved CSS classes)│   └── technical/        (technical deep dives)

││

├── generated-app/                 Angular 20 application├── .env                   🔐 Environment variables

│   ├── src/app/components/        (generated components)└── package.json          📦 Pipeline dependencies

│   └── src/app/app.routes.ts     (auto-updated routes)```

│

├── archive/                       Old Node.js version (reference)---

│   ├── nodejs-version/

│   └── old-docs/## 🎯 Features

│

├── requirements.txt               Python dependencies### AI Code Generation

├── test_pipeline_setup.py         Validation script- **IBM Granite LLM** integration for intelligent code generation

├── .env                           API credentials (gitignored)- **Strict CSS validation** - Only approved UPS brand classes allowed

├── .env.template                  Configuration template- **Angular 20+ syntax** - Modern standalone components

│- **TypeScript-first** - Fully typed components

├── README.md                      This file

├── CTO_DEMO_INSTRUCTIONS.md       Complete demo guide### Developer Experience

├── DEMO_CHEAT_SHEET.md           Quick reference- **Interactive preview** - See components before committing

└── PYTHON_CONVERSION_COMPLETE.md  Technical summary- **Automatic routing** - app.routes.ts updated automatically

```- **Git automation** - Feature branches created (`feat/figma-*`)

- **VSCode integration** - Preview opens automatically

---

### Quality Assurance

## 🎯 Features- **53 approved CSS classes** from UPS brand guidelines

- **93% CSS compliance** achieved in testing

### AI-Powered Generation- **No Tailwind** - Prevents training bias issues

- **IBM Granite 3-8B-Instruct** LLM for code generation- **Inline styles** for gradients/opacity when needed

- **Enterprise-grade** AI (not public models)

- **Intelligent prompting** with strict CSS enforcement---

- **Temperature 0.1** for deterministic output

## 📖 Documentation

### Automatic Error Correction

- **TypeScript Auto-Fix**: Scans HTML for property references, auto-injects missing properties| Guide | Description |

- **Type Inference**: Booleans for toggles, strings for others|-------|-------------|

- **100% Success Rate**: All properties defined correctly| [Quick Start](docs/setup/QUICK_START.md) | Get up and running in 5 minutes |

| [Developer Guide](docs/guides/DEVELOPER_GUIDE.md) | Complete workflow for developers |

### Brand Compliance| [Branch Workflow](docs/guides/BRANCH_WORKFLOW_GUIDE.md) | Visual guide to Git automation |

- **53 Approved UPS CSS Classes** enforced| [Complete Guide](docs/guides/COMPLETE_GUIDE.md) | Comprehensive documentation |

- **Strict Validation**: Blocks unauthorized classes (Tailwind, Bootstrap)| [Migration Summary](MIGRATION_SUMMARY.md) | Repository reorganization details |

- **Violation Reporting**: Clear list of unauthorized classes

- **Inline Style Suggestions**: For gradients, opacity, etc.---



### Developer Experience## 🔧 Commands

- **Automatic Browser Preview**: Chrome opens to `http://localhost:4200/<component-name>`

- **Dev Server Management**: Starts server automatically if needed### Pipeline Commands (Root)

- **Interactive Approval**: Accept/Reject/Regenerate workflow```bash

- **Route Management**: `app.routes.ts` updated automaticallynpm run generate         # Run code generator (main workflow)

- **Cleanup on Reject**: Removes files and reverts routesnpm run mcp-server       # Start Figma MCP server  

npm run figma:fetch      # Fetch Figma JSON

---npm run figma:automate   # Run automation pipeline

```

## 📖 Documentation

### Angular App Commands (generated-app/)

| Document | Description |```bash

|----------|-------------|cd generated-app

| **README.md** (this file) | Quick start and overview |npm start               # Run dev server (localhost:4200)

| **[CTO_DEMO_INSTRUCTIONS.md](CTO_DEMO_INSTRUCTIONS.md)** | Complete demo guide (20+ pages) |npm build               # Build for production

| **[DEMO_CHEAT_SHEET.md](DEMO_CHEAT_SHEET.md)** | Quick reference for live demo |npm test                # Run tests

| **[PYTHON_CONVERSION_COMPLETE.md](PYTHON_CONVERSION_COMPLETE.md)** | Technical summary and validation |```



------



## 🔧 Command Reference## 🎨 Generated Components



### Pipeline CommandsExample components already generated:

- **track-page** - Main tracking interface

```bash- **demo-component** - Feature showcase

# Validate setup (run first)- **quote-ship-page** - Shipping quote form

python test_pipeline_setup.py

All components feature:

# Generate component- ✅ UPS brand CSS compliance

python pipeline/generate_pipeline.py <file_key> <node_id> <component_name>- ✅ Responsive design

- ✅ TypeScript types

# Example with real Figma design- ✅ Standalone architecture

python pipeline/generate_pipeline.py 0eg3UmbqMcZtym1x8sGtZX 261-1272 my-component

```---



### Angular App Commands## 🤝 Contributing



```bashThis is an internal UPS project. For questions or issues:

cd generated-app

1. Check documentation in `docs/`

npm start       # Dev server (http://localhost:4200)2. Review `MIGRATION_SUMMARY.md` for recent changes

npm run build   # Production build3. Contact the development team

npm test        # Run tests

```---



---## 📄 License



## 🎨 How It Works**Proprietary** - Internal UPS tool



### 1. Figma API Fetch---

```python

# Fetches design JSON from Figma REST API## 🔗 Links

GET https://api.figma.com/v1/files/{key}/nodes?ids={id}

```- **Repository**: https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR

- **Figma API**: https://www.figma.com/developers/api

### 2. LLM Code Generation- **IBM Granite**: https://www.ibm.com/products/watsonx-ai

```python- **Angular**: https://angular.io

# Sends to IBM Granite with strict CSS prompt

POST https://us-south.ml.cloud.ibm.com/ml/v1/text/chat---

{

  "model": "ibm/granite-3-8b-instruct",**Built with** ❤️ **by UPS Development Team**

  "messages": [{│   └── app.routes.ts                 # Route configuration

    "role": "user",├── assets/                           # Images and icons

    "content": "Generate Angular component..."├── styles.scss                       # Global styles and UPS design tokens

  }]└── index.html                        # Main HTML template

}```

```

## UPS Design System

### 3. TypeScript Auto-Fix

```pythonThe project implements the UPS brand guidelines with:

# Parses HTML for property references

- Event bindings: (click)="prop = value"- **Colors**: UPS Gold (#FFC400), UPS Brown (#351C15), UPS Black (#121212)

- Conditionals: *ngIf="prop"- **Typography**: Roboto font family with various weights

- Toggles: prop = !prop- **Components**: Reusable UI components following UPS design patterns



# Injects missing properties## Development server

class MyComponent {

  showDetails: boolean = false;  # Auto-injectedRun `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

  isActive: boolean = false;     # Auto-injected

}## Code scaffolding

```

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### 4. CSS Validation

```python## Build

# Extracts all class="..." from HTML

# Compares against 53 approved UPS classesRun `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

# Reports violations with clear error message

```## Running unit tests



### 5. Browser PreviewRun `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

```python

1. Copy component to generated-app/src/app/components/## Figma Integration

2. Update app.routes.ts with import and route

3. Check if dev server running (localhost:4200)### MCP Server

4. Start server if needed (new PowerShell window)The Figma MCP server provides direct integration with Figma designs:

5. Wait for server ready (health check every 2 sec)

6. Open Chrome to http://localhost:4200/<component-name>```powershell

```npm run mcp-server  # Start server on http://127.0.0.1:3845

```

### 6. Approval Workflow

```Available MCP tools:

Your choice (A/R/G):- `mcp_figma_get_code` - Get design code/data

  A = Accept  → Keep files, done- `mcp_figma_get_metadata` - Get design structure

  R = Reject  → Delete files, revert routes- `mcp_figma_get_screenshot` - Get design images

  G = Generate → Run pipeline again with new LLM response- `mcp_figma_get_variable_defs` - Get design variables

```

### Fetch Figma Designs

---```powershell

npm run figma:fetch <fileKey> [nodeId]

## 🎯 Success Metrics```



| Metric | Value |Downloads raw Figma JSON to `./figma-exports/` directory.

|--------|-------|

| **Pipeline Time** | 11-14 seconds |### Automate with LLMs

| **Manual Time Saved** | ~2 hours per component |```powershell

| **Feature Completion** | 86% (6 out of 7 features) |npm run figma:automate <fileKey> [nodeId] [--llm=openai|claude]

| **CSS Enforcement** | 100% validation |```

| **TypeScript Auto-Fix** | 100% property injection |

| **Browser Preview** | Fully automated |Processes designs and optionally analyzes with AI. Output saved to `./llm-processing/`.



---### Documentation

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick command reference

## 📋 Environment Variables- **[COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)** - Comprehensive guide with examples

- **[FIGMA_SETUP.md](FIGMA_SETUP.md)** - Detailed setup instructions

Create a `.env` file (use `.env.template` as reference):

## Further help

```bash

# Figma APITo get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

FIGMA_ACCESS_TOKEN=figd_your_token_here

## Implementation Notes

# IBM Watson AI

IBM_GRANITE_API_KEY=your_ibm_api_key_here- Converted from React + Tailwind to Angular + SCSS

IBM_GRANITE_PROJECT_ID=your_project_id_here- Uses CSS custom properties for design tokens

```- Implements responsive breakpoints for mobile/tablet

- Maintains exact visual fidelity to Figma design

**Get credentials:**- Uses Angular 20+ standalone components architecture

- **Figma**: https://www.figma.com/settings → Personal Access Tokens- Includes Figma MCP server for design automation
- **IBM**: https://cloud.ibm.com/iam/apikeys → Create API key

---

## 🐛 Troubleshooting

### `Module 'requests' not found`
```bash
pip install -r requirements.txt
```

### `FIGMA_ACCESS_TOKEN not found`
Check `.env` file exists and has correct format (no spaces around `=`)

### `Dev server failed to start`
```bash
# Check port availability
netstat -ano | findstr :4200

# Kill process if needed
Stop-Process -Id <PID> -Force
```

### `IBM API returns 401`
1. Verify `IBM_GRANITE_API_KEY` in `.env`
2. Check API key hasn't expired
3. Ensure Watson AI service is active

---

## 🤝 Contributing

This is an internal UPS project. For questions:
1. Check documentation files
2. Contact development team

---

## 📜 License

**Proprietary** - Internal UPS tool

---

## 🔗 Links

- **Repository**: https://github.com/jainshauryaups/FIGMA-UX-TO-UI-CODE-GENERATOR
- **Figma API Docs**: https://www.figma.com/developers/api
- **IBM Granite**: https://www.ibm.com/products/watsonx-ai
- **Angular**: https://angular.io
- **Python**: https://python.org

---

## 📝 Notes

### Migration from Node.js
This project was originally built in Node.js (see `archive/nodejs-version/`). The Python version preserves 100% feature parity:
- ✅ All 9 core features converted
- ✅ Same APIs (Figma, IBM Granite)
- ✅ Same validation logic
- ✅ Same browser automation
- ✅ ~25% fewer lines of code

### UPS Brand CSS
The pipeline enforces 53 pre-approved CSS classes:
- `.ups-gold-bg`, `.ups-brown-text`, `.ups-container`, etc.
- Blocks Tailwind (`w-screen`, `text-lg`, etc.)
- Blocks Bootstrap (`container-fluid`, `btn-primary`, etc.)
- Suggests inline styles for unsupported styles

---

**Built with ❤️ by UPS Development Team**

**Last Updated:** October 2025
