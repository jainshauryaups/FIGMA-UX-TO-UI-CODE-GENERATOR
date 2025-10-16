# 🌳 Git Branching Workflow - Visual Guide

## **Current Repository State**

```
Repository: poc (local)
Remote: Not connected yet (will connect to GitHub)

Branches:
├── main (current) ← Production-ready code
└── feat/figma-demo-component (old feature branch)
```

---

## 🎯 **How Branching Works in This System**

### **Architecture Overview**

```
┌─────────────────────────────────────────────────────────┐
│                    MAIN BRANCH                          │
│  (Production-ready code, default branch on GitHub)      │
│                                                          │
│  - All POC files                                        │
│  - Documentation                                        │
│  - Generator scripts                                    │
│  - Existing components                                  │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Developer generates new component
                         │ (runs: node generate-with-preview.mjs ...)
                         ▼
┌─────────────────────────────────────────────────────────┐
│          FEATURE BRANCH (auto-created)                  │
│     feat/figma-<component-name>                         │
│                                                          │
│  - New component files                                  │
│  - Updated app.routes.ts                                │
│  - Auto-committed with metadata                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Developer pushes to GitHub
                         ▼
┌─────────────────────────────────────────────────────────┐
│              PULL REQUEST on GitHub                     │
│                                                          │
│  - Code review                                          │
│  - Screenshot comparison (Figma vs Browser)             │
│  - Team approval                                        │
└─────────────────────────────────────────────────────────┘
                         │
                         │ PR merged
                         ▼
┌─────────────────────────────────────────────────────────┐
│         MAIN BRANCH (updated)                           │
│                                                          │
│  - Previous code + new component                        │
│  - Ready for next developer                             │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 **Step-by-Step: Developer Workflow**

### **Scenario:** Sarah needs to create a "UserProfile" component from Figma design

#### **Step 1: Start Fresh** ✅

```powershell
# Clone repo (first time only)
git clone https://github.com/YOUR-ORG/poc.git
cd poc
npm install

# Or if already cloned, just sync with main
git checkout main
git pull origin main
```

**Current state:**
```
* main (you are here)
  ├── demo-component/
  ├── track-page/
  └── all POC files
```

---

#### **Step 2: Generate Component** 🚀

```powershell
# Sarah gets Figma node ID: 256-3000
# She wants to create: user-profile component

node generate-with-preview.mjs 0eg3UmbqMcZtym1x8sGtZX 256-3000 user-profile
```

**What happens automatically:**

1. ✅ Figma design fetched
2. ✅ AI generates code
3. ✅ CSS validated
4. ✅ Files saved to `.preview/user-profile/`
5. ✅ VSCode opens files for review

**Sarah sees:**
```
Component: user-profile
Files: 3 files created
CSS Validation: ✅ PASSED (10/10 approved classes)

What would you like to do?
  [A] Accept & save to final location + Git commit
  [R] Regenerate
  [E] Edit manually
  [C] Cancel

Your choice: _
```

---

#### **Step 3: Sarah Types 'A' (Accept)** ✅

```powershell
Your choice: A
```

**System automatically does:**

```powershell
# 1. Create new feature branch
git checkout -b feat/figma-user-profile

# 2. Move files from .preview/ to src/app/components/
mv .preview/user-profile/ src/app/components/user-profile/

# 3. Update routes
# Adds to app.routes.ts:
#   import { UserProfileComponent } from './components/user-profile/user-profile.component';
#   { path: 'user-profile', component: UserProfileComponent }

# 4. Stage and commit
git add src/app/components/user-profile/
git add src/app/app.routes.ts
git commit -m "feat: Add UserProfileComponent from Figma design

- Generated from Figma node: 256-3000
- File key: 0eg3UmbqMcZtym1x8sGtZX
- Component path: src/app/components/user-profile/
- Route: /user-profile
- CSS Validation: PASSED (10/10)
"
```

**New branch state:**
```
* feat/figma-user-profile (you are here) ← NEW!
  │
  ├── All files from main
  ├── NEW: user-profile component
  └── UPDATED: app.routes.ts
  
  main (still clean, no changes)
