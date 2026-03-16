import Image from 'next/image';

export default function Hero() {
  return (
    <div className="hero-wrap">
      <div className="hero-inner anim">
        <div className="hero-top">
          <div className="hero-text">
            <h1>Abel Mak <span className="accent">Full-Stack Software Engineer</span></h1>
            <p className="hero-tagline">Thinking through the mess. Building solutions that work.</p>
          </div>
          <div className="hero-photo">
            <Image src="/profile_pic.webp" alt="Abel Mak, Full-Stack Software Engineer" width={320} height={320} priority />
          </div>
        </div>
        <p className="hero-intro">
          I&apos;m a <span className="hl">full-stack engineer</span> who gravitates toward the messy parts of a project — where requirements are fuzzy, tradeoffs matter, and the right answer isn&apos;t obvious yet. Lately I&apos;ve been pairing with AI tools like <span className="hl">Claude Code</span> to solve hard problems faster and ship better code.
        </p>
      </div>
    </div>
  );
}
