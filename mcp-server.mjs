import express from 'express';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// SSE endpoint for MCP async notifications
app.get('/mcp', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    req.socket.setKeepAlive(true, 30000);
    res.write(': connected\n\n');

    const heartbeat = setInterval(() => {
        res.write(': ping\n\n');
    }, 25000);

    req.on('close', () => {
        clearInterval(heartbeat);
        console.log('SSE connection closed');
    });
});

// JSON-RPC endpoint for MCP tool calls
app.post('/rpc', async (req, res) => {
    try {
        const { method, params } = req.body;
        console.log('RPC call:', method, params);
        
        // Handle different methods
        switch (method) {
            case 'mcp_figma_get_code':
                // Implementation for getting Figma code
                break;
            case 'mcp_figma_get_metadata':
                // Implementation for getting Figma metadata
                break;
            default:
                throw new Error(`Unknown method: ${method}`);
        }
        
        res.json({ result: 'Method not implemented yet' });
    } catch (error) {
        console.error('RPC Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Figma API endpoints
app.get('/mcp/node/:nodeId', async (req, res) => {
    try {
        const nodeId = req.params.nodeId;
        const fileKey = req.query.fileKey;
        
        if (!fileKey) {
            return res.status(400).json({ error: 'fileKey is required' });
        }

        console.log(`Fetching node ${nodeId} from file ${fileKey}`);
        console.log('Request URL:', `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`);
        
        const response = await fetch(
            `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`,
            {
                headers: {
                    'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Figma API returned ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully fetched data from Figma');
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
const port = 3845;
const host = '127.0.0.1';

const server = app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
    console.log('Available endpoints:');
    console.log('- GET /test');
    console.log('- GET /mcp/node/:nodeId?fileKey=xxx');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please make sure no other MCP server is running.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
        process.exit(1);
    } else {
        console.error('Server error:', error);
    }
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutting down');
    });
});