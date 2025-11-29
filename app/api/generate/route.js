import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { topic } = await request.json();
    
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!anthropicKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000, // Increased from 4096 to ensure complete articles
        messages: [{
          role: 'user',
          content: `Create a complete Next.js 14+ App Router page component for an article titled "${topic.title}". 
          Category: ${topic.category}
          Keywords: ${topic.keywords}
          Slug: ${topic.slug}
          
          CRITICAL REQUIREMENTS:
          1. Use Next.js 14+ App Router format with separate metadata export
          2. Export metadata object for SEO (title, description, keywords)
          3. Return ONLY valid JavaScript code - NO markdown code blocks, NO backticks, NO \`\`\`jsx
          4. Start directly with: export const metadata = {...}
          5. Make sure ALL JSX tags are properly closed - including the final closing tags
          6. Component must be COMPLETE from start to finish
          7. NEVER truncate the article - complete all sections fully
          8. End with a proper conclusion section and closing </article> tag
          
          Structure your response EXACTLY like this:
          
          export const metadata = {
            title: "Your Article Title | Site Name",
            description: "Your meta description here",
            keywords: ["keyword1", "keyword2"]
          };
          
          export default function ArticlePage() {
            return (
              <article className="max-w-4xl mx-auto px-4 py-8">
                {/* Your complete article content here */}
              </article>
            );
          }
          
          Article Requirements:
          - Comprehensive content (800-1200 words, not too long)
          - Well-structured with h1, h2, h3 headings
          - Engaging introduction and COMPLETE conclusion section
          - 8-12 main points or tips
          - Actionable advice with examples
          - Use Tailwind CSS for beautiful styling
          - Include colored sections and visual variety
          - Make it informative and valuable
          - MUST end with a conclusion and closing thoughts section
          - ENSURE the article ends with proper closing </article> tag
          
          REMEMBER: Return ONLY the raw JavaScript code. No markdown formatting. No code fences. Just pure code.
          Make absolutely certain the article is COMPLETE with a conclusion at the end.`
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let code = data.content[0].text;
    
    // Clean up the code - remove markdown code fences if present
    code = code.replace(/```jsx\n?/g, '');
    code = code.replace(/```javascript\n?/g, '');
    code = code.replace(/```\n?$/g, '');
    code = code.trim();
    
    // Check if article is complete (has closing tags)
    if (!code.includes('</article>') || !code.includes('</div>')) {
      console.warn('Warning: Generated article may be incomplete');
    }
    
    return NextResponse.json({ code });

  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}