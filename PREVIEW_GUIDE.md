# 🎨 How to Preview Generated UI Components

**Last Updated:** October 16, 2025

---

## 3 Ways to Preview Your Generated Components

---

## ✅ **Option 1: Live Angular Preview** (BEST - What We Just Did!)

**Shows:** Actual component running in Angular with all interactions

### Quick Start
```bash
# 1. Start Angular dev server
npm start

# 2. Open browser to:
http://localhost:4200/shipping-tracker
```

### What You See
- ✅ Real Angular component rendering
- ✅ UPS brand CSS applied
- ✅ Interactive elements working
- ✅ Hot reload on file changes
- ✅ Browser dev tools available

### How to View Different Components
```
http://localhost:4200/              → Tracking page (default)
http://localhost:4200/track         → Tracking page
http://localhost:4200/quote-ship    → Quote & Ship page
http://localhost:4200/shipping-tracker → NEW! Generated component
```

### Tips
- **Hot Reload**: Edit files in VSCode → Browser auto-refreshes
- **Dev Tools**: Press F12 to inspect HTML/CSS
- **Responsive**: Resize browser to test mobile views
- **Console**: Check for JavaScript errors

---

## 📝 **Option 2: VSCode Preview** (Code Review)

**Shows:** The generated code files side-by-side

### Already Open in VSCode!
When you ran the generator, these files were automatically opened:
```
.preview/shipping-tracker/
  ├── shipping-tracker.component.ts   ← TypeScript logic
  ├── shipping-tracker.component.html ← HTML template
  └── shipping-tracker.component.scss ← Styles
```

### What You Can Do
1. **Review Code**: Check TypeScript logic, HTML structure, CSS classes
2. **Edit Live**: Make changes → Save → See updates in browser
3. **Compare**: Open Figma design side-by-side with code
4. **Validate**: Check CSS classes against UPS brand guidelines

### VSCode Extensions (Optional)
- **Angular Language Service**: Autocomplete, error checking
- **HTML Preview**: Right-click HTML → "Open Preview"
- **Live Server**: Preview HTML without Angular compilation

---

## 🖼️ **Option 3: Static HTML Preview** (Quick & Simple)

**Shows:** Just the HTML without Angular compilation

### Create a Quick Preview File
```bash
# Run this command
node create-html-preview.mjs shipping-tracker
```

Let me create that tool for you:

---

## 🎯 **Recommended Workflow**

### For CTO Demo
```
1. Open Figma design (show the mockup)
2. Run generator command
3. Open http://localhost:4200/shipping-tracker
4. Show side-by-side: Figma vs. Live preview
5. Highlight: CSS validation, auto-routing, Git commit
```

### For Development
```
1. Generate component with preview
2. Review code in VSCode (auto-opened)
3. Check CSS validation results
4. If violations: Regenerate [R] or Edit [E]
5. If good: Accept [A]
6. Preview in browser: http://localhost:4200/component-name
7. Test & refine
8. Commit to Git
```

---

## 🔍 **Current Component: shipping-tracker**

### What's Currently Running

**URL:** `http://localhost:4200/shipping-tracker`

**Component Structure:**
```typescript
// shipping-tracker.component.ts
@Component({
  selector: 'app-shipping-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ShippingTrackerComponent { }
```

**HTML Template:**
```html
<div class="flex flex-col items-center justify-center gap-8 h-full">
  <div class="bg-ups-grey-5 rounded-lg shadow-lg relative z-10">
    <img src="assets/images/1107007~747-8-1-1080-1.png" 
         alt="Tracking Image" 
         class="w-full h-full object-cover">
    <div class="absolute inset-0 bg-gradient-to-t 
                from-ups-blue to-ups-grey-2 opacity-60">
    </div>
  </div>
  <div class="text-center text-white font-roboto-bold 
              text-ups-white p-4 rounded-full">
    <h1>Track Your Shipment</h1>
  </div>
</div>
```

**CSS Classes Used:**
- `flex`, `flex-col`, `items-center`, `justify-center` ✅
- `gap-8` ✅
- `h-full` ✅
- `bg-ups-grey-5` ✅
- `rounded-lg` ✅
- `shadow-lg` ✅
- `relative`, `z-10` ✅
- ❌ `object-cover` (Tailwind - not in UPS CSS)
- ❌ `bg-gradient-to-t` (Tailwind gradient)
- ❌ `from-ups-blue` (Custom class)
- ❌ `to-ups-grey-2` (Custom class)
- ❌ `opacity-60` (Tailwind)
- `text-center`, `text-white` ✅
- `font-roboto-bold` ✅
- `p-4` ✅
- `rounded-full` ✅

---

## 🛠️ **Troubleshooting Preview Issues**

### Browser shows blank page
```bash
# Check terminal for compilation errors
# Look for red error messages in console

# Common fix: Restart dev server
npm start
```

### Component not found (404)
```bash
# Check route was added to app.routes.ts
# Verify component name matches URL
# Example: shipping-tracker → /shipping-tracker
```

### CSS not applying
```bash
# Check styles.scss is imported
# Verify CSS class names are correct
# Check browser console for missing files
```

