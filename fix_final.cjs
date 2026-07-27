const fs = require('fs');
const path = require('path');

const p = (file) => path.join(__dirname, 'src', 'pages', file);

// Reimbursements.tsx
let r = fs.readFileSync(p('Reimbursements.tsx'), 'utf8');
r = r.replace(/globalReimbursements = updated;/g, 'globalReimbursements = updated as Reimbursement[];');
fs.writeFileSync(p('Reimbursements.tsx'), r, 'utf8');

// TravelClaims.tsx
let t = fs.readFileSync(p('TravelClaims.tsx'), 'utf8');
t = t.replace(/globalTravelClaims = updated;/g, 'globalTravelClaims = updated as TravelClaim[];');
fs.writeFileSync(p('TravelClaims.tsx'), t, 'utf8');

// PurchaseRequests.tsx
let pr = fs.readFileSync(p('PurchaseRequests.tsx'), 'utf8');
pr = pr.replace(/globalPurchaseRequests = updated;/g, 'globalPurchaseRequests = updated as PurchaseRequest[];');
fs.writeFileSync(p('PurchaseRequests.tsx'), pr, 'utf8');

// ExpenseManagement.tsx
let em = fs.readFileSync(p('ExpenseManagement.tsx'), 'utf8');
em = em.replace(/setExpenses\(updated\);/g, 'setExpenses(updated as Expense[]);');
fs.writeFileSync(p('ExpenseManagement.tsx'), em, 'utf8');

// EmployeeSalary.tsx
let es = fs.readFileSync(p('EmployeeSalary.tsx'), 'utf8');
es = es.replace(/map\(\(change, idx\)/g, 'map((change)');
fs.writeFileSync(p('EmployeeSalary.tsx'), es, 'utf8');

// FinanceReports.tsx
let fr = fs.readFileSync(p('FinanceReports.tsx'), 'utf8');
fr = fr.replace(/\(value: number\)/g, '(value: any)');
fs.writeFileSync(p('FinanceReports.tsx'), fr, 'utf8');

// Invoices.tsx
let inv = fs.readFileSync(p('Invoices.tsx'), 'utf8');
inv = inv.replace(/Filter,\s*/g, '');
fs.writeFileSync(p('Invoices.tsx'), inv, 'utf8');

// Notifications.tsx
let n = fs.readFileSync(p('Notifications.tsx'), 'utf8');
n = n.replace(/FileText,\s*/g, '');
n = n.replace(/CreditCard,\s*/g, '');
n = n.replace(/PieChart,\s*/g, '');
n = n.replace(/Badge,\s*/g, '');
fs.writeFileSync(p('Notifications.tsx'), n, 'utf8');

// PayrollReports.tsx
let prp = fs.readFileSync(p('PayrollReports.tsx'), 'utf8');
prp = prp.replace(/BarChart,\s*/g, '');
prp = prp.replace(/FileText,\s*/g, '');
fs.writeFileSync(p('PayrollReports.tsx'), prp, 'utf8');

// PayrollAttendance.tsx
let pa = fs.readFileSync(p('PayrollAttendance.tsx'), 'utf8');
pa = pa.replace(/return 'primary'/g, "return 'default'");
pa = pa.replace(/return 'secondary'/g, "return 'default'");
fs.writeFileSync(p('PayrollAttendance.tsx'), pa, 'utf8');

// PayrollBonuses.tsx
let pb = fs.readFileSync(p('PayrollBonuses.tsx'), 'utf8');
pb = pb.replace(/return 'primary'/g, "return 'default'");
fs.writeFileSync(p('PayrollBonuses.tsx'), pb, 'utf8');

// PayrollLoans.tsx
let pl = fs.readFileSync(p('PayrollLoans.tsx'), 'utf8');
pl = pl.replace(/return 'primary'/g, "return 'default'");
fs.writeFileSync(p('PayrollLoans.tsx'), pl, 'utf8');

// PayrollPayslips.tsx
let pp = fs.readFileSync(p('PayrollPayslips.tsx'), 'utf8');
pp = pp.replace(/return 'primary'/g, "return 'default'");
fs.writeFileSync(p('PayrollPayslips.tsx'), pp, 'utf8');

// PayrollProcessing.tsx
let ppro = fs.readFileSync(p('PayrollProcessing.tsx'), 'utf8');
ppro = ppro.replace(/return 'primary'/g, "return 'default'");
fs.writeFileSync(p('PayrollProcessing.tsx'), ppro, 'utf8');

// PayrollTax.tsx
let pt = fs.readFileSync(p('PayrollTax.tsx'), 'utf8');
pt = pt.replace(/return 'secondary'/g, "return 'default'");
fs.writeFileSync(p('PayrollTax.tsx'), pt, 'utf8');

console.log('Fixed final TS errors');
