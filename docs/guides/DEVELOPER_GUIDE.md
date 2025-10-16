# 🚀 Figma to Angular - Developer Guide

**For Frontend Developers: How to Generate Components from Figma Designs**

---

## 📋 **Prerequisites**

Before you start, make sure you have:
- ✅ Node.js installed (v18+)
- ✅ Git installed
- ✅ Access to this repository
- ✅ Figma access token (ask team lead)
- ✅ IBM Granite API key (ask team lead)

---

## 🎯 **Quick Start - Generate Your First Component**

### **Step 1: Clone the Repository**

```powershell
# Clone the repo
git clone https://github.com/YOUR-ORG/poc.git
cd poc

# Install dependencies
npm install
```

### **Step 2: Set Up Environment Variables (First Time Only)**

Create a `.env` file in the root:

```env
FIGMA_ACCESS_TOKEN=your_figma_token_here
IBM_GRANITE_API_KEY=your_ibm_api_key_here
IBM_GRANITE_PROJECT_ID=0d4fb471-2d2f-4496-8a2c-bfb3567fdea1
```

> **Note:** Ask your team lead for these credentials. Never commit `.env` to Git!

### **Step 3: Get Figma Node ID**

1. Open your Figma design in browser
2. Select the component/frame you want to generate
3. Copy the URL - it looks like:
   ```
   https://figma.com/design/0eg3UmbqMcZtym1x8sGtZX/filename?node-id=255-2415
   ```
4. Extract:
   - **File Key:** `0eg3UmbqMcZtym1x8sGtZX` (after `/design/`)
   - **Node ID:** `255-2415` (after `node-id=`)

### **Step 4: Generate Component**

```powershell
# Syntax: node generate-with-preview.mjs <FILE-KEY> <NODE-ID> <COMPONENT-NAME>

# Example:
node generate-with-preview.mjs 0eg3UmbqMcZtym1x8sGtZX 255-2415 my-new-component

# Use kebab-case for component names (e.g., user-profile, shipping-form)
```

### **Step 5: Review Preview**

The script will:
1. ✅ Fetch design from Figma (~2 seconds)
2. ✅ Generate Angular code with AI (~8 seconds)
3. ✅ Validate CSS against UPS brand guidelines
4. ✅ Save to `.preview/my-new-component/` folder
5. ✅ Open files in VSCode automatically

**You'll see a summary:**
```
══════════════════════════════════════════════════
  📋 PREVIEW SUMMARY
══════════════════════════════════════════════════

Component: my-new-component
Files: 3 files created
  • my-new-component.component.ts (20 lines)
  • my-new-component.component.html (15 lines)
  • my-new-component.component.scss (2 lines)

CSS Validation:
  ✅ PASSED - All 12 classes approved
  
  OR
  
  ❌ FAILED - 2 unauthorized classes
  Violations:
    • text-4xl (use inline style instead)
    • bg-blue-500 (use bg-ups-blue instead)

══════════════════════════════════════════════════
```

### **Step 6: Choose What to Do**

You'll be prompted with options:

```
What would you like to do?

  [A] Accept & save to final location + Git commit
  [R] Regenerate with stricter CSS enforcement
  [E] Edit manually in VSCode (keep in preview)
  [C] Cancel and delete preview

Your choice:
```

**Choose based on CSS validation:**

#### ✅ **If CSS Validation PASSED:**
Type `A` to accept
- Files move to `src/app/components/my-new-component/`
- Route auto-added to `app.routes.ts`
- Git branch created: `feat/figma-my-new-component`
- Changes committed with Figma metadata

#### ⚠️ **If CSS Validation FAILED (has violations):**

**Option 1 - Regenerate (Recommended):**
Type `R` to regenerate
- AI will try again with stricter enforcement
- Usually fixes 80% of violations

**Option 2 - Manual Fix:**
Type `E` to edit in VSCode
1. Fix the violations (usually just 1-2 classes)
2. Save files
3. Run the generator again with same component name
4. Type `A` to accept

**Option 3 - Accept Anyway (Not Recommended):**
Type `A` to accept despite violations
- Only if you plan to fix manually later
- May cause runtime styling issues

---

## 🌳 **Git Workflow (IMPORTANT!)**

### **Automatic Branch Strategy**

When you accept a component (`A`), the system automatically:

1. **Creates feature branch:**
   ```
   feat/figma-<component-name>
   ```
   Example: `feat/figma-user-profile`

2. **Commits with metadata:**
   ```
   feat: Add UserProfileComponent from Figma design

   - Generated from Figma node: 255-2415
   - File key: 0eg3UmbqMcZtym1x8sGtZX
   - Component path: src/app/components/user-profile/
   - Route: /user-profile
   - Generated with AI pipeline using IBM Granite LLM
   - UPS brand CSS compliant
   ```

3. **Ready for push:**
   ```powershell
   git push origin feat/figma-user-profile
   ```

### **Complete Developer Workflow**

