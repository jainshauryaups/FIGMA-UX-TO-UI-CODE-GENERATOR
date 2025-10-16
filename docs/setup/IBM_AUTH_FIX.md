# IBM Granite API - Authentication Issue

## ❌ Current Problem

Your IBM API key appears to be an **API key**, but IBM's chat endpoint requires an **access token** (Bearer token).

## 🔑 How to Get the Correct Access Token

### Option 1: Generate Access Token from API Key (Recommended)

IBM requires a 2-step authentication:
1. Exchange your API key for an IAM access token
2. Use that access token in requests

Run this command to get your access token:

```bash
curl -X POST "https://iam.cloud.ibm.com/identity/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=YOUR_IBM_API_KEY_HERE"
```

**PowerShell version:**
```powershell
$apiKey = "YOUR_IBM_API_KEY_HERE"
$response = Invoke-RestMethod -Uri "https://iam.cloud.ibm.com/identity/token" -Method Post -Body @{
    grant_type = "urn:ibm:params:oauth:grant-type:apikey"
    apikey = $apiKey
} -ContentType "application/x-www-form-urlencoded"
$response.access_token
```

This will return JSON with an `access_token` field. **Copy that token.**

---

### Option 2: Use IBM Cloud CLI

```bash
# Install IBM Cloud CLI
# Then login and get token:
ibmcloud login --apikey YOUR_IBM_API_KEY_HERE
ibmcloud iam oauth-tokens
```

---

## 🔧 Update Your .env File

Once you have the access token, update `.env`:

```properties
# Replace API key with access token
IBM_GRANITE_API_KEY=<your_access_token_here>

# It will look something like:
# IBM_GRANITE_API_KEY=eyJraWQiOiIyMDI0MTExNDE4MzAiLCJhbGciOiJSUzI1NiJ9...
```

**Note:** Access tokens expire (usually after 1 hour). You'll need to refresh them or implement automatic token refresh in the code.

---

## 💡 Alternative: Automatic Token Refresh

I can update the service to automatically exchange your API key for an access token before each request. This way you keep the API key in `.env` and the service handles token management.

Would you like me to implement automatic token refresh?

---

## 🚀 Quick Test

After getting your access token, test again:

```bash
npm run figma:test
```

Expected output:
```
✅ Connection Successful!
Response from Granite:
─────────────────────────────────────
Hello! Connection successful.
─────────────────────────────────────
```

---

## 📝 Next Steps

1. **Get Access Token** (use PowerShell command above)
2. **Update .env** with the access token  
3. **Test Connection** (`npm run figma:test`)
4. **OR**: I can implement automatic token refresh for you

Let me know which approach you prefer!
