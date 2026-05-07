import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to read Excel data
const readExcel = (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`[ExcelBackend] File not found: ${filePath}`);
      return {};
    }
    const buf = fs.readFileSync(filePath);
    const workbook = XLSX.read(buf, { type: 'buffer' });
    const data: any = {};
    workbook.SheetNames.forEach(sheetName => {
      data[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });
    return data;
  } catch (err) {
    console.error('[ExcelBackend] Error reading excel:', err);
    return {};
  }
};

// Helper to write Excel data
const writeExcel = (filePath: string, data: any) => {
  try {
    const workbook = XLSX.utils.book_new();
    Object.keys(data).forEach(sheetName => {
      const worksheet = XLSX.utils.json_to_sheet(data[sheetName]);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(filePath, buf);
    console.log(`[ExcelBackend] Successfully wrote to ${filePath}`);
  } catch (err) {
    console.error('[ExcelBackend] Error writing excel:', err);
    throw err;
  }
};

const excelBackendPlugin = () => ({
  name: 'excel-backend',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      try {
        if (req.url.startsWith('/api/')) {
          console.log(`[ExcelBackend] Request: ${req.method} ${req.url}`);
          const dbPath = path.resolve(__dirname, 'database.xlsx');
          const db = readExcel(dbPath);
          
          const url = new URL(req.url, `http://${req.headers.host}`);
          const fullPath = url.pathname.replace('/api/', '');
          const urlParts = fullPath.split('/');
          const resource = urlParts[0];
          const id = urlParts[1] || url.searchParams.get('id');
          const method = req.method;

          // Set common headers
          res.setHeader('Content-Type', 'application/json');

          // --- LOOKUPS (Unified Endpoint) ---
          if (resource === 'lookups') {
            const type = url.searchParams.get('type');
            const sheetMap: any = {
              'departments': 'Departments',
              'designations': 'Designations',
              'clients': 'Clients',
              'workplaces': 'Workplaces'
            };
            
            if (!type || !sheetMap[type]) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid lookup type' }));
              return;
            }

            const sheetName = sheetMap[type];

            if (method === 'GET') {
              res.end(JSON.stringify({ data: db[sheetName] || [] }));
              return;
            }

            if (method === 'POST') {
              let body = '';
              req.on('data', (chunk: any) => body += chunk);
              req.on('end', () => {
                try {
                  const newItem = JSON.parse(body);
                  const items = db[sheetName] || [];
                  const maxId = items.reduce((max: number, item: any) => {
                    const idNum = parseInt(item.id);
                    return isNaN(idNum) ? max : Math.max(max, idNum);
                  }, 0);
                  newItem.id = (maxId + 1).toString();
                  db[sheetName] = [...items, newItem];
                  writeExcel(dbPath, db);
                  res.end(JSON.stringify({ data: newItem }));
                } catch (err: any) {
                  res.statusCode = err.code === 'EBUSY' ? 423 : 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }

          // --- EMPLOYEES ---
          if (resource === 'employees') {
            if (method === 'GET') {
              res.end(JSON.stringify({ data: db.Employees || [] }));
              return;
            }

            if (method === 'POST') {
              let body = '';
              req.on('data', (chunk: any) => body += chunk);
              req.on('end', () => {
                try {
                  const newItem = JSON.parse(body);
                  const employees = db.Employees || [];
                  const maxId = employees.reduce((max: number, emp: any) => {
                    const idNum = parseInt(emp.id);
                    return isNaN(idNum) ? max : Math.max(max, idNum);
                  }, 0);
                  newItem.id = (maxId + 1).toString();
                  db.Employees = [...employees, newItem];
                  writeExcel(dbPath, db);
                  res.end(JSON.stringify({ data: newItem }));
                } catch (err: any) {
                  res.statusCode = err.code === 'EBUSY' ? 423 : 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }

            if (method === 'PUT' && id) {
              let body = '';
              req.on('data', (chunk: any) => body += chunk);
              req.on('end', () => {
                try {
                  const updatedItem = JSON.parse(body);
                  const employees = db.Employees || [];
                  db.Employees = employees.map((emp: any) => emp.id.toString() === id.toString() ? { ...emp, ...updatedItem, id } : emp);
                  writeExcel(dbPath, db);
                  res.end(JSON.stringify({ data: updatedItem }));
                } catch (err: any) {
                  res.statusCode = err.code === 'EBUSY' ? 423 : 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }

            if (method === 'DELETE' && id) {
              try {
                const employees = db.Employees || [];
                db.Employees = employees.filter((emp: any) => emp.id.toString() !== id.toString());
                writeExcel(dbPath, db);
                res.end(JSON.stringify({ message: 'Deleted successfully' }));
              } catch (err: any) {
                res.statusCode = err.code === 'EBUSY' ? 423 : 500;
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            }
          }

          // --- DOCUMENTS ---
          if (resource === 'documents') {
            if (method === 'GET') {
              const allDocs = db.Documents || [];
              if (id) {
                res.end(JSON.stringify({ data: allDocs.filter((d: any) => d.employee_id.toString() === id.toString()) }));
              } else {
                res.end(JSON.stringify({ data: allDocs }));
              }
              return;
            }
          }

          // --- PERFORMANCE ---
          if (resource === 'performance') {
            if (method === 'GET') {
              res.end(JSON.stringify({ data: db.Performance || [] }));
              return;
            }

            if (method === 'POST') {
              let body = '';
              req.on('data', (chunk: any) => body += chunk);
              req.on('end', () => {
                try {
                  const newItem = JSON.parse(body);
                  const perfRecords = db.Performance || [];
                  const maxId = perfRecords.reduce((max: number, r: any) => {
                    const idNum = parseInt(r.id);
                    return isNaN(idNum) ? max : Math.max(max, idNum);
                  }, 0);
                  newItem.id = (maxId + 1).toString();
                  db.Performance = [...perfRecords, newItem];
                  writeExcel(dbPath, db);
                  res.end(JSON.stringify({ data: newItem }));
                } catch (err: any) {
                  res.statusCode = err.code === 'EBUSY' ? 423 : 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }
          // --- ASSETS ---
          if (resource === 'assets' && method === 'GET') {
            const employees = db.Employees || [];
            res.end(JSON.stringify({ data: employees }));
            return;
          }

          // --- ATTENDANCE ---
          if (resource === 'attendance') {
            if (method === 'GET') {
              res.end(JSON.stringify({ data: db.Attendance || [] }));
              return;
            }

            if (method === 'POST') {
              let body = '';
              req.on('data', (chunk: any) => body += chunk);
              req.on('end', () => {
                try {
                  const newItem = JSON.parse(body);
                  const attendance = db.Attendance || [];
                  const maxId = attendance.reduce((max: number, att: any) => {
                    const idNum = parseInt(att.id.toString().replace('att', ''));
                    return isNaN(idNum) ? max : Math.max(max, idNum);
                  }, 0);
                  newItem.id = (maxId + 1).toString();
                  db.Attendance = [...attendance, newItem];
                  writeExcel(dbPath, db);
                  res.end(JSON.stringify({ data: newItem }));
                } catch (err: any) {
                  res.statusCode = err.code === 'EBUSY' ? 423 : 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }
          
          // Fallback for other /api calls
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
          return;
        }
      } catch (globalErr: any) {
        console.error('[ExcelBackend] Global middleware error:', globalErr);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), excelBackendPlugin()],
})