```powershell
# 1. Start from main branch
git checkout main
git pull origin main

# 2. Generate component (creates new branch automatically)
node generate-with-preview.mjs <FILE-KEY> <NODE-ID> <component-name>

# 3. Review preview → Type 'A' to accept
# (Branch feat/figma-component-name created automatically)

# 4. Test the component
npm start
# Visit http://localhost:4200/component-name in browser

# 5. If looks good, push to GitHub
git push origin feat/figma-<component-name>

# 6. Create Pull Request on GitHub
# Go to: https://github.com/YOUR-ORG/poc/pulls
# Click "New Pull Request"
# Select: base: main ← compare: feat/figma-<component-name>
# Add screenshots from Figma + browser
# Request review from team lead

# 7. After PR approval and merge, cleanup
git checkout main
git pull origin main
git branch -d feat/figma-<component-name>
```

---

## 🧪 **Testing Your Component**

### **Step 1: Start Dev Server**
```powershell
npm start
```

### **Step 2: Open in Browser**
Navigate to:
```
http://localhost:4200/<component-name>
```

Example: `http://localhost:4200/user-profile`

### **Step 3: Verify**

Check:
- ✅ Component renders without errors
- ✅ Layout matches Figma design
- ✅ UPS brand colors/fonts applied correctly
- ✅ Responsive behavior (resize browser)
- ✅ No console errors (F12 → Console tab)

### **Step 4: Side-by-Side Comparison**

Open Figma design and browser side-by-side:
- Compare spacing, colors, fonts
- Check alignment and sizing
- Verify text content

---

## ⚠️ **Common Issues & Solutions**

### **Issue 1: CSS Validation Failed**

**Problem:**
```
❌ CSS Validation FAILED! 2 unauthorized classes found:
   - text-4xl
   - object-cover
```

**Solution:**
Either regenerate (`R`) or manually fix in `.preview/` folder:

```html
<!-- BEFORE (wrong) -->
<h1 class="text-4xl">Title</h1>
<img class="object-cover" />

<!-- AFTER (correct) -->
<h1 [style]="'font-size: 2.25rem'">Title</h1>
<img [style]="'object-fit: cover; width: 300px; height: 200px'" />
```

Then run generator again and accept.

### **Issue 2: Component Already Exists**

**Problem:**
```
Error: Component my-component already exists in src/app/components/
```

**Solution:**
Either:
1. Use a different component name
2. Delete existing component first
3. Rename the Figma node

### **Issue 3: Compilation Errors**

**Problem:**
```
TS2724: '@angular/core' has no exported member 'standalone'
```

**Solution:**
This was a bug in early versions. Make sure you have the latest code:
```powershell
git pull origin main
```

The prompt now generates correct Angular 20+ syntax.

### **Issue 4: Route Not Working**

**Problem:**
Navigating to `http://localhost:4200/my-component` shows 404

**Solution:**
Check `src/app/app.routes.ts`:
```typescript
// Should have this line:
import { MyComponent } from './components/my-component/my-component.component';

// And this route:
{ path: 'my-component', component: MyComponent },
```

If missing, the auto-update failed. Add manually and restart server.

### **Issue 5: White Screen in Browser**

**Problem:**
Component loads but shows blank white screen

**Solution:**
Check browser console (F12) for errors. Usually caused by:
1. Missing imports in component `.ts` file
2. Incorrect CSS class names
3. Template syntax errors

Fix the errors and restart: `npm start`

---

## 📊 **Quality Standards**

### **CSS Compliance Requirements**

**Target:** 90%+ compliance with UPS brand CSS

**Approved CSS Classes (53 total):**
```css
/* Layout */
flex, flex-col, flex-row, items-center, justify-center, gap-8, relative, absolute

/* Colors */
bg-ups-blue, bg-ups-grey-1, bg-ups-grey-2, bg-ups-grey-3, bg-ups-grey-4, bg-ups-grey-5
text-ups-white, text-ups-black, text-ups-blue, text-ups-grey-3

/* Typography */
font-roboto-bold, font-roboto-light, font-roboto-medium

/* Spacing */
p-4, p-8, m-4, m-8

/* Borders */
rounded-lg, shadow-lg

/* ... and more (see src/styles.scss for complete list)
```

**Forbidden (Tailwind/Bootstrap):**
```css
❌ text-4xl, text-xl, text-sm (font sizes)
❌ bg-gradient-to-t, from-blue-500, to-gray-200 (gradients)
❌ object-cover, aspect-square (image utilities)
❌ opacity-60, opacity-80 (opacity utilities)
❌ hover:*, focus:*, active:* (state modifiers)
```

**Use inline styles instead:**
```html
✅ [style]="'font-size: 2.25rem'"
✅ [style]="'background: linear-gradient(to top, var(--ups-blue), var(--ups-grey-2))'"
✅ [style]="'object-fit: cover; width: 300px; height: 200px'"
✅ [style]="'opacity: 0.6'"
```

### **Code Review Checklist**

