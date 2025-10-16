#!/usr/bin/env node

/**
 * Sync UPS Brand CSS
 * 
 * Copies the master brand CSS file from pipeline to generated-app
 * Run this after editing pipeline/brand-css/ups-brand.scss
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE = path.join(__dirname, 'brand-css', 'ups-brand.scss');
const DEST = path.join(__dirname, '..', 'generated-app', 'src', 'styles.scss');

async function syncCSS() {
  console.log('\n🔄 Syncing UPS Brand CSS...\n');
  
  try {
    // Read source file
    console.log(`📖 Reading: ${SOURCE}`);
    const content = await fs.readFile(SOURCE, 'utf-8');
    
    // Verify source has content
    if (!content || content.trim().length === 0) {
      throw new Error('Source file is empty!');
    }
    
    // Count classes (rough estimate)
    const classCount = (content.match(/^\./gm) || []).length;
    console.log(`   Found ${classCount} class definitions`);
    
    // Write to destination
    console.log(`\n📝 Writing: ${DEST}`);
    await fs.writeFile(DEST, content, 'utf-8');
    
    // Verify destination
    const destContent = await fs.readFile(DEST, 'utf-8');
    if (destContent === content) {
      console.log('\n✅ Sync successful!');
      console.log(`\n📊 Summary:`);
      console.log(`   Source: pipeline/brand-css/ups-brand.scss`);
      console.log(`   Destination: generated-app/src/styles.scss`);
      console.log(`   Size: ${content.length} bytes`);
      console.log(`   Classes: ~${classCount}\n`);
    } else {
      throw new Error('Verification failed - files do not match!');
    }
    
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    console.error('\nPlease check:');
    console.error('  1. Source file exists: pipeline/brand-css/ups-brand.scss');
    console.error('  2. Destination folder exists: generated-app/src/');
    console.error('  3. You have write permissions\n');
    process.exit(1);
  }
}

// Run sync
syncCSS();
