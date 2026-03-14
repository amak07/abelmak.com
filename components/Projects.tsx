import { ProjectItem } from '@/lib/content';

interface ProjectsProps {
  items: ProjectItem[];
}

export default function Projects({ items }: ProjectsProps) {
  return (
    <section className="section-wrap" id="projects" aria-label="Projects">
      <div className="section-inner anim">
        <h2 className="section-header">Projects</h2>
        <div className="section-header-line"></div>
        {items.map((project, i) => (
          <div className="project-card" key={i}>
            <h3><a href={project.link}>{project.title}</a></h3>
            <p dangerouslySetInnerHTML={{ __html: project.description }} />
            <div className="tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
