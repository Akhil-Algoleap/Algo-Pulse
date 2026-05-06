import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow } from './_onedrive';

const TABLE_MAP: any = {
  'departments': 'DepartmentsTable',
  'designations': 'DesignationsTable',
  'clients': 'ClientsTable',
  'workplaces': 'WorkplacesTable'
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;
  const { type } = req.query; // e.g. /api/lookups?type=departments

  if (!type || !TABLE_MAP[type.toString()]) {
    return res.status(400).json({ error: 'Invalid lookup type' });
  }

  const tableName = TABLE_MAP[type.toString()];

  try {
    if (method === 'GET') {
      const data = await getTableRows(tableName);
      return res.status(200).json({ data });
    }

    if (method === 'POST') {
      const rows = await getTableRows(tableName);
      const maxId = rows.reduce((max: number, item: any) => {
        const idNum = parseInt(item.id || '0');
        return isNaN(idNum) ? max : Math.max(max, idNum);
      }, 0);
      
      const newItem = { ...req.body, id: (maxId + 1).toString() };
      await addTableRow(tableName, newItem);
      return res.status(201).json({ data: newItem });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
