'use client';

import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    // Enable animations only after JS loads
    document.documentElement.classList.add('js-loaded');

    // Intersection Observer for scroll fade-in
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.anim').forEach((el) => {
      observer.observe(el);
    });

    // Active nav link tracking — pick section closest to top of viewport
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
    const navOffset = 80;

    const updateActiveNav = () => {
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      let currentId = '';

      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= navOffset) {
          currentId = section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Build email via JS so CDNs can't mangle it
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
      emailLink.setAttribute(
        'href',
        ['m','a','i','l','t','o',':','a','b','e','l','m','a','k','0','7','@','g','m','a','i','l','.','c','o','m'].join('')
      );
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveNav);
    };
  }, []);

  return null;
}
