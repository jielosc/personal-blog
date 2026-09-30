import type { APIRoute } from 'astro';
import { publishedPosts, postUrl, url } from '../lib/posts';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async ({ site }) => {
  const posts = await publishedPosts();
  const paths = [url(), url('archive/'), url('about/'), ...posts.map(post => postUrl(post.id))];
  const entries = paths.map(path => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
