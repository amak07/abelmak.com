interface BackgroundProps {
  paragraphs: string[];
}

export default function Background({ paragraphs }: BackgroundProps) {
  return (
    <section className="section-wrap" id="background" aria-label="Background">
      <div className="section-inner anim">
        <h2 className="section-header">Background</h2>
        <div className="section-header-line"></div>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="about-text"
            style={i === 2 ? { marginTop: '1rem' } : undefined}
            dangerouslySetInnerHTML={{ __html: p }}
          />
        ))}
      </div>
    </section>
  );
}
