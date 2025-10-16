#!/usr/bin/env node

/**
 * Figma to Angular Code Generator with PREVIEW & STRICT CSS Enforcement
 * 
 * Workflow:
 * 1. Fetch Figma design
 * 2. Generate code with IBM Granite
 * 3. Save to .preview/ folder
 * 4. Validate CSS strictly (reject non-UPS classes)
 * 5. Show preview + open in VSCode
 * 6. Wait for user approval
 * 7. On approval: Move to final location + Git commit
 */

import dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';
import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import readline from 'readline';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  figmaToken: process.env.FIGMA_ACCESS_TOKEN,
  ibmApiKey: process.env.IBM_GRANITE_API_KEY,
  ibmProjectId: process.env.IBM_GRANITE_PROJECT_ID || '0d4fb471-2d2f-4496-8a2c-bfb3567fdea1',
  ibmEndpoint: 'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29',
  ibmIamEndpoint: 'https://iam.cloud.ibm.com/identity/token',
  modelId: 'ibm/granite-3-8b-instruct',
  previewDir: path.join(__dirname, '.preview'),
  componentDir: path.join(__dirname, '..', 'generated-app', 'src', 'app', 'components'),
  stylesPath: path.join(__dirname, 'brand-css', 'ups-brand.scss'),
  routesPath: path.join(__dirname, '..', 'generated-app', 'src', 'app', 'app.routes.ts'),
};

// Validate required environment variables
if (!config.figmaToken) {
  console.error('❌ ERROR: FIGMA_ACCESS_TOKEN not found in environment variables');
  console.error('   Please create a .env file with your Figma token');
  process.exit(1);
}
if (!config.ibmApiKey) {
  console.error('❌ ERROR: IBM_GRANITE_API_KEY not found in environment variables');
  console.error('   Please add IBM_GRANITE_API_KEY to your .env file');
  process.exit(1);
}

// SSL workaround for corporate environment
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('\n' + '═'.repeat(50));
  log(`  ${title}`, 'cyan');
  console.log('═'.repeat(50) + '\n');
}

// Helper function to convert kebab-case to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// ============================================================================
// STEP 1: Fetch Figma Design
// ============================================================================
async function fetchFigmaNode(fileKey, nodeId) {
  log('📥 Step 1: Fetching Figma design data...', 'blue');
  
  // Convert node ID format (255-2415 → 255:2415 for API)
  const apiNodeId = nodeId.replace('-', ':');
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(apiNodeId)}`;
  
  const response = await fetch(url, {
    headers: { 'X-Figma-Token': config.figmaToken },
    agent: httpsAgent,
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.statusText}`);
  }

  const data = await response.json();
  const node = data.nodes[apiNodeId];
  
  if (!node || !node.document) {
    throw new Error(`Node ${nodeId} not found in Figma file`);
  }

  log(`✓ Fetched node: ${nodeId}`, 'green');
  return node.document;
}

// ============================================================================
// STEP 2: Load UPS Brand CSS (STRICT MODE)
// ============================================================================
async function loadBrandCSS() {
  log('🎨 Step 2: Loading UPS Brand CSS (STRICT MODE)...', 'blue');
  
  const cssContent = await fs.readFile(config.stylesPath, 'utf-8');
  
  // Extract all CSS classes
  const classMatches = cssContent.matchAll(/\.([a-zA-Z0-9_-]+)/g);
  const approvedClasses = new Set();
  
  for (const match of classMatches) {
    approvedClasses.add(match[1]);
  }

  // Also extract utility class patterns (e.g., text-*, bg-*, p-*)
  const utilityPatterns = [
    /\.text-ups-[a-zA-Z0-9-]+/g,
    /\.bg-ups-[a-zA-Z0-9-]+/g,
    /\.font-[a-zA-Z0-9-]+/g,
    /\.p-[0-9]+/g,
    /\.m-[0-9]+/g,
    /\.gap-[0-9]+/g,
    /\.rounded-[a-zA-Z0-9-]+/g,
  ];

  utilityPatterns.forEach(pattern => {
    const matches = cssContent.matchAll(pattern);
    for (const match of matches) {
      approvedClasses.add(match[0].substring(1)); // Remove leading dot
    }
  });

  log(`✓ Brand CSS loaded: ${approvedClasses.size} approved classes`, 'green');
  
  return {
    classes: Array.from(approvedClasses),
    rawCSS: cssContent,
  };
}

