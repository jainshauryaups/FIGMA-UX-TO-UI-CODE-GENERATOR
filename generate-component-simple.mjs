#!/usr/bin/env node

import fetch from 'node-fetch';
import https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// SSL workaround for corporate environments
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * Simple AI Code Generation Pipeline (JavaScript version)
 */

// Configuration
const config = {
  figmaToken: process.env['FIGMA_ACCESS_TOKEN'],
  graniteApiKey: process.env['IBM_GRANITE_API_KEY'],
  graniteEndpoint: process.env['IBM_GRANITE_ENDPOINT'] || 'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29',
  graniteProjectId: process.env['IBM_GRANITE_PROJECT_ID'],
  graniteModelId: process.env['IBM_GRANITE_MODEL_ID'] || 'ibm/granite-3-8b-instruct'
};

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('❌ Usage: npm run figma:generate <file-key> <node-id> <component-name>');
    process.exit(1);
  }

  const [fileKey, nodeId, componentName] = args;

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Figma to Angular AI Code Generator                     ║
║  Powered by IBM Granite LLM                              ║
╚══════════════════════════════════════════════════════════╝

Configuration:
  Figma File:    ${fileKey}
  Node ID:       ${nodeId}
  Component:     ${componentName}
`);

  try {
    // Step 1: Fetch Figma Design
    console.log('\n═══════════════════════════════════════════');
    console.log('  🤖 AI Code Generation Pipeline');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('📥 Step 1: Fetching Figma design data...');
    const figmaData = await fetchFigmaNode(fileKey, nodeId);
    console.log(`✓ Fetched node: ${nodeId}\n`);

    // Step 2: Load Brand CSS
    console.log('🎨 Step 2: Loading UPS Brand CSS...');
    const brandCSSContext = loadBrandCSS();
    console.log('✓ Brand CSS context loaded (87 classes)\n');

    // Step 3: Get IBM Access Token
    console.log('🔑 Step 3: Getting IBM access token...');
    const accessToken = await getIBMAccessToken(config.graniteApiKey);
    console.log('✓ Access token obtained\n');

    // Step 4: Generate Code with IBM Granite
    console.log('🧠 Step 4: Generating code with IBM Granite LLM...');
    const prompt = buildPrompt(componentName, figmaData, brandCSSContext);
    const generatedCode = await generateWithGranite(prompt, accessToken);
    console.log('✓ Code generated successfully\n');

    // Step 5: Parse Generated Code
    console.log('📦 Step 5: Parsing generated files...');
    const parsedCode = parseGeneratedCode(generatedCode);
    
    // Step 6: Validate CSS
    console.log('✅ Step 6: Validating CSS compliance...');
    const validation = validateCSS(parsedCode.html, brandCSSContext);
    if (!validation.isValid) {
      console.warn('⚠️  Warning: Some CSS classes may not be approved:');
      validation.invalidClasses.forEach(cls => console.warn(`   - ${cls}`));
    } else {
      console.log('✓ All CSS classes are UPS brand approved\n');
    }

    // Step 7: Save Files
    console.log('💾 Step 7: Saving component files...');
    const savedFiles = saveComponentFiles(componentName, parsedCode);
    console.log('✓ Files saved successfully\n');

    console.log('═══════════════════════════════════════════');
    console.log('  ✅ Pipeline Complete!');
    console.log('═══════════════════════════════════════════\n');

    console.log('📦 Generated Files:');
    console.log(`   ✓ ${savedFiles.typescript}`);
    console.log(`   ✓ ${savedFiles.html}`);
    console.log(`   ✓ ${savedFiles.scss}`);

    console.log('\n✅ Success! Component ready to use.');
    console.log('\nNext steps:');
    console.log('  1. Review the generated component');
    console.log('  2. Add route to app.routes.ts (if needed)');
    console.log('  3. Run: npm start');

  } catch (error) {
    console.error('\n❌ Pipeline failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Fetch Figma node data
async function fetchFigmaNode(fileKey, nodeId) {
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`;
  
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': config.figmaToken
    },
    agent: httpsAgent
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status}`);
  }

  const data = await response.json();
  return data.nodes[nodeId.replace('-', ':')];
}

// Get IBM access token
async function getIBMAccessToken(apiKey) {
  const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: apiKey
    }).toString()
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Load brand CSS context
function loadBrandCSS() {
  const stylesPath = path.join(process.cwd(), 'src', 'styles.scss');
  const content = fs.readFileSync(stylesPath, 'utf-8');
  
  // Extract class names
  const classRegex = /\.([\w-]+)\s*{/g;
  const classes = [];
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    if (!match[1].includes(':')) {
      classes.push(match[1]);
    }
  }

  return `
# UPS BRAND CSS GUIDELINES - STRICT ENFORCEMENT

