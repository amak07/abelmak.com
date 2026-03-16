import Image from 'next/image';

export default function Hero() {
  return (
    <div className="hero-wrap">
      <div className="hero-inner anim">
        <div className="hero-top">
          <div className="hero-text">
            <h1>Thinking through the mess. <span className="accent">Building solutions that work.</span></h1>
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
