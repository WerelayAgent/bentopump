const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const links = content.match(/href="[^"]+"/g);
console.log('Links:', links ? links.filter(l => l.includes('bpump') || l.includes('bento')) : []);

const files = fs.readdirSync('.');
for (const file of files) {
  if (file.endsWith('.html')) {
    const text = fs.readFileSync(file, 'utf8');
    const ethMatches = text.match(/.{0,20}ETH.{0,20}/g);
    if (ethMatches) console.log(file, 'ETH matches:', ethMatches);
  }
}
