const http = require('http');
const axios = require('axios');
const { exec } = require('child_process');

// REPLACE THESE WITH YOUR OWN AZURE APP CREDENTIALS
const TENANT_ID = "efe60221-cdd1-4867-aacd-c78966781692";
const CLIENT_ID = "06ce5be0-ca62-4ba3-81be-3c5c23623107";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET_HERE";
const REDIRECT_URI = "http://localhost:3000";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');

  if (code) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Success!</h1><p>You can close this window now. Check your terminal for the token.</p>');
    
    console.log('\n[System] Code received. Swapping for refresh token...');
    
    try {
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('code', code);
      params.append('grant_type', 'authorization_code');
      params.append('redirect_uri', REDIRECT_URI);
      params.append('scope', 'https://graph.microsoft.com/Files.ReadWrite offline_access');

      const response = await axios.post(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, params);
      
      console.log('\n--- COPY THIS ENTIRE TOKEN BELOW ---');
      console.log(response.data.refresh_token);
      console.log('-------------------------------------\n');
      console.log('1. Copy the token above (it is very long!).');
      console.log('2. Paste it into Vercel ONEDRIVE_REFRESH_TOKEN.');
      console.log('3. REDEPLOY in Vercel.');
      
      process.exit(0);
    } catch (err) {
      console.error('Error swapping token:', err.response?.data || err.message);
      process.exit(1);
    }
  } else {
    res.writeHead(400);
    res.end('No code found');
  }
});

server.listen(3000, () => {
  const authUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent('https://graph.microsoft.com/Files.ReadWrite offline_access')}`;
  
  console.log('\n[System] Web server started on port 3000.');
  console.log('[System] Opening your browser automatically...');
  
  exec(`start "" "${authUrl}"`);
});
