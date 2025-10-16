#!/usr/bin/env node

/**
 * Automated Figma to LLM Processing Script
 * 
 * This script:
 * 1. Fetches Figma design JSON
 * 2. Processes it for LLM consumption
 * 3. Optionally sends to an LLM API
 * 4. Saves the results
 * 
 * Usage:
 *   node automate-figma-llm.mjs <fileKey> [nodeId] [--llm=openai|claude|local]
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
const OUTPUT_DIR = './llm-processing';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Parse arguments
const args = process.argv.slice(2);
const fileKey = args.find(arg => !arg.startsWith('--'));
const nodeId = args.find((arg, i) => i > 0 && !arg.startsWith('--') && args[i-1] !== '--llm');
const llmOption = args.find(arg => arg.startsWith('--llm='))?.split('=')[1] || 'none';

if (!fileKey) {
    console.log('');
    console.log('Usage: node automate-figma-llm.mjs <fileKey> [nodeId] [--llm=openai|claude|local]');
    console.log('');
    console.log('Examples:');
    console.log('  node automate-figma-llm.mjs Cs2VvhCrMokQ1234567890');
    console.log('  node automate-figma-llm.mjs Cs2VvhCrMokQ1234567890 255:2652');
    console.log('  node automate-figma-llm.mjs Cs2VvhCrMokQ1234567890 --llm=openai');
    console.log('');
    process.exit(1);
}

/**
 * Fetch Figma design data
 */
async function fetchFigmaDesign(fileKey, nodeId = null) {
    console.log('📥 Fetching Figma design...');
    
    let url = `https://api.figma.com/v1/files/${fileKey}`;
    if (nodeId) {
        const formattedNodeId = nodeId.replace(':', '-');
        url += `/nodes?ids=${formattedNodeId}`;
    }
    
    const response = await fetch(url, {
        headers: { 'X-Figma-Token': FIGMA_TOKEN },
        agent: httpsAgent
    });

    if (!response.ok) {
        throw new Error(`Figma API error: ${response.status}`);
    }

    return await response.json();
}

/**
 * Process Figma JSON for LLM consumption
 * Extracts key information and formats it for better LLM understanding
 */
function processFigmaForLLM(figmaData) {
    console.log('⚙️  Processing for LLM...');
    
    const processed = {
        metadata: {
            name: figmaData.name,
            lastModified: figmaData.lastModified,
            version: figmaData.version,
            processedAt: new Date().toISOString()
        },
        design: extractDesignInfo(figmaData.document || figmaData.nodes),
        styles: extractStyles(figmaData.styles),
        components: extractComponents(figmaData.components)
    };
    
    return processed;
}

/**
 * Extract design information from nodes
 */
function extractDesignInfo(node) {
    if (!node) return null;
    
    // Handle both direct document and nodes object
    const rootNode = node.document || node;
    
    const info = {
        id: rootNode.id,
        name: rootNode.name,
        type: rootNode.type,
    };
    
    // Extract layout information
    if (rootNode.absoluteBoundingBox) {
        info.layout = {
            width: rootNode.absoluteBoundingBox.width,
            height: rootNode.absoluteBoundingBox.height,
            x: rootNode.absoluteBoundingBox.x,
            y: rootNode.absoluteBoundingBox.y
        };
    }
    
    // Extract colors
    if (rootNode.fills && rootNode.fills.length > 0) {
        info.fills = rootNode.fills.map(fill => ({
            type: fill.type,
            color: fill.color,
            opacity: fill.opacity
        }));
    }
    
    // Extract text properties
    if (rootNode.type === 'TEXT') {
        info.text = {
            characters: rootNode.characters,
            style: rootNode.style
        };
    }
    
    // Recursively process children
    if (rootNode.children && rootNode.children.length > 0) {
        info.children = rootNode.children.map(extractDesignInfo);
    }
    
    return info;
}

/**
 * Extract styles information
 */
function extractStyles(styles) {
    if (!styles) return {};
    
    const extracted = {};
    for (const [key, style] of Object.entries(styles)) {
        extracted[key] = {
            name: style.name,
            type: style.styleType,
            description: style.description
        };
    }
    return extracted;
}