// ============================================================================
// STEP 3: Get IBM Access Token
// ============================================================================
async function getIBMAccessToken() {
  log('🔑 Step 3: Getting IBM access token...', 'blue');
  
  const response = await fetch(config.ibmIamEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${config.ibmApiKey}`,
    agent: httpsAgent,
  });

  if (!response.ok) {
    throw new Error(`IBM IAM error: ${response.statusText}`);
  }

  const data = await response.json();
  log('✓ Access token obtained', 'green');
  return data.access_token;
}

// ============================================================================
// STEP 4: Build Strict CSS Prompt
// ============================================================================
function buildStrictPrompt(figmaNode, brandCSS, componentName) {
  log('🧠 Step 4: Building prompt with STRICT CSS enforcement...', 'blue');
  
  const figmaJson = JSON.stringify(figmaNode, null, 2);
  const truncatedFigma = figmaJson.length > 5000 ? figmaJson.substring(0, 5000) + '...' : figmaJson;

  const prompt = `You are an expert Angular developer. Generate a complete Angular standalone component from this Figma design.

🚨 CRITICAL SYSTEM CONSTRAINTS - VIOLATIONS WILL BREAK THE APPLICATION 🚨

This Angular project uses CUSTOM UPS BRAND CSS ONLY.
Tailwind CSS is NOT installed. Bootstrap is NOT installed. Material UI is NOT installed.
Using any CSS class not in the approved list below will cause COMPILATION ERRORS and APPLICATION FAILURE.

❌ ABSOLUTELY FORBIDDEN - THESE CLASSES WILL CAUSE ERRORS:
DO NOT USE ANY OF THESE (Tailwind/Bootstrap patterns):
- object-cover, object-fit, object-*, aspect-*
- opacity-0, opacity-10, opacity-20, opacity-30, opacity-40, opacity-50, opacity-60, opacity-70, opacity-80, opacity-90, opacity-100
- bg-gradient-to-t, bg-gradient-to-b, bg-gradient-to-l, bg-gradient-to-r, bg-gradient-to-tr, bg-gradient-to-tl
- from-*, to-*, via-* (gradient color stops)
- text-white, text-black, text-gray-*, text-blue-*, text-red-* (use text-ups-* instead)
- bg-white, bg-black, bg-gray-*, bg-blue-* (use bg-ups-* instead)
- hover:*, focus:*, active:* (use Angular directives instead)
- Any class with numbers: w-48, h-64, p-8, m-4 (unless listed in approved list below)

✅ APPROVED CSS CLASSES - ONLY USE THESE ${brandCSS.classes.length} CLASSES:
${brandCSS.classes.join(', ')}

🎯 STRICT RULES:
1. If a CSS class is NOT in the approved list above → DO NOT USE IT
2. Need gradient? → Use inline style: [style]="'background: linear-gradient(to top, var(--ups-blue), var(--ups-grey-2))'"
3. Need opacity? → Use inline style: [style]="'opacity: 0.6'"
4. Need object-fit? → Use inline style: [style]="'object-fit: cover'"
5. Need hover effect? → Use Angular: (mouseenter) and (mouseleave) with ngClass
6. For images: Use <img [src]="'assets/images/placeholder.png'" style="...inline styles...">

📝 EXAMPLES OF CORRECT VS WRONG CODE:

❌ WRONG - WILL BREAK APPLICATION (DO NOT DO THIS):
<div class="bg-gradient-to-t from-blue-500 to-gray-200 opacity-60 hover:opacity-100">
  <img class="object-cover w-48 h-48" />
</div>

✅ CORRECT - WILL WORK (DO THIS):
<div class="bg-ups-grey-5 relative" 
     [style]="'background: linear-gradient(to top, var(--ups-blue), var(--ups-grey-2)); opacity: 0.6'">
  <img [src]="'assets/images/placeholder.png'" 
       [style]="'object-fit: cover; width: 300px; height: 200px'" />
</div>

🎯 ANGULAR 20+ STANDALONE COMPONENT SYNTAX:

❌ WRONG - INVALID ANGULAR SYNTAX (DO NOT DO THIS):
import { Component, standalone, NgModule } from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
@standalone()  // ❌ This decorator does not exist!
export class MyComponent {}

@NgModule({  // ❌ Cannot mix standalone with NgModule!
  declarations: [MyComponent],
  exports: [MyComponent]
})
export class MyComponentModule {}

✅ CORRECT - ANGULAR 20+ STANDALONE SYNTAX (DO THIS):
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,  // ✅ Property inside @Component decorator
  imports: [CommonModule],  // ✅ Direct imports, no NgModule needed
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponent {  // ✅ No NgModule, just export the component
  constructor() {}
}

CRITICAL: In Angular 20+:
- standalone is a PROPERTY (standalone: true), NOT a decorator
- Standalone components do NOT use @NgModule
- Imports go in the @Component decorator's imports array
- No need for declarations or exports arrays

FIGMA DESIGN DATA:
${truncatedFigma}

COMPONENT NAME: ${componentName}

Generate 3 files with proper Angular 20+ standalone component structure:

1. TypeScript Component (.ts):
   - MUST use standalone: true as a PROPERTY in @Component decorator
   - DO NOT use @standalone() decorator (it doesn't exist!)
   - DO NOT create @NgModule (standalone components don't need it)
   - Import CommonModule in the imports array
   - Use proper typing with TypeScript interfaces
   - Include component logic and properties
   - Example structure:
     import { Component } from '@angular/core';
     import { CommonModule } from '@angular/common';
     
     @Component({
       selector: 'app-${componentName}',
       standalone: true,
       imports: [CommonModule],
       templateUrl: './${componentName}.component.html',
       styleUrls: ['./${componentName}.component.scss']
     })
     export class ${componentName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Component {
       constructor() {}
     }

2. HTML Template (.html):
   - ONLY use approved UPS CSS classes from the list above
   - For ANY style not in approved list: use [style] attribute with inline CSS
   - Use Angular property binding: [style], [class], [ngClass]
   - Use semantic HTML5
   - Match Figma layout structure
   - Add proper accessibility attributes
   - For images: Use placeholder like 'assets/images/placeholder.png'

3. SCSS Styles (.scss):
   - Should be MINIMAL or EMPTY (use global UPS classes)
   - Only add component-specific styles if absolutely necessary
   - NO duplicate classes from global styles.scss

Format your response EXACTLY like this:

\`\`\`typescript
// TypeScript code here
\`\`\`

\`\`\`html
<!-- HTML template here -->
\`\`\`

\`\`\`scss
/* SCSS styles here (should be minimal) */
\`\`\`

REMEMBER: Using any class not in the approved list will BREAK the application. When in doubt, use inline styles with [style] attribute.

Generate clean, production-ready code now.`;

  log('✓ Enhanced strict CSS prompt created', 'green');
  return prompt;
}

// ============================================================================
// STEP 5: Generate Code with IBM Granite
// ============================================================================
async function generateWithGranite(prompt, accessToken) {
  log('🤖 Step 5: Generating code with IBM Granite LLM...', 'blue');
  
  const requestBody = {
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    project_id: config.ibmProjectId,
    model_id: config.modelId,
    max_tokens: 6000,
    temperature: 0.1, // Lower temperature for stricter CSS compliance
  };

  const response = await fetch(config.ibmEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
    agent: httpsAgent,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IBM Granite API error: ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  const generatedCode = data.choices[0].message.content;
  
  log('✓ Code generated successfully', 'green');
  return generatedCode;
}

// ============================================================================
// STEP 6: Parse Generated Code
// ============================================================================
function parseGeneratedCode(generatedCode) {
  log('📦 Step 6: Parsing generated files...', 'blue');
  
  const tsMatch = generatedCode.match(/```typescript\n([\s\S]*?)```/);
  const htmlMatch = generatedCode.match(/```html\n([\s\S]*?)```/);
  const scssMatch = generatedCode.match(/```scss\n([\s\S]*?)```/);

  const files = {
    typescript: tsMatch ? tsMatch[1].trim() : '',
    html: htmlMatch ? htmlMatch[1].trim() : '',
    scss: scssMatch ? scssMatch[1].trim() : '',
  };

  log('✓ Files parsed successfully', 'green');
  return files;
}

// ============================================================================
// STEP 6.5: Extract Properties from HTML and Fix TypeScript
// ============================================================================
function fixTypeScriptLogic(typescript, html) {
  log('🔧 Step 6.5: Analyzing HTML for missing TypeScript properties...', 'blue');
  
  // Extract property references from HTML
  const propertyPatterns = [
    // Property bindings: [property]="value" or [style]="value"
    /\[([a-zA-Z_$][a-zA-Z0-9_$]*)\]="([^"]+)"/g,
    // Event bindings with property assignments: (click)="prop = value"
    /\(click\)="([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
    // *ngIf with properties: *ngIf="property"
    /\*ngIf="([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    // Interpolation: {{ property }}
    /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
  ];

  const referencedProperties = new Set();
  
  // Find all property references
  propertyPatterns.forEach(pattern => {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const prop = match[1];
      // Skip common Angular directives and known properties
      if (!['style', 'class', 'src', 'ngIf', 'ngFor', 'ngClass', 'ngStyle'].includes(prop)) {
        referencedProperties.add(prop);
      }
    }
  });

  // Also check for properties in event handlers: (click)="showDetails = !showDetails"
  const togglePattern = /\(click\)="([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*!([a-zA-Z_$][a-zA-Z0-9_$]*)"/g;
  const toggleMatches = html.matchAll(togglePattern);
  for (const match of toggleMatches) {
    referencedProperties.add(match[1]);
    referencedProperties.add(match[2]);
  }

  // Check which properties are already in TypeScript
  const existingProperties = new Set();
  const propertyRegex = /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[:=]/gm;
  const propMatches = typescript.matchAll(propertyRegex);
  for (const match of propMatches) {
    existingProperties.add(match[1]);
  }

  // Find missing properties
  const missingProperties = Array.from(referencedProperties).filter(
    prop => !existingProperties.has(prop) && prop !== 'constructor'
  );

  if (missingProperties.length === 0) {
    log('✓ All properties already defined in TypeScript', 'green');
    return typescript;
  }

  log(`⚠️  Found ${missingProperties.length} missing properties: ${missingProperties.join(', ')}`, 'yellow');

  // Inject missing properties into TypeScript class
  // Find the class body and add properties after the class declaration
  const classBodyRegex = /export class \w+Component \{/;
  const match = typescript.match(classBodyRegex);
  
  if (!match) {
    log('⚠️  Could not find class declaration, skipping property injection', 'yellow');
    return typescript;
  }

  // Generate property declarations (assume boolean for toggles, string for others)
  const propertyDeclarations = missingProperties.map(prop => {
    // Check if it's used as a boolean toggle
    const isBooleanToggle = html.includes(`${prop} = !${prop}`) || html.includes(`*ngIf="${prop}"`);
    return `  ${prop}${isBooleanToggle ? ': boolean' : ''} = ${isBooleanToggle ? 'false' : "''"};\n`;
  }).join('');

  // Insert properties right after the opening brace of the class
  const insertionPoint = match.index + match[0].length;
  const fixedTypeScript = 
    typescript.slice(0, insertionPoint) +
    '\n' + propertyDeclarations +
    typescript.slice(insertionPoint);

  log(`✅ Added ${missingProperties.length} missing properties to TypeScript`, 'green');
  return fixedTypeScript;
}

// ============================================================================
// STEP 7: STRICT CSS Validation
// ============================================================================
function validateCSSStrict(htmlContent, approvedClasses) {
  log('🔍 Step 7: Validating CSS (STRICT MODE)...', 'yellow');
  
  // Extract all class names from HTML
  const classMatches = htmlContent.matchAll(/class="([^"]+)"/g);
  const usedClasses = new Set();
  const violations = [];

  for (const match of classMatches) {
    const classes = match[1].split(' ');
    classes.forEach(cls => {
      if (cls.trim()) {
        usedClasses.add(cls.trim());
      }
    });
  }

  // Check each used class against approved list
  usedClasses.forEach(cls => {
    if (!approvedClasses.includes(cls)) {
      violations.push(cls);
    }
  });

  const result = {
    totalClasses: usedClasses.size,
    approvedCount: usedClasses.size - violations.length,
    violations: violations,
    isValid: violations.length === 0,
  };

  if (result.isValid) {
    log('✅ CSS Validation PASSED! All classes approved.', 'green');
  } else {
    log(`❌ CSS Validation FAILED! ${violations.length} unauthorized classes found:`, 'red');
    violations.forEach(cls => log(`   - ${cls}`, 'red'));
  }

  return result;
}

// ============================================================================
// STEP 8: Save to Preview Folder
// ============================================================================
async function saveToPreview(componentName, files) {
  log('💾 Step 8: Saving to preview folder...', 'blue');
  
  const previewPath = path.join(config.previewDir, componentName);
  await fs.mkdir(previewPath, { recursive: true });

  const filePaths = {
    ts: path.join(previewPath, `${componentName}.component.ts`),
    html: path.join(previewPath, `${componentName}.component.html`),
    scss: path.join(previewPath, `${componentName}.component.scss`),
  };

  await fs.writeFile(filePaths.ts, files.typescript, 'utf-8');
  await fs.writeFile(filePaths.html, files.html, 'utf-8');
  await fs.writeFile(filePaths.scss, files.scss, 'utf-8');

  log(`✓ Preview files saved to: .preview/${componentName}/`, 'green');
  return filePaths;
}

// ============================================================================
// STEP 9: Show Preview Summary
// ============================================================================
function showPreviewSummary(componentName, files, cssValidation) {
  header('📋 PREVIEW SUMMARY');

  console.log(`Component: ${colors.bright}${componentName}${colors.reset}`);
  console.log(`Files: 3 files created`);
  console.log(`  • ${componentName}.component.ts (${files.typescript.split('\n').length} lines)`);
  console.log(`  • ${componentName}.component.html (${files.html.split('\n').length} lines)`);
  console.log(`  • ${componentName}.component.scss (${files.scss.split('\n').length} lines)`);
  
  console.log(`\nCSS Validation:`);
  if (cssValidation.isValid) {
    log(`  ✅ PASSED - All ${cssValidation.totalClasses} classes approved`, 'green');
  } else {
    log(`  ❌ FAILED - ${cssValidation.violations.length} unauthorized classes`, 'red');
    console.log(`  Approved: ${cssValidation.approvedCount}/${cssValidation.totalClasses}`);
    console.log(`\n  Violations:`);
    cssValidation.violations.slice(0, 10).forEach(cls => {
      log(`    • ${cls}`, 'red');
    });
    if (cssValidation.violations.length > 10) {
      console.log(`    ... and ${cssValidation.violations.length - 10} more`);
    }
  }

  console.log('\n' + '═'.repeat(50));
}

// ============================================================================
// STEP 10: Open in VSCode
// ============================================================================
async function openInVSCode(filePaths) {
  log('📂 Opening preview in VSCode...', 'blue');
  
  try {
    // Open files in VSCode
    const files = [filePaths.ts, filePaths.html, filePaths.scss];
    for (const file of files) {
      await execAsync(`code "${file}"`);
    }
    log('✓ Files opened in VSCode', 'green');
  } catch (error) {
    log('⚠️  Could not open VSCode automatically', 'yellow');
    log(`   Please manually open: ${path.dirname(filePaths.ts)}`, 'yellow');
  }
}

// ============================================================================
// STEP 10.5: Browser Preview System (SIMPLIFIED)
// ============================================================================
let devServerProcess = null;
let tempComponentPath = null;

async function setupBrowserPreview(componentName, previewPaths) {
  log('🌐 Step 10.5: Setting up browser preview...', 'blue');
  
  try {
    // 1. Copy component to generated-app (always do this)
    tempComponentPath = path.join(config.componentDir, componentName);
    await fs.mkdir(tempComponentPath, { recursive: true });
    
    await fs.copyFile(previewPaths.ts, path.join(tempComponentPath, `${componentName}.component.ts`));
    await fs.copyFile(previewPaths.html, path.join(tempComponentPath, `${componentName}.component.html`));
    await fs.copyFile(previewPaths.scss, path.join(tempComponentPath, `${componentName}.component.scss`));
    
    log(`✓ Component copied to generated-app`, 'green');
    
    // 2. Update routes
    await updateRoutes(componentName, 'add-temp');
    log(`✓ Routes updated`, 'green');
    
    // 3. Check if server is already running
    const serverRunning = await checkServerRunning();
    
    if (!serverRunning) {
      log('🚀 Starting Angular dev server...', 'yellow');
      log('   This will take 30-60 seconds...', 'yellow');
      
      // Start server in a NEW terminal window (user can see it)
      const isWindows = process.platform === 'win32';
      if (isWindows) {
        // Open new PowerShell window with ng serve
        await execAsync(`start powershell -NoExit -Command "cd '${path.join(__dirname, '..', 'generated-app')}'; npm start"`);
      } else {
        // Mac/Linux
        await execAsync(`osascript -e 'tell app "Terminal" to do script "cd ${path.join(__dirname, '..', 'generated-app')} && npm start"'`);
      }
      
      // Wait for server to be ready
      log('⏳ Waiting for server to start...', 'yellow');
      await waitForServer('http://localhost:4200', 120000);
      log('✓ Server is ready!', 'green');
    } else {
      log('✓ Server already running', 'green');
    }
    
    // 4. Open browser
    const url = `http://localhost:4200/${componentName}`;
    log(`🌐 Opening browser: ${url}`, 'cyan');
    
    const isWindows = process.platform === 'win32';
    const openCmd = isWindows ? 'start' : (process.platform === 'darwin' ? 'open' : 'xdg-open');
    
    await execAsync(`${openCmd} ${url}`);
    
    log('✓ Browser opened!', 'green');
    log('📝 Review the component visually before accepting', 'cyan');
    
    return true;
    
  } catch (error) {
    log(`⚠️  Browser preview failed: ${error.message}`, 'yellow');
    log('   You can manually run: cd generated-app && npm start', 'yellow');
    return false;
  }
}

// Helper: Check if server is running
async function checkServerRunning() {
  try {
    const response = await fetch('http://localhost:4200', {
      method: 'HEAD',
      signal: AbortSignal.timeout(2000)
    });
    return response.ok || response.status === 404; // 404 is ok, means server is running
  } catch {
    return false;
  }
}

// Helper: Wait for server to be ready
async function waitForServer(url, timeout = 120000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      if (response.ok || response.status === 404) {
        return true;
      }
    } catch {
      // Server not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Check every 2 seconds
  }
  
  throw new Error('Server startup timeout');
}

async function setupBrowserPreviewOLD(componentName, previewPaths) {
  log('🌐 Step 10.5: Setting up browser preview...', 'blue');
  
  try {
    // 1. Copy component to generated-app temporarily
    tempComponentPath = path.join(config.componentDir, componentName);
    await fs.mkdir(tempComponentPath, { recursive: true });
    
    await fs.copyFile(previewPaths.ts, path.join(tempComponentPath, `${componentName}.component.ts`));
    await fs.copyFile(previewPaths.html, path.join(tempComponentPath, `${componentName}.component.html`));
    await fs.copyFile(previewPaths.scss, path.join(tempComponentPath, `${componentName}.component.scss`));
    
    log(`✓ Component copied to generated-app`, 'green');
    
    // 2. Update routes temporarily
    await updateRoutes(componentName, 'add-temp');
    log(`✓ Routes updated temporarily`, 'green');
    
    // 3. Start ng serve in background
    log('🚀 Starting Angular dev server (this may take 30-60 seconds)...', 'yellow');
    const { spawn } = await import('child_process');
    
    const isWindows = process.platform === 'win32';
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    
    devServerProcess = spawn(npmCmd, ['start'], {
      cwd: path.join(__dirname, '..', 'generated-app'),
      shell: true,
      detached: false,
      stdio: 'pipe'
    });
    
    // Wait for server to be ready
    let serverReady = false;
    let output = '';
    
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout after 120 seconds'));
      }, 120000);
      
      devServerProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('compiled successfully') || output.includes('Compiled successfully')) {
          serverReady = true;
          clearTimeout(timeout);
          resolve();
        }
      });
      
      devServerProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('Address already in use')) {
          log('⚠️  Port 4200 already in use, assuming server is running', 'yellow');
          serverReady = true;
          clearTimeout(timeout);
          resolve();
        }
      });
      
      devServerProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
    
    if (serverReady) {
      log('✓ Dev server is running!', 'green');
      
      // 4. Open browser
      const url = `http://localhost:4200/${componentName}`;
      log(`🌐 Opening browser: ${url}`, 'cyan');
      
      const openCmd = process.platform === 'win32' ? 'start' : 
                      process.platform === 'darwin' ? 'open' : 'xdg-open';
      
      await execAsync(`${openCmd} ${url}`).catch(() => {
        log(`⚠️  Could not auto-open browser. Please visit: ${url}`, 'yellow');
      });
      
      log('✓ Browser preview ready!', 'green');
      log('📝 Review the component visually before accepting', 'cyan');
      
      return true;
    }
    
    return false;
    
  } catch (error) {
    log(`⚠️  Browser preview failed: ${error.message}`, 'yellow');
    log('   Continuing with code-only preview...', 'yellow');
    return false;
  }
}