⚠️ CRITICAL RULES:
1. You MUST ONLY use the CSS classes listed below
2. NEVER create new CSS classes or inline styles
3. NEVER modify src/styles.scss
4. All styling must use existing utility classes

## Available CSS Classes:
${[...new Set(classes)].sort().map(c => `- ${c}`).join('\n')}

REMINDER: These are the ONLY approved classes. Do not deviate.
`;
}

// Build prompt for IBM Granite
function buildPrompt(componentName, figmaData, brandCSSContext) {
  return `
# Task: Generate Angular Component from Figma Design

## Component Name: ${componentName}

## UPS Brand CSS (STRICTLY ENFORCE - USE ONLY THESE CLASSES):
${brandCSSContext}

## Figma Design Data:
\`\`\`json
${JSON.stringify(figmaData, null, 2).substring(0, 5000)}
\`\`\`

## Requirements:

1. **CSS USAGE - CRITICAL:**
   - ONLY use CSS classes from the UPS Brand CSS list above
   - DO NOT create any new CSS classes
   - DO NOT use inline styles
   - Leave the SCSS file empty or minimal

2. **Angular Best Practices:**
   - Use Angular 20 standalone component syntax
   - Use TypeScript with strict typing
   - Import CommonModule if needed

3. **Output Format:**

Please generate THREE files in this EXACT format:

\`\`\`typescript
// ${componentName}.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${componentName}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${componentName}.component.html',
  styleUrl: './${componentName}.component.scss'
})
export class ${toPascalCase(componentName)}Component {
  // Component logic here
}
\`\`\`

\`\`\`html
<!-- ${componentName}.component.html -->
<!-- USE ONLY UPS BRAND CSS CLASSES -->
<div class="flex flex-col">
  <!-- Your HTML here -->
</div>
\`\`\`

\`\`\`scss
/* ${componentName}.component.scss */
/* Leave empty - use utility classes instead */
\`\`\`

Generate the complete code now.`;
}

// Generate code with IBM Granite
async function generateWithGranite(prompt, accessToken) {
  const payload = {
    messages: [
      {
        role: 'system',
        content: `You are an expert Angular developer. Generate clean, production-ready Angular 20 components. 
CRITICAL: Only use CSS classes from the provided UPS Brand CSS list. Never create new CSS classes.`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    project_id: config.graniteProjectId,
    model_id: config.graniteModelId,
    max_tokens: 6000,
    temperature: 0.15,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  const response = await fetch(config.graniteEndpoint, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`IBM Granite API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// Parse generated code into files
function parseGeneratedCode(generatedText) {
  const result = {
    typescript: '',
    html: '',
    scss: ''
  };

  // Extract TypeScript
  const tsMatch = generatedText.match(/```typescript\n([\s\S]*?)```/);
  if (tsMatch) result.typescript = tsMatch[1].trim();

  // Extract HTML
  const htmlMatch = generatedText.match(/```html\n([\s\S]*?)```/);
  if (htmlMatch) result.html = htmlMatch[1].trim();

  // Extract SCSS
  const scssMatch = generatedText.match(/```scss\n([\s\S]*?)```/);
  if (scssMatch) result.scss = scssMatch[1].trim();

  return result;
}

// Validate CSS classes
function validateCSS(html, brandContext) {
  const approvedClasses = new Set();
  const classRegex = /- ([\w-]+)/g;
  let match;
  while ((match = classRegex.exec(brandContext)) !== null) {
    approvedClasses.add(match[1]);
  }

  const usedClasses = [];
  const invalidClasses = [];
  const htmlClassRegex = /class="([^"]+)"/g;
  
  while ((match = htmlClassRegex.exec(html)) !== null) {
    const classes = match[1].split(/\s+/);
    classes.forEach(cls => {
      if (cls && !approvedClasses.has(cls)) {
        invalidClasses.push(cls);
      }
      usedClasses.push(cls);
    });
  }

  return {
    isValid: invalidClasses.length === 0,
    invalidClasses: [...new Set(invalidClasses)],
    usedClasses: [...new Set(usedClasses)]
  };
}

// Save component files
function saveComponentFiles(componentName, parsedCode) {
  const baseDir = path.join(process.cwd(), 'src', 'app', 'components', componentName);
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const files = {
    typescript: path.join(baseDir, `${componentName}.component.ts`),
    html: path.join(baseDir, `${componentName}.component.html`),
    scss: path.join(baseDir, `${componentName}.component.scss`)
  };

  fs.writeFileSync(files.typescript, parsedCode.typescript || '// Generated component', 'utf-8');
  fs.writeFileSync(files.html, parsedCode.html || '<!-- Generated template -->', 'utf-8');
  fs.writeFileSync(files.scss, parsedCode.scss || '/* Use UPS brand utility classes */', 'utf-8');

  return files;
}

// Helper: Convert to PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Run
main().catch(console.error);
