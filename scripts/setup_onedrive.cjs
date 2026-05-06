const msal = require('@azure/msal-node');
const axios = require('axios');
const readline = require('readline');

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
  console.log('Error: Please set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET environment variables before running this script.');
  console.log('Example: $env:AZURE_CLIENT_SECRET="your_secret"; node scripts/setup_onedrive.cjs');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    clientSecret: CLIENT_SECRET,
  }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

async function setup() {
  const authCodeUrlParameters = {
    scopes: ["https://graph.microsoft.com/Files.ReadWrite", "offline_access"],
    redirectUri: "http://localhost:3000",
  };

  const url = await pca.getAuthCodeUrl(authCodeUrlParameters);
  
  console.log('\n1. Open this URL in your browser and log in:');
  console.log(url);
  console.log('\n2. After login, you will be redirected to a page that fails to load (localhost:3000).');
  
  rl.question('3. Copy the entire URL of that failed page and paste it here: ', async (responseUrl) => {
    try {
      const urlObj = new URL(responseUrl);
      const code = urlObj.searchParams.get('code');
      
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('code', code);
      params.append('grant_type', 'authorization_code');
      params.append('redirect_uri', 'http://localhost:3000');
      params.append('scope', 'https://graph.microsoft.com/Files.ReadWrite offline_access');

      const response = await axios.post(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, params);

      if (response.data.refresh_token) {
        console.log('\n--- SUCCESS! ---');
        console.log('NEW REFRESH TOKEN:\n');
        console.log(response.data.refresh_token);
        console.log('\nCopy the ENTIRE token above and update your Vercel ONEDRIVE_REFRESH_TOKEN variable.');
      } else {
        console.log('\n--- ERROR ---');
        console.log('No refresh token received. Make sure you checked "Consent on behalf of organization" if asked.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
    rl.close();
  });
}

setup();
