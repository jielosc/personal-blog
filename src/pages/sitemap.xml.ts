import type { APIRoute } from 'astro';
import { publishedPosts, postUrl, url } from '../lib/posts';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async ({ site }) => {
  const posts = await publishedPosts();
  const pages = [
    ...[url(), url('archive/'), url('about/')].map(path => ({ path, updated: undefined as Date | undefined })),
    ...posts.map(post => ({ path: postUrl(post.id), updated: post.data.updated })),
  ];
  // Only emit explicitly recorded modification dates, never the build time.
  const entries = pages.map(({ path, updated }) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc>${updated ? `<lastmod>${updated.toISOString()}</lastmod>` : ''}</url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
