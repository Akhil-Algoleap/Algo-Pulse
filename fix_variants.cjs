const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let modified = false;
  
  const rules = [
    { from: /variant="primary"/g, to: 'variant="default"' },
    { from: /variant="secondary"/g, to: 'variant="default"' },
    { from: /variant="error"/g, to: 'variant="danger"' },
    { from: /profile\?\.name/g, to: 'profile?.employee_name' },
    { from: /profile\?\.employeeName/g, to: 'profile?.employee_name' },
    { from: /return 'primary'/g, to: "return 'default'" },
    { from: /return 'secondary'/g, to: "return 'default'" },
    { from: /return 'error'/g, to: "return 'danger'" }
  ];
  
  for (const rule of rules) {
    if (content.match(rule.from)) {
      content = content.replace(rule.from, rule.to);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modified', file);
  }
}
console.log('Done replacement');
