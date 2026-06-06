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
    description: 'Built and scaled a real-time AI chat platform with persistent multi-channel conversations, configurable third-party service connectors, and streaming response interfaces — with centralized API management and cancellation flows for long-running operations.',
    impact: ['70% bundle size reduction via route-level code splitting & lazy loading', '60% load time improvement', '40–70% code duplication eliminated through modular shared abstractions'],
    tags: ['Vue 3', 'SSE', 'Markdown Rendering', 'Code Splitting', 'Enterprise AI'],
    year: '2025',
    href: null,
  },
  {
    num: '02',
    title: 'Yeedu — Apache Spark Infrastructure Platform',
    company: 'Modak Analytics LLP',
    description: 'Architected core modules for a cloud data engineering platform — AI assistant with SSE streaming and chart visualization, workspace file management with Git-based version control, multi-catalog data browsing, and secrets management.',
    impact: ['6 platform modules built end-to-end — catalog, mounts, Unity Catalog, secrets, workspace files, AI assistant', '66% frontend complexity reduction in secrets management redesign', '30–40% faster debugging workflows through contextual error analysis and real-time diagnostics'],
    tags: ['Vue 3', 'PrimeVue', 'Pinia', 'Tailwind CSS', 'Real-time AI'],
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
