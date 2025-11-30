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
    },
    {
      url: `${baseUrl}/holiday-budget-inflation-survival-guide-2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/longevity-diet-habits-aging`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/remote-work-burnout-prevention-strategies`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/save-money-fast`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/sustainable-investing-strategies-2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    

  ]
}