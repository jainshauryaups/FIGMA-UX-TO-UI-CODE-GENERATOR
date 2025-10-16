import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Quick test of IBM Granite API connection with automatic token management
 */
async function testGraniteAPI() {
  const apiKey = process.env['IBM_GRANITE_API_KEY'];
  const endpoint = process.env['IBM_GRANITE_ENDPOINT'] || 'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29';
  const projectId = process.env['IBM_GRANITE_PROJECT_ID'];
  const modelId = process.env['IBM_GRANITE_MODEL_ID'] || 'ibm/granite-3-8b-instruct';

  console.log('\n🔧 Testing IBM Granite API Connection...\n');

  // Check configuration
  if (!apiKey) {
    console.error('❌ IBM_GRANITE_API_KEY not found in .env');
    process.exit(1);
  }
  if (!projectId) {
    console.error('❌ IBM_GRANITE_PROJECT_ID not found in .env');
    process.exit(1);
  }

  console.log('✓ API Key found');
  console.log('✓ Project ID found');
  console.log(`✓ Using model: ${modelId}\n`);

  // Step 1: Exchange API key for access token
  console.log('🔑 Exchanging API key for access token...\n');
  
  let accessToken;
  try {
    const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
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

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error(`❌ Failed to get access token (${tokenResponse.status}):`, error);
      process.exit(1);
    }

    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;
    console.log('✓ Access token obtained successfully\n');

  } catch (error) {
    console.error('❌ Token exchange failed:', error.message);
    process.exit(1);
  }

  // Step 2: Test API call with access token
  try {
    const payload = {
      messages: [
        {
          role: 'system',
          content: 'You are Granite, an AI language model developed by IBM. You are helpful and concise.'
        },
        {
          role: 'user',
          content: 'Say "Hello! Connection successful." and nothing else.'
        }
      ],
      project_id: projectId,
      model_id: modelId,
      max_tokens: 50,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    console.log('📡 Sending test request to IBM Granite...\n');

    const response = await fetch(endpoint, {
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
      console.error(`❌ API Error (${response.status}):`, errorText);
      process.exit(1);
    }

    const data = await response.json();
    
    console.log('✅ Connection Successful!\n');
    console.log('Response from Granite:');
    console.log('─────────────────────────────────────');
    console.log(data.choices?.[0]?.message?.content || 'No response content');
    console.log('─────────────────────────────────────\n');
    
    if (data.usage) {
      console.log('Token Usage:');
      console.log(`  Prompt tokens: ${data.usage.prompt_tokens}`);
      console.log(`  Completion tokens: ${data.usage.completion_tokens}`);
      console.log(`  Total tokens: ${data.usage.total_tokens}\n`);
    }

    console.log('🎉 All systems ready for code generation!\n');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

// Run test
testGraniteAPI();
