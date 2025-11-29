import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const count = body.count || 5;
    
    console.log('Generate topics request - count:', count);
    
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!anthropicKey) {
      console.error('Missing Anthropic API key');
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }
    
    console.log('API key found, length:', anthropicKey.length);

    console.log('Calling Anthropic API...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Generate ${count} trending, high-traffic article topics for a blog in November 2025. 
          
          Focus on:
          - Current trends and hot topics people are searching for
          - Evergreen content with SEO potential
          - Mix of categories: Health, Finance, Technology, Lifestyle, Business, Career, etc.
          - Topics that attract organic traffic
          - Practical, actionable content ideas
          
          Return ONLY a valid JSON array with no markdown formatting. Each object must have:
          - slug: URL-friendly slug (lowercase, hyphens)
          - title: Compelling article title
          - category: Main category
          - keywords: Comma-separated SEO keywords
          
          Example format:
          [
            {
              "slug": "ai-productivity-tools-2025",
              "title": "Best AI Productivity Tools for 2025",
              "category": "Technology",
              "keywords": "AI tools, productivity, automation, 2025"
            }
          ]
          
          Generate exactly ${count} unique, trending topics. Return ONLY the JSON array, no other text.`
        }]
      })
    });

    console.log('Anthropic API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error response:', errorText);
      return NextResponse.json(
        { error: `Anthropic API Error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Received response from Anthropic');
    
    let topicsText = data.content[0].text;
    console.log('Raw topics text length:', topicsText.length);
    console.log('First 200 chars:', topicsText.substring(0, 200));
    
    // Clean up response - remove markdown code fences if present
    topicsText = topicsText.replace(/```json\n?/g, '');
    topicsText = topicsText.replace(/```\n?/g, '');
    topicsText = topicsText.trim();
    
    console.log('Cleaned topics text length:', topicsText.length);
    
    // Parse JSON
    let topics;
    try {
      topics = JSON.parse(topicsText);
      console.log('Successfully parsed JSON, topics count:', topics.length);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse:', topicsText.substring(0, 500));
      return NextResponse.json(
        { error: `Failed to parse topics JSON: ${parseError.message}` },
        { status: 500 }
      );
    }
    
    // Validate topics array
    if (!Array.isArray(topics) || topics.length === 0) {
      console.error('Invalid topics array:', topics);
      return NextResponse.json(
        { error: 'Invalid topics format received - not an array or empty' },
        { status: 500 }
      );
    }
    
    // Validate each topic has required fields
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      if (!topic.slug || !topic.title || !topic.category || !topic.keywords) {
        console.error('Invalid topic at index', i, ':', topic);
        return NextResponse.json(
          { error: `Topic at index ${i} missing required fields` },
          { status: 500 }
        );
      }
    }
    
    console.log('All topics validated successfully');
    return NextResponse.json({ topics });

  } catch (error) {
    console.error('Generate topics API error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
