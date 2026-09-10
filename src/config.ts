export const SITE = {
  title: 'ScotScottMcA',
  description: 'Just a blog on things I find interesting.',
  url: 'https://scotscottmca.com',
  author: 'Scott McAllister',
  subtitle: 'Just a blog on things I find interesting.',
  since: 2022,
  keywords: [
    'WSUS',
    'ConfigMgr',
    'Intune',
    'Endpoint Manager',
    'Microsoft',
    'PowerShell',
    'MECM',
  ],
  // Google Analytics measurement id (retained from the Hugo site)
  googleAnalyticsId: 'G-2DLW833T23',
  license: {
    label: 'CC BY-NC 4.0',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
  },
  // JSON behind the unlisted /usage page, written by scripts/usage-stats.mjs.
  // Set PUBLIC_USAGE_DATA_URL (e.g. in .env) to point elsewhere locally.
  usageDataUrl:
    import.meta.env.PUBLIC_USAGE_DATA_URL ||
    'https://gist.githubusercontent.com/scotscottmca/5321ac84ddec1de6e66f6f49f0f5d57f/raw/usage.json',
};

export const SOCIAL = [
  { name: 'GitHub', url: 'https://github.com/smcallister594', icon: 'github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/scottmca', icon: 'linkedin' },
  { name: 'Twitter', url: 'https://twitter.com/ScotScottMcA', icon: 'twitter' },
  { name: 'Reddit', url: 'https://www.reddit.com/user/Scott-PatchMyPC', icon: 'reddit' },
];

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Posts', href: '/posts' },
  { label: 'Projects', href: '/projects' },
  { label: 'Status', href: '/status' },
  { label: 'CV', href: '/cv' },
];
