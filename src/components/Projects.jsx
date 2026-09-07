import React from 'react';
import SectionLabel from './SectionLabel';
import { projects } from '../data/projects';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

export default function Projects() {
  return (
    <section id="projects" className="section-container projects-section">
      <SectionLabel number="04" text="SELECTED WORK" />

      <div className="section-header-flex">
        <div>
          <h2 className="section-title">FEATURED PROJECTS</h2>
          <p className="section-subtitle">Real-world applications built with clean architecture, authentication, and database persistence.</p>
        </div>
      </div>

      <div className="projects-cards-grid">
        {projects.map((project) => (
          <article key={project.id} className="project-card">
            <div className="project-image-container">
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="project-img"
                loading="lazy"
              />
              <div className="project-image-overlay">
                <div className="project-quick-links">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-link-btn"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github size={15} />
                      <span>Source</span>
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="quick-link-btn primary"
                      aria-label={`Open live preview of ${project.title}`}
                    >
                      <ExternalLink size={15} />
                      <span>Live Preview</span>
                    </a>
                  )}
                </div>
              </div>
              <span className="project-category-badge">{project.category}</span>
            </div>

            <div className="project-info">
              <div className="project-title-row">
                <h3 className="project-card-title">{project.title}</h3>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-arrow-link"
                    aria-label={`Visit ${project.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </a>
                )}
              </div>

              <p className="project-card-desc">{project.description}</p>

              <div className="project-tech-stack">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-bottom-actions">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-action"
                  >
                    <Github size={14} />
                    <span>GITHUB REPOSITORY</span>
                  </a>
                ) : null}

                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-action accent"
                  >
                    <span>LIVE PREVIEW</span>
                    <ArrowUpRight size={14} />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
