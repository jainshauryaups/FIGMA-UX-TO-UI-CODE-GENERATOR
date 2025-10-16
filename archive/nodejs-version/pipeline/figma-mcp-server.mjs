#!/usr/bin/env node

/**
 * Figma MCP Server - Complete Implementation
 * Provides MCP tools for Figma integration: get_code, get_metadata, get_screenshot, etc.
 */

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Handle SSL certificate issues in corporate environments
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.MCP_SERVER_PORT || 3845;
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_TOKEN) {
    console.error('ERROR: FIGMA_ACCESS_TOKEN not found in .env file');
    process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        figmaToken: FIGMA_TOKEN ? 'configured' : 'missing'
    });
});

/**
 * MCP Tool: mcp_figma_get_code
 * Generate code for a Figma node
 */
app.post('/mcp/get_code', async (req, res) => {
    try {
        const { nodeId, fileKey, forceCode = false } = req.body;
        
        if (!fileKey) {
            return res.status(400).json({ error: 'fileKey is required' });
        }
        
        // If no nodeId, get the whole file
        const targetNodeId = nodeId || '';
        
        console.log(`Fetching code for node ${targetNodeId || 'root'} from file ${fileKey}`);
        
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}${targetNodeId ? `/nodes?ids=${targetNodeId}` : ''}`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_TOKEN
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Figma API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        res.json({
            success: true,
            nodeId: targetNodeId,
            fileKey,
            data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in get_code:', error);
        res.status(500).json({ 
            error: error.message,
            tool: 'mcp_figma_get_code'
        });
    }
});

/**
 * MCP Tool: mcp_figma_get_metadata
 * Get metadata for a Figma node
 */
app.post('/mcp/get_metadata', async (req, res) => {
    try {
        const { nodeId, fileKey } = req.body;
        
        if (!fileKey) {
            return res.status(400).json({ error: 'fileKey is required' });
        }
        
        const targetNodeId = nodeId || '';
        
        console.log(`Fetching metadata for node ${targetNodeId || 'root'} from file ${fileKey}`);
        
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}${targetNodeId ? `/nodes?ids=${targetNodeId}` : ''}`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_TOKEN
                },
                agent: httpsAgent
            }
        );

        if (!response.ok) {
            throw new Error(`Figma API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Extract metadata (simplified XML-like structure)
        const metadata = extractMetadata(data);
        
        res.json({
            success: true,
            nodeId: targetNodeId,
            fileKey,
            metadata,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in get_metadata:', error);
        res.status(500).json({ 
            error: error.message,
            tool: 'mcp_figma_get_metadata'
        });
    }
});

/**
 * MCP Tool: mcp_figma_get_screenshot
 * Get screenshot/image of a Figma node
 */
app.post('/mcp/get_screenshot', async (req, res) => {
    try {
        const { nodeId, fileKey, scale = 2, format = 'png' } = req.body;
        
        if (!fileKey || !nodeId) {
            return res.status(400).json({ error: 'fileKey and nodeId are required' });
        }
        
        console.log(`Fetching screenshot for node ${nodeId} from file ${fileKey}`);
        
        const response = await fetch(
            `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&scale=${scale}&format=${format}`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_TOKEN
                },
                agent: httpsAgent
            }
        );

        if (!response.ok) {
            throw new Error(`Figma API returned ${response.status}`);
        }

        const data = await response.json();
        
        res.json({
            success: true,
            nodeId,
            fileKey,
            imageUrl: data.images?.[nodeId],
            scale,
            format,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in get_screenshot:', error);
        res.status(500).json({ 
            error: error.message,
            tool: 'mcp_figma_get_screenshot'
        });
    }
});

/**
 * MCP Tool: mcp_figma_get_variable_defs
 * Get variable definitions from a Figma file
 */
app.post('/mcp/get_variable_defs', async (req, res) => {
    try {
        const { fileKey } = req.body;
        
        if (!fileKey) {
            return res.status(400).json({ error: 'fileKey is required' });
        }
        
        console.log(`Fetching variables from file ${fileKey}`);
        
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}/variables/local`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_TOKEN
                },
                agent: httpsAgent
            }
        );

        if (!response.ok) {
            throw new Error(`Figma API returned ${response.status}`);
        }

        const data = await response.json();
        
        res.json({
            success: true,
            fileKey,
            variables: data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error in get_variable_defs:', error);
        res.status(500).json({ 
            error: error.message,
            tool: 'mcp_figma_get_variable_defs'
        });
    }
});

