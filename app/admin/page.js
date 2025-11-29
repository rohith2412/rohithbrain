// FILE: app/admin/page.js
'use client';
import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [articleCount, setArticleCount] = useState(5);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const githubToken = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GITHUB_TOKEN : null;
  const repoOwner = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GITHUB_USERNAME : null;
  const repoName = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_REPOSITORY_NAME : null;

  // Generate trending topics using Claude
  const generateTrendingTopics = async () => {
    setIsGeneratingTopics(true);
    try {
      console.log('🔥 Requesting', articleCount, 'topics...');
      
      const response = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: articleCount })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage;
        
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('❌ API Error (JSON):', error);
          errorMessage = error.error || JSON.stringify(error);
        } else {
          const errorText = await response.text();
          console.error('❌ API Error (Text):', errorText);
          errorMessage = errorText || 'Unknown error';
        }
        
        throw new Error(`API Error (${response.status}): ${errorMessage}`);
      }

      const data = await response.json();
      console.log('✅ Received topics:', data.topics?.length || 0);
      
      if (!data.topics || !Array.isArray(data.topics) || data.topics.length === 0) {
        console.error('❌ Invalid response:', data);
        throw new Error('No topics received from API');
      }
      
      console.log('📋 Topics:', data.topics.map(t => t.title).join(', '));
      
      setTopics(data.topics);
      setIsGeneratingTopics(false);
      alert(`✅ Generated ${data.topics.length} trending topics!`);
    } catch (error) {
      console.error('💥 Topic generation error:', error);
      console.error('💥 Error details:', {
        message: error.message,
        stack: error.stack
      });
      setIsGeneratingTopics(false);
      alert('❌ Error generating topics:\n\n' + error.message + '\n\nCheck browser console (F12) for full details.');
    }
  };

  // Generate articles using the topics
  const generateArticles = async () => {
    if (topics.length === 0) {
      alert('⚠️ Please generate topics first!');
      return;
    }

    setIsGenerating(true);
    const generated = [];
    const failed = [];
    
    try {
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i];
        console.log(`Generating ${i + 1}/${topics.length}: ${topic.title}`);

        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic })
          });

          if (!response.ok) {
            const error = await response.json();
            console.error(`Failed to generate ${topic.title}:`, error);
            failed.push({ topic: topic.title, error: error.error });
            continue;
          }

          const data = await response.json();
          
          if (!data.code || data.code.trim().length === 0) {
            console.error(`Empty code generated for ${topic.title}`);
            failed.push({ topic: topic.title, error: 'Empty code generated' });
            continue;
          }
          
          if (!data.code.includes('export const metadata') || !data.code.includes('export default function')) {
            console.warn(`⚠️ Generated code for ${topic.title} might be incomplete`);
          }
          
          if (data.warnings && data.warnings.length > 0) {
            console.warn(`⚠️ Warnings for ${topic.title}:`, data.warnings);
          }
          
          generated.push({
            path: `app/${topic.slug}/page.js`,
            content: data.code,
            slug: topic.slug,
            warnings: data.warnings
          });

          console.log(`✓ Generated: ${topic.title} (${generated.length}/${topics.length})`);
          
        } catch (articleError) {
          console.error(`Error generating ${topic.title}:`, articleError);
          failed.push({ topic: topic.title, error: articleError.message });
        }
      }
      
      setArticles(generated);
      setIsGenerating(false);
      
      let message = `✅ Successfully generated ${generated.length} articles!`;
      if (failed.length > 0) {
        message += `\n\n⚠️ ${failed.length} failed:\n${failed.map(f => `- ${f.topic}: ${f.error}`).join('\n')}`;
      }
      alert(message);
      
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      alert('❌ Error generating articles: ' + error.message);
    }
    
    return generated;
  };

  // Post to GitHub with sitemap update
  const postToGitHub = async () => {
    if (!githubToken || !repoOwner || !repoName) {
      alert('❌ Missing GitHub credentials. Check your .env.local file and restart the server.');
      return;
    }

    setIsPosting(true);

    try {
      const articlesToPost = articles.length > 0 ? articles : await generateArticles();

      if (articlesToPost.length === 0) {
        alert('❌ No articles to post');
        setIsPosting(false);
        return;
      }

      console.log('📤 Posting to GitHub:', `${repoOwner}/${repoName}`);
      console.log('📝 Articles to post:', articlesToPost.length);

      const branchName = 'content-updates';

      // 1. Get the main branch reference
      console.log('1️⃣ Getting main branch reference...');
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
        const errorText = await mainRefResponse.text();
        console.error('GitHub API Error:', errorText);
        throw new Error(`GitHub API Error: ${mainRefResponse.status} - ${errorText}`);
      }
      
      const mainRefData = await mainRefResponse.json();
      const latestCommitSha = mainRefData.object.sha;
      console.log('✓ Latest commit SHA:', latestCommitSha.substring(0, 7));

      // 2. Create or update the content-updates branch
      console.log('2️⃣ Creating/updating branch:', branchName);
      try {
        const createBranchResponse = await fetch(
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
        
        if (createBranchResponse.ok) {
          console.log('✓ Created new branch:', branchName);
        } else {
          const updateBranchResponse = await fetch(
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
          
          if (!updateBranchResponse.ok) {
            const errorText = await updateBranchResponse.text();
            throw new Error(`Failed to update branch: ${errorText}`);
          }
          console.log('✓ Updated existing branch:', branchName);
        }
      } catch (branchError) {
        console.error('Branch creation/update error:', branchError);
        throw branchError;
      }

      // 3. Get the tree
      console.log('3️⃣ Getting commit tree...');
      const commitResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits/${latestCommitSha}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (!commitResponse.ok) {
        throw new Error(`Failed to get commit: ${commitResponse.status}`);
      }
      
      const commitData = await commitResponse.json();
      const baseTreeSha = commitData.tree.sha;
      console.log('✓ Base tree SHA:', baseTreeSha.substring(0, 7));

      // 4. Generate updated sitemap.js
      console.log('4️⃣ Generating sitemap...');
      const existingSlugs = await generateSitemapContent(articlesToPost);
      
      // Combine existing slugs with new ones (avoid duplicates)
      const newSlugs = articlesToPost.map(a => a.slug);
      const allSlugs = [...new Set([...existingSlugs, ...newSlugs])]; // Remove duplicates
      
      console.log('📋 Existing articles:', existingSlugs.length);
      console.log('📋 New articles:', newSlugs.length);
      console.log('📋 Total unique articles:', allSlugs.length);
      
      // Create sitemap entries for all articles
      const allArticleEntries = allSlugs.map(slug => {
        return `    {
      url: \`\${baseUrl}/${slug}\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    }`;
      }).join(',\n');
      
      const sitemapContent = `export default function sitemap() {
  const baseUrl = 'https://rohithbrain.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: \`\${baseUrl}/fish-curry\`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
${allArticleEntries}
  ]
}`;
      
      console.log('✓ Sitemap generated with', allSlugs.length, 'articles');

      // 5. Create blobs for articles and sitemap
      console.log('5️⃣ Creating blobs for', articlesToPost.length, 'articles + sitemap...');
      const articleBlobs = [];
      
      for (let i = 0; i < articlesToPost.length; i++) {
        const article = articlesToPost[i];
        try {
          console.log(`  Creating blob ${i + 1}/${articlesToPost.length}: ${article.path}`);
          
          if (!article.content || article.content.trim().length === 0) {
            console.error(`  ❌ Empty content for ${article.path}`);
            throw new Error(`Empty content for ${article.path}`);
          }
          
          const contentSize = new Blob([article.content]).size;
          console.log(`  Content size: ${(contentSize / 1024).toFixed(2)} KB`);
          
          if (contentSize > 10 * 1024 * 1024) {
            console.warn(`  ⚠️  Large file: ${article.path} (${(contentSize / 1024 / 1024).toFixed(2)} MB)`);
          }
          
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
          
          if (!blobResponse.ok) {
            const errorText = await blobResponse.text();
            console.error(`  ❌ Blob creation failed:`, errorText);
            throw new Error(`Failed to create blob for ${article.path}: ${errorText}`);
          }
          
          const blobData = await blobResponse.json();
          console.log(`  ✓ Blob created:`, blobData.sha.substring(0, 7));
          
          articleBlobs.push({
            path: article.path,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha
          });
        } catch (error) {
          console.error(`  ❌ Error processing ${article.path}:`, error);
          throw new Error(`Failed to create blob for ${article.path}: ${error.message}`);
        }
      }
      
      console.log('✓ All article blobs created successfully');

      // 6. Create sitemap blob
      console.log('6️⃣ Creating sitemap blob...');
      const sitemapBlobResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: sitemapContent,
            encoding: 'utf-8'
          })
        }
      );
      
      if (!sitemapBlobResponse.ok) {
        throw new Error('Failed to create sitemap blob');
      }
      
      const sitemapBlobData = await sitemapBlobResponse.json();
      console.log('✓ Sitemap blob created');
      
      const allBlobs = [
        ...articleBlobs,
        {
          path: 'app/sitemap.js',
          mode: '100644',
          type: 'blob',
          sha: sitemapBlobData.sha
        }
      ];
      
      console.log('✓ Total blobs:', allBlobs.length);

      // 7. Create new tree
      console.log('7️⃣ Creating tree...');
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
            tree: allBlobs
          })
        }
      );
      
      if (!treeResponse.ok) {
        const errorText = await treeResponse.text();
        throw new Error(`Failed to create tree: ${errorText}`);
      }
      
      const treeData = await treeResponse.json();
      console.log('✓ Tree created:', treeData.sha.substring(0, 7));

      // 8. Create commit
      console.log('8️⃣ Creating commit...');
      const newCommitResponse = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`,
        {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Add ${articlesToPost.length} new articles and update sitemap`,
            tree: treeData.sha,
            parents: [latestCommitSha]
          })
        }
      );
      
      if (!newCommitResponse.ok) {
        const errorText = await newCommitResponse.text();
        throw new Error(`Failed to create commit: ${errorText}`);
      }
      
      const newCommitData = await newCommitResponse.json();
      console.log('✓ Commit created:', newCommitData.sha.substring(0, 7));

      // 9. Update the content-updates branch
      console.log('9️⃣ Updating branch reference...');
      const updateRefResponse = await fetch(
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
      
      if (!updateRefResponse.ok) {
        const errorText = await updateRefResponse.text();
        throw new Error(`Failed to update branch: ${errorText}`);
      }
      
      console.log('✓ Branch updated successfully!');

      console.log('✓ Success! Branch updated:', branchName);
      
      const prUrl = `https://github.com/${repoOwner}/${repoName}/compare/${branchName}?expand=1`;
      
      alert(`✅ Successfully posted ${articlesToPost.length} articles + updated sitemap!\n\n🔗 Branch: ${branchName}\n\n📋 Next steps:\n1. Click OK to open GitHub\n2. Create Pull Request\n3. Review changes\n4. Merge when ready\n\nOpening GitHub in 2 seconds...`);
      
      setTimeout(() => {
        window.open(prUrl, '_blank');
      }, 2000);
      
      setIsPosting(false);
    } catch (error) {
      console.error('GitHub error:', error);
      alert('❌ Error: ' + error.message);
      setIsPosting(false);
    }
  };

  // Generate sitemap content
  const generateSitemapContent = (articlesToPost) => {
    const baseUrl = 'https://rohithbrain.com';
    
    // Get existing articles from the current sitemap
    const fetchExistingSitemap = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/app/sitemap.js`,
          {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          const content = atob(data.content); // Decode base64
          
          // Extract existing slugs from sitemap
          const slugMatches = content.match(/url: `\${baseUrl}\/([^`]+)`/g);
          if (slugMatches) {
            return slugMatches
              .map(match => match.match(/\/([^`]+)`/)[1])
              .filter(slug => slug !== '' && slug !== 'fish-curry'); // Exclude home and fish-curry (we'll add them manually)
          }
        }
      } catch (error) {
        console.warn('Could not fetch existing sitemap, creating new one:', error);
      }
      return [];
    };
    
    return fetchExistingSitemap();
  };

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
        <p className="text-gray-400 mb-8">AI-Powered Content Generation & Deployment</p>

        {/* Article Count Input */}
        <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white">📊 Content Settings</h2>
          <div className="flex items-center gap-4">
            <label className="text-white font-medium">Number of Articles:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={articleCount}
              onChange={(e) => setArticleCount(parseInt(e.target.value) || 1)}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-gray-400 text-sm">Generate 1-100 articles at once</span>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
          <h3 className="text-yellow-300 font-bold mb-2">🐛 Debug Info</h3>
          <p className="text-yellow-200 text-sm">Article Count: {articleCount}</p>
          <p className="text-yellow-200 text-sm">Topics Generated: {topics.length}</p>
          <p className="text-yellow-200 text-sm">Articles Generated: {articles.length}</p>
          <p className="text-yellow-200 text-sm">Check browser console (F12) for detailed logs</p>
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
        {topics.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">📝 Generated Topics</h2>
            <p className="text-gray-400 mb-4">{topics.length} trending topics ready</p>
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
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={generateTrendingTopics}
            disabled={isGeneratingTopics}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isGeneratingTopics ? '⏳ Generating Trending Topics...' : `🔥 Step 1: Generate ${articleCount} Trending Topics`}
          </button>

          <button
            onClick={generateArticles}
            disabled={isGenerating || topics.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isGenerating ? '⏳ Generating Articles...' : '📝 Step 2: Generate Articles'}
          </button>

          <button
            onClick={postToGitHub}
            disabled={isPosting || !githubToken || !repoOwner || !repoName}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isPosting ? '⏳ Posting to GitHub...' : '🚀 Step 3: Post to GitHub + Update Sitemap'}
          </button>
        </div>

        {articles.length > 0 && (
          <div className="mt-6 bg-green-900 border border-green-700 rounded-lg p-4">
            <p className="text-green-300 font-semibold mb-2">
              ✅ {articles.length} articles generated and ready to post!
            </p>
            <details className="mt-3">
              <summary className="text-green-200 cursor-pointer hover:text-green-100">
                📋 Preview Generated Articles
              </summary>
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {articles.map((article, i) => (
                  <div key={i} className="bg-green-950 p-3 rounded text-sm">
                    <div className="text-green-200 font-mono">{article.path}</div>
                    <div className="text-green-400 text-xs mt-1">
                      Size: {article.content ? (new Blob([article.content]).size / 1024).toFixed(2) : 0} KB
                      {!article.content && <span className="text-red-400 ml-2">⚠️ Empty content!</span>}
                      {article.warnings && article.warnings.length > 0 && (
                        <span className="text-yellow-400 ml-2">⚠️ {article.warnings.length} warning(s)</span>
                      )}
                    </div>
                    {article.warnings && article.warnings.length > 0 && (
                      <div className="mt-2 text-yellow-300 text-xs">
                        Warnings: {article.warnings.join(', ')}
                      </div>
                    )}
                    {article.content && (
                      <details className="mt-2">
                        <summary className="text-green-300 text-xs cursor-pointer">View Code</summary>
                        <pre className="mt-2 p-2 bg-black rounded text-xs overflow-x-auto max-h-40">
                          <code className="text-green-400">{article.content.substring(0, 500)}...</code>
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-3">📋 How It Works</h3>
          <ol className="text-gray-300 space-y-2 text-sm list-decimal list-inside">
            <li>Enter the number of articles you want (1-100)</li>
            <li>Click "Generate Trending Topics" - AI finds hot topics automatically</li>
            <li>Click "Generate Articles" - Creates complete SEO-optimized pages</li>
            <li>Click "Post to GitHub" - Uploads articles AND updates sitemap.js</li>
            <li>Create a Pull Request on GitHub and merge when ready</li>
          </ol>
        </div>
      </div>
    </div>
  );
}