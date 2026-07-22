const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.xlsx');

if (!fs.existsSync(dbPath)) {
  console.error('database.xlsx not found at:', dbPath);
  process.exit(1);
}

const buf = fs.readFileSync(dbPath);
const workbook = XLSX.read(buf, { type: 'buffer' });

if (!workbook.Sheets['Attendance']) {
  console.error('Attendance sheet not found in database.xlsx');
  process.exit(1);
}

const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets['Attendance']);

const updatedRows = rawRows.map(row => {
  return {
    id: row.id || '',
    employee_id: row.employee_id || '',
    employee_name: row.employee_name || '',
    employee_id_code: row.employee_id_code || row.employee_id || '',
    date: row.date || '',
    clock_in: row.clock_in || '',
    clock_out: row.clock_out !== undefined ? row.clock_out : '',
    total_hours: row.total_hours !== undefined ? row.total_hours : 0,
    status: row.status || 'Present'
  };
});

const newSheet = XLSX.utils.json_to_sheet(updatedRows, {
  header: ['id', 'employee_id', 'employee_name', 'employee_id_code', 'date', 'clock_in', 'clock_out', 'total_hours', 'status']
});

workbook.Sheets['Attendance'] = newSheet;

const outBuf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync(dbPath, outBuf);

console.log('Successfully migrated database.xlsx Attendance sheet structure with clock_out and total_hours.');