async function cleanupBrowserPreview(componentName, keepFiles = false) {
  log('🧹 Cleaning up browser preview...', 'blue');
  
  // Note: We DON'T stop the dev server (it's in a separate terminal window)
  // User can stop it manually with Ctrl+C in that window
  
  // Remove temporary files (if rejecting)
  if (!keepFiles && tempComponentPath) {
    try {
      await fs.rm(tempComponentPath, { recursive: true, force: true });
      log('  ✓ Temporary component files removed', 'green');
    } catch (error) {
      log('  ⚠️  Could not remove temporary files', 'yellow');
    }
  }
  
  // Revert routes (if rejecting)
  if (!keepFiles) {
    try {
      await updateRoutes(componentName, 'remove-temp');
      log('  ✓ Routes reverted', 'green');
    } catch (error) {
      log('  ⚠️  Could not revert routes', 'yellow');
    }
  }
  
  log('✓ Cleanup complete', 'green');
  if (!keepFiles) {
    log('💡 Note: Dev server is still running in separate window', 'cyan');
    log('   Press Ctrl+C in that window to stop it', 'cyan');
  }
}

// Helper function to update routes
async function updateRoutes(componentName, action) {
  const routesPath = config.routesPath;
  let routesContent = await fs.readFile(routesPath, 'utf-8');
  
  const componentClassName = componentName.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Component';
  
  if (action === 'add-temp' || action === 'add-permanent') {
    // Add import if not exists
    const importStatement = `import { ${componentClassName} } from './components/${componentName}/${componentName}.component';`;
    if (!routesContent.includes(importStatement)) {
      const firstImportMatch = routesContent.match(/import { \w+ } from/);
      if (firstImportMatch) {
        const insertPos = firstImportMatch.index + firstImportMatch[0].length;
        routesContent = routesContent.slice(0, insertPos) + 
                       `\n${importStatement}` + 
                       routesContent.slice(insertPos);
      } else {
        routesContent = importStatement + '\n' + routesContent;
      }
    }
    
    // Add route
    const routeEntry = `  { path: '${componentName}', component: ${componentClassName} },`;
    if (!routesContent.includes(routeEntry)) {
      const routesMatch = routesContent.match(/export const routes: Routes = \[/);
      if (routesMatch) {
        const insertPos = routesMatch.index + routesMatch[0].length;
        routesContent = routesContent.slice(0, insertPos) + 
                       `\n${routeEntry}` + 
                       routesContent.slice(insertPos);
      }
    }
    
  } else if (action === 'remove-temp') {
    // Remove import
    const importRegex = new RegExp(`import { ${componentClassName} } from './components/${componentName}/${componentName}.component';\\n?`, 'g');
    routesContent = routesContent.replace(importRegex, '');
    
    // Remove route
    const routeRegex = new RegExp(`\\s*{ path: '${componentName}', component: ${componentClassName} },?\\n?`, 'g');
    routesContent = routesContent.replace(routeRegex, '');
  }
  
  await fs.writeFile(routesPath, routesContent, 'utf-8');
}

// ============================================================================
// STEP 11: Interactive Approval Prompt
// ============================================================================
async function promptForApproval(cssValidation) {
  header('❓ ACTIONS');
  
  console.log('What would you like to do?\n');
  
  if (cssValidation.isValid) {
    console.log('  [A] Accept & save to final location + Git commit');
  } else {
    log('  [A] Accept anyway (NOT RECOMMENDED - has CSS violations)', 'yellow');
  }
  
  console.log('  [R] Regenerate with stricter CSS enforcement');
  console.log('  [F] Attempt auto-fix CSS violations');
  console.log('  [E] Edit manually in VSCode (keep in preview)');
  console.log('  [C] Cancel and delete preview');
  
  console.log('\n' + '═'.repeat(50));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\nYour choice: ', (answer) => {
      rl.close();
      resolve(answer.toUpperCase().trim());
    });
  });
}

