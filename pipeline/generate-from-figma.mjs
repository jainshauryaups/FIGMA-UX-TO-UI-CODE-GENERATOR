#!/usr/bin/env node

import { CodeGenerationPipeline } from './src/ai-pipeline/code-generation-pipeline.js';

/**
 * CLI Tool for AI Code Generation from Figma
 * 
 * Usage:
 *   npm run figma:generate <file-key> <node-id> <component-name>
 *   npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page
 * 
 * Optional flags:
 *   --analyze    Analyze existing code for patterns
 *   --test       Run diagnostics only
 */

async function main() {
  const args = process.argv.slice(2);
  
  // Show help
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const pipeline = new CodeGenerationPipeline();

  // Run diagnostics
  if (args.includes('--test')) {
    await pipeline.runDiagnostics();
    process.exit(0);
  }

  // Validate required arguments
  if (args.length < 3) {
    console.error('❌ Error: Missing required arguments\n');
    showHelp();
    process.exit(1);
  }

  const [fileKey, nodeId, componentName] = args;
  const analyzeExistingCode = args.includes('--analyze');

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Figma to Angular AI Code Generator                     ║
║  Powered by IBM Granite LLM                              ║
╚══════════════════════════════════════════════════════════╝
  
Configuration:
  Figma File:    ${fileKey}
  Node ID:       ${nodeId}
  Component:     ${componentName}
  Analyze Code:  ${analyzeExistingCode ? 'Yes' : 'No'}
`);

  try {
    const result = await pipeline.generateComponentFromFigma(
      fileKey,
      nodeId,
      componentName,
      {
        analyzeExistingCode,
        allowInvalidCSS: false // Strict enforcement
      }
    );

    if (result.success) {
      console.log('\n📦 Generated Files:');
      if (result.files) {
        console.log(`   ✓ ${result.files.typescript}`);
        console.log(`   ✓ ${result.files.html}`);
        console.log(`   ✓ ${result.files.scss}`);
      }

      if (result.metadata) {
        console.log(`\n📊 Generation Stats:`);
        console.log(`   Model: ${result.metadata.model}`);
        console.log(`   Tokens Used: ${result.metadata.tokensUsed}`);
        console.log(`   Generated At: ${result.metadata.generatedAt}`);
      }

      console.log('\n✅ Success! Component ready to use.');
      console.log('\nNext steps:');
      console.log('  1. Review the generated component');
      console.log('  2. Add route to app.routes.ts (if needed)');
      console.log('  3. Run: npm start');
      console.log('  4. Generate Storybook story: npm run storybook:generate');

    } else {
      console.error(`\n❌ Generation failed: ${result.error}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  Figma to Angular AI Code Generator - CLI                ║
╚══════════════════════════════════════════════════════════╝

USAGE:
  npm run figma:generate <file-key> <node-id> <component-name> [options]

ARGUMENTS:
  file-key         Figma file key (from URL)
  node-id          Figma node ID (from URL or right-click > Copy link)
  component-name   Name for the Angular component (kebab-case)

OPTIONS:
  --analyze        Analyze existing components for code patterns
  --test           Run diagnostics to test API connections
  --help, -h       Show this help message

EXAMPLES:
  # Generate a new component
  npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page

  # Generate with existing code analysis
  npm run figma:generate 0eg3UmbqMcZtym1x8sGtZX 255-2415 track-page --analyze

  # Run diagnostics
  npm run figma:generate --test

REQUIREMENTS:
  1. Set up .env file with:
     - FIGMA_ACCESS_TOKEN=your_token
     - IBM_GRANITE_API_KEY=your_key
     - IBM_GRANITE_ENDPOINT=your_endpoint (optional)
     - IBM_GRANITE_MODEL_ID=model_id (optional)

  2. Brand CSS must be in: src/styles.scss

NOTES:
  - Generated code will ONLY use existing UPS brand CSS classes
  - No new CSS will be created
  - Strict validation ensures brand compliance
  - Files are saved to: src/app/components/<component-name>/

For more info: See README.md
`);
}

// Run CLI
main().catch(console.error);
