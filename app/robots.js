// FILE: app/robots.js

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/']
    },
    sitemap: 'https://yourdomain.com/sitemap.xml'
  }
}