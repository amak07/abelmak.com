import { Education as EducationType } from '@/lib/content';

interface EducationProps {
  education: EducationType;
}

export default function EducationSection({ education }: EducationProps) {
  return (
    <section className="section-wrap" aria-label="Education">
      <div className="section-inner anim">
        <h2 className="section-header">Education</h2>
        <div className="section-header-line"></div>
        <div className="education-item">
          <div className="edu-icon">{education.icon}</div>
          <div className="edu-details">
            <h3>{education.school}</h3>
            <p className="edu-sub">{education.degree} · {education.year}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
