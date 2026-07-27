const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Running tsc...');
  execSync('npx tsc', { encoding: 'utf8' });
  console.log('Build succeeded!');
} catch (error) {
  const output = error.stdout || '';
  const lines = output.split('\n');
  
  const fixes = {};
  
  for (const line of lines) {
    const match = line.match(/^src\/pages\/([a-zA-Z0-9_.-]+)\.tsx\((\d+),(\d+)\): error TS2322: Type '"default"' is not assignable to type '"primary" \| "secondary" \| "danger" \| "ghost" \| "outline" \| undefined'\./);
    if (match) {
      const file = match[1] + '.tsx';
      const lineNum = parseInt(match[2], 10) - 1;
      
      if (!fixes[file]) fixes[file] = [];
      fixes[file].push(lineNum);
    }
  }
  
  for (const file of Object.keys(fixes)) {
    const filePath = path.join(__dirname, 'src', 'pages', file);
    const contentLines = fs.readFileSync(filePath, 'utf8').split('\n');
    
    for (const lineNum of fixes[file]) {
      contentLines[lineNum] = contentLines[lineNum].replace('variant="default"', 'variant="primary"');
    }
    
    fs.writeFileSync(filePath, contentLines.join('\n'), 'utf8');
    console.log(`Fixed ${file}`);
  }
}
