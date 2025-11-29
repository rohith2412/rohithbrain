import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const topic = body.topic;
    
    // Validate topic object
    if (!topic || !topic.title || !topic.slug || !topic.category || !topic.keywords) {
      return NextResponse.json(
        { error: 'Invalid topic object. Required: title, slug, category, keywords' },
        { status: 400 }
      );
    }
    
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!anthropicKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    console.log('Generating article for:', topic.title);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 12000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: `Create a complete, SEO-optimized Next.js 14+ App Router page component for an article about "${topic.title}".

**Article Details:**
- Title: ${topic.title}
- Category: ${topic.category}
- Keywords: ${topic.keywords}
- URL Slug: ${topic.slug}

**CRITICAL REQUIREMENTS:**

1. **Format & Structure:**
   - Use Next.js 14+ App Router format with separate metadata export
   - Return ONLY valid JavaScript code - NO markdown, NO backticks, NO \`\`\`jsx
   - Start directly with: export const metadata = {...}
   - Must be COMPLETE from start to finish with proper closing tags

2. **SEO & Metadata:**
   - Comprehensive metadata object with title, description, keywords, openGraph
   - Include JSON-LD structured data (Schema.org Article or Recipe format)
   - Canonical URL set to /${topic.slug}
   - Meta description 150-160 characters

3. **Content Requirements:**
   - 1000-1500 words of high-quality, engaging content
   - Well-structured with h1, h2, h3 headings (proper semantic HTML)
   - Engaging introduction (2-3 paragraphs)
   - 8-12 main sections with detailed explanations
   - Practical, actionable advice with specific examples
   - COMPLETE conclusion section (2-3 paragraphs)
   - Tips/pro tips section in colored box

4. **Styling (Match Fish Curry Example):**
   - Use Tailwind CSS throughout
   - article tag with: className="max-w-4xl mx-auto px-4 py-8"
   - Proper spacing: mb-8, mb-4, space-y-6
   - Text sizes: text-4xl for h1, text-2xl for h2, text-xl for h3, text-xl for body
   - Colored sections: bg-blue-50, bg-green-50, bg-purple-50 for tips/highlights
   - Headers: text-gray-600 for metadata, text-gray-700 for borders
   - Lists: space-y-2, ml-6 indentation

5. **Structure Template:**
\`\`\`
export const metadata = {
  title: 'Your Title | Rohith Brain',
  description: 'Compelling 150-160 char description',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  openGraph: {
    title: 'Your Title',
    description: 'Description',
    type: 'article'
  },
  alternates: {
    canonical: '/${topic.slug}'
  }
};

export default function ArticlePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Your Title",
    "description": "Description",
    "author": {
      "@type": "Person",
      "name": "Rohith Brain"
    },
    "datePublished": "2025-11-29"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">[Title]</h1>
          <p className="text-xl text-gray-600 mb-4">[Engaging intro]</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">[Section Title]</h2>
          <p className="text-xl mb-4">[Content]</p>
        </section>

        [More sections...]

        <section className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 Pro Tips</h2>
          <ul className="space-y-2 text-xl">
            <li>• [Tip 1]</li>
            <li>• [Tip 2]</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
          <p className="text-xl mb-4">[Wrap up]</p>
        </section>
      </article>
    </>
  );
}
\`\`\`

**REMEMBER:**
- Return ONLY raw JavaScript code
- No markdown code fences or backticks
- Ensure ALL tags are properly closed
- Article must be COMPLETE with conclusion
- Follow the fish curry example structure exactly
- Make it engaging, informative, and SEO-optimized`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json(
        { error: `Anthropic API Error: ${response.status} - ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let code = data.content[0].text;
    
    console.log('Raw response length:', code.length);
    
    // Clean up the code - remove markdown code fences if present
    code = code.replace(/```jsx\n?/g, '');
    code = code.replace(/```javascript\n?/g, '');
    code = code.replace(/```js\n?/g, '');
    code = code.replace(/```\n?$/g, '');
    code = code.replace(/```$/g, '');
    code = code.trim();
    
    // Additional cleanup - remove any stray backticks at start/end
    if (code.startsWith('```')) {
      code = code.substring(3).trim();
    }
    if (code.endsWith('```')) {
      code = code.substring(0, code.length - 3).trim();
    }
    
    console.log('Cleaned code length:', code.length);
    
    // Validate article completion
    const warnings = [];
    
    if (!code.includes('</article>')) {
      warnings.push('Missing closing article tag');
      console.warn('⚠️ Missing closing article tag');
    }
    
    if (!code.includes('export const metadata')) {
      warnings.push('Missing metadata export');
      console.warn('⚠️ Missing metadata export');
    }
    
    if (!code.includes('export default function')) {
      warnings.push('Missing default export');
      console.warn('⚠️ Missing default export');
    }
    
    // Check for common syntax errors
    if (code.includes('undefined')) {
      console.warn('⚠️ Code contains "undefined" - possible incomplete generation');
    }
    
    // Check if code looks truncated
    if (code.length < 1000) {
      warnings.push('Code seems too short (< 1000 chars)');
      console.warn('⚠️ Code seems too short:', code.length, 'chars');
    }
    
    // Try to detect if the article was cut off mid-generation
    const lastChars = code.substring(code.length - 50);
    if (!lastChars.includes('}') && !lastChars.includes('>')) {
      warnings.push('Code may be truncated');
      console.warn('⚠️ Code may be truncated - no closing bracket/tag at end');
    }
    
    if (warnings.length > 0) {
      console.warn('Article generation warnings:', warnings.join(', '));
    }
    
    console.log('Successfully generated article for:', topic.title);
    
    return NextResponse.json({ 
      code,
      warnings: warnings.length > 0 ? warnings : undefined
    });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
