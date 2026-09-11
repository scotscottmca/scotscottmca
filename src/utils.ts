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
