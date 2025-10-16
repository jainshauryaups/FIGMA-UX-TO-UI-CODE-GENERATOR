# GitHub Repository Setup - "poc"

**Step-by-Step Guide to Create and Push to GitHub**

---

## 🎯 **What We're Doing**

Creating a GitHub repository called **"poc"** and pushing all your POC code to it.

---

## 📋 **Step 1: Create Repository on GitHub**

### **Option A: Via GitHub Website (Recommended)**

1. Go to: https://github.com/new

2. Fill in repository details:
   ```
   Repository name: poc
   Description: Figma to Angular AI Code Generator - POC
   Visibility: ✓ Private (recommended) or Public
   
   ☐ Add a README file (we already have one)
   ☐ Add .gitignore (we already have one)
   ☐ Choose a license (optional)
   ```

3. Click **"Create repository"**

4. **COPY the repository URL** shown on the next page:
   ```
   https://github.com/YOUR-USERNAME/poc.git
   ```

### **Option B: Via GitHub CLI** (if you have gh CLI installed)

```bash
gh repo create poc --private --description "Figma to Angular AI Code Generator - POC"
```

---

## 📋 **Step 2: Connect Local Repository to GitHub**

Run these commands in PowerShell:

```powershell
# Make sure you're in the project directory
cd "C:\Users\JCW6TPH\OneDrive - ups\Documents\figmaAngular"

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/poc.git

# Verify remote was added
git remote -v
# Should show:
# origin  https://github.com/YOUR-USERNAME/poc.git (fetch)
# origin  https://github.com/YOUR-USERNAME/poc.git (push)
```

**Replace `YOUR-USERNAME` with your actual GitHub username!**

---

## 📋 **Step 3: Push Code to GitHub**

### **Push the Current Branch**

```powershell
# Push current branch (feat/figma-demo-component)
git push -u origin feat/figma-demo-component

# Enter GitHub credentials if prompted
```

### **Create and Push Main Branch**

```powershell
# Create main branch from current state
git checkout -b main

# Add all files to main
git add .

# Commit to main
git commit -m "Initial POC setup with Figma to Angular AI generator

Features:
- Figma API integration
- IBM Granite LLM code generation
- UPS brand CSS enforcement (53 approved classes)
- Preview workflow with VSCode integration
- Auto Git branching and commits
- Route auto-update
- Complete documentation

Components:
- demo-component (working example)

Documentation:
- DEVELOPER_GUIDE.md (complete workflow guide)
- POC_SUMMARY.md (executive summary)
- FINAL_COMPLETION_REPORT.md (completion status)
- README_POC.md (quick start guide)
- 8 other documentation files

Status: 98% complete, production-ready"

# Push main branch
git push -u origin main
```

---

## 📋 **Step 4: Set Main as Default Branch**

1. Go to your repository on GitHub:
   ```
   https://github.com/YOUR-USERNAME/poc
   ```

2. Click **"Settings"** tab

3. Click **"Branches"** in left sidebar

4. Under "Default branch", click the switch icon

5. Select **"main"** from dropdown

6. Click **"Update"**

7. Confirm by clicking **"I understand, update the default branch"**

---

## 📋 **Step 5: Verify Everything Pushed**

### **Check on GitHub Website**

Visit: `https://github.com/YOUR-USERNAME/poc`

You should see:
- ✅ Main branch (default)
- ✅ feat/figma-demo-component branch
- ✅ All files (src/, .preview/, documentation, etc.)
- ✅ README_POC.md displayed on homepage
- ✅ Commit history

### **Check Locally**

```powershell
# View all branches (local and remote)
git branch -a

# Should show:
# * main
#   feat/figma-demo-component
#   remotes/origin/main
#   remotes/origin/feat/figma-demo-component

# Check remote connection
git remote -v

# Should show:
# origin  https://github.com/YOUR-USERNAME/poc.git (fetch)
# origin  https://github.com/YOUR-USERNAME/poc.git (push)
```

