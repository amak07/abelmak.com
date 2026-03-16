import { unstable_noStore } from 'next/cache';
import { getSiteConfig, getResumeData, getProjects, getAbout } from '@/lib/content';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Background from '@/components/Background';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import EducationSection from '@/components/Education';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollAnimations from '@/components/ScrollAnimations';
import ChatCTA from '@/components/ChatCTA';
import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  if (process.env.NODE_ENV === 'development') {
    unstable_noStore();
  }
  const config = getSiteConfig();
  const resume = getResumeData();
  const projects = getProjects();
  const aboutParagraphs = getAbout();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <ChatCTA />
        <Background paragraphs={aboutParagraphs} />
        <Experience items={resume.experience} />
        <Projects items={projects} />
        <Skills skills={resume.skills} />
        <EducationSection education={resume.education} />
        <Contact email={config.email} social={config.social} />
      </main>
      <Footer />
      <ScrollAnimations />
      <ChatWidget />
    </>
  );
}
