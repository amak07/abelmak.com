# CLAUDE.md — abelmak.com Portfolio Site

## Project Overview

Personal portfolio site for Abel Mak, a full-stack software engineer with 9+ years experience (Visa, Cisco, FM Global). Built with Next.js 15 (App Router, SSG) and deployed on Vercel. Content-driven architecture where JSON/MD files generate static pages at build time. Future phases include a public AI chatbot and private interview prep tool.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Static Site Generation)
- **Hosting**: Vercel (free tier, auto-deploys from GitHub)
- **Domain**: abelmak.com
- **Fonts**: Bricolage Grotesque (display) + Outfit (body) via next/font/google
- **Styles**: Global CSS with CSS variables (no Tailwind, no CSS Modules)
- **Content**: JSON + Markdown files in `content/` directory

## Commands

- `npm.cmd run dev` — Start dev server
- `npm.cmd run build` — Build for production (SSG)
- `npm.cmd run start` — Preview production build

## Design Decisions (locked in)

### Visual Design
- **Style**: Clean, single-page, minimalist
- **Color Palette**: "Terracotta" warm palette
  - Background: `#ffffff` (white) alternating with `#f5f3f0` (warm stone)
  - Text: `#1c1917` (primary), `#57534e` (secondary), `#a8a29e` (muted)
  - Accent: `#c2410c` (terracotta)
  - Accent hover: `#9a3412`
  - Tags: `#fef2f2` bg, `#9a3412` text
- **Fade-in animations**: CSS-only safe — content visible by default, JS adds `.js-loaded` class to enable animations
- **Mobile responsive**: hamburger nav, single-column layout below 640px

### SEO & AI Visibility
- Full meta tags (description, keywords, OG, Twitter Card) generated from `content/site-config.json`
- JSON-LD structured data (Person schema)
- `robots.txt` — allows ALL AI crawlers
- `llms.txt` — LLM discovery file
- `sitemap.xml` — standard sitemap
- Canonical URL: `https://abelmak.com/`

## File Structure

```
abelmak.com/
├── app/
│   ├── layout.tsx              ← Root layout (fonts, meta, JSON-LD)
│   ├── page.tsx                ← Home page (reads content, renders sections)
│   └── globals.css             ← All styles (CSS variables, components, responsive)
├── components/
│   ├── Nav.tsx                 ← Navigation (client component, hamburger toggle)
│   ├── Hero.tsx                ← Hero section
│   ├── Background.tsx          ← About/background section
│   ├── Experience.tsx          ← Experience timeline
│   ├── Projects.tsx            ← Project cards
│   ├── Skills.tsx              ← Skills grid
│   ├── Education.tsx           ← Education section
│   ├── Contact.tsx             ← CTA + contact links
│   ├── Footer.tsx              ← Footer
│   └── ScrollAnimations.tsx    ← Client component (animations, email protection)
├── lib/
│   └── content.ts              ← Content reader functions (build-time)
├── content/
│   ├── site-config.json        ← Name, title, meta tags, social links
│   ├── resume.json             ← Experience, skills, education
│   ├── projects.json           ← Project cards
│   ├── about.md                ← Background paragraphs
│   └── prompts/
│       └── public-chat.txt     ← System prompt for future chatbot
├── public/
│   ├── robots.txt              ← AI crawler permissions
│   ├── llms.txt                ← LLM discovery file
│   └── sitemap.xml             ← Search engine sitemap
├── CLAUDE.md                   ← This file
└── next.config.ts
```

## Content System

To update the site, edit the content files and push to GitHub:

- **Experience/Skills/Education**: Edit `content/resume.json`
- **Projects**: Edit `content/projects.json`
- **Background text**: Edit `content/about.md`
- **Meta tags/links**: Edit `content/site-config.json`

Content files support HTML highlight spans (`<span class="hl">text</span>`) for terracotta-colored emphasis text.

## Key Technical Notes

### Email Protection
Email link is constructed via JavaScript (in `ScrollAnimations.tsx`) to prevent CDN mangling of mailto: links.

### Fade-in Animation Safety
Progressive enhancement pattern: content visible by default, `ScrollAnimations.tsx` adds `.js-loaded` class which enables CSS transitions. IntersectionObserver adds `.visible` class on scroll.

### Fonts
Loaded via `next/font/google` with CSS variables `--font-bricolage` and `--font-outfit`. The globals.css maps these to `--font-display` and `--font-body` with fallback stacks.

## Future Phases

### Phase 3: Public AI Chat (planned)
- `/api/chat` serverless endpoint → Anthropic Messages API
- Chat widget component
- System prompt from `content/prompts/public-chat.txt`
- Cost: ~$1-5/month

### Phase 4: Private Interview Prep (planned)
- `/prep` route behind auth
- Modes: Knowledge Query, Mock Interview, Quick Refresh, STAR Story, Resume Tailor
- Full knowledge base context (~15-20K tokens)

### Phase 5: MCP Automation (planned)
- `portfolio-sync-mcp` server for Claude Project → GitHub sync
- Tools: update_resume, update_project, update_about, sync_knowledge, trigger_deploy

## Privacy Notes
- Company names (Factory Mutual, Relativity Holdings, Cisco, Visa) are used on the public site since it serves as a resume
- For non-resume content (architectural docs, internal write-ups), use generic descriptions ("Enterprise Insurance Platform", "Building Certification Platform") if those documents may be published
