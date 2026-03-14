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

export default function Home() {
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
        <Background paragraphs={aboutParagraphs} />
        <Experience items={resume.experience} />
        <Projects items={projects} />
        <Skills skills={resume.skills} />
        <EducationSection education={resume.education} />
        <Contact email={config.email} social={config.social} />
      </main>
      <Footer />
      <ScrollAnimations />
    </>
  );
}