Before creating PR, verify:
- [ ] CSS validation passed (or violations fixed manually)
- [ ] Component compiles without TypeScript errors
- [ ] Component renders correctly in browser
- [ ] Matches Figma design visually
- [ ] Route added to `app.routes.ts`
- [ ] Committed to feature branch (`feat/figma-*`)
- [ ] No console errors in browser
- [ ] Tested on Chrome (primary browser)

---

## 🎯 **Best Practices**

### **Naming Conventions**

**Component Names:**
- Use kebab-case: `user-profile`, `shipping-form`, `tracking-card`
- Be descriptive: `order-summary` not `summary`
- Match Figma layer name when possible

**Branch Names:**
- Auto-generated: `feat/figma-<component-name>`
- Don't change manually

**File Naming:**
- Auto-generated: `<component-name>.component.ts|html|scss`
- Don't rename after generation

### **Figma Organization**

For best results:
1. Name your Figma frames clearly (e.g., "UserProfileCard")
2. Use components/frames (not groups) for generation
3. Keep designs at 1920x1080 or mobile (375x812)
4. Use UPS brand colors in Figma variables when possible

### **Git Hygiene**

**DO:**
- ✅ Create one branch per component
- ✅ Test thoroughly before pushing
- ✅ Write clear PR descriptions with screenshots
- ✅ Delete branches after merge

**DON'T:**
- ❌ Commit directly to `main`
- ❌ Commit `.env` file
- ❌ Reuse feature branches for multiple components
- ❌ Push without testing

---

## 🚀 **Advanced Usage**

### **Batch Generation (Multiple Components)**

Generate multiple components in sequence:

```powershell
# Component 1
node generate-with-preview.mjs <FILE-KEY> <NODE-ID-1> component-1
# Review → Accept

# Component 2  
node generate-with-preview.mjs <FILE-KEY> <NODE-ID-2> component-2
# Review → Accept

# Push all at once
git push origin feat/figma-component-1
git push origin feat/figma-component-2
```

### **Regeneration (Fix Issues)**

If accepted component has issues:

```powershell
# 1. Delete the component
rm -r src/app/components/my-component

# 2. Remove from routes manually (app.routes.ts)

# 3. Regenerate
node generate-with-preview.mjs <FILE-KEY> <NODE-ID> my-component

# 4. Review more carefully this time
# Type 'E' to edit if needed, then 'A' to accept
```

### **Custom Styling**

If you need component-specific styles:

1. Accept component (`A`)
2. Edit `<component-name>.component.scss`:
   ```scss
   // Add component-specific styles here
   .custom-hover-effect {
     &:hover {
       transform: scale(1.05);
       transition: transform 0.2s;
     }
   }
   ```
3. Use in template:
   ```html
   <div class="flex items-center custom-hover-effect">
   ```

---

## 📞 **Getting Help**

### **Common Questions**

**Q: How long does generation take?**
A: ~10 seconds total (2s Figma fetch + 8s AI generation)

**Q: Can I edit generated code?**
A: Yes! After accepting, edit files in `src/app/components/` as needed.

**Q: What if CSS validation fails repeatedly?**
A: Accept anyway (`A`) and fix manually. Usually just 1-2 class replacements.

**Q: Can I generate from Figma mobile designs?**
A: Yes! Use the same process. AI adapts to mobile layouts.

**Q: What's the success rate?**
A: ~85-95% depending on design complexity. Preview workflow catches issues.

### **Support Resources**

- **Documentation:** See all `.md` files in root directory
- **Prompt Details:** See `PROMPT_ANALYSIS.md`
- **CSS Rules:** See `src/styles.scss`
- **Team Lead:** Contact for Figma/IBM credentials
- **Issues:** Create GitHub issue with:
  - Figma node ID
  - Error message
  - Screenshot of preview

---

## 🎉 **Success Metrics**

**You're doing great if:**
- ✅ CSS validation passes 90%+ of the time
- ✅ Components compile without errors
- ✅ Visual match with Figma design is 80%+
- ✅ Generation → Commit takes < 2 minutes
- ✅ PRs are approved with minimal changes

**Typical Timeline:**
- Fetch Figma: 2 seconds
- Generate code: 8 seconds
- Review preview: 30 seconds
- Test in browser: 1 minute
- Create PR: 2 minutes
- **Total: ~4 minutes** (vs 7 hours manual!)

---

## 📝 **Quick Reference**

### **One-Line Commands**

```powershell
# Generate component
node generate-with-preview.mjs <FILE-KEY> <NODE-ID> <component-name>

# Start dev server
npm start

# Push to GitHub
git push origin feat/figma-<component-name>

# Check Git status
git status

# View commit log
git log --oneline -5
```

### **File Locations**

```
src/
├── app/
│   ├── app.routes.ts          ← Routes (auto-updated)
│   └── components/
│       └── <component-name>/  ← Your component here
├── styles.scss                ← UPS brand CSS (DO NOT EDIT)
└── ...

.preview/                      ← Preview folder (temporary)
└── <component-name>/          ← Review here before accepting
```

---

**Happy Coding! 🚀**

*Last Updated: October 16, 2025*  
*For questions: Contact your team lead*
