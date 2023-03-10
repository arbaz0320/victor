/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.advogadossc.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  exclude: ["/server-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://www.advogadossc.com/server-sitemap.xml"],
  },
};
