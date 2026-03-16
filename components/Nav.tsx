'use client';

import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-brand">
          <img src="/bioengineering_11675822.png" alt="" width={28} height={28} className="nav-logo" />
          Abel Mak
        </a>
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {[
            { label: 'Background', href: '#background' },
            { label: 'Experience', href: '#experience' },
            { label: 'Projects', href: '#projects' },
            { label: 'Skills', href: '#skills' },
            { label: 'Contact', href: '#contact' },
          ].map((item) => (
            <li key={item.label}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
