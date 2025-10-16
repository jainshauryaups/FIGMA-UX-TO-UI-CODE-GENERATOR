import fetch from 'node-fetch';

const testServer = async () => {
    try {
        // First test the basic endpoint
        console.log('1. Testing basic endpoint...');
        let response = await fetch('http://localhost:3845/test');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let data = await response.json();
        console.log('Basic endpoint response:', data);
        
        // Test Figma endpoint
        console.log('\n2. Testing Figma endpoint...');
        const figmaUrl = 'http://localhost:3845/mcp/node/255:2652?fileKey=0eg3UmbqMcZtym1x8sGtZX';
        console.log('Requesting:', figmaUrl);
        
        response = await fetch(figmaUrl);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }
        
        data = await response.json();
        console.log('Figma endpoint response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
    }
};

testServer();