'use client';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [articles, setArticles] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only render after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get credentials from environment variables (only for GitHub - Anthropic is server-side now)
  const githubToken = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GITHUB_TOKEN : null;
  const repoOwner = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GITHUB_USERNAME : null;
  const repoName = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_REPOSITORY_NAME : null;

  const topics = [
    { slug: 'save-money-fast', title: 'How to Save Money Fast', category: 'Finance', keywords: 'money, finance, savings' },
    // { slug: 'weight-loss-tips', title: '10 Weight Loss Tips', category: 'Health', keywords: 'weight loss, diet, health' },
    // { slug: 'productivity-hacks', title: 'Top Productivity Hacks', category: 'Lifestyle', keywords: 'productivity, efficiency, work' },
    // { slug: 'digital-marketing-guide', title: 'Digital Marketing Guide', category: 'Business', keywords: 'marketing, digital, strategy' },
    // { slug: 'mental-health-tips', title: 'Mental Health Tips', category: 'Health', keywords: 'mental health, wellness, mindfulness' },
    // { slug: 'remote-work-setup', title: 'Perfect Remote Work Setup', category: 'Career', keywords: 'remote work, home office, productivity' },
    // { slug: 'investment-basics', title: 'Investment Basics for Beginners', category: 'Finance', keywords: 'investment, stocks, finance' },
    // { slug: 'healthy-meal-prep', title: 'Healthy Meal Prep Ideas', category: 'Health', keywords: 'meal prep, nutrition, healthy eating' },
    // { slug: 'time-management', title: 'Master Time Management', category: 'Productivity', keywords: 'time management, planning, efficiency' },
    // { slug: 'social-media-growth', title: 'Social Media Growth Strategies', category: 'Marketing', keywords: 'social media, growth, engagement' },
    // { slug: 'stress-relief', title: 'Effective Stress Relief Methods', category: 'Wellness', keywords: 'stress relief, relaxation, mental health' },
    // { slug: 'side-hustle-ideas', title: 'Best Side Hustle Ideas', category: 'Finance', keywords: 'side hustle, income, business' },
    // { slug: 'morning-routine', title: 'Perfect Morning Routine', category: 'Lifestyle', keywords: 'morning routine, habits, wellness' },
    // { slug: 'seo-basics', title: 'SEO Basics for Websites', category: 'Marketing', keywords: 'SEO, search engine, optimization' },
    // { slug: 'budget-travel', title: 'Budget Travel Tips', category: 'Travel', keywords: 'travel, budget, adventure' },
    // { slug: 'email-marketing', title: 'Email Marketing Best Practices', category: 'Marketing', keywords: 'email marketing, campaigns, conversion' },
    // { slug: 'home-workout', title: 'Effective Home Workouts', category: 'Fitness', keywords: 'workout, fitness, exercise' },
    // { slug: 'passive-income', title: 'Build Passive Income Streams', category: 'Finance', keywords: 'passive income, investment, money' },
    // { slug: 'content-creation', title: 'Content Creation Guide', category: 'Business', keywords: 'content creation, strategy, marketing' },
    // { slug: 'sleep-optimization', title: 'Optimize Your Sleep', category: 'Health', keywords: 'sleep, health, wellness' },
  ];

  // Generate articles using our API route
  const generateArticles = async () => {
    setIsGenerating(true);
    const generated = [];
    
    try {
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        console.log(`Generating ${i + 1}/${topics.length}: ${topic.title}`);

        // Call our API route instead of Anthropic directly
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || `API Error: ${response.status}`);
        }

        const data = await response.json();
        
        generated.push({
          path: `app/${topic.slug}/page.js`,
          content: data.code
        });

        console.log(`✓ Generated: ${topic.title} (${generated.length}/${topics.length})`);
      }
      
      setArticles(generated);
      setIsGenerating(false);
      alert(`✅ Successfully generated ${generated.length} articles!`);
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      alert('❌ Error generating articles: ' + error.message);
    }
    
    return generated;
  };

  // Auto-post to GitHub
  const postToGitHub = async () => {
    if (!githubToken || !repoOwner || !repoName) {
      alert('❌ Missing GitHub credentials. Check your .env.local file and restart the server.');
      return;
    }

    setIsPosting(true);

    try {
      // 1. Generate all articles first if not already generated
      const articlesToPost = articles.length > 0 ? articles : await generateArticles();

      if (articlesToPost.length === 0) {
        alert('❌ No articles to post');
        setIsPosting(false);
        return;
      }

      console.log('Posting to GitHub:', `${repoOwner}/${repoName}`);

      const branchName = 'content-updates'; // Use a separate branch

      // 2. Get the main branch reference
      const mainRefResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (!mainRefResponse.ok) {
        throw new Error(`GitHub API Error: ${mainRefResponse.status} ${mainRefResponse.statusText}`);
      }
      
      const mainRefData = await mainRefResponse.json();
      const latestCommitSha = mainRefData.object.sha;

      // 3. Create or update the content-updates branch
      try {
        await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`,
          {
            method: 'POST',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ref: `refs/heads/${branchName}`,
              sha: latestCommitSha
            })
          }
        );
        console.log('Created new branch:', branchName);
      } catch (error) {
        // Branch might already exist, update it instead
        await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branchName}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `token ${githubToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              sha: latestCommitSha,
              force: true
            })
          }
        );
        console.log('Updated existing branch:', branchName);
      }

      // 4. Get the tree
      const commitResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits/${latestCommitSha}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      const commitData = await commitResponse.json();
      const baseTreeSha = commitData.tree.sha;

      // 5. Create blobs for each file
      console.log('Creating blobs...');
      const blobs = await Promise.all(
        articlesToPost.map(async (article) => {
          const blobResponse = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs`,
            {
              method: 'POST',
              headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: article.content,
                encoding: 'utf-8'
              })
            }
          );
          const blobData = await blobResponse.json();
          return {
            path: article.path,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha
          };
        })
      );

      // 6. Create new tree
      console.log('Creating tree...');
      const treeResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: blobs
          })
        }
      );
      const treeData = await treeResponse.json();

      // 7. Create commit
      console.log('Creating commit...');
      const newCommitResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Add ${articlesToPost.length} new articles`,
            tree: treeData.sha,
            parents: [latestCommitSha]
          })
        }
      );
      const newCommitData = await newCommitResponse.json();

      // 8. Update the content-updates branch
      console.log('Updating branch...');
      await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branchName}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sha: newCommitData.sha
          })
        }
      );

      console.log('✓ Success!');
      alert(`✅ Successfully posted all articles to branch '${branchName}'!\n\nNext steps:\n1. Go to GitHub and create a Pull Request\n2. Review the changes\n3. Merge when ready`);
      setIsPosting(false);
    } catch (error) {
      console.error('GitHub error:', error);
      alert('❌ Error: ' + error.message);
      setIsPosting(false);
    }
  };

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          🚀 Rohith Brain Admin
        </h1>
        <p className="text-gray-400 mb-8">Automated Content Generation & Deployment</p>

        {/* Debug Info */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mb-6">
          <h3 className="text-blue-300 font-bold mb-2">ℹ️ API Configuration</h3>
          <p className="text-blue-200 text-sm">Anthropic API is called server-side (no CORS issues)</p>
          <p className="text-blue-200 text-sm">GitHub API is called client-side</p>
        </div>

        {/* Environment Status */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white">🔐 Environment Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">GitHub Token</span>
              <span className={`px-3 py-1 rounded-full text-sm ${githubToken ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {githubToken ? '✓ Configured' : '✗ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Repository</span>
              <span className={`px-3 py-1 rounded-full text-sm ${repoOwner && repoName ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                {repoOwner && repoName ? `✓ ${repoOwner}/${repoName}` : '✗ Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Topics Preview */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white">📝 Articles Queue</h2>
          <p className="text-gray-400 mb-4">Ready to generate {topics.length} articles</p>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {topics.map((t, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <div>
                  <span className="text-white font-medium">{i + 1}. {t.title}</span>
                  <span className="text-gray-400 text-sm ml-2">({t.category})</span>
                </div>
                <span className="text-xs text-gray-500">{t.slug}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={generateArticles}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isGenerating ? '⏳ Generating Articles...' : '📝 Step 1: Generate 20 Articles'}
          </button>

          <button
            onClick={postToGitHub}
            disabled={isPosting || !githubToken || !repoOwner || !repoName}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isPosting ? '⏳ Posting to GitHub...' : '🚀 Step 2: Auto-Post to GitHub'}
          </button>
        </div>

        {articles.length > 0 && (
          <div className="mt-6 bg-green-900 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 font-semibold">
              ✅ {articles.length} articles generated and ready to post!
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">📋 Setup Checklist</h3>
          <ol className="text-gray-300 space-y-2 text-sm list-decimal list-inside">
            <li>Create <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> in project root (not inside app/)</li>
            <li>Add variables with <code className="bg-gray-700 px-2 py-1 rounded">NEXT_PUBLIC_</code> prefix</li>
            <li><strong className="text-yellow-300">RESTART your dev server completely (Ctrl+C then npm run dev)</strong></li>
            <li>Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)</li>
            <li>Check browser console (F12) for debug info</li>
          </ol>
          
          <div className="mt-4 bg-gray-900 p-3 rounded text-xs text-gray-400 font-mono">
            # .env.local (in project root)<br/>
            ANTHROPIC_API_KEY=sk-ant-...<br/>
            NEXT_PUBLIC_GITHUB_TOKEN=ghp_...<br/>
            NEXT_PUBLIC_GITHUB_USERNAME=rohith2412<br/>
            NEXT_PUBLIC_REPOSITORY_NAME=rohithbrain
          </div>
        </div>
      </div>
    </div>
  );
}