### Image not loading
```bash
# Check image path: assets/images/filename.png
# Verify image exists in public/assets/images/
# Use browser Network tab to debug 404s
```

---

## 📊 **Side-by-Side Comparison Setup**

### Perfect Demo Setup
```
Screen Layout:
┌─────────────────────────────────────────────────┐
│  Monitor 1: Figma Design                        │
│  - Show original mockup                         │
│  - Highlight node ID: 255-2415                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Monitor 2 (Split View):                        │
│  ┌─────────────────┬──────────────────────────┐ │
│  │  VSCode         │  Browser Preview         │ │
│  │  - Code files   │  - localhost:4200        │ │
│  │  - CSS report   │  - Live component        │ │
│  └─────────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Single Monitor Setup
```
Use Browser Tabs:
Tab 1: Figma Design (reference)
Tab 2: http://localhost:4200/shipping-tracker (preview)
Tab 3: VSCode (code review)

Switch between tabs during demo
```

---

## 🎬 **Demo Script with Preview**

### 5-Minute Live Demo

**Minute 0-1: Introduction**
```
"Let me show you how we convert Figma designs to code in real-time"
→ Open Figma, show design
→ Copy node ID: 255-2415
```

**Minute 1-2: Generation**
```
"Watch the AI generate Angular code with strict brand enforcement"
→ Run: npm run figma:dev 0eg3UmbqMcZtym1x8sGtZX 255-2415 demo-comp
→ Show terminal output (steps 1-7)
→ Highlight CSS validation results
```

**Minute 2-3: Code Review**
```
"Files automatically open in VSCode for review"
→ Show TypeScript component
→ Show HTML template
→ Point out UPS CSS classes
→ Highlight violations caught
```

**Minute 3-4: Live Preview**
```
"Now let's see it running live in the browser"
→ Open http://localhost:4200/demo-comp
→ Show side-by-side with Figma design
→ Highlight: matches design, uses brand CSS
→ Edit code → Show hot reload
```

**Minute 4-5: Git Workflow**
```
"Developer approves → Automatic Git commit"
→ Type [A] in terminal
→ Show: Branch created, files committed
→ Show: git log (commit message)
→ Explain: Team pulls code, ready to use
```

---

## 🚀 **Quick Commands Reference**

```bash
# Start preview server
npm start

# Generate new component with preview
npm run figma:dev <fileKey> <nodeId> <componentName>

# Example
npm run figma:dev 0eg3UmbqMcZtym1x8sGtZX 255-2415 my-component

# View in browser
http://localhost:4200/my-component

# Stop server
Ctrl+C in terminal
```

---

## 📱 **Testing Responsive Design**

### Browser Dev Tools
```
1. Press F12
2. Click device toggle icon (Ctrl+Shift+M)
3. Select device:
   - iPhone 12 Pro (390x844)
   - iPad Air (820x1180)
   - Desktop (1920x1080)
```

### Common Breakpoints
```css
Mobile:    < 768px
Tablet:    768px - 1024px
Desktop:   > 1024px
```

---

## 🎨 **Visual Comparison Checklist**

When previewing, verify:

### Layout
- [ ] Component matches Figma layout structure
- [ ] Spacing/padding correct (gap-4, p-8, etc.)
- [ ] Alignment matches design
- [ ] Responsive behavior works

### Colors
- [ ] Background colors match UPS brand
- [ ] Text colors match UPS brand
- [ ] No custom colors (only UPS CSS)

### Typography
- [ ] Font family: Roboto (UPS brand)
- [ ] Font sizes match design
- [ ] Font weights correct (regular, medium, bold)
- [ ] Line heights appropriate

### Components
- [ ] Buttons styled correctly
- [ ] Forms match design
- [ ] Images load and display
- [ ] Icons present and sized correctly

### Interactions
- [ ] Hover states work
- [ ] Click handlers functional
- [ ] Focus states visible
- [ ] Animations smooth

---

## 💡 **Pro Tips**

### Faster Previews
```bash
# Keep server running
# Generate new component
# Refresh browser to see new route
```

### Better Debugging
```bash
# Browser Console (F12)
console.log() statements visible
Network tab shows file loading
Elements tab inspects HTML/CSS
```

### CSS Inspection
```bash
# Right-click element → Inspect
# See computed styles
# Check which CSS classes applied
# Verify UPS brand classes used
```

---

## ✅ **Your Current Setup**

```
✅ Angular dev server: RUNNING
✅ Component: shipping-tracker
✅ URL: http://localhost:4200/shipping-tracker
✅ Files: In VSCode (open for editing)
✅ Hot reload: Enabled
✅ Preview: Ready in Simple Browser

Status: READY TO DEMO! 🎉
```

---

## 🎯 **Next Steps**

1. **Review in Browser**: Check http://localhost:4200/shipping-tracker
2. **Compare with Figma**: Open Figma design side-by-side
3. **Test Interactions**: Click, hover, resize browser
4. **Edit if Needed**: Make changes in VSCode → Auto-refresh
5. **Accept or Regenerate**: Return to terminal, choose action
6. **Demo Ready**: Show CTO the live preview workflow

---

*Preview Guide - October 16, 2025*
