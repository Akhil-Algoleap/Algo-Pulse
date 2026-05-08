import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow, updateTableRow } from './_onedrive.js';

const TABLE_NAME = 'AssetsTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    if (method === 'GET') {
      const data = await getTableRows(TABLE_NAME);
      return res.status(200).json({ data });
    }

    if (method === 'POST') {
      const newItem = { ...req.body };
      await addTableRow(TABLE_NAME, newItem);
      return res.status(201).json({ data: newItem });
    }

    if (method === 'PUT' && id) {
      const updatedItem = await updateTableRow(TABLE_NAME, id.toString(), req.body, 'employee_id');
      return res.status(200).json({ data: updatedItem });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
