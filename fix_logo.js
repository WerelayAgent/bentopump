const fs = require('fs');
const path = require('path');

const dir = 'C:\\Tools\\bentopump';

// Rename Logo
const brandDir = path.join(dir, 'brand');
if (fs.existsSync(brandDir)) {
  const brandFiles = fs.readdirSync(brandDir);
  const logoFile = brandFiles.find(f => f.includes('logo'));
  if (logoFile && logoFile !== 'logo.svg') {
    fs.renameSync(path.join(brandDir, logoFile), path.join(brandDir, 'logo.svg'));
  }
}

// Rename Icon
const rootFiles = fs.readdirSync(dir);
const iconFile = rootFiles.find(f => f.includes('icon_icon'));
if (iconFile && iconFile !== 'icon.png') {
  fs.renameSync(path.join(dir, iconFile), path.join(dir, 'icon.png'));
}

// Replace in HTML
function fixHTML(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== '.git' && file !== 'node_modules') {
      fixHTML(filePath);
    } else if (filePath.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Fix logo
      const logoRegex = /src="[^"]*bentopump-logo[^"]*"/g;
      if (logoRegex.test(content)) {
        content = content.replace(logoRegex, 'src="/brand/logo.svg"');
        modified = true;
      }
      
      const logoRegex2 = /href="[^"]*bentopump-logo[^"]*"/g; // just in case it's in a link/preload
      if (logoRegex2.test(content)) {
        content = content.replace(logoRegex2, 'href="/brand/logo.svg"');
        modified = true;
      }

      // Fix icon
      const iconRegex = /href="[^"]*icon_icon[^"]*"/g;
      if (iconRegex.test(content)) {
        content = content.replace(iconRegex, 'href="/icon.png"');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated logo/icon links in: ${filePath}`);
      }
    }
  }
}

fixHTML(dir);
console.log('Logo and icon fixed.');
