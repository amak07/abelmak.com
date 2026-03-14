import { ExperienceItem } from '@/lib/content';

interface ExperienceProps {
  items: ExperienceItem[];
}

export default function Experience({ items }: ExperienceProps) {
  return (
    <section className="section-wrap" id="experience" aria-label="Experience">
      <div className="section-inner anim">
        <h2 className="section-header">Experience</h2>
        <div className="section-header-line"></div>
        {items.map((item, i) => (
          <div className="experience-item" key={i}>
            <div className="experience-date">{item.date}</div>
            <div>
              <h3 className="experience-role">{item.role}</h3>
              <div className="experience-company">{item.company} · {item.location}</div>
              <ul className="experience-desc">
                {item.bullets.map((bullet, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: bullet }} />
                ))}
              </ul>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
