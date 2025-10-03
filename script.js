// Q1 
async function fetchPosts() {
  try {
    // fetch posts 
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_embed=comments&_expand=user');
    if (!response.ok) {
      throw new Error(`fetch failed ${response.status}`);
    }
    const posts = await response.json();

    // Build a map of authors to collect their articles
    const authorsMap = new Map();

    posts.forEach(post => {
      // post has: id, userId, title, body, comments (array), user (expanded user object)
      const authorId = post.user?.id ?? post.userId;
      const authorName = post.user?.name ?? `User ${authorId}`;

      if (!authorsMap.has(authorId)) {
        authorsMap.set(authorId, { id: authorId, name: authorName, articles: [] });
      }

      const authorEntry = authorsMap.get(authorId);

      // For each post (article), push { id, comments: [...] }
      const article = {
        id: post.id,
        comments: Array.isArray(post.comments) ? post.comments.map(c => ({
          id: c.id,
          content: c.body ?? c.name ?? ''
        })) : []
      };

      authorEntry.articles.push(article);
    });

    // Convert map values to an array
    const authors = Array.from(authorsMap.values());
    return authors;

  } catch (error) {
    console.error('error fetching posts data', error);
    return null;
  }
}


(async () => {
  const result = await fetchPosts();
  console.log('Authors with articles and comments:', result);
})();
