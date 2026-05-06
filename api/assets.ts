import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow, updateTableRow } from './_onedrive';

const TABLE_NAME = 'AssetsTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;

  try {
    if (method === 'GET') {
      const data = await getTableRows(TABLE_NAME);
      return res.status(200).json({ data });
    }

    if (method === 'POST') {
      // Handle assignment or creation
      const { assetId, employeeId } = req.body;
      if (employeeId) {
        // Assignment logic
        const updated = await updateTableRow(TABLE_NAME, assetId, { 
            assigned_to: employeeId,
            status: 'Assigned',
            last_action_date: new Date().toISOString()
        });
        return res.status(200).json({ data: updated });
      }
      
      const newItem = { ...req.body, id: Date.now().toString() };
      await addTableRow(TABLE_NAME, newItem);
      return res.status(201).json({ data: newItem });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
