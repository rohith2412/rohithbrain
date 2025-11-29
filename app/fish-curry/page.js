export const metadata = {
  title: 'Indian Fish Curry Recipe - Easy & Delicious',
  description: 'Learn how to make authentic Indian fish curry with coconut milk. Ready in 30 minutes.',
  keywords: ['fish curry recipe', 'Indian fish curry', 'coconut fish curry'],
  openGraph: {
    title: 'Indian Fish Curry Recipe',
    description: 'Authentic Indian fish curry with coconut milk',
    images: ['/images/fish-curry.jpg'],
    type: 'article'
  },
  alternates: {
    canonical: '/fish-curry'
  }
}

export default function FishCurryRecipe() {
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "Indian Fish Curry",
    "description": "A simple and tasty Indian-style fish curry",
    "prepTime": "PT15M",
    "cookTime": "PT15M",
    "totalTime": "PT30M",
    "recipeYield": "2-3 servings"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Indian Fish Curry Recipe</h1>
          <p className="text-xl text-gray-600 mb-4">
            A simple and tasty fish curry perfect for weeknight dinners.
          </p>
          
          <div className="flex gap-6 text-sm text-gray-600 border-b pb-4">
            <div><span className="font-semibold">Prep:</span> 15 min</div>
            <div><span className="font-semibold">Cook:</span> 15 min</div>
            <div><span className="font-semibold">Servings:</span> 2-3</div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            <li>• 300–400g fish (cod, tilapia, or kingfish)</li>
            <li>• 1 medium onion, finely chopped</li>
            <li>• 2 medium tomatoes, chopped</li>
            <li>• 1–2 green chilies, slit</li>
            <li>• 1 tsp ginger-garlic paste</li>
            <li>• 1 tsp turmeric powder</li>
            <li>• 1 tsp red chili powder</li>
            <li>• 1 tsp coriander powder</li>
            <li>• 1/2 tsp cumin powder</li>
            <li>• 1/2 tsp garam masala</li>
            <li>• Salt to taste</li>
            <li>• 2–3 tbsp oil</li>
            <li>• 1 cup coconut milk or water</li>
            <li>• Fresh coriander leaves</li>
            <li>• Juice of half a lemon</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Prep the fish</h3>
              <p>Wash the fish and pat dry. Marinate with turmeric and salt for 10–15 minutes.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">2. Cook the base</h3>
              <p>Heat oil. Sauté onions until golden. Add ginger-garlic paste and chilies. Add tomatoes and cook until soft.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">3. Add spices</h3>
              <p>Mix in all spice powders. Stir for 1-2 minutes until fragrant.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">4. Add liquid</h3>
              <p>Pour coconut milk and bring to simmer.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">5. Cook the fish</h3>
              <p>Add fish pieces. Cover and simmer 7-10 minutes. Don't stir too much.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">6. Finish and serve</h3>
              <p>Add garam masala and lemon juice. Garnish with coriander. Serve with rice or roti.</p>
            </div>
          </div>
        </section>

        <section className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">💡 Tips</h2>
          <ul className="space-y-2">
            <li>• Use firm white fish to prevent breaking</li>
            <li>• Adjust spice level with chilies</li>
            <li>• Coconut milk = creamy, water = lighter</li>
          </ul>
        </section>
      </article>
    </>
  )
}i