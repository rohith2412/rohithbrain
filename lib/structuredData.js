// FILE: lib/structuredData.js

export function generateArticleStructuredData(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.authorName
    },
    image: article.imageUrl
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Organization',
    url: 'https://rohithbrain.com',
    logo: 'https://rohithbrain.com/logo.png',
    sameAs: [
      'https://twitter.com/yourusername',
      'https://linkedin.com/company/yourcompany'
    ]
  }
}