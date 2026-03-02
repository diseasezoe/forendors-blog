/**
 * WordPress → Astro migration script
 * Reads WP export XML, converts posts to Markdown with proper frontmatter.
 *
 * Usage: node migrate-wp.mjs /path/to/export.xml
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import https from 'https';
import http from 'http';

const XML_PATH = process.argv[2];
if (!XML_PATH) {
  console.error('Usage: node migrate-wp.mjs <path-to-wp-export.xml>');
  process.exit(1);
}

const xml = readFileSync(XML_PATH, 'utf-8');

// ── Category mapping: WP nicename → Astro category ──
const CATEGORY_MAP = {
  'tipy-triky': 'tipy',
  'finance': 'finance',
  'novinky': 'novinky',
  'propagace': 'propagace',
  'nastaveni': 'nastaveni',
  'rozhovory': 'rozhovor',
  'od-vseho-neco': 'ostatni',
};

// ── Known interview subjects (WP slug → initials + name) ──
const INTERVIEW_MAP = {
  'eva-vasova': { subject: 'Eva Vášová', initials: 'EV' },
  'honza-dvoracek': { subject: 'Honza Dvořáček', initials: 'HD' },
  'andrej-polescuk': { subject: 'Andrej Poleščuk', initials: 'AP' },
  'daniel-prazak': { subject: 'Daniel Pražák', initials: 'DP' },
  'marketa-lukaskova': { subject: 'Markéta Lukášková', initials: 'ML' },
  'brain-we-are-nase-podcasty-si-lidi-pustili-uz-16-milionkrat': { subject: 'Brain We Are', initials: 'BW' },
  'radio-zeitung': { subject: 'Radio Zeitung', initials: 'RZ' },
  'gabriela-zim': { subject: 'Gabriela Zim', initials: 'GZ' },
  'michelle-losekoot-rozhovor': { subject: 'Michelle Losekoot', initials: 'ML' },
  'tereza-chadimova': { subject: 'Tereza Chadimová', initials: 'TC' },
  'rodicovska-posilovna-spolecne-jsme-zacali-hledat-cestu-jak-resilienci-priblizit-rodicum': { subject: 'Rodičovská posilovna', initials: 'RP' },
  'klara-klapi-mouchova': { subject: 'Klára Klapí Mouchová', initials: 'KM' },
  'magda-blaha-dulezite-je-zacit-a-nedumat-nad-tim-zbytecne-dlouho': { subject: 'Magda Bláha', initials: 'MB' },
};

// ── Parse XML items ──
function extractItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    items.push({
      title: extractCDATA(block, 'title') || extractTag(block, 'title'),
      slug: extractCDATA(block, 'wp:post_name'),
      date: extractCDATA(block, 'wp:post_date'),
      status: extractCDATA(block, 'wp:status'),
      postType: extractCDATA(block, 'wp:post_type'),
      content: extractCDATA(block, 'content:encoded'),
      excerpt: extractCDATA(block, 'excerpt:encoded'),
      categories: extractCategories(block),
      link: extractTag(block, 'link'),
    });
  }
  return items;
}

function extractCDATA(block, tag) {
  // Handle namespaced tags
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${escaped}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escaped}>`);
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function extractTag(block, tag) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${escaped}>([^<]*)<\\/${escaped}>`);
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function extractCategories(block) {
  const cats = [];
  const re = /category domain="category" nicename="([^"]+)"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    cats.push(m[1]);
  }
  return cats;
}

// ── HTML → Markdown conversion ──
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // Remove WP block comments
  md = md.replace(/<!-- \/?wp:[^>]*-->/g, '');

  // Handle figures with images
  md = md.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, (_, inner) => {
    const imgMatch = inner.match(/<img[^>]*src="([^"]*)"[^>]*(?:alt="([^"]*)")?[^>]*>/i);
    const captionMatch = inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    if (imgMatch) {
      const alt = imgMatch[2] || captionMatch?.[1]?.replace(/<[^>]+>/g, '') || '';
      return `\n\n![${alt}](${imgMatch[1]})\n\n`;
    }
    return inner;
  });

  // Images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*(?:alt="([^"]*)")?[^>]*\/?>/gi, (_, src, alt) => {
    return `![${alt || ''}](${src})`;
  });

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    return `[${cleanText}](${href})`;
  });

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `\n\n# ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `\n\n## ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `\n\n### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `\n\n#### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`);

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => {
    const text = c.replace(/<[^>]+>/g, '').trim();
    return '\n\n> ' + text.replace(/\n/g, '\n> ') + '\n\n';
  });

  // Lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = [];
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => {
      items.push('- ' + li.replace(/<[^>]+>/g, '').trim());
    });
    return '\n\n' + items.join('\n') + '\n\n';
  });
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    const items = [];
    let i = 1;
    inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, li) => {
      items.push(`${i++}. ` + li.replace(/<[^>]+>/g, '').trim());
    });
    return '\n\n' + items.join('\n') + '\n\n';
  });

  // Bold, italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `\n\n${c.trim()}\n\n`);

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#8211;/g, '–');
  md = md.replace(/&#8212;/g, '—');
  md = md.replace(/&#8216;/g, '\u2018');
  md = md.replace(/&#8217;/g, '\u2019');
  md = md.replace(/&#8220;/g, '\u201E');
  md = md.replace(/&#8221;/g, '\u201C');
  md = md.replace(/&#8222;/g, '\u201E');
  md = md.replace(/&#8230;/g, '…');
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&#\d+;/g, '');

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

// ── Extract first meaningful sentence for excerpt ──
function generateExcerpt(content, wpExcerpt) {
  if (wpExcerpt) {
    return wpExcerpt.replace(/<[^>]+>/g, '').trim().substring(0, 200);
  }
  // Get plain text from content
  const plain = content
    .replace(/<!-- [^>]*-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201E')
    .replace(/&#8221;/g, '\u201C')
    .replace(/&#8222;/g, '\u201E')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  // Take first 1-2 sentences
  const sentences = plain.match(/[^.!?]+[.!?]+/g);
  if (sentences) {
    let excerpt = sentences[0];
    if (sentences[1] && (excerpt.length + sentences[1].length) < 200) {
      excerpt += sentences[1];
    }
    return excerpt.trim().substring(0, 250);
  }
  return plain.substring(0, 200);
}

// ── Slug shortening for nicer URLs ──
function shortenSlug(slug) {
  // Already short enough
  if (slug.length < 50) return slug;

  // Remove common filler words for shorter URLs
  const shortened = slug
    .replace(/-jak-na-ne$/g, '')
    .replace(/-abyste-vy-nemuseli$/g, '')
    .replace(/-a-podcasty-vedou$/g, '')
    .replace(/-vlastni-tvorby$/g, '')
    .replace(/-je-normalni$/g, '')
    .replace(/-i-na-spotify$/g, '-spotify')
    .replace(/-jak-nahrat-vlastni-podcast$/g, '');

  return shortened.length < slug.length ? shortened : slug;
}

// ── Collect image URLs from content ──
function extractImageUrls(content) {
  const urls = [];
  const re = /src="(https?:\/\/blog\.forendors\.cz\/wp-content\/uploads\/[^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

// ── Download image ──
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        resolve(false); // Skip, don't fail
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        writeFileSync(destPath, Buffer.concat(chunks));
        resolve(true);
      });
      res.on('error', () => resolve(false));
    }).on('error', () => resolve(false));
  });
}

// ── Main ──
async function main() {
  const BLOG_DIR = join(import.meta.dirname, 'src/content/blog');
  const IMG_DIR = join(import.meta.dirname, 'public/images/articles');
  mkdirSync(BLOG_DIR, { recursive: true });
  mkdirSync(IMG_DIR, { recursive: true });

  const items = extractItems(xml);
  const posts = items.filter(i => i.postType === 'post' && i.slug && i.slug !== 'ahoj-vsichni');

  console.log(`Found ${posts.length} posts (${posts.filter(p => p.status === 'publish').length} published, ${posts.filter(p => p.status === 'draft').length} drafts)\n`);

  const redirects = [];
  const allImageDownloads = [];

  for (const post of posts) {
    const wpCats = post.categories;
    const primaryWpCat = wpCats[0] || 'od-vseho-neco';
    const category = CATEGORY_MAP[primaryWpCat] || 'ostatni';

    const isInterview = category === 'rozhovor' || !!INTERVIEW_MAP[post.slug];
    const interview = INTERVIEW_MAP[post.slug];

    const newSlug = shortenSlug(post.slug);
    const isDraft = post.status !== 'publish';
    const excerpt = generateExcerpt(post.content, post.excerpt);

    // Extract date (YYYY-MM-DD)
    const dateMatch = post.date.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : '2022-01-01';

    // Convert content
    let markdown = htmlToMarkdown(post.content);

    // Download and remap images
    const imgUrls = extractImageUrls(post.content);
    for (const url of imgUrls) {
      const imgName = basename(new URL(url).pathname);
      const localPath = `/images/articles/${imgName}`;
      const destPath = join(IMG_DIR, imgName);

      // Replace URL in markdown
      markdown = markdown.replace(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);

      if (!existsSync(destPath)) {
        allImageDownloads.push({ url, destPath, imgName });
      }
    }

    // Build frontmatter
    let fm = `---\n`;
    fm += `title: "${post.title.replace(/"/g, '\\"')}"\n`;
    fm += `excerpt: "${excerpt.replace(/"/g, '\\"')}"\n`;
    fm += `date: ${date}\n`;
    fm += `category: ${category}\n`;
    fm += `tags: []\n`;
    if (isInterview && interview) {
      fm += `interviewSubject: "${interview.subject}"\n`;
      fm += `interviewInitials: "${interview.initials}"\n`;
    }
    fm += `draft: ${isDraft}\n`;
    fm += `---\n\n`;

    const filePath = join(BLOG_DIR, `${newSlug}.md`);
    writeFileSync(filePath, fm + markdown);
    console.log(`${isDraft ? '📝 DRAFT' : '✅'} ${newSlug}.md  [${category}]  "${post.title.substring(0, 50)}..."`);

    // Redirect old WP URL → new slug
    if (post.link && post.status === 'publish') {
      try {
        const oldPath = new URL(post.link).pathname.replace(/\/$/, '');
        if (oldPath && oldPath !== '/' && oldPath !== `/${newSlug}`) {
          redirects.push({
            source: oldPath,
            destination: `/${newSlug}`,
            permanent: true,
          });
        }
      } catch {}
    }
  }

  // Download images
  if (allImageDownloads.length > 0) {
    console.log(`\nDownloading ${allImageDownloads.length} images...`);
    for (const { url, destPath, imgName } of allImageDownloads) {
      const ok = await downloadImage(url, destPath);
      console.log(`  ${ok ? '✅' : '❌'} ${imgName}`);
    }
  }

  // Write vercel.json with redirects
  const vercelConfig = {
    redirects: redirects.filter((r, i, arr) =>
      arr.findIndex(x => x.source === r.source) === i
    ),
  };
  const vercelPath = join(import.meta.dirname, 'vercel.json');
  writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2) + '\n');
  console.log(`\n📄 vercel.json updated with ${vercelConfig.redirects.length} redirects`);

  console.log('\n✅ Migration complete!');
  console.log(`   ${posts.filter(p => p.status === 'publish').length} published + ${posts.filter(p => p.status !== 'publish').length} draft articles`);
  console.log(`   Run: npm run build && npm run dev`);
}

main().catch(console.error);
