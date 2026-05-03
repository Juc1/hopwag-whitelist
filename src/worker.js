export default {
  async fetch(request, env) {
    
    const url = new URL(request.url);
    const path = url.pathname;
    const query = url.search;

    // Skip non-HTML requests (images, CSS, JS etc.)
    const ext = ['.jpg','.jpeg','.png','.gif','.webp',
                 '.css','.js','.woff','.woff2','.ico'];
    if (ext.some(e => path.endsWith(e))) {
      return fetch(request);
    }

    // Check manual patterns
    const allowedPatterns = ['utm_','itok','page=',
                             '/user/login','/user/logout',
                             '/search','/contact'];
    if (allowedPatterns.some(p => 
      path.includes(p) || query.includes(p))) {
      return fetch(request);
    }

    // Check KV whitelist
    const match = await env.WHITELIST.get(path);
    if (match) return fetch(request);

    // Nothing matched - block
    return new Response('Not found', { status: 404 });
  }
}
