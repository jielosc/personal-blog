import type { APIRoute } from 'astro';
import { site as blog } from '../site.config';
import { publishedPosts, titleOf, excerptOf, postUrl, url } from '../lib/posts';
import { escapeXml } from '../lib/xml';

export const GET: APIRoute = async ({ site }) => {
  const posts = await publishedPosts();
  const home = escapeXml(new URL(url(), site).href);
  const self = escapeXml(new URL(url('rss.xml'), site).href);
  const items = posts.map(post => {
    const link = escapeXml(new URL(postUrl(post.id), site).href);
    return `<item>
<title>${escapeXml(titleOf(post))}</title>
<link>${link}</link><guid isPermaLink="true">${link}</guid>
<description>${escapeXml(excerptOf(post))}</description>
${post.data.date ? `<pubDate>${post.data.date.toUTCString()}</pubDate>` : ''}
</item>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(blog.title)}</title><link>${home}</link>
<description>${escapeXml(blog.description)}</description><language>zh-CN</language>
<atom:link href="${self}" rel="self" type="application/rss+xml" />
${items.join('')}
</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