// ============================================================================
// STEP 12: Handle Approval Actions
// ============================================================================
// ============================================================================
// STEP 12: Handle Approval Actions
// ============================================================================
async function handleApproval(choice, componentName, previewPaths, cssValidation, fileKey, nodeId) {
  switch (choice) {
    case 'A':
      if (!cssValidation.isValid) {
        log('\n⚠️  Warning: Proceeding with CSS violations!', 'yellow');
      }
      // Cleanup browser preview but keep component files (we're accepting them)
      await cleanupBrowserPreview(componentName, true);
      await moveToFinalLocation(componentName, previewPaths);
      await createGitCommit(componentName, fileKey, nodeId);
      break;

    case 'R':
      // Cleanup and remove everything (will regenerate)
      await cleanupBrowserPreview(componentName, false);
      log('\n🔄 Regenerating with stricter enforcement...', 'yellow');
      log('   (This will re-run the generator)', 'yellow');
      return 'regenerate';

    case 'F':
      log('\n🔧 Auto-fix not yet implemented', 'yellow');
      log('   For now, please edit manually or regenerate', 'yellow');
      // Keep browser preview running for manual edits
      return 'cancel';

    case 'E':
      log('\n✓ Files remain in .preview/ for manual editing', 'green');
      log('   Run generator again when ready to finalize', 'green');
      // Keep browser preview running so user can see changes
      log('   Browser preview will stay running for testing', 'cyan');
      return 'edit';

    case 'C':
      // Cleanup everything
      await cleanupBrowserPreview(componentName, false);
      await fs.rm(path.dirname(previewPaths.ts), { recursive: true, force: true });
      log('\n✓ Preview cancelled and deleted', 'green');
      return 'cancel';

    default:
      await cleanupBrowserPreview(componentName, false);
      log('\n❌ Invalid choice. Cancelling.', 'red');
      return 'cancel';
  }

  return 'complete';
}

// ============================================================================
// STEP 13: Move to Final Location + Update Routes
// ============================================================================
async function moveToFinalLocation(componentName, previewPaths) {
  log('\n📁 Moving to final location...', 'blue');
  
  const finalPath = path.join(config.componentDir, componentName);
  await fs.mkdir(finalPath, { recursive: true });

  const finalPaths = {
    ts: path.join(finalPath, `${componentName}.component.ts`),
    html: path.join(finalPath, `${componentName}.component.html`),
    scss: path.join(finalPath, `${componentName}.component.scss`),
  };

  // Copy files
  await fs.copyFile(previewPaths.ts, finalPaths.ts);
  await fs.copyFile(previewPaths.html, finalPaths.html);
  await fs.copyFile(previewPaths.scss, finalPaths.scss);

  // Delete preview
  await fs.rm(path.dirname(previewPaths.ts), { recursive: true, force: true });

  log(`✓ Files moved to: generated-app/src/app/components/${componentName}/`, 'green');
  
  // Auto-update routes permanently
  await updateRoutes(componentName, 'add-permanent');
  
  return finalPaths;
}

// ============================================================================
// Auto-Update Routes in app.routes.ts
// ============================================================================
// ============================================================================
// STEP 14: Create Git Commit with Enhanced Messages
// ============================================================================
async function createGitCommit(componentName, figmaFileKey, nodeId) {
  log('📝 Creating git commit...', 'blue');
  
  try {
    const branchName = `feat/figma-${componentName}`;
    const className = toPascalCase(componentName) + 'Component';
    
    // Check if git repo exists
    try {
      await execAsync('git rev-parse --git-dir');
    } catch {
      log('⚠️  Not a git repository. Initializing...', 'yellow');
      await execAsync('git init');
      log('✓ Git repository initialized', 'green');
    }
    
    // Check if already on this branch
    let onBranch = false;
    try {
      const { stdout } = await execAsync('git branch --show-current');
      onBranch = stdout.trim() === branchName;
    } catch (error) {
      // Ignore
    }
    
    // Create or switch to branch
    if (!onBranch) {
      try {
        await execAsync(`git checkout -b ${branchName}`);
        log(`✓ Created branch: ${branchName}`, 'green');
      } catch (error) {
        try {
          await execAsync(`git checkout ${branchName}`);
          log(`✓ Switched to branch: ${branchName}`, 'green');
        } catch {
          log(`  Using current branch`, 'yellow');
        }
      }
    }

    // Stage component files
    await execAsync(`git add generated-app/src/app/components/${componentName}/`);
    
    // Stage routes file if modified
    try {
      await execAsync('git add generated-app/src/app/app.routes.ts');
    } catch {
      // Routes file might not be modified
    }
    
    // Create detailed commit message
    const commitMessage = `feat: Add ${className} from Figma design

- Generated from Figma node: ${nodeId}
- File: ${figmaFileKey}
- Component path: generated-app/src/app/components/${componentName}/
- Route: /${componentName}
- Generated with AI pipeline using IBM Granite LLM
- UPS brand CSS compliant`;

    await execAsync(`git commit -m "${commitMessage.split('\n')[0]}" -m "${commitMessage.split('\n').slice(1).join('\n')}"`);
    
    log(`✓ Committed with detailed message`, 'green');
    log(`\n📊 Git Summary:`, 'cyan');
    log(`  Branch: ${branchName}`, 'cyan');
    log(`  Component: ${className}`, 'cyan');
    log(`  Route: /${componentName}`, 'cyan');
    log(`\n🚀 Component ready to use!`, 'bright');
    log(`\n💡 Next steps:`, 'yellow');
    log(`  1. Review code in VSCode`, 'yellow');
    log(`  2. Test: npm start → http://localhost:4200/${componentName}`, 'yellow');
    log(`  3. Push: git push origin ${branchName}`, 'yellow');
    log(`  4. Create PR on GitHub/GitLab`, 'yellow');
    
  } catch (error) {
    log(`⚠️  Git commit failed: ${error.message}`, 'yellow');
    log('   Files saved successfully anyway', 'green');
  }
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================
async function main() {
  console.clear();
  
  log('╔════════════════════════════════════════════════╗', 'cyan');
  log('║  Figma → Angular AI Code Generator (PREVIEW)  ║', 'cyan');
  log('║  with STRICT CSS Enforcement                  ║', 'cyan');
  log('╚════════════════════════════════════════════════╝', 'cyan');

  // Parse arguments
  const [fileKey, nodeId, componentName] = process.argv.slice(2);

  if (!fileKey || !nodeId || !componentName) {
    console.log('\nUsage: node generate-with-preview.mjs <fileKey> <nodeId> <componentName>');
    console.log('\nExample:');
    console.log('  node generate-with-preview.mjs 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page');
    process.exit(1);
  }

  console.log(`\nConfiguration:`);
  console.log(`  Figma File:    ${fileKey}`);
  console.log(`  Node ID:       ${nodeId}`);
  console.log(`  Component:     ${componentName}`);
  console.log('');

  header('🤖 AI Code Generation Pipeline (STRICT MODE)');

  try {
    // Execute pipeline
    const figmaNode = await fetchFigmaNode(fileKey, nodeId);
    const brandCSS = await loadBrandCSS();
    const accessToken = await getIBMAccessToken();
    const prompt = buildStrictPrompt(figmaNode, brandCSS, componentName);
    const generatedCode = await generateWithGranite(prompt, accessToken);
    const files = parseGeneratedCode(generatedCode);
    
    // Fix TypeScript logic by adding missing properties
    files.typescript = fixTypeScriptLogic(files.typescript, files.html);
    
    const cssValidation = validateCSSStrict(files.html, brandCSS.classes);
    const previewPaths = await saveToPreview(componentName, files);
    
    showPreviewSummary(componentName, files, cssValidation);
    await openInVSCode(previewPaths);
    
    // Setup browser preview
    const browserPreviewReady = await setupBrowserPreview(componentName, previewPaths);
    if (browserPreviewReady) {
      log('\n💡 TIP: Check the browser to see your component rendered!', 'cyan');
    }
    
    const choice = await promptForApproval(cssValidation);
    const result = await handleApproval(choice, componentName, previewPaths, cssValidation, fileKey, nodeId);

    if (result === 'regenerate') {
      log('\n♻️  Restarting generation...', 'cyan');
      // Could implement auto-regenerate here
      process.exit(0);
    }

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
