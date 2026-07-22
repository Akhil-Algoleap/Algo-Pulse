import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTableRows, addTableRow, updateTableRow } from './_onedrive.js';

const EMPLOYEES_TABLE = 'EmployeesTable';
const ATTENDANCE_TABLE = 'AttendanceTable';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support eSSL ADMS GET handshake
  if (req.method === 'GET') {
    return res.status(200).send('OK');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const rawEmpId = (body.employee_id || body.employee_id_code || body.PIN || body.userId || '').toString().trim();
    
    if (!rawEmpId) {
      return res.status(400).json({ error: 'employee_id is required' });
    }

    const timestampStr = body.timestamp || body.Stamp || new Date().toISOString();
    const punchDateObj = new Date(timestampStr);
    const isValidDate = !isNaN(punchDateObj.getTime());
    const finalDateObj = isValidDate ? punchDateObj : new Date();
    
    // Format YYYY-MM-DD
    const todayDate = finalDateObj.toISOString().split('T')[0];
    const timestampIso = finalDateObj.toISOString();

    // 1. Fetch employees to match employee_id code
    const employees = await getTableRows(EMPLOYEES_TABLE);
    const matchedEmp = employees.find((emp: any) => 
      (emp.employee_id && emp.employee_id.toString().trim().toLowerCase() === rawEmpId.toLowerCase()) ||
      (emp.id && emp.id.toString().trim().toLowerCase() === rawEmpId.toLowerCase())
    );

    const matchedEmpIdCode = matchedEmp?.employee_id || matchedEmp?.id || rawEmpId;
    const matchedEmpId = matchedEmp?.id || rawEmpId;
    const matchedName = matchedEmp?.employee_name || `Employee ${rawEmpId}`;

    // 2. Fetch attendance logs for today
    const attendanceLogs = await getTableRows(ATTENDANCE_TABLE);
    
    const existingLog = attendanceLogs.find((log: any) => 
      (log.date === todayDate) &&
      (
        (log.employee_id_code && log.employee_id_code.toString().trim().toLowerCase() === matchedEmpIdCode.toLowerCase()) ||
        (log.employee_id && log.employee_id.toString().trim().toLowerCase() === matchedEmpId.toLowerCase()) ||
        (log.employee_id_code && log.employee_id_code.toString().trim().toLowerCase() === rawEmpId.toLowerCase())
      )
    );

    if (!existingLog) {
      // FIRST SWIPE OF THE DAY -> CLOCK IN
      // Calculate 9:30 AM cutoff
      const hours = finalDateObj.getHours();
      const minutes = finalDateObj.getMinutes();
      const punchMinutes = hours * 60 + minutes;
      const cutoffMinutes = 9 * 60 + 30; // 9:30 AM
      const status = punchMinutes > cutoffMinutes ? 'Late' : 'Present';

      const maxId = attendanceLogs.reduce((max: number, att: any) => {
        const idNum = parseInt(att.id?.toString().replace('att', '') || '0');
        return isNaN(idNum) ? max : Math.max(max, idNum);
      }, 0);

      const newItem = {
        id: `att${maxId + 1}`,
        employee_id: matchedEmpId,
        employee_name: matchedName,
        employee_id_code: matchedEmpIdCode,
        date: todayDate,
        clock_in: timestampIso,
        clock_out: '',
        total_hours: 0,
        status: status
      };

      await addTableRow(ATTENDANCE_TABLE, newItem);
      return res.status(200).json({
        success: true,
        action: 'clock_in',
        data: newItem,
        message: `Clocked IN for ${matchedName} (${status})`
      });
    } else {
      // SUBSEQUENT SWIPE OF THE DAY -> CLOCK OUT
      const inTime = new Date(existingLog.clock_in).getTime();
      const outTime = finalDateObj.getTime();
      const diffMs = outTime - inTime;
      const totalHours = diffMs > 0 ? parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2)) : 0;

      const updatedFields = {
        clock_out: timestampIso,
        total_hours: totalHours
      };

      const updatedRecord = await updateTableRow(ATTENDANCE_TABLE, existingLog.id, updatedFields);
      return res.status(200).json({
        success: true,
        action: 'clock_out',
        data: updatedRecord,
        message: `Clocked OUT for ${matchedName} (${totalHours}h)`
      });
    }
  } catch (error: any) {
    console.error('eSSL API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
