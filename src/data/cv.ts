// Single source of truth for career facts. The CV page renders all of it; the
// home page reads headline figures from here so the two can never drift.
//
// Every figure below is drawn from real commit/PR history. Nothing here is
// estimated or rounded up — if a number is not known, it is absent, not guessed.

export interface CvProject {
  name: string;
  context: string;
  period?: string;
  summary: string;
  bullets: string[];
  tags: string[];
}

export const ROLE = {
  org: 'Patch My PC',
  title: 'Software Developer',
  start: 'August 2021',
  /** The span the listed bodies of work are drawn from. */
  listed: '2025 – 2026',
  location: 'Larkhall, Scotland',
};

export const PROJECTS: CvProject[] = [
  {
    name: 'Publisher — Remote UI',
    context: 'Flagship, multi-release',
    summary:
      'Multi-release initiative moving the Settings UI to run remotely against the ' +
      'service over a new Config API.',
    bullets: [
      'Multi-session support: locking, read-only vs. read/write promotion, session roster, disconnect picker, status pills.',
      'Redesigned ConfigApi around an RBAC role model with hardened HTTP status handling and Swagger docs.',
      'Streamed content operations over the wire — staged content, scripts, Collect Logs — and de-elevated the Settings UI (asInvoker) with UI-only and service-only install modes.',
      'Migrated the codebase from packages.config to PackageReference with Central Package Management; added ARM64 support.',
    ],
    tags: ['C#', 'WPF/XAML (MVVM)', 'VB.NET', 'PowerShell', 'MS Graph', 'WSUS SDK', 'Polly', 'LiteDB', 'Azure DevOps'],
  },
  {
    name: 'Arthur v2',
    context: 'AI log analysis & diagnostics platform',
    summary:
      'Core contributor across infrastructure, backend, frontend and documentation for ' +
      'an AI-powered log-analysis and diagnostics platform.',
    bullets: [
      'Built blue/green release control for zero-downtime deploys, with promotion and retirement workflows and ARM identity handling.',
      'Added live admin-console data and Foundry Skills / per-session MCP server integration for agent tooling.',
      'Built typed evidence tools, citation verification, answer streaming, and PromptShield screening for large bundles.',
      'Optimised log parsing and zip/gzip extraction for large diagnostic bundles.',
    ],
    tags: ['C#/.NET', 'TypeScript', 'React', 'Terraform', 'Azure', 'DuckDB', 'Parquet', 'Docker', 'Nginx', 'xUnit', 'Vitest', 'Playwright'],
  },
  {
    name: 'Customer Portal & Customer API',
    context: 'License Management',
    period: 'Mar – Sep 2026',
    summary:
      'Led UI modernisation and the catalog approval pipeline for the customer-facing ' +
      'License Management portal, plus matching work in the backing API.',
    bullets: [
      'Built catalog approval workflows: RBAC, audit logging, live progress, per-file retry and revert, conflict handling.',
      'Added Cloud Catalog support — Azure Blob-backed upload, download and approval, hash verification, live logs, local Azurite development.',
      'Shipped preview channels, automated publishing, and direct-to-production approval pipelines.',
      'Extended the Customer API (C#/.NET) with transactional approval and undo, authenticated blob downloads, feature flags, and managed-identity auth.',
    ],
    tags: ['PHP', 'C#/.NET', 'JavaScript', 'MySQL', 'Docker', 'Azure Pipelines', 'PowerShell', 'Azure Blob Storage', 'OAuth'],
  },
  {
    name: 'Cliffs Notes',
    context: 'AI release-notes generator',
    summary:
      'Azure Functions service that auto-consolidates release notes from DevOps work ' +
      'items using GPT-5.x reasoning models.',
    bullets: [
      'Per-audience filtering and formatting (end user, technical, internal) with Teams channel posting.',
      'Cut generation time from 30-minute timeouts to a reliable 4–5 minutes, eliminating 2,900+ redundant API calls.',
      'Tag-authoritative categorisation with content-based inference for edge cases.',
      'Shipped with a 59/59 passing test suite and full backward compatibility.',
    ],
    tags: ['Node.js', 'Azure Functions', 'Azure DevOps SDK', 'OpenAI GPT-5.x', 'Teams Adaptive Cards'],
  },
];

export const SKILLS = [
  { group: 'Languages', items: ['C#', 'VB.NET', 'TypeScript / JavaScript', 'PowerShell', 'PHP', 'SQL'] },
  { group: 'Frontend', items: ['React', 'WPF/XAML (MVVM)', 'HTML/CSS', 'Teams Adaptive Cards'] },
  { group: 'Cloud & infrastructure', items: ['Azure (Functions, Pipelines, Blob Storage, Managed Identity)', 'Terraform', 'Docker', 'Nginx'] },
  { group: 'Data', items: ['MySQL', 'DuckDB', 'Parquet', 'LiteDB'] },
  { group: 'AI & agents', items: ['OpenAI GPT-5.x', 'Model Context Protocol (MCP)', 'Agent orchestration', 'Evidence and citation tooling'] },
  { group: 'Testing & tooling', items: ['xUnit', 'Vitest', 'Playwright', 'Polly', 'MS Graph SDK', 'WSUS SDK'] },
];

/** Contribution volume per body of work, as reported from commit and PR
 *  history. The home page shows the totals rather than any single project, so
 *  the components live here and the sum is computed — never typed by hand. */
export const CONTRIBUTIONS = [
  { commits: 556, prs: 244 },
  { commits: 79, prs: 38 },
  { commits: 106, prs: 34 },
  { commits: 633, prs: 512 },
];

const total = (key: 'commits' | 'prs') =>
  CONTRIBUTIONS.reduce((sum, entry) => sum + entry[key], 0).toLocaleString('en-GB');

/** The two figures the home page sets as readouts, and the period they cover. */
export const HEADLINE_FIGURES = [
  { value: total('commits'), unit: 'commits' },
  { value: total('prs'), unit: 'pull requests' },
];
export const FIGURES_PERIOD = '2026';

export const CONTACT = {
  linkedin: 'https://www.linkedin.com/in/scottmca',
  github: 'https://github.com/smcallister594',
};