---

## 🌳 **Workflow for Future Developers**

When a developer wants to generate a new component:

### **Step 1: Clone Repository**

```powershell
git clone https://github.com/YOUR-USERNAME/poc.git
cd poc
npm install
```

### **Step 2: Create .env File**

```env
FIGMA_ACCESS_TOKEN=your_token_here
IBM_GRANITE_API_KEY=your_key_here
IBM_GRANITE_PROJECT_ID=0d4fb471-2d2f-4496-8a2c-bfb3567fdea1
```

### **Step 3: Start from Main**

```powershell
git checkout main
git pull origin main
```

### **Step 4: Generate Component**

```powershell
# This automatically creates a new branch!
node generate-with-preview.mjs <file-key> <node-id> <component-name>

# Review preview → Type 'A' to accept
# Branch feat/figma-<component-name> created automatically
```

### **Step 5: Push New Branch**

```powershell
# Push the auto-created feature branch
git push origin feat/figma-<component-name>
```

### **Step 6: Create Pull Request**

1. Go to: `https://github.com/YOUR-USERNAME/poc/pulls`
2. Click **"New Pull Request"**
3. Select:
   - Base: **main**
   - Compare: **feat/figma-<component-name>**
4. Add description with screenshots (Figma + browser)
5. Click **"Create Pull Request"**
6. Request review from team lead

### **Step 7: After Merge**

```powershell
# Update local main
git checkout main
git pull origin main

# Delete local feature branch
git branch -d feat/figma-<component-name>

# Delete remote feature branch (optional)
git push origin --delete feat/figma-<component-name>
```

---

## 📁 **.gitignore Setup**

Make sure your `.gitignore` includes:

```gitignore
# Node
node_modules/
npm-debug.log*

# Angular
dist/
.angular/

# Environment
.env
.env.local

# Preview (don't commit preview files)
.preview/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## 🔒 **Security Notes**

### **NEVER Commit These:**

```
❌ .env (contains API keys)
❌ Figma access tokens
❌ IBM Granite API keys
❌ node_modules/
❌ .preview/ (temporary files)
```

### **Add .env.example Instead:**

Create `.env.example` with placeholders:

```env
FIGMA_ACCESS_TOKEN=your_figma_token_here
IBM_GRANITE_API_KEY=your_ibm_api_key_here
IBM_GRANITE_PROJECT_ID=0d4fb471-2d2f-4496-8a2c-bfb3567fdea1
```

This file CAN be committed (no secrets, just template).

---

## 🎯 **Repository Structure on GitHub**

After setup, your GitHub repo will have:

```
poc/
├── main (default branch)
│   ├── All POC code
│   ├── Documentation
│   └── Demo component
│
└── feat/figma-demo-component (example feature branch)
    └── Same as main (merged later via PR)
```

**Developers will create new branches:**
- `feat/figma-user-profile`
- `feat/figma-shipping-form`
- `feat/figma-tracking-card`
- etc.

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] Repository created on GitHub
- [ ] Local repo connected to GitHub (`git remote -v` works)
- [ ] Main branch pushed and set as default
- [ ] All files visible on GitHub
- [ ] README_POC.md displays on homepage
- [ ] .gitignore prevents sensitive files from being committed
- [ ] .env.example committed (NOT .env)
- [ ] Demo component visible in repo
- [ ] Documentation files all present

---

## 🚀 **You're Done!**

Your POC is now on GitHub and ready for:
- ✅ Team collaboration
- ✅ Code reviews via Pull Requests
- ✅ Version control
- ✅ CTO demo
- ✅ Production rollout

**Next:** Share the repository URL with your team!

---

**Repository URL Format:**
```
https://github.com/YOUR-USERNAME/poc
```

**Developer Clone Command:**
```bash
git clone https://github.com/YOUR-USERNAME/poc.git
```

---

*Setup Guide - October 16, 2025*
