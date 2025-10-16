# AI Code Generation Pipeline - Setup & Usage Guide

## 🎯 Overview

This AI-powered pipeline converts Figma designs directly into production-ready Angular components using **IBM Granite LLM**, while **strictly enforcing UPS brand CSS compliance**.

### Key Features

✅ **Brand-Safe Generation** - Only uses approved UPS CSS classes from `src/styles.scss`  
✅ **IBM Granite Integration** - Powered by enterprise-grade LLM  
✅ **Zero CSS Creation** - No new styles, only utility classes  
✅ **Intelligent Validation** - Automatic brand compliance checking  
✅ **Full Automation** - Figma → Code → Files in one command  

---

## 📋 Prerequisites

### 1. IBM Granite API Access

You need IBM watsonx.ai credentials:

```bash
# Get your API key from:
https://cloud.ibm.com/catalog/services/watson-machine-learning
```

### 2. Figma Access Token

Already configured in your `.env` file ✓

### 3. UPS Brand CSS

Already present in `src/styles.scss` ✓

---

## ⚙️ Setup

### Step 1: Configure Environment Variables

Edit `.env` file and add your IBM Granite credentials:

```properties
# Figma (already configured)
FIGMA_ACCESS_TOKEN=your_figma_personal_access_token_here

# IBM Granite LLM (ADD YOUR CREDENTIALS)
IBM_GRANITE_API_KEY=your_actual_api_key_here
IBM_GRANITE_ENDPOINT=https://us-south.ml.cloud.ibm.com/ml/v1/text/generation
IBM_GRANITE_MODEL_ID=ibm/granite-13b-chat-v2
```

### Step 2: Test Connection

```bash
npm run figma:test
```

Expected output:
```
✓ Figma API token found
✓ IBM Granite API connected
✓ Brand CSS loaded (87 classes)
✅ All systems ready!
```

---

## 🚀 Usage

### Basic Command

```bash
npm run figma:generate <file-key> <node-id> <component-name>
```

### Real Example

Using your actual Figma design:

```bash
# Generate track-page component from Figma node 255-2415
npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page
```

### With Code Analysis

```bash
# Analyze existing components for consistency
npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page --analyze
```

---

## 📊 Pipeline Flow

```
1. 📥 Fetch Figma Design
   ↓
2. 🎨 Load UPS Brand CSS (Immutable)
   ↓
3. 🔍 Analyze Existing Code (Optional)
   ↓
4. 🧠 Generate with IBM Granite
   ↓
5. ✅ Validate CSS Compliance
   ↓
6. 💾 Save Component Files
```

---

## 📁 Generated Output

Components are saved to:
```
src/app/components/<component-name>/
├── <component-name>.component.ts     # TypeScript logic
├── <component-name>.component.html   # Template (using UPS CSS classes)
└── <component-name>.component.scss   # Empty/minimal (no custom styles)
```

### Example Output

```
src/app/components/track-page/
├── track-page.component.ts
├── track-page.component.html
└── track-page.component.scss
```

---

## 🎨 Brand CSS Enforcement

### ✅ What the AI Can Do

- Use existing CSS classes from `styles.scss`
- Combine utility classes (e.g., `flex items-center gap-4`)
- Use UPS brand colors via variables (`var(--ups-gold)`)

### ❌ What the AI Cannot Do

- Create new CSS classes
- Use inline styles
- Modify `src/styles.scss`
- Generate custom SCSS code

### Example: Generated HTML

```html
<!-- ✅ CORRECT: Uses approved UPS brand classes -->
<div class="flex flex-col items-center gap-4 bg-ups-white p-4">
  <h1 class="text-ups-black font-roboto-medium">Track a Package</h1>
  <button class="bg-ups-gold text-ups-white rounded-lg px-4 py-4 cursor-pointer">
    Track
  </button>
</div>

<!-- ❌ WRONG: Would be rejected by validator -->
<div class="custom-header" style="color: red;">
  <!-- This would fail validation -->
</div>
```

---

## 🔧 Troubleshooting

### Error: "IBM_GRANITE_API_KEY not found"

**Solution:** Add your API key to `.env` file

```bash
IBM_GRANITE_API_KEY=your_actual_key_here
```

### Error: "Generated code contains unauthorized CSS classes"

**Solution:** The AI tried to create new classes. This is a bug in the prompt. Re-run the command.

### Error: "Figma API error: 401"

**Solution:** Check your FIGMA_ACCESS_TOKEN in `.env`

---

## 📖 Advanced Usage

### Custom Output Path

Modify `generate-from-figma.mjs` to change output directory:

```typescript
const result = await pipeline.generateComponentFromFigma(
  fileKey,
  nodeId,
  componentName,
  {
    outputPath: 'custom/path/here',  // Custom path
    analyzeExistingCode: true
  }
);
```

### Integration with Routing

After generation, add route to `app.routes.ts`:

```typescript
import { TrackPageComponent } from './components/track-page/track-page.component';

export const routes: Routes = [
  { path: 'track', component: TrackPageComponent },
  // ... other routes
];
```

---

## 🎯 Next Steps

After successful generation:

1. **Review Generated Code**
   ```bash
   code src/app/components/track-page/
   ```

2. **Add to Routing** (if it's a page)
   - Edit `src/app/app.routes.ts`
   - Add route configuration

3. **Test Locally**
   ```bash
   npm start
   # Open http://localhost:4200/track
   ```

4. **Generate Storybook Story** (coming soon)
   ```bash
   npm run storybook:generate track-page
   ```

5. **Commit to Git** (coming soon)
   ```bash
   npm run git:commit track-page
   ```

---

## 🛡️ Brand Compliance Guarantee

This pipeline ensures **100% UPS brand compliance** by:

1. **Immutable CSS** - `src/styles.scss` is never modified
2. **Strict Validation** - Automatic checking of all generated classes
3. **Zero New Styles** - No SCSS code in component files
4. **Enforced Prompts** - IBM Granite receives strict instructions

**The UPS brand CSS is sacred and will never be changed by this system.**

---

## 📚 Architecture

```
src/ai-pipeline/
├── services/
│   ├── brand-css.service.ts      # CSS parser & validator
│   ├── granite-llm.service.ts    # IBM Granite integration
│   └── code-generator.service.ts # Orchestrator
├── templates/                     # Code templates (future)
└── prompts/                       # LLM prompts (future)
```

---

## 🤝 Support

Issues? Questions?

1. Run diagnostics: `npm run figma:test`
2. Check logs in console
3. Verify `.env` configuration
4. Review generated code for errors

---

**Happy Coding! 🚀**
