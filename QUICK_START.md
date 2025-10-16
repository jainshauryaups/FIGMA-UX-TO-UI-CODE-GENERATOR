# 🚀 Quick Start - AI Code Generation

## ✅ Phase 1 Complete!

The foundation is built. Here's what you have:

### Created Files

```
src/ai-pipeline/
├── services/
│   ├── brand-css.service.ts       ✅ Parses UPS brand CSS
│   └── granite-llm.service.ts     ✅ IBM Granite integration
├── code-generation-pipeline.ts    ✅ Main orchestrator
│
generate-from-figma.mjs            ✅ CLI tool
AI_PIPELINE_GUIDE.md               ✅ Full documentation
.env                               ✅ Updated with IBM config
package.json                       ✅ New scripts added
```

---

## 🎯 What You Need Next

### 1. Get IBM Granite API Key

**Option A: IBM watsonx.ai (Recommended)**
1. Go to https://cloud.ibm.com/
2. Sign in / Create account
3. Navigate to: Catalog → AI/Machine Learning → watsonx.ai
4. Create instance
5. Get API key from credentials

**Option B: IBM Cloud Pak for Data**
- If your organization already has it

### 2. Update .env File

```bash
# Replace this placeholder:
IBM_GRANITE_API_KEY=your_actual_key_here

# With your real key:
IBM_GRANITE_API_KEY=abcd1234...
```

---

## 🧪 Test the System

```bash
# Run diagnostics
npm run figma:test
```

**Expected Output:**
```
🔧 Running diagnostics...

✓ Figma API token found
✓ IBM Granite API connected
✓ Brand CSS loaded (87 classes)

✅ All systems ready!
```

---

## 🎨 Generate Your First Component

```bash
# Using your actual Figma design
npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page
```

**What happens:**
1. Fetches Figma design data
2. Loads UPS brand CSS (87 approved classes)
3. Sends to IBM Granite with strict CSS rules
4. Generates Angular component
5. Validates all CSS classes
6. Saves 3 files (TS, HTML, SCSS)

---

## 📂 Output

```
src/app/components/track-page/
├── track-page.component.ts       # Angular component logic
├── track-page.component.html     # Template with UPS classes
└── track-page.component.scss     # Empty (uses utilities)
```

---

## 🛡️ Brand Safety Guarantee

### Your styles.scss is PROTECTED:

✅ Never modified  
✅ Only referenced  
✅ Classes enforced  
✅ Validation built-in  

### The AI CANNOT:

❌ Create new CSS classes  
❌ Use inline styles  
❌ Modify styles.scss  
❌ Generate custom SCSS  

### The AI MUST:

✅ Use only approved UPS classes  
✅ Combine utility classes  
✅ Follow brand colors  
✅ Pass validation  

---

## 📖 Full Documentation

See `AI_PIPELINE_GUIDE.md` for:
- Detailed setup instructions
- Advanced usage examples
- Troubleshooting guide
- Architecture overview

---

## 🚧 What's Next (Phase 2 & 3)

### Coming Soon:

- ⏳ Intelligent code merger (update existing components)
- ⏳ Storybook integration (automatic story generation)
- ⏳ Git automation (auto-commit, branch, PR)
- ⏳ Route auto-update (app.routes.ts)

---

## 💡 Pro Tips

1. **Start Small** - Generate simple components first
2. **Review Output** - Always check generated code
3. **Test Locally** - Run `npm start` after generation
4. **Iterate** - Re-run if output isn't perfect

---

## ❓ Need Help?

Run diagnostics first:
```bash
npm run figma:test
```

Common issues:
- Missing API key → Check .env
- Connection error → Verify IBM endpoint
- Invalid CSS → Check validation output

---

**Ready to generate your first AI-powered component?** 🚀

```bash
npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page
```
