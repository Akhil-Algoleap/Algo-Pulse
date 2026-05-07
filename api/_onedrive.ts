import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

// Credentials from Vercel Environment Variables
const TENANT_ID = process.env.AZURE_TENANT_ID?.trim();
const CLIENT_ID = process.env.AZURE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET?.trim();
const DRIVE_ID = process.env.ONEDRIVE_DRIVE_ID?.trim();
const ITEM_ID = process.env.ONEDRIVE_ITEM_ID?.trim();
const REFRESH_TOKEN = process.env.ONEDRIVE_REFRESH_TOKEN?.trim();

// Map table names to sheet names
const SHEET_MAP: Record<string, string> = {
  'EmployeesTable': 'Employees',
  'AssetsTable': 'Assets',
  'AttendanceTable': 'Attendance',
  'PerformanceTable': 'Performance',
  'DocumentsTable': 'Documents',
  'DepartmentsTable': 'Departments',
  'DesignationsTable': 'Designations',
  'ClientsTable': 'Clients',
  'WorkplacesTable': 'Workplaces',
};

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET || !DRIVE_ID || !ITEM_ID || !REFRESH_TOKEN) {
  console.error('[OneDrive] CRITICAL: Missing one or more environment variables!');
}

export const getAccessToken = async () => {
  if (!REFRESH_TOKEN) throw new Error('ONEDRIVE_REFRESH_TOKEN is missing');
  
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
  if (data.error) throw new Error(`${data.error}: ${data.error_description}`);
  return data.access_token;
};

export const getGraphClient = async () => {
  const token = await getAccessToken();
  return Client.init({
    authProvider: (done) => done(null, token!),
  });
};

// ─── Sheet-based helpers ────────────────────────────────────────────────────

const getSheetName = (tableName: string) => {
  const sheet = SHEET_MAP[tableName];
  if (!sheet) throw new Error(`Unknown table name: ${tableName}`);
  return sheet;
};

// Convert 0-based column index to Excel column letters (A, B, ..., Z, AA, AB, ...)
const colToLetter = (col: number): string => {
  let letter = '';
  col += 1; // 1-based
  while (col > 0) {
    const rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
};

/**
 * Read all rows from a worksheet (first row = headers)
 */
export const getTableRows = async (tableName: string): Promise<any[]> => {
  const sheetName = getSheetName(tableName);
  const client = await getGraphClient();
  
  // Get used range
  const res = await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/usedRange`)
    .get();

  const values: any[][] = res.values;
  if (!values || values.length < 2) return [];

  const headers: string[] = values[0];
  return values.slice(1).map((row) => {
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
    return obj;
  });
};

/**
 * Append a new row to a worksheet
 */
export const addTableRow = async (tableName: string, data: any): Promise<any> => {
  const sheetName = getSheetName(tableName);
  const client = await getGraphClient();

  // Get headers from first row
  const headerRes = await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/usedRange`)
    .get();

  const values: any[][] = headerRes.values;
  if (!values || values.length === 0) throw new Error(`Sheet "${sheetName}" is empty`);

  const headers: string[] = values[0];
  const newRow = headers.map((h) => data[h] ?? '');

  // Find next empty row (usedRange row count + 1)
  const nextRow = values.length + 1; // 1-indexed

  // Write to the next row
  const endCol = colToLetter(headers.length - 1);
  const range = `A${nextRow}:${endCol}${nextRow}`;

  await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/range(address='${range}')`)
    .patch({ values: [newRow] });

  return data;
};

/**
 * Update an existing row by matching the 'id' column
 */
export const updateTableRow = async (tableName: string, id: string, data: any): Promise<any> => {
  const sheetName = getSheetName(tableName);
  const client = await getGraphClient();

  const res = await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/usedRange`)
    .get();

  const values: any[][] = res.values;
  if (!values || values.length < 2) throw new Error('Sheet is empty');

  const headers: string[] = values[0];
  const idIdx = headers.indexOf('id');
  if (idIdx === -1) throw new Error('No "id" column found');

  const rowIdx = values.findIndex((row, i) => i > 0 && row[idIdx]?.toString() === id.toString());
  if (rowIdx === -1) throw new Error(`Row with id ${id} not found`);

  const existingObj: any = {};
  headers.forEach((h, i) => { existingObj[h] = values[rowIdx][i] ?? ''; });

  const merged = { ...existingObj, ...data };
  const newRow = headers.map((h) => merged[h] ?? '');

  const excelRow = rowIdx + 1; // 1-indexed
  const endCol = colToLetter(headers.length - 1);
  const range = `A${excelRow}:${endCol}${excelRow}`;

  await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/range(address='${range}')`)
    .patch({ values: [newRow] });

  return merged;
};

/**
 * Delete a row by matching the 'id' column
 */
export const deleteTableRow = async (tableName: string, id: string): Promise<void> => {
  const sheetName = getSheetName(tableName);
  const client = await getGraphClient();

  const res = await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/usedRange`)
    .get();

  const values: any[][] = res.values;
  if (!values || values.length < 2) throw new Error('Sheet is empty');

  const headers: string[] = values[0];
  const idIdx = headers.indexOf('id');
  if (idIdx === -1) throw new Error('No "id" column found');

  const rowIdx = values.findIndex((row, i) => i > 0 && row[idIdx]?.toString() === id.toString());
  if (rowIdx === -1) throw new Error(`Row with id ${id} not found`);

  const excelRow = rowIdx + 1; // 1-indexed

  // Delete the row by shifting rows up
  await client
    .api(`/drives/${DRIVE_ID}/items/${ITEM_ID}/workbook/worksheets/${encodeURIComponent(sheetName)}/range(address='${excelRow}:${excelRow}')/delete`)
    .post({ shift: 'Up' });
};
