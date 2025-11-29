// FILE: app/page.js

export const metadata = {
  title: 'Home',
  description: 'Welcome to our homepage with great content',
  alternates: {
    canonical: '/'
  }
}

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <article>
        <h1 className="text-4xl font-bold mb-4">Welcome to Your SEO-Friendly Next.js App</h1>
        <p className="text-lg mb-4">This is built with App Router and optimized for search engines.</p>
        
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">SEO Features Included</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Metadata API for dynamic SEO tags</li>
            <li>Open Graph and Twitter Card support</li>
            <li>Semantic HTML structure</li>
            <li>Automatic sitemap generation</li>
            <li>Robots.txt configuration</li>
            <li>Structured data (JSON-LD)</li>
          </ul>
        </section>
      </article>
    </main>
  )
}