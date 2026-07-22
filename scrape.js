const scrape = require('website-scraper').default || require('website-scraper');

const options = {
    urls: [
        'https://bentoetf.com/',
        'https://bentoetf.com/mint',
        'https://bentoetf.com/redeem',
        'https://bentoetf.com/portfolio',
        'https://bentoetf.com/bento',
        'https://bentoetf.com/docs',
        'https://bentoetf.com/reserves'
    ],
    directory: './site',
    filenameGenerator: 'bySiteStructure',
    sources: [
        { selector: 'img', attr: 'src' },
        { selector: 'link[rel="stylesheet"]', attr: 'href' },
        { selector: 'script', attr: 'src' },
        { selector: 'link[rel="icon"]', attr: 'href' },
        { selector: 'link[rel="apple-touch-icon"]', attr: 'href' },
        { selector: 'meta[property="og:image"]', attr: 'content' },
        { selector: 'meta[name="twitter:image"]', attr: 'content' },
        { selector: 'link[rel="preload"]', attr: 'href' }
    ],
    ignoreErrors: true
};

scrape(options).then((result) => {
    console.log("Scraping complete.");
}).catch((err) => {
    console.error("Error scraping:", err);
});
