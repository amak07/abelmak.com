'use client';

export default function ChatCTA() {
  function handleClick() {
    window.dispatchEvent(new CustomEvent('open-chat'));
  }

  return (
    <div className="chat-cta anim">
      <div className="section-inner">
        <p className="chat-cta-text">Curious about my work?</p>
        <button className="chat-cta-btn" onClick={handleClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Chat with AI about me
        </button>
        <a href="/Abel_Mak_Resume.pdf" download="Abel_Mak_Resume.pdf" className="chat-cta-download">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Resume
        </a>
      </div>
    </div>
  );
}
