export default function sitemap() {
  const baseUrl = 'https://rohithbrain.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${baseUrl}/fish-curry`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    }
    // When adding more articles, add a comma after the fish-curry object
    // Example:
    // },
    // {
    //   url: `${baseUrl}/your-new-article`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8
    // }
  ]
}