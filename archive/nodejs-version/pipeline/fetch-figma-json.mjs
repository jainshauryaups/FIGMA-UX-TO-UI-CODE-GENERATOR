#!/usr/bin/env node

/**
 * Fetch Raw Figma JSON Script
 * Downloads raw JSON data from Figma designs for LLM processing
 * 
 * Usage:
 *   node fetch-figma-json.mjs <fileKey> [nodeId]
 *   node fetch-figma-json.mjs Cs2VvhCrMokQ1234567890
 *   node fetch-figma-json.mjs Cs2VvhCrMokQ1234567890 255:2652
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

// Handle SSL certificate issues in corporate environments
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const OUTPUT_DIR = './figma-exports';

if (!FIGMA_TOKEN) {
    console.error('ERROR: FIGMA_ACCESS_TOKEN not found in .env file');
    process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const fileKey = args[0];
const nodeId = args[1];

if (!fileKey) {
    console.log('Usage: node fetch-figma-json.mjs <fileKey> [nodeId]');
    console.log('');
    console.log('Examples:');
    console.log('  node fetch-figma-json.mjs Cs2VvhCrMokQ1234567890');
    console.log('  node fetch-figma-json.mjs Cs2VvhCrMokQ1234567890 255:2652');
    console.log('');
    console.log('To get fileKey and nodeId from a Figma URL:');
    console.log('  https://figma.com/design/<fileKey>/...?node-id=<nodeId>');
    process.exit(1);
}

async function fetchFigmaData(fileKey, nodeId = null) {
    try {
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  Fetching Figma Data');
        console.log('═══════════════════════════════════════════');
        console.log(`  File Key: ${fileKey}`);
        if (nodeId) {
            console.log(`  Node ID:  ${nodeId}`);
        }
        console.log('');
        
        // Build URL
        let url = `https://api.figma.com/v1/files/${fileKey}`;
        if (nodeId) {
            // Replace : with - for URL (Figma API format)
            const formattedNodeId = nodeId.replace(':', '-');
            url += `/nodes?ids=${formattedNodeId}`;
        }
        
        console.log(`  Requesting: ${url}`);
        console.log('');
        
        // Fetch from Figma API
        const response = await fetch(url, {
            headers: {
                'X-Figma-Token': FIGMA_TOKEN
            },
            agent: httpsAgent
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Figma API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        // Create output directory if it doesn't exist
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        
        // Generate filename
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const filename = nodeId 
            ? `figma-${fileKey}-node-${nodeId.replace(':', '-')}-${timestamp}.json`
            : `figma-${fileKey}-full-${timestamp}.json`;
        
        const outputPath = path.join(OUTPUT_DIR, filename);
        
        // Save to file
        await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log('✓ Success!');
        console.log('');
        console.log(`  File Name:     ${data.name || 'Unknown'}`);
        console.log(`  Last Modified: ${data.lastModified || 'Unknown'}`);
        console.log(`  Version:       ${data.version || 'Unknown'}`);
        console.log('');
        console.log(`  Saved to: ${outputPath}`);
        
        // Get file size
        const stats = await fs.stat(outputPath);
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`  File Size: ${sizeMB} MB`);
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('');
        
        return outputPath;
        
    } catch (error) {
        console.error('');
        console.error('✗ Error:', error.message);
        console.error('');
        
        if (error.message.includes('404')) {
            console.error('  The file or node was not found.');
            console.error('  Please check:');
            console.error('  1. The file key is correct');
            console.error('  2. You have access to the file');
            console.error('  3. The node ID exists in the file');
        } else if (error.message.includes('403')) {
            console.error('  Access denied. Please check:');
            console.error('  1. Your FIGMA_ACCESS_TOKEN is valid');
            console.error('  2. The token has access to this file');
        }
        
        console.error('');
        process.exit(1);
    }
}

// Run the script
fetchFigmaData(fileKey, nodeId);
