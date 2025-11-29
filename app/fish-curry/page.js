// FILE: app/fish-curry/page.js

export const metadata = {
  title: 'Indian Fish Curry Recipe - Easy & Delicious',
  description: 'Learn how to make authentic Indian fish curry with coconut milk. Simple step-by-step recipe ready in 30 minutes. Perfect with rice or roti.',
  keywords: ['fish curry recipe', 'Indian fish curry', 'coconut fish curry', 'easy fish recipe'],
  openGraph: {
    title: 'Indian Fish Curry Recipe - Easy & Delicious',
    description: 'Authentic Indian fish curry with coconut milk, ready in 30 minutes',
    images: ['/images/fish-curry.jpg'],
    type: 'article'
  },
  alternates: {
    canonical: '/fish-curry'
  }
}

export default function FishCurryRecipe() {
  // Structured data for Google Recipe rich results
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "Indian Fish Curry",
    "description": "A simple and tasty Indian-style fish curry with coconut milk",
    "prepTime": "PT15M",
    "cookTime": "PT15M",
    "totalTime": "PT30M",
    "recipeYield": "2-3 servings",
    "recipeCategory": "Main Course",
    "recipeCuisine": "Indian",
    "keywords": "fish curry, Indian curry, coconut curry",
    "recipeIngredient": [
      "300-400g fish (cod, tilapia, or kingfish)",
      "1 medium onion, finely chopped",
      "2 medium tomatoes, chopped or pureed",
      "1-2 green chilies, slit",
      "1 tsp ginger-garlic paste",
      "1 tsp turmeric powder",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "1/2 tsp cumin powder",
      "1/2 tsp garam masala",
      "Salt to taste",
      "2-3 tbsp oil",
      "1 cup coconut milk or water",
      "Fresh coriander leaves",
      "Juice of half a lemon"
    ],
    "recipeInstructions": [
      {
        "@type": "HowToStep",
        "name": "Prep the fish",
        "text": "Wash the fish and pat dry. Marinate with a pinch of turmeric and salt for 10-15 minutes."
      },
      {
        "@type": "HowToStep",
        "name": "Cook the base",
        "text": "Heat oil in a pan. Add chopped onions and sauté until golden brown. Add ginger-garlic paste and green chilies; sauté for 1-2 minutes. Add chopped tomatoes and cook until soft and oil separates."
      },
      {
        "@type": "HowToStep",
        "name": "Add spices",
        "text": "Mix in turmeric, chili, coriander, cumin powders, and salt. Stir for 1-2 minutes until fragrant."
      },
      {
        "@type": "HowToStep",
        "name": "Add liquid",
        "text": "Pour in coconut milk or water and bring to a gentle simmer."
      },
      {
        "@type": "HowToStep",
        "name": "Cook the fish",
        "text": "Gently add fish pieces into the curry. Cover and simmer for 7-10 minutes. Avoid stirring too much to prevent breaking the fish."
      },
      {
        "@type": "HowToStep",
        "name": "Finish and serve",
        "text": "Sprinkle garam masala and squeeze lemon juice. Garnish with fresh coriander leaves. Serve with steamed rice, roti, or appam."
      }
    ]
  }

  return (
    <>
      {/* Add structured data for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Indian Fish Curry Recipe</h1>
          <p className="text-xl text-gray-600 mb-4">
            A simple and tasty fish curry you can try. This Indian-style fish curry is perfect for weeknight dinners and easily adjustable to your taste.
          </p>
          
          <div className="flex gap-6 text-sm text-gray-600 border-b pb-4">
            <div>
              <span className="font-semibold">Prep Time:</span> 15 minutes
            </div>
            <div>
              <span className="font-semibold">Cook Time:</span> 15 minutes
            </div>
            <div>
              <span className="font-semibold">Servings:</span> 2-3
            </div>
          </div>
        </header>

        {/* Ingredients */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ingredients (for 2–3 servings)</h2>
          <ul className="space-y-2">
            <li>• 300–400g fish (any firm white fish like cod, tilapia, or kingfish)</li>
            <li>• 1 medium onion, finely chopped</li>
            <li>• 2 medium tomatoes, chopped or pureed</li>
            <li>• 1–2 green chilies, slit (optional)</li>
            <li>• 1 tsp ginger-garlic paste</li>
            <li>• 1 tsp turmeric powder</li>
            <li>• 1 tsp red chili powder (adjust to taste)</li>
            <li>• 1 tsp coriander powder</li>
            <li>• 1/2 tsp cumin powder</li>
            <li>• 1/2 tsp garam masala</li>
            <li>• Salt, to taste</li>
            <li>• 2–3 tbsp oil (vegetable or coconut oil)</li>
            <li>• 1 cup coconut milk or water (for gravy)</li>
            <li>• Fresh coriander leaves for garnish</li>
            <li>• Juice of half a lemon (optional)</li>
          </ul>
        </section>

        {/* Instructions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Prep the fish</h3>
              <ul className="ml-6 space-y-1">
                <li>• Wash the fish and pat dry.</li>
                <li>• Marinate with a pinch of turmeric and salt for 10–15 minutes.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">2. Cook the base</h3>
              <ul className="ml-6 space-y-1">
                <li>• Heat oil in a pan.</li>
                <li>• Add chopped onions and sauté until golden brown.</li>
                <li>• Add ginger-garlic paste and green chilies; sauté for 1–2 minutes.</li>
                <li>• Add chopped tomatoes and cook until soft and oil separates.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">3. Add spices</h3>
              <ul className="ml-6 space-y-1">
                <li>• Mix in turmeric, chili, coriander, cumin powders, and salt.</li>
                <li>• Stir for 1–2 minutes until fragrant.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">4. Add liquid</h3>
              <ul className="ml-6 space-y-1">
                <li>• Pour in coconut milk or water and bring to a gentle simmer.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">5. Cook the fish</h3>
              <ul className="ml-6 space-y-1">
                <li>• Gently add fish pieces into the curry.</li>
                <li>• Cover and simmer for 7–10 minutes, depending on the thickness of the fish.</li>
                <li>• Avoid stirring too much to prevent breaking the fish.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">6. Finish and garnish</h3>
              <ul className="ml-6 space-y-1">
                <li>• Sprinkle garam masala and squeeze lemon juice.</li>
                <li>• Garnish with fresh coriander leaves.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">7. Serve</h3>
              <ul className="ml-6 space-y-1">
                <li>• Best with steamed rice, roti, or appam.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">💡 Tips</h2>
          <ul className="space-y-2">
            <li>• Firm white fish works best; avoid delicate fish that may break apart.</li>
            <li>• Adjust spiciness by changing the number of green chilies or chili powder.</li>
            <li>• Coconut milk makes the curry creamy; water makes it lighter.</li>
          </ul>
        </section>
      </article>
    </>
  )
}