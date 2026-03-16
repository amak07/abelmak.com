'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState, FormEvent } from 'react';
import ContactCard from './ContactCard';

const MAX_MESSAGES = 20;

const SUGGESTED_QUESTIONS = [
  'What do you build?',
  'Tell me about your recent work',
  'How can I contact you?',
];

const LINKIFY_PATTERN = /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|(?:linkedin\.com|github\.com)\/[^\s]+)/g;
const FOLLOW_UP_PATTERN = /^->\s*"?(.+?)"?\s*$/;
const CONTACT_LINE_PATTERN = /^[-–—]?\s*(email|linkedin|github)\s*[:\-–]/i;

// Parse assistant messages: split text from -> follow-up prompts
function parseMessage(content: string): { text: string; followUps: string[]; hasContact: boolean } {
  const lines = content.split('\n');
  const textLines: string[] = [];
  const followUps: string[] = [];

  for (const line of lines) {
    const match = line.match(FOLLOW_UP_PATTERN);
    if (match) {
      followUps.push(match[1]);
    } else {
      textLines.push(line);
    }
  }

  let text = textLines.join('\n').trim();
  const lower = text.toLowerCase();
  const hasContact =
    lower.includes('abelmak07@gmail.com') ||
    (lower.includes('linkedin') && lower.includes('email'));

  if (hasContact) {
    text = text
      .split('\n')
      .filter((l) => {
        const lt = l.toLowerCase().trim();
        return (
          !lt.includes('abelmak07@gmail.com') &&
          !lt.includes('linkedin.com/in/abelmak') &&
          !lt.includes('github.com/amak') &&
          !CONTACT_LINE_PATTERN.test(lt)
        );
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  return { text, followUps, hasContact };
}

// Convert URLs and emails in text to clickable links
function linkify(text: string): (string | React.ReactElement)[] {
  LINKIFY_PATTERN.lastIndex = 0;
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = LINKIFY_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const value = match[0];
    const isEmail = value.includes('@') && !value.includes('/');
    const href = isEmail
      ? `mailto:${value}`
      : value.startsWith('http') ? value : `https://${value}`;
    parts.push(
      <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="chat-link">
        {value}
      </a>
    );
    lastIndex = LINKIFY_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// Get text content from message parts
function getMessageText(msg: { parts: Array<{ type: string; text?: string }> }): string {
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userScrolledUp = useRef(false);
  const isAutoScrolling = useRef(false);

  const { messages, sendMessage, status, error } = useChat();
  const [showThinking, setShowThinking] = useState(false);
  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isStreaming = status === 'streaming' || status === 'submitted';
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const isAtLimit = userMessageCount >= MAX_MESSAGES;

  // Show thinking dots for a minimum duration when a new request starts
  useEffect(() => {
    if (status === 'submitted') {
      setShowThinking(true);
      thinkingTimerRef.current = setTimeout(() => {
        setShowThinking(false);
      }, 1500);
    }
    return () => {
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    };
  }, [status]);

  // Detect user manually scrolling up (vs our programmatic scroll)
  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (isAutoScrolling.current) return;
      const distFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      userScrolledUp.current = distFromBottom > 60;
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll unless user has scrolled up; reset flag when streaming ends
  useEffect(() => {
    if (!userScrolledUp.current) {
      const container = messagesRef.current;
      if (container) {
        isAutoScrolling.current = true;
        container.scrollTop = container.scrollHeight;
        requestAnimationFrame(() => { isAutoScrolling.current = false; });
      }
    }
    if (!isStreaming) userScrolledUp.current = false;
  }, [messages, isStreaming]);

  // Focus input when panel opens (skip on mobile to avoid raising keyboard)
  useEffect(() => {
    if (isOpen && window.innerWidth > 640) inputRef.current?.focus();
  }, [isOpen]);

  // Listen for open-chat custom event (from CTA)
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);

  // Escape key closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Mobile keyboard: adjust chat panel height when virtual keyboard opens (desktop only)
  useEffect(() => {
    if (!isOpen || !window.visualViewport) return;
    if (window.innerWidth <= 640) return; // fullscreen mode handles mobile
    const vv = window.visualViewport;
    const handleResize = () => {
      const panel = document.querySelector('.chat-panel') as HTMLElement | null;
      if (!panel) return;
      const keyboardHeight = window.innerHeight - vv.height;
      if (keyboardHeight > 100) {
        panel.style.bottom = `${keyboardHeight + 8}px`;
        panel.style.maxHeight = `${vv.height - 70}px`;
      } else {
        panel.style.bottom = '';
        panel.style.maxHeight = '';
      }
    };
    vv.addEventListener('resize', handleResize);
    return () => vv.removeEventListener('resize', handleResize);
  }, [isOpen]);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }

  function handleSend(content: string) {
    if (!content.trim() || isStreaming || isAtLimit) return;
    sendMessage({ text: content.trim() });
    setInput('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  // Determine if the last message is the currently streaming one
  const lastMsg = messages[messages.length - 1];
  const isLastMsgStreaming = isStreaming && lastMsg?.role === 'assistant';

  return (
    <div className="chat-widget">
      {/* Floating bubble */}
      <button
        className={`chat-bubble ${isOpen ? 'chat-bubble-open' : ''}`}
        onClick={() => isOpen ? handleClose() : setIsOpen(true)}
        aria-label={isOpen ? 'Close chat' : "Chat with Abel's AI"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {(isOpen || isClosing) && (
        <div className={`chat-panel ${isClosing ? 'chat-panel-closing' : ''}`} role="dialog" aria-label="Chat with Abel">
          <div className="chat-header">
            <span className="chat-header-title">Chat with Abel</span>
            <span className="chat-badge">AI</span>
            <button
              className="chat-close"
              onClick={handleClose}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="chat-messages" ref={messagesRef} role="log" aria-live="polite" aria-label="Chat messages">
            {messages.length === 0 && !isStreaming && (
              <div className="chat-welcome">
                <p>
                  Hey! I&apos;m Abel&apos;s AI assistant. Ask me about my experience,
                  projects, or technical skills.
                </p>
                <div className="chat-chips">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="chat-chip"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => {
              const text = getMessageText(msg);

              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="chat-msg chat-msg-user">
                    {text}
                  </div>
                );
              }

              const isThisStreaming = isLastMsgStreaming && i === messages.length - 1;
              const parsed = parseMessage(text);

              // Show typing dots while thinking or waiting for first content
              if (isThisStreaming && (!parsed.text || showThinking)) {
                return (
                  <div key={msg.id} className="chat-typing" role="status">
                    <span className="visually-hidden">Abel is typing</span>
                    <span className="chat-dot" aria-hidden="true" />
                    <span className="chat-dot" aria-hidden="true" />
                    <span className="chat-dot" aria-hidden="true" />
                  </div>
                );
              }

              return (
                <div key={msg.id} className="chat-msg-group">
                  <div className="chat-msg chat-msg-assistant">
                    {linkify(parsed.text)}
                    {isThisStreaming && <span className="chat-cursor" />}
                  </div>
                  {parsed.hasContact && !isThisStreaming && <ContactCard />}
                  {parsed.followUps.length > 0 && !isThisStreaming && (
                    <div className="chat-followups">
                      {parsed.followUps.map((q) => (
                        <button
                          key={q}
                          className="chat-chip"
                          onClick={() => handleSend(q)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="chat-error" role="alert">
              {error.message === 'Service unavailable' || error.message === 'Something went wrong'
                ? 'Chat is temporarily unavailable. Try again later.'
                : error.message}
            </div>
          )}

          {isAtLimit ? (
            <div className="chat-limit" role="status">
              Session limit reached. Refresh to start a new conversation.
            </div>
          ) : (
            <form className="chat-input-wrap" onSubmit={handleSubmit}>
              <label htmlFor="chat-input" className="visually-hidden">Message</label>
              <input
                id="chat-input"
                ref={inputRef}
                className="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isStreaming}
                maxLength={500}
              />
              <button
                className="chat-send"
                type="submit"
                disabled={isStreaming || !input.trim()}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
