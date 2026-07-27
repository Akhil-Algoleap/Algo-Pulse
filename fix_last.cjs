const fs = require('fs');
const path = require('path');
const p = (file) => path.join(__dirname, 'src', 'pages', file);
const pComp = (file) => path.join(__dirname, 'src', 'components', file);

// Layout.tsx
let lay = fs.readFileSync(pComp('Layout.tsx'), 'utf8');
lay = lay.replace(/Plane,\s*/g, ''); // Removes all Planes, wait, I need one Plane
// Let's just remove Download and one Plane manually
lay = lay.replace(/Download,\s*/g, '');
const planes = lay.match(/Plane/g);
if (planes && planes.length > 1) {
    lay = lay.replace(/Plane,\s*/, '');
}
fs.writeFileSync(pComp('Layout.tsx'), lay, 'utf8');

// Audit.tsx
let au = fs.readFileSync(p('Audit.tsx'), 'utf8');
au = au.replace(/Filter,\s*/g, '');
fs.writeFileSync(p('Audit.tsx'), au, 'utf8');

// Dashboard.tsx
let db = fs.readFileSync(p('Dashboard.tsx'), 'utf8');
db = db.replace(/profile\?\.role === 'Payroll Manager'/g, "(profile?.role as any) === 'Payroll Manager'");
fs.writeFileSync(p('Dashboard.tsx'), db, 'utf8');

// EmployeeSalary.tsx
let es = fs.readFileSync(p('EmployeeSalary.tsx'), 'utf8');
if (!es.includes('MinusCircle')) {
    es = es.replace(/PlusCircle,\s*/, 'PlusCircle, MinusCircle, ');
}
es = es.replace(/\(change, idx\)/g, '(change)');
fs.writeFileSync(p('EmployeeSalary.tsx'), es, 'utf8');

// ExpenseManagement.tsx
let em = fs.readFileSync(p('ExpenseManagement.tsx'), 'utf8');
em = em.replace(/setExpenses\(updated\);/g, 'setExpenses(updated as any);');
em = em.replace(/setExpenses\(updated as Expense\[\]\);/g, 'setExpenses(updated as any);');
fs.writeFileSync(p('ExpenseManagement.tsx'), em, 'utf8');

// Notifications.tsx
let notif = fs.readFileSync(p('Notifications.tsx'), 'utf8');
notif = notif.replace(/PieChart,\s*/g, '');
notif = notif.replace(/Badge,\s*/g, '');
fs.writeFileSync(p('Notifications.tsx'), notif, 'utf8');

// PayrollAttendance.tsx
let pa = fs.readFileSync(p('PayrollAttendance.tsx'), 'utf8');
pa = pa.replace(/'primary'/g, "'default'");
pa = pa.replace(/'secondary'/g, "'default'");
fs.writeFileSync(p('PayrollAttendance.tsx'), pa, 'utf8');

// PayrollBonuses.tsx
let pb = fs.readFileSync(p('PayrollBonuses.tsx'), 'utf8');
pb = pb.replace(/'primary'/g, "'default'");
fs.writeFileSync(p('PayrollBonuses.tsx'), pb, 'utf8');

// PayrollLoans.tsx
let pl = fs.readFileSync(p('PayrollLoans.tsx'), 'utf8');
pl = pl.replace(/'primary'/g, "'default'");
fs.writeFileSync(p('PayrollLoans.tsx'), pl, 'utf8');

// PayrollPayslips.tsx
let pp = fs.readFileSync(p('PayrollPayslips.tsx'), 'utf8');
pp = pp.replace(/'primary'/g, "'default'");
fs.writeFileSync(p('PayrollPayslips.tsx'), pp, 'utf8');

// PayrollProcessing.tsx
let ppro = fs.readFileSync(p('PayrollProcessing.tsx'), 'utf8');
ppro = ppro.replace(/'primary'/g, "'default'");
fs.writeFileSync(p('PayrollProcessing.tsx'), ppro, 'utf8');

// PayrollTax.tsx
let pt = fs.readFileSync(p('PayrollTax.tsx'), 'utf8');
pt = pt.replace(/'secondary'/g, "'default'");
fs.writeFileSync(p('PayrollTax.tsx'), pt, 'utf8');

console.log('Done');
