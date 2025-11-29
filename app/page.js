// FILE: app/page.js - Homepage with article links

export const metadata = {
  title: 'Rohith Brain - Your Source for Knowledge & Tips',
  description: 'Discover articles on recipes, technology, lifestyle, health, finance, and more. Learn something new every day.',
  alternates: {
    canonical: '/'
  }
}

export default function Home() {
  // Array of your articles - add new ones here
  const articles = [
    {
      title: 'Indian Fish Curry Recipe',
      description: 'Learn how to make authentic Indian fish curry with coconut milk in just 30 minutes',
      url: '/fish-curry',
      category: 'Recipes',
      readTime: '5 min read'
    },
    // Add more articles as you create them:
    // {
    //   title: 'How to Save Money Fast',
    //   description: '10 proven ways to build your savings quickly',
    //   url: '/save-money-fast',
    //   category: 'Finance',
    //   readTime: '7 min read'
    // },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Rohith Brain</h1>
          <p className="text-xl mb-8">
            Your daily source for helpful guides, tips, and knowledge across all topics
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <a 
              key={index}
              href={article.url}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-sm text-blue-600 font-semibold">{article.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <span className="text-sm text-gray-500">{article.readTime}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">🍳</div>
              <h3 className="font-semibold">Recipes</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-semibold">Finance</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">💪</div>
              <h3 className="font-semibold">Health</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">💻</div>
              <h3 className="font-semibold">Technology</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">✈️</div>
              <h3 className="font-semibold">Travel</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold">Lifestyle</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">🏠</div>
              <h3 className="font-semibold">Home & Garden</h3>
            </div>
            <div className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold">Education</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}