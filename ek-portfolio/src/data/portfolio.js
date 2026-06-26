export const person = {
  name: 'Ekamruth Sarma Gangaraju',
  initials: 'ek',
  role: 'Senior Frontend Engineer',
  location: 'Hyderabad, India',
  email: 'ekamruthgangaraju@gmail.com',
  tagline: 'I build the frontend layer where AI becomes usable — real-time, precise, and built to last.',
  available: true,
}

export const socialLinks = [
  { href: 'https://github.com/Ekamruth', label: 'GitHub' },
  { href: 'https://linkedin.com/in/ekamruth-sarma-gangaraju-538a72265', label: 'LinkedIn' },
  { href: `${import.meta.env.BASE_URL}Ekamruth_resume.pdf`, label: 'Resume' },
]

export const workProjects = [
  {
    num: '01',
    title: 'ForgeAI — AI Chat Interfaces',
    company: 'Modak Analytics LLP',
    description: 'Sole frontend owner of the AI chat interfaces for ~5 months — architected a multi-session streaming engine that broke a hard single-session bottleneck, drove a full refactor collapsing 2 monolithic chat surfaces into 1 unified streaming core, and shipped 10+ capabilities end-to-end including branching, job monitoring, slash commands, and reliability hardening.',
    impact: [
      'Concurrent live AI conversations: 1 → unlimited',
      'Stream survival across navigation: 0% → 100%',
      '2 monolithic chat surfaces → 1 unified core; real-time logic paths halved',
      '17 pre-defined test scenarios; streaming rewrite shipped with zero rollback',
      'Job monitoring: 100% terminal-status delivery, survives route changes',
      '10+ features shipped end-to-end — branching, slash commands, sharing, access controls',
    ],
    tags: ['Vue 3', 'SSE', 'Streaming', 'State Machines', 'Enterprise AI'],
    year: '2025',
    href: null,
  },
  {
    num: '02',
    title: 'Yeedu — Apache Spark Infrastructure Platform',
    company: 'Modak Analytics LLP',
    description: 'Drove a full UI framework migration to PrimeVue across 5+ dashboards, architected an end-to-end file-management system with a reusable file-picker across 6+ workflows, built the platform\'s flagship AI assistant (AssistantX + Notebook AI) as a headline release differentiator, and owned 70+ features over 13 months with a near-zero regression rate.',
    impact: [
      '~40% UI dev time cut via reusable PrimeVue component library — tables, loaders, filters, validation',
      '6+ create/edit workflows collapsed into one unified file-picker',
      'Flagship AI assistant shipped: live SSE streaming, syntax highlighting, chart + code output rendering',
      'Infinite scroll across 7+ components; streaming uploads handling 250+ file batches',
      'Unity Catalog integration unblocked enterprise customer adoption',
      '70+ features · 55+ bugs resolved · near-zero regression across 13 months',
    ],
    tags: ['Vue 3', 'PrimeVue', 'Pinia', 'Infinite Scroll', 'Real-time AI'],
    year: '2024',
    href: null,
  },
  {
    num: '03',
    title: 'Enterprise Dashboards & Admin Platforms',
    company: 'Epsilon Infinity Services',
    description: 'Built scalable frontend applications across health-tech, school management, staffing, and internal operations — shared UI component libraries, data-heavy dashboard interfaces, and performance-optimized rendering for large datasets.',
    impact: ['30–40% faster UI performance via virtual scrolling and dynamic rendering', 'Reusable component systems adopted across multiple enterprise products', 'Delivered across 4 domains — health-tech, school management, staffing, internal platforms'],
    tags: ['React.js', 'Vue.js', 'Virtual Scrolling', 'Performance Optimization', 'Enterprise UI'],
    year: '2022',
    href: null,
  },
]

export const personalProjects = []

export const skills = {
  core: ['React.js', 'Vue 3', 'JavaScript (ES6+)', 'TypeScript', 'HTML5 / CSS3'],
  realtime: ['SSE', 'WebSockets', 'Streaming Responses', 'Real-time Systems'],
  architecture: ['Component Architecture', 'State Management', 'Performance Optimization', 'Code Splitting', 'Virtual Scrolling'],
  backend: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'PostgreSQL'],
  tooling: ['Redux', 'Pinia', 'Material UI', 'PrimeVue', 'Jest', 'Vitest', 'Vite', 'Webpack', 'Git', 'CI/CD'],
}

export const stats = [
  { num: '4', suffix: '+', label: 'Years building' },
  { num: '70', suffix: '%', label: 'Bundle size cut' },
  { num: '6', suffix: '', label: 'Modules built end-to-end' },
]

export const experience = [
  {
    role: 'Software Development Engineer',
    company: 'Modak Analytics LLP',
    period: 'July 2024 – Present',
    location: 'Hyderabad, India',
  },
  {
    role: 'Frontend Developer',
    company: 'Epsilon Infinity Services',
    period: 'May 2022 – July 2024',
    location: 'Hyderabad, India',
  },
]
