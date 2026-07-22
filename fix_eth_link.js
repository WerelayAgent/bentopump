const fs = require('fs');
const path = require('path');

const dir = 'C:\\Tools\\bentopump';

function replaceInFiles(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== '.git' && file !== 'node_modules') {
      replaceInFiles(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Fix ETH -> SOL
      if (/\bETH\b/.test(content)) {
        content = content.replace(/\bETH\b/g, 'SOL');
        modified = true;
      }
      
      // Fix WETH -> WSOL
      if (/\bWETH\b/.test(content)) {
        content = content.replace(/\bWETH\b/g, 'WSOL');
        modified = true;
      }

      // Fix broken link
      if (content.includes('href="/bentopump"')) {
        content = content.replace(/href="\/bentopump"/g, 'href="/bpump"');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

replaceInFiles(dir);

// Rename folder
const oldFolderPath = path.join(dir, 'bento');
const newFolderPath = path.join(dir, 'bpump');
if (fs.existsSync(oldFolderPath)) {
  fs.renameSync(oldFolderPath, newFolderPath);
  console.log(`Renamed folder bento to bpump`);
}

console.log('Fixes complete.');
