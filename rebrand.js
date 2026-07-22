const fs = require('fs');
const path = require('path');

const dir = 'C:\\Tools\\bentopump\\site';

function processFiles(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processFiles(filePath);
        } else if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            const replacements = [
                // Links and references
                { pattern: /bentoetf\.com/g, replacement: 'bentopump.com' },
                { pattern: /bentoetf/gi, replacement: 'bentopump' },
                
                // Titles and text
                { pattern: /Bento Protocol/gi, replacement: 'BentoPump' },
                
                // Networks
                { pattern: /Robinhood Chain/gi, replacement: 'pump.fun' },
                { pattern: /Robinhood/gi, replacement: 'pump.fun' },
                { pattern: /Ethereum/gi, replacement: 'Solana' },
                { pattern: / ETH /g, replacement: ' SOL ' },
                
                // Handle specific casing
                { pattern: /\bBento\b/g, replacement: 'BentoPump' },
                { pattern: /\bbento\b/g, replacement: 'bentopump' },
                { pattern: /\bBENTO\b/g, replacement: 'BPUMP' }
            ];

            for (const { pattern, replacement } of replacements) {
                if (pattern.test(content)) {
                    content = content.replace(pattern, replacement);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log(`Updated: ${filePath}`);
            }
        }
    }
}

processFiles(dir);
console.log("Rebranding complete.");
