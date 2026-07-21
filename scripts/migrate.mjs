// One-shot migration: Hugo markdown -> Astro markdown.
// Reads content/posts/*.md, writes src/content/posts/*.md.
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'content/posts';
const OUT = 'src/content/posts';

function parseAttrs(str) {
  const attrs = {};
  const re = /(\w+)\s*=\s*("([^"]*)"|(\S+))/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    attrs[m[1]] = m[3] !== undefined ? m[3] : m[4];
  }
  return attrs;
}

function convertFrontmatter(fm) {
  const out = { title: '', date: '', tags: [], author: 'Scott McAllister', draft: false };
  const lines = fm.split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    switch (key.toLowerCase()) {
      case 'title':
        out.title = val.replace(/^["']|["']$/g, '');
        break;
      case 'date':
        out.date = val;
        break;
      case 'last_modified_at':
      case 'lastmod':
        out.lastModified = val;
        break;
      case 'tags': {
        const inner = val.replace(/^\[|\]$/g, '');
        out.tags = inner
          .split(',')
          .map((t) => t.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
        break;
      }
      case 'author':
        out.author = val.replace(/^["']|["']$/g, '');
        break;
      case 'draft':
        out.draft = /true/i.test(val);
        break;
    }
  }
  return out;
}

function yamlEscape(s) {
  if (/[:#"'\[\]{}]|^\s|\s$/.test(s)) return JSON.stringify(s);
  return s;
}

function buildFrontmatter(fm) {
  const lines = ['---'];
  lines.push(`title: ${yamlEscape(fm.title)}`);
  lines.push(`date: ${fm.date}`);
  if (fm.lastModified) lines.push(`lastModified: ${fm.lastModified}`);
  lines.push(`author: ${yamlEscape(fm.author)}`);
  lines.push('tags:');
  for (const t of fm.tags) lines.push(`  - ${yamlEscape(t)}`);
  lines.push(`draft: ${fm.draft}`);
  lines.push('---');
  return lines.join('\n');
}

function convertBody(body) {
  const inLines = body.split(/\r?\n/);
  const out = [];
  let admonition = false;
  const admoIcons = { note: 'ℹ️', tip: '💡', warning: '⚠️', danger: '🔥', info: 'ℹ️', question: '❓' };

  for (let raw of inLines) {
    let m = raw.match(/^\s*\{\{<\s*highlight\s+([^\s>]+)[^>]*>\}\}\s*$/);
    if (m) {
      out.push('```' + m[1]);
      continue;
    }
    if (/^\s*\{\{<\s*\/highlight\s*>\}\}\s*$/.test(raw)) {
      out.push('```');
      continue;
    }
    m = raw.match(/^\s*\{\{<\s*admonition\s+([^>]*?)>\}\}\s*$/);
    if (m) {
      const a = parseAttrs(m[1]);
      const type = (a.type || 'note').toLowerCase();
      const title = a.title || type.charAt(0).toUpperCase() + type.slice(1);
      const icon = admoIcons[type] || 'ℹ️';
      out.push(`> ${icon} **${title}**`);
      out.push('>');
      admonition = true;
      continue;
    }
    if (/^\s*\{\{<\s*\/admonition\s*>\}\}\s*$/.test(raw)) {
      admonition = false;
      out.push('');
      continue;
    }
    raw = raw.replace(/\{\{<\s*image\s+([^>]*?)>\}\}/g, (_all, attrs) => {
      const a = parseAttrs(attrs);
      let cap = (a.caption || '').replace(/\s*\(`image`\)\s*$/i, '').trim();
      const src = a.src || '';
      return `![${cap}](${src})`;
    });
    raw = raw.replace(/\{\{<\s*figure\s+([^>]*?)>\}\}/g, (_all, attrs) => {
      const a = parseAttrs(attrs);
      return `![${(a.caption || a.alt || '').trim()}](${a.src || ''})`;
    });

    if (admonition) {
      out.push(raw.trim().length ? `> ${raw}` : '>');
    } else {
      out.push(raw);
    }
  }
  return out.join('\n');
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.md'));
  for (const file of files) {
    const txt = fs.readFileSync(path.join(SRC, file), 'utf8');
    const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) {
      console.warn('No frontmatter, skipping', file);
      continue;
    }
    const fm = convertFrontmatter(m[1]);
    const body = convertBody(m[2]);
    const outTxt = buildFrontmatter(fm) + '\n\n' + body.replace(/^\n+/, '');
    fs.writeFileSync(path.join(OUT, file), outTxt);
    console.log('Converted', file, '-> tags=' + fm.tags.length, 'draft=' + fm.draft);
  }
  console.log('Done:', files.length, 'posts');
}

main();
