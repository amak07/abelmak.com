'use client';

import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-brand">Abel Mak</a>
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links${open ? ' open' : ''}`}>
          {['Background', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
