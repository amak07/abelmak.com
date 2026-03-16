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
      </div>
    </div>
  );
}
