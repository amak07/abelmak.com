import fs from 'fs';
import path from 'path';

// Type definitions
export interface ExperienceItem {
  date: string;
  role: string;
  company: string;
  location: string;
  bullets: string[];
  tags: string[];
}

export interface SkillItem {
  category: string;
  items: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  icon: string;
}

export interface ResumeData {
  experience: ExperienceItem[];
  skills: SkillItem[];
  education: Education;
}

export interface ProjectItem {
  title: string;
  link: string;
  description: string;
  tags: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  keywords: string;
  url: string;
  email: string;
  social: {
    linkedin: string;
    github: string;
  };
  og: {
    type: string;
    title: string;
    description: string;
    url: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
  jsonLd: Record<string, unknown>;
}

const contentDir = path.join(process.cwd(), 'content');

export function getSiteConfig(): SiteConfig {
  return JSON.parse(fs.readFileSync(path.join(contentDir, 'site-config.json'), 'utf-8'));
}

export function getResumeData(): ResumeData {
  return JSON.parse(fs.readFileSync(path.join(contentDir, 'resume.json'), 'utf-8'));
}

export function getProjects(): ProjectItem[] {
  return JSON.parse(fs.readFileSync(path.join(contentDir, 'projects.json'), 'utf-8'));
}

export function getAbout(): string[] {
  const content = fs.readFileSync(path.join(contentDir, 'about.md'), 'utf-8');
  return content.split('\n\n').filter(p => p.trim());
}
