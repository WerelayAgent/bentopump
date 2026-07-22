const fs = require('fs');
const path = require('path');

const dir = 'C:\\Tools\\bentopump';

// Copy images to root
const imageDir = path.join(dir, '_next', 'image');
if (fs.existsSync(imageDir)) {
    const images = fs.readdirSync(imageDir);
    for (const img of images) {
        if (img.includes('mag7-128')) {
            fs.copyFileSync(path.join(imageDir, img), path.join(dir, 'mag7-128.png'));
        }
        if (img.includes('mag7-512')) {
            fs.copyFileSync(path.join(imageDir, img), path.join(dir, 'mag7-512.png'));
        }
    }
}

// Function to replace strings in files
function processFiles(directory) {
    const files = fs.readdirSync(directory);
    
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
            processFiles(filePath);
        } else if (filePath.endsWith('.html')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Fix images
            const imgRegex = /\/_next\/image\?url=[^"'\s]+mag7-512\.png[^"'\s]*/g;
            if (imgRegex.test(content)) {
                content = content.replace(imgRegex, '/mag7-512.png');
                modified = true;
            }
            const imgRegex2 = /\/_next\/image\?url=[^"'\s]+mag7-128\.png[^"'\s]*/g;
            if (imgRegex2.test(content)) {
                content = content.replace(imgRegex2, '/mag7-128.png');
                modified = true;
            }

            // Also replace srcSet definitions which might not be caught if they are space separated
            // Actually, the regex above matches the whole url up to space or quote, which works for srcset too!
            // Let's do a broader replacement just in case
            if (content.includes('/_next/image?url=')) {
                content = content.replace(/\/_next\/image\?url=(?:%2F|\/)boxes(?:%2F|\/)mag7-512\.png[^"'\s,]*/g, '/mag7-512.png');
                content = content.replace(/\/_next\/image\?url=(?:%2F|\/)boxes(?:%2F|\/)mag7-128\.png[^"'\s,]*/g, '/mag7-128.png');
                modified = true;
            }

            // Replace address and specific text
            // "0x73e2…7d5c" -> "coming soon on pump.fun"
            if (content.includes('0x73e2…7d5c')) {
                content = content.replace(/0x73e2…7d5c/g, 'coming soon on pump.fun');
                modified = true;
            }

            // If there's any mention of gloopyagent
            if (content.includes('gloopyagent')) {
                content = content.replace(/https:\/\/gloopyagent\.xyz\/?/g, 'coming soon on pump.fun');
                content = content.replace(/gloopyagent\.xyz/g, 'coming soon on pump.fun');
                modified = true;
            }

            // "Contracts not yet deployed · launching-soon state, no zero-address reads."
            if (content.includes('Contracts not yet deployed')) {
                content = content.replace(/Contracts not yet deployed[^<]*no zero-address reads\./g, 'Launching soon on pump.fun');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log(`Fixed: ${filePath}`);
            }
        }
    }
}

processFiles(dir);
console.log("Fixes applied.");
