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
│   ├── ScrollAnimations.tsx    ← Client component (animations, email protection)
│   ├── ChatWidget.tsx          ← AI chat widget (lazy-loaded, uses Vercel AI SDK)
│   ├── ChatCTA.tsx             ← Chat call-to-action button
│   └── ContactCard.tsx         ← Contact card rendered in chat
├── lib/
│   └── content.ts              ← Content reader functions (build-time)
├── content/
│   ├── site-config.json        ← Name, title, meta tags, social links
│   ├── resume.json             ← Experience, skills, education
│   ├── projects.json           ← Project cards
│   ├── about.md                ← Background paragraphs
│   └── prompts/
│       └── abel_chatbot_system_prompt.txt  ← AI chatbot system prompt
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

### Phase 3: Public AI Chat (implemented)
- `/api/chat` serverless endpoint → Anthropic Claude Haiku via Vercel AI SDK
- `ChatWidget.tsx` — floating chat bubble + panel with streaming, follow-up chips, contact card
- `ContactCard.tsx` — styled contact card rendered when AI mentions contact info
- System prompt: `content/prompts/abel_chatbot_system_prompt.txt`
- 3-level progressive disclosure (L1 overview → L2 story → L3 detail)
- Security: origin check, rate limiting (20/hr/IP), message cap (20/session), input validation
- Structured logging via `after()` for conversation analytics

### Phase 4: Private Interview Prep (planned)
- `/prep` route behind auth
- Modes: Knowledge Query, Mock Interview, Quick Refresh, STAR Story, Resume Tailor
- Full knowledge base context (~15-20K tokens)

### Phase 5: MCP Automation (planned)
- `portfolio-sync-mcp` server for Claude Project → GitHub sync
- Tools: update_resume, update_project, update_about, sync_knowledge, trigger_deploy

## Landing the Plane (Session Completion)

**Plan Rule:** Every implementation plan MUST include "Land the Plane" as its final checklist item.

Work is NOT complete until a successful PR has passed CI and has been MERGED into the target branch.

### 0. Code review (before committing)

Use `superpowers:requesting-code-review` to launch a review subagent. The review must check:

- Do the changes match the stated plan/requirements?
- Was anything added that wasn't in scope?
- Are production changes minimal?
- Fix all Critical and Important issues before proceeding.

**Skill-based audits** — for non-trivial work touching a core area, invoke the relevant skill during review:

| Area changed                     | Audit skill                   |
| -------------------------------- | ----------------------------- |
| React components, UI             | `vercel-react-best-practices` |
| Next.js (API routes, SSR/SSG)    | `vercel-react-best-practices` |
| Accessibility                    | `accessibility`               |
| SEO (meta, schema, sitemap)      | `seo-audit`                   |

### 1. Run quality gates (if code changed)

```bash
./node_modules/.bin/tsc.cmd --noEmit  # Type check
npm.cmd run build                     # Build
```

### 2. Commit, push, and open PR

```bash
git add <files>                  # Stage changes
git commit -m "..."              # Commit
git pull --rebase                # Sync with remote
git push -u origin <branch>     # Push feature branch
gh pr create --title "..." --body "..."  # Open PR against master
```

### 3. Monitor PR until merged

The session is NOT over after pushing. You must:

1. Report to the user that the PR is open and CI is running.
2. Wait for Vercel preview deployment to complete, then check status:
   ```bash
   gh pr checks <pr-number>
   ```
3. If CI/build fails: investigate, fix, push again, and repeat.
4. If CI passes: report to the user that the PR is ready for review/merge.
5. Once the PR is merged, confirm with `gh pr view <pr-number>` and report completion.

**Critical rules:**

- NEVER stop before the PR is merged — that leaves work in limbo
- NEVER say "ready to push when you are" — YOU must push and open the PR
- If CI fails, resolve and retry until it passes
- Report status periodically — the user should never have to ask "what's happening?"

## Privacy Notes
- Company names (Factory Mutual, Relativity Holdings, Cisco, Visa) are used on the public site since it serves as a resume
- For non-resume content (architectural docs, internal write-ups), use generic descriptions ("Enterprise Insurance Platform", "Building Certification Platform") if those documents may be published
