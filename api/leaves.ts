import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow, updateTableRow } from './_onedrive.js';

const TABLE_NAME = 'LeavesTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;

  try {
    if (method === 'GET') {
      const data = await getTableRows(TABLE_NAME);
      return res.status(200).json({ data });
    }

    if (method === 'POST') {
      const rows = await getTableRows(TABLE_NAME);
      const maxId = rows.reduce((max: number, leave: any) => {
        const idNum = parseInt(leave.id?.toString() || '0');
        return isNaN(idNum) ? max : Math.max(max, idNum);
      }, 0);
      
      const newItem = { 
        ...req.body, 
        id: (maxId + 1).toString(),
        status: 'Pending',
        applied_at: new Date().toISOString()
      };
      await addTableRow(TABLE_NAME, newItem);
      return res.status(201).json({ data: newItem });
    }

    if (method === 'PUT') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      
      const updatedItem = await updateTableRow(TABLE_NAME, id.toString(), req.body);
      return res.status(200).json({ data: updatedItem });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
