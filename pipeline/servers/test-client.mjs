import fetch from 'node-fetch';

const MCP_URL = 'http://127.0.0.1:3845';
const FILE_KEY = '0eg3UmbqMcZtym1x8sGtZX';
const NODE_ID = '255-2652';

// Test both endpoints
async function testEndpoints() {
    try {
        // 1. Test basic endpoint
        console.log('\nTesting /test endpoint...');
        let response = await fetch(`${MCP_URL}/test`);
        let data = await response.json();
        console.log('Test endpoint response:', data);

        // 2. Test Figma endpoint
        console.log('\nTesting Figma endpoint...');
        await getFigmaData();
    } catch (error) {
        console.error('Error testing endpoints:', error);
    }
}

async function getFigmaData() {
    try {
        console.log('Connecting to MCP server...');
        console.log(`URL: ${MCP_URL}/mcp/node/${NODE_ID}?fileKey=${FILE_KEY}`);

        const response = await fetch(
            `${MCP_URL}/mcp/node/${NODE_ID}?fileKey=${FILE_KEY}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`MCP server returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('\nRaw Figma JSON:');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

console.log('Starting MCP server test...');
testEndpoints();