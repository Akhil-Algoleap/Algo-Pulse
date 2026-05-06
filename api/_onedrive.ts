import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

// Credentials from Vercel Environment Variables
const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const DRIVE_ID = process.env.ONEDRIVE_DRIVE_ID;
const ITEM_ID = process.env.ONEDRIVE_ITEM_ID; // The ID of database.xlsx

const REFRESH_TOKEN = process.env.ONEDRIVE_REFRESH_TOKEN;

// Validation
if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !DRIVE_ID || !ITEM_ID || !REFRESH_TOKEN) {
  console.error('[OneDrive] CRITICAL: Missing one or more environment variables!');
  console.log('Available keys:', Object.keys(process.env).filter(k => k.startsWith('AZURE') || k.startsWith('ONEDRIVE')));
}



export const getAccessToken = async () => {
  if (!REFRESH_TOKEN) throw new Error('ONEDRIVE_REFRESH_TOKEN is missing');
  
  console.log('[OneDrive] Swapping refresh token via direct API call...');
  
  try {
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID!);
    params.append('client_secret', CLIENT_SECRET!);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', REFRESH_TOKEN);
    params.append('scope', 'https://graph.microsoft.com/Files.ReadWrite offline_access');

    const response = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(`${data.error}: ${data.error_description}`);
    }

    console.log('[OneDrive] Token swapped successfully');
    return data.access_token;
  } catch (err: any) {
    console.error('[OneDrive] Token swap failed:', err.message);
    throw err;
  }
};

export const getGraphClient = async () => {
  const token = await getAccessToken();
  return Client.init({
    authProvider: (done) => done(null, token!),
  });
};

/**
 * Excel Helper Functions
 * We assume each sheet has a Table named after the sheet (e.g. "EmployeesTable")
 */

export const getTableRows = async (tableName: string) => {
  console.log(`[OneDrive] Fetching rows for table: ${tableName}`);
  const client = await getGraphClient();
  const res = await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/rows`).get();
  
  console.log(`[OneDrive] Found ${res.value?.length || 0} rows`);
  // Map row values to objects using column names
  const columns = await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/columns`).get();
  const columnNames = columns.value.map((c: any) => c.name);
  
  return res.value.map((row: any) => {
    const obj: any = {};
    row.values[0].forEach((val: any, idx: number) => {
      obj[columnNames[idx]] = val;
    });
    return obj;
  });
};

export const addTableRow = async (tableName: string, data: any) => {
  const client = await getGraphClient();
  
  // Get column order
  const columns = await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/columns`).get();
  const columnNames = columns.value.map((c: any) => c.name);
  
  const values = [columnNames.map((name: string) => {
    // Try different naming conventions
    const val = data[name] || 
                data[name.toLowerCase()] || 
                data[name.toLowerCase().replace(' ', '_')] ||
                data[name.toLowerCase().replace('_id', '')] ||
                data[name.toLowerCase().replace(' ', '_') + '_id'];
    return val || '';
  })];
  
  const res = await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/rows`).post({
    values
  });
  return res;
};

export const updateTableRow = async (tableName: string, id: string, data: any) => {
  const client = await getGraphClient();
  
  // 1. Find the row index by searching for the ID in the 'id' column
  const rows = await getTableRows(tableName);
  const rowIndex = rows.findIndex((r: any) => r.id?.toString() === id.toString());
  
  if (rowIndex === -1) throw new Error(`Row with ID ${id} not found`);
  
  // 2. Get column order
  const columns = await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/columns`).get();
  const columnNames = columns.value.map((c: any) => c.name);
  
  // 3. Prepare updated values
  const updatedRow = { ...rows[rowIndex], ...data };
  const values = [columnNames.map((name: string) => {
    const val = updatedRow[name] || 
                updatedRow[name.toLowerCase()] || 
                updatedRow[name.toLowerCase().replace(' ', '_')] ||
                updatedRow[name.toLowerCase().replace('_id', '')] ||
                updatedRow[name.toLowerCase().replace(' ', '_') + '_id'];
    return val || '';
  })];
  
  // 4. Update the specific row
  await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/rows/itemAt(index=${rowIndex})`).patch({
    values
  });
  
  return updatedRow;
};

export const deleteTableRow = async (tableName: string, id: string) => {
  const client = await getGraphClient();
  const rows = await getTableRows(tableName);
  const rowIndex = rows.findIndex((r: any) => r.id?.toString() === id.toString());
  
  if (rowIndex === -1) throw new Error(`Row with ID ${id} not found`);
  
  await client.api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/tables/${tableName}/rows/itemAt(index=${rowIndex})`).delete();
};