/**
 * Extract components information
 */
function extractComponents(components) {
    if (!components) return {};
    
    const extracted = {};
    for (const [key, component] of Object.entries(components)) {
        extracted[key] = {
            name: component.name,
            description: component.description,
            key: component.key
        };
    }
    return extracted;
}

/**
 * Generate LLM prompt
 */
function generateLLMPrompt(processedData) {
    return `You are analyzing a Figma design. Here is the processed design data:

## Design Metadata
- Name: ${processedData.metadata.name}
- Last Modified: ${processedData.metadata.lastModified}
- Version: ${processedData.metadata.version}

## Design Structure
${JSON.stringify(processedData.design, null, 2)}

## Styles
${JSON.stringify(processedData.styles, null, 2)}

## Components
${JSON.stringify(processedData.components, null, 2)}

Please analyze this design and provide:
1. A summary of the design structure
2. Key UI components identified
3. Color palette and typography used
4. Recommendations for implementation
5. Any accessibility considerations`;
}

/**
 * Send to OpenAI
 */
async function sendToOpenAI(prompt) {
    if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not found in .env');
    }
    
    console.log('🤖 Sending to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a UI/UX design expert analyzing Figma designs.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Send to Claude
 */
async function sendToClaude(prompt) {
    if (!ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not found in .env');
    }
    
    console.log('🤖 Sending to Claude...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-opus-20240229',
            max_tokens: 2000,
            messages: [
                { role: 'user', content: prompt }
            ]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content[0].text;
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  Figma to LLM Automation');
        console.log('═══════════════════════════════════════════');
        console.log(`  File Key: ${fileKey}`);
        if (nodeId) console.log(`  Node ID:  ${nodeId}`);
        console.log(`  LLM:      ${llmOption}`);
        console.log('');
        
        // Step 1: Fetch Figma data
        const figmaData = await fetchFigmaDesign(fileKey, nodeId);
        
        // Step 2: Process for LLM
        const processedData = processFigmaForLLM(figmaData);
        
        // Create output directory
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        
        // Save processed data
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const processedPath = path.join(OUTPUT_DIR, `processed-${fileKey}-${timestamp}.json`);
        await fs.writeFile(processedPath, JSON.stringify(processedData, null, 2), 'utf8');
        console.log(`✓ Processed data saved: ${processedPath}`);
        
        // Save raw data
        const rawPath = path.join(OUTPUT_DIR, `raw-${fileKey}-${timestamp}.json`);
        await fs.writeFile(rawPath, JSON.stringify(figmaData, null, 2), 'utf8');
        console.log(`✓ Raw data saved: ${rawPath}`);
        
        // Step 3: Generate prompt
        const prompt = generateLLMPrompt(processedData);
        const promptPath = path.join(OUTPUT_DIR, `prompt-${fileKey}-${timestamp}.txt`);
        await fs.writeFile(promptPath, prompt, 'utf8');
        console.log(`✓ LLM prompt saved: ${promptPath}`);
        
        // Step 4: Optionally send to LLM
        let llmResponse = null;
        if (llmOption === 'openai') {
            llmResponse = await sendToOpenAI(prompt);
        } else if (llmOption === 'claude') {
            llmResponse = await sendToClaude(prompt);
        }
        
        if (llmResponse) {
            const responsePath = path.join(OUTPUT_DIR, `llm-response-${fileKey}-${timestamp}.txt`);
            await fs.writeFile(responsePath, llmResponse, 'utf8');
            console.log(`✓ LLM response saved: ${responsePath}`);
            console.log('');
            console.log('LLM Response:');
            console.log('─'.repeat(43));
            console.log(llmResponse);
        }
        
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  ✓ Processing Complete');
        console.log('═══════════════════════════════════════════');
        console.log('');
        
    } catch (error) {
        console.error('');
        console.error('✗ Error:', error.message);
        console.error('');
        process.exit(1);
    }
}

main();
