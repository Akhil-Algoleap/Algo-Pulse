import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow } from './_onedrive';

const TABLE_NAME = 'PerformanceTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;

  try {
    if (method === 'GET') {
      const data = await getTableRows(TABLE_NAME);
      return res.status(200).json({ data });
    }

    if (method === 'POST') {
      const rows = await getTableRows(TABLE_NAME);
      const maxId = rows.reduce((max: number, r: any) => {
        const idNum = parseInt(r.id || '0');
        return isNaN(idNum) ? max : Math.max(max, idNum);
      }, 0);
      
      const newItem = { ...req.body, id: (maxId + 1).toString() };
      await addTableRow(TABLE_NAME, newItem);
      return res.status(201).json({ data: newItem });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