/**
 * Get raw Figma file JSON - for automation scripts
 */
app.get('/api/figma/file/:fileKey', async (req, res) => {
    try {
        const { fileKey } = req.params;
        const { nodeId } = req.query;
        
        console.log(`Fetching raw JSON for file ${fileKey}${nodeId ? `, node ${nodeId}` : ''}`);
        
        let url = `https://api.figma.com/v1/files/${fileKey}`;
        if (nodeId) {
            url += `/nodes?ids=${nodeId}`;
        }
        
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
        
        res.json(data);
        
    } catch (error) {
        console.error('Error fetching Figma file:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get Figma file info
 */
app.get('/api/figma/file/:fileKey/info', async (req, res) => {
    try {
        const { fileKey } = req.params;
        
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}`,
            {
                headers: {
                    'X-Figma-Token': FIGMA_TOKEN
                },
                agent: httpsAgent
            }
        );

        if (!response.ok) {
            throw new Error(`Figma API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Return simplified info
        res.json({
            name: data.name,
            lastModified: data.lastModified,
            version: data.version,
            thumbnailUrl: data.thumbnailUrl,
            document: {
                id: data.document.id,
                name: data.document.name,
                type: data.document.type
            }
        });
        
    } catch (error) {
        console.error('Error fetching file info:', error);
        res.status(500).json({ error: error.message });
    }
});

// Helper function to extract metadata
function extractMetadata(data) {
    if (!data) return null;
    
    const metadata = {
        name: data.name,
        type: data.document?.type || data.type,
        children: []
    };
    
    if (data.document?.children) {
        metadata.children = data.document.children.map(extractNodeInfo);
    } else if (data.nodes) {
        metadata.children = Object.values(data.nodes).map(node => extractNodeInfo(node.document));
    }
    
    return metadata;
}

function extractNodeInfo(node) {
    if (!node) return null;
    
    const info = {
        id: node.id,
        name: node.name,
        type: node.type,
        visible: node.visible !== false
    };
    
    if (node.absoluteBoundingBox) {
        info.bounds = node.absoluteBoundingBox;
    }
    
    if (node.children && node.children.length > 0) {
        info.children = node.children.map(extractNodeInfo);
    }
    
    return info;
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('  Figma MCP Server Started Successfully');
    console.log('═══════════════════════════════════════════');
    console.log(`  URL: http://127.0.0.1:${PORT}`);
    console.log(`  Figma Token: ${FIGMA_TOKEN ? '✓ Configured' : '✗ Missing'}`);
    console.log('');
    console.log('  Available MCP Tools:');
    console.log('  • POST /mcp/get_code');
    console.log('  • POST /mcp/get_metadata');
    console.log('  • POST /mcp/get_screenshot');
    console.log('  • POST /mcp/get_variable_defs');
    console.log('');
    console.log('  API Endpoints:');
    console.log('  • GET  /api/figma/file/:fileKey');
    console.log('  • GET  /api/figma/file/:fileKey/info');
    console.log('  • GET  /health');
    console.log('═══════════════════════════════════════════');
    console.log('');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`✗ Port ${PORT} is already in use`);
        console.error('  Please close the other MCP server or change MCP_SERVER_PORT in .env');
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\nShutting down MCP server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nShutting down MCP server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