```

---

#### **Step 4: Test Locally** 🧪

```powershell
# Start dev server
npm start

# Open browser
# http://localhost:4200/user-profile

# Sarah verifies:
# ✅ Component renders
# ✅ Matches Figma design
# ✅ No console errors
# ✅ Responsive works
```

---

#### **Step 5: Push to GitHub** 📤

```powershell
# Push the feature branch
git push origin feat/figma-user-profile
```

**GitHub state:**
```
Remote (GitHub):
├── main (default)
└── feat/figma-user-profile (Sarah's new branch)
```

---

#### **Step 6: Create Pull Request** 🔀

Sarah goes to GitHub:
```
https://github.com/YOUR-ORG/poc/pulls
Click "New Pull Request"

Base: main ← Compare: feat/figma-user-profile

Title: Add UserProfile component from Figma
Description:
- Component: UserProfile
- Figma Node: 256-3000
- CSS Validation: PASSED ✅
- Screenshots:
  [Figma design screenshot]
  [Browser screenshot]

Reviewers: @team-lead
```

---

#### **Step 7: Code Review** 👀

**Team lead reviews:**
- ✅ Code quality
- ✅ Visual match with Figma
- ✅ CSS compliance
- ✅ No TypeScript errors
- ✅ Routes working

**Team lead approves and merges PR**

---

#### **Step 8: Main Updated** 🎉

**After merge:**

```
main (updated)
  ├── demo-component/
  ├── user-profile/ ← NEW!
  ├── track-page/
  └── all POC files
  
feat/figma-user-profile (can be deleted now)
```

---

#### **Step 9: Sarah Cleans Up** 🧹

```powershell
# Switch back to main
git checkout main

# Pull latest (includes her merged component!)
git pull origin main

# Delete local feature branch
git branch -d feat/figma-user-profile

# Optional: Delete remote branch
git push origin --delete feat/figma-user-profile
```

**Sarah is back to clean main, ready for next component!**

---

## 🔄 **Multiple Developers Working Simultaneously**

### **Scenario:** 3 developers, 3 components

**Developer A - Generating "ShippingForm":**
```powershell
git checkout main
git pull origin main
node generate-with-preview.mjs ... shipping-form
# Type 'A' → creates feat/figma-shipping-form
git push origin feat/figma-shipping-form
```

**Developer B - Generating "TrackingCard":**
```powershell
git checkout main
git pull origin main  
node generate-with-preview.mjs ... tracking-card
# Type 'A' → creates feat/figma-tracking-card
git push origin feat/figma-tracking-card
```

**Developer C - Generating "OrderSummary":**
```powershell
git checkout main
git pull origin main
node generate-with-preview.mjs ... order-summary
# Type 'A' → creates feat/figma-order-summary
git push origin feat/figma-order-summary
```

**GitHub state (simultaneous):**
```
main
├── feat/figma-shipping-form (Developer A)
├── feat/figma-tracking-card (Developer B)
└── feat/figma-order-summary (Developer C)

All 3 can work in parallel!
No conflicts because each is a separate feature branch.
```

**Merge order (team lead decides):**
1. Merge shipping-form → main updated
2. Merge tracking-card → main updated
3. Merge order-summary → main updated

---

## 🎯 **Key Benefits of This Workflow**

### **1. Isolation** 🔒
Each component is developed in its own branch.
No risk of breaking main branch.

### **2. Parallel Development** ⚡
Multiple developers can generate components simultaneously.
No waiting, no conflicts.

### **3. Code Review** 👁️
Every component goes through PR review.
Quality control before merging to main.

### **4. Traceability** 📝
Every commit has Figma metadata:
- Node ID
- File key
- Component path
- CSS validation result

### **5. Rollback** ⏪
If a component has issues, just don't merge the PR.
Main branch stays clean.

### **6. Automation** 🤖
Branch creation is automatic.
Routes are auto-updated.
Commits are auto-created.
Developer just types 'A' and pushes!

---

## 📊 **Branch Naming Convention**

```
feat/figma-<component-name>

Examples:
✅ feat/figma-user-profile
✅ feat/figma-shipping-form
✅ feat/figma-tracking-card
✅ feat/figma-order-summary
✅ feat/figma-payment-method

❌ feature/user-profile (not the pattern)
❌ user-profile (no prefix)
❌ feat/userprofile (use kebab-case)
```

**Why `feat/figma-`?**
- `feat/` = Feature branch (Git standard)
- `figma-` = Generated from Figma (vs manually coded)
- `<component-name>` = Clear identifier

---

## 🔍 **Tracking Branches**

### **View All Branches:**
```powershell
# Local branches
git branch

# Remote branches
git branch -r

# All branches (local + remote)
git branch -a
```

### **Switch Between Branches:**
```powershell
# Go to main
git checkout main

# Go to specific feature branch
git checkout feat/figma-user-profile

# Create new branch
git checkout -b feat/figma-new-component
```

### **Delete Branches:**
```powershell
# Delete local branch (after merge)
git branch -d feat/figma-user-profile

# Force delete (if not merged)
git branch -D feat/figma-user-profile

# Delete remote branch
git push origin --delete feat/figma-user-profile
```

---

## 🎬 **Visual Timeline Example**

```
Day 1:
─────────────────────────────────────────────────────────
main: [Initial POC commit]


Day 2: Sarah generates user-profile
─────────────────────────────────────────────────────────
main: [Initial POC commit]
  │
  └─→ feat/figma-user-profile: [Add UserProfile component]


Day 3: John generates shipping-form  
─────────────────────────────────────────────────────────
main: [Initial POC commit]
  │
  ├─→ feat/figma-user-profile: [Add UserProfile component]
  │
  └─→ feat/figma-shipping-form: [Add ShippingForm component]


Day 4: Sarah's PR merged
─────────────────────────────────────────────────────────
main: [Initial POC commit] → [Add UserProfile component] ✅
  │
  └─→ feat/figma-shipping-form: [Add ShippingForm component]


Day 5: John's PR merged
─────────────────────────────────────────────────────────
main: [Initial POC] → [Add UserProfile] → [Add ShippingForm] ✅


Day 6: Ready for more components!
─────────────────────────────────────────────────────────
main: [Initial POC] → [UserProfile] → [ShippingForm]
  │
  └─→ Clean state, ready for next developer
```

---

## ✅ **Summary: What Happens When Developer Generates Component**

### **Before Generation:**
```
Repository State:
└── main (you are here)
    └── All existing code
```

### **After Running Generator & Typing 'A':**
```
Repository State:
├── main (unchanged, still clean)
└── feat/figma-<component-name> (you are here) ← AUTO-CREATED!
    └── main code + new component
```

### **After Push:**
```
Local:
├── main
└── feat/figma-<component-name> ← Pushed to GitHub

GitHub (Remote):
├── main (default)
└── feat/figma-<component-name> ← Visible for PR
```

### **After PR Merge:**
```
GitHub:
└── main (updated with new component)

Local (after git pull):
└── main (synced with GitHub)
```

---

## 🎯 **The Magic: It's All Automatic!**

**Developer only needs to:**
1. Run generator
2. Type 'A'
3. Run `git push origin feat/figma-<component-name>`
4. Create PR on GitHub

**System automatically:**
- ✅ Creates feature branch
- ✅ Moves files to correct location
- ✅ Updates app.routes.ts
- ✅ Creates detailed commit
- ✅ Preserves Figma metadata

**No manual Git commands needed for branching/committing!**

---

*Branch Workflow Guide - October 16, 2025*
