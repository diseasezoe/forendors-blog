import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Forendors Blog',
    description: 'Rady, rozhovory a novinky ze světa tvorby obsahu a jeho monetizace.',
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/${post.id}`,
    })),
    customData: '<language>cs</language>',
  });
}
