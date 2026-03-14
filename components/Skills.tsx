import { Fragment } from 'react';
import { SkillItem } from '@/lib/content';

interface SkillsProps {
  skills: SkillItem[];
}

export default function Skills({ skills }: SkillsProps) {
  return (
    <section className="section-wrap" id="skills" aria-label="Skills">
      <div className="section-inner anim">
        <h2 className="section-header">What I Work With</h2>
        <div className="section-header-line"></div>
        <dl className="skills-grid">
          {skills.map((skill) => (
            <Fragment key={skill.category}>
              <dt>{skill.category}</dt>
              <dd>{skill.items}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </section>
  );
}
