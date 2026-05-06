import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows } from './_onedrive';

const TABLE_NAME = 'DocumentsTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const method = req.method;
  const { employeeId } = req.query;

  try {
    if (method === 'GET') {
      let data = await getTableRows(TABLE_NAME);
      if (employeeId) {
        data = data.filter((d: any) => d.employee_id === employeeId);
      }
      return res.status(200).json({ data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
