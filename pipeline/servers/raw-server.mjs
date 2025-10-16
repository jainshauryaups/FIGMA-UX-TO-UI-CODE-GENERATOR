import express from 'express';
import fetch from 'node-fetch';

const app = express();
const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = '0eg3UmbqMcZtym1x8sGtZX';
const NODE_ID = '255-2652';

// Enable CORS and JSON parsing
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Get raw Figma JSON
app.get('/raw-json', async (req, res) => {
    try {
        console.log('Fetching Figma data...');
        console.log(`File Key: ${FILE_KEY}`);
        console.log(`Node ID: ${NODE_ID}`);

        const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`;
        console.log(`URL: ${url}`);

        const response = await fetch(url, {
            headers: {
                'X-Figma-Token': FIGMA_TOKEN
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Figma API Error:', errorText);
            throw new Error(`Figma API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Successfully fetched Figma data');
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
    }
});

// Basic test endpoint
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const port = 3333;

const server = app.listen(port, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
    console.log('Available endpoints:');
    console.log('- GET /test - Test if server is running');
    console.log('- GET /raw-json - Get raw Figma JSON');
});

server.on('error', (error) => {
    console.error('Server error:', error);
    if (error.code === 'EADDRINUSE') {
        console.log('Port is busy, trying to close existing connections...');
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down...');
    server.close();
});

// Keep the process running
process.stdin.resume();