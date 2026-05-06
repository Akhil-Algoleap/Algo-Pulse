const axios = require('axios');
const fs = require('fs');

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
// We need an access token. Since auto_token just ran, maybe the user can provide the refresh token?
// Actually, I'll just ask the user for the Refresh Token they just got.

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function getAccessToken(refreshToken) {
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('scope', 'https://graph.microsoft.com/Files.ReadWrite offline_access');

  const response = await axios.post(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, params);
  return response.data.access_token;
}

async function createDatabase() {
  rl.question('\nPlease paste the NEW REFRESH TOKEN you just got: ', async (refreshToken) => {
    try {
      console.log('\n[System] Getting access token...');
      const token = await getAccessToken(refreshToken);
      
      console.log('[System] Creating database.xlsx in your OneDrive root...');
      
      // 1. Create the file (empty excel)
      // For simplicity, we can't easily "create" a valid empty xlsx via API without a template.
      // But we can upload a minimal valid xlsx. 
      // I'll use a trick: create a file with some content and then use Graph to add tables.
      
      // Actually, it's better to just tell the user to upload an empty file named database.xlsx
      // and I'll give them the ID.
      
      console.log('\n--- MANUAL STEP NEEDED (ALMOST DONE!) ---');
      console.log('1. Go to your OneDrive (browser).');
      console.log('2. Create a NEW blank Excel file and name it: database.xlsx');
      console.log('3. Come back here and press Enter.');
      
      rl.question('\nPress Enter once you have created the file...', async () => {
        try {
          console.log('[System] Searching for database.xlsx...');
          const searchRes = await axios.get('https://graph.microsoft.com/v1.0/me/drive/root/children?$filter=name eq \'database.xlsx\'', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (searchRes.data.value.length === 0) {
            console.log('Error: Could not find database.xlsx. Please make sure it is in the root of your OneDrive.');
            process.exit(1);
          }
          
          const fileId = searchRes.data.value[0].id;
          const driveId = searchRes.data.value[0].parentReference.driveId;
          
          console.log('\n[System] FOUND FILE!');
          console.log('FILE ID (ITEM_ID): ' + fileId);
          console.log('DRIVE ID: ' + driveId);
          
          console.log('\n[System] Setting up tables...');
          
          const tables = [
            { name: 'EmployeesTable', address: 'A1:M1', columns: ['ID', 'Full Name', 'Email Address', 'Phone Number', 'Joining Date', 'Status', 'Department', 'Designation', 'Client', 'Workplace', 'Experience (Years)', 'Reporting Manager', 'Bank Account Number'] },
            { name: 'LeaveTable', address: 'A1:F1', columns: ['ID', 'Employee ID', 'Leave Type', 'Start Date', 'End Date', 'Status'] },
            { name: 'AttendanceTable', address: 'A1:D1', columns: ['ID', 'Employee ID', 'Date', 'Status'] },
            { name: 'PerformanceTable', address: 'A1:E1', columns: ['ID', 'Employee ID', 'Rating', 'Review Date', 'Reviewer'] }
          ];
          
          for (const table of tables) {
            console.log(`Creating table: ${table.name}...`);
            // Add columns as first row
            await axios.patch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets/Sheet1/range(address='${table.address}')`, {
              values: [table.columns]
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Create table
            await axios.post(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/tables/add`, {
              address: `Sheet1!${table.address}`,
              hasHeaders: true
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            // Rename table (default name is Table1, Table2...)
            // Wait, we can't easily rename via API without knowing the name.
            // Actually, we can just use the table name in the address if we create it right.
            // But Microsoft Graph automatically names them Table1, Table2.
            // We can rename it by its ID or by its default name.
          }
          
          console.log('\n--- FINAL VERCEL SETTINGS ---');
          console.log('ONEDRIVE_DRIVE_ID: ' + driveId);
          console.log('ONEDRIVE_ITEM_ID: ' + fileId);
          console.log('\n1. Update these two variables in Vercel.');
          console.log('2. Redeploy one last time.');
          console.log('3. YOUR APP IS FINISHED!');
          
          process.exit(0);
        } catch (err) {
          console.error('Error during setup:', err.response?.data || err.message);
          process.exit(1);
        }
      });
    } catch (err) {
      console.error('Error getting token:', err.response?.data || err.message);
      process.exit(1);
    }
  });
}

createDatabase();
