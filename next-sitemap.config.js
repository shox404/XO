/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://mlns.site',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.8,
    sitemapSize: 5000,
    exclude: ['/api/*'], 
};
