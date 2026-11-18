const fs = require('fs');

const serverCode = fs.readFileSync('Program-3-Node-Utility/server.js', 'utf8');
const startTag = 'const html = `';
const endTag = '`;\n\n  res.writeHead';

const startIdx = serverCode.indexOf(startTag);
const endIdx = serverCode.indexOf(endTag, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const html = serverCode.substring(startIdx + startTag.length, endIdx);
  fs.writeFileSync('docs/screenshots/p3_dashboard.html', html, 'utf8');
  console.log('Saved p3_dashboard.html successfully!');
} else {
  console.log('Could not find dashboard HTML tags');
}
