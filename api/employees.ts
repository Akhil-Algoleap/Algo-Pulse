import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow, updateTableRow, deleteTableRow } from './_onedrive';

const TABLE_NAME = 'EmployeesTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const method = req.method;

  try {
    if (method === 'GET') {
      const data = await getTableRows(TABLE_NAME);
      return res.status(200).json({ data });
    }

    if (method === 'POST') {
      const rows = await getTableRows(TABLE_NAME);
      const maxId = rows.reduce((max: number, emp: any) => {
        const idNum = parseInt(emp.id);
        return isNaN(idNum) ? max : Math.max(max, idNum);
      }, 0);
      
      const newItem = { ...req.body, id: (maxId + 1).toString() };
      await addTableRow(TABLE_NAME, newItem);
      return res.status(201).json({ data: newItem });
    }

    if (method === 'PUT' && id) {
      const updatedItem = await updateTableRow(TABLE_NAME, id.toString(), req.body);
      return res.status(200).json({ data: updatedItem });
    }

    if (method === 'DELETE' && id) {
      await deleteTableRow(TABLE_NAME, id.toString());
      return res.status(200).json({ message: 'Deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal Server Error',
      details: error.response?.data || error.stack
    });
  }
}
