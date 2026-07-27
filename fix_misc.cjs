const fs = require('fs');
const path = require('path');

const p = (file) => path.join(__dirname, 'src', 'pages', file);

// PurchaseRequests.tsx
let pr = fs.readFileSync(p('PurchaseRequests.tsx'), 'utf8');
pr = pr.replace(/setRequests\(updated\);/g, 'setRequests(updated as PurchaseRequest[]);');
fs.writeFileSync(p('PurchaseRequests.tsx'), pr, 'utf8');

// PayrollReports.tsx
let prp = fs.readFileSync(p('PayrollReports.tsx'), 'utf8');
prp = prp.replace(/BarChart, FileText, /, '');
prp = prp.replace(/FileText, BarChart, /, '');
prp = prp.replace(/BarChart,\n\s*FileText,/, '');
fs.writeFileSync(p('PayrollReports.tsx'), prp, 'utf8');

// PayrollTax.tsx
let pt = fs.readFileSync(p('PayrollTax.tsx'), 'utf8');
pt = pt.replace(/RefreshCw, /g, '');
pt = pt.replace(/,\s*RefreshCw/g, '');
fs.writeFileSync(p('PayrollTax.tsx'), pt, 'utf8');

// ProjectCalendar.tsx
let pc = fs.readFileSync(p('ProjectCalendar.tsx'), 'utf8');
pc = pc.replace(/Badge, /g, '');
pc = pc.replace(/,\s*Badge/g, '');
fs.writeFileSync(p('ProjectCalendar.tsx'), pc, 'utf8');

// ProjectDetails.tsx
let pd = fs.readFileSync(p('ProjectDetails.tsx'), 'utf8');
pd = pd.replace(/BarChart2, /g, '');
pd = pd.replace(/,\s*BarChart2/g, '');
fs.writeFileSync(p('ProjectDetails.tsx'), pd, 'utf8');

// Settings.tsx
let st = fs.readFileSync(p('Settings.tsx'), 'utf8');
st = st.replace(/const \[complianceConfig, setComplianceConfig\].+;\n/g, '');
fs.writeFileSync(p('Settings.tsx'), st, 'utf8');

// PayrollBonuses.tsx
let pb = fs.readFileSync(p('PayrollBonuses.tsx'), 'utf8');
pb = pb.replace(/cn, /g, '');
pb = pb.replace(/,\s*cn/g, '');
fs.writeFileSync(p('PayrollBonuses.tsx'), pb, 'utf8');

console.log('Misc fixes done');
