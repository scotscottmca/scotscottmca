export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// First substantial prose paragraph, with markdown syntax stripped.
export function excerpt(body: string | undefined, max = 160): string {
  const paragraphs = (body || '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\n\s*\n/)
    .map((p) =>
      p
        .replace(/^\s*#+\s.*$/gm, '')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/^\s*(?:[-*+]|>)\s+/gm, '')
        .replace(/[*`_~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    );
  const text = paragraphs.find((p) => p.length >= 40) ?? paragraphs.join(' ').trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Small counts read better as words in a headline: "Ten posts." not "10 posts."
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
  'Nineteen', 'Twenty'];
export function spell(n: number): string {
  return WORDS[n] ?? n.toLocaleString('en-GB');
}

// Tags by use, most-used first: the honest shape of what gets written about.
export function tagCounts(items: { data: { tags: string[] } }[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
