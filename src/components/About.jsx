import React from 'react';
import SectionLabel from './SectionLabel';
import { GraduationCap } from 'lucide-react';

export default function About() {
  const tools = [
    { category: "Frontend", items: ["React", "JavaScript (ES6+)", "HTML5", "CSS3", "Vite"] },
    { category: "Backend", items: ["Node.js", "Express", "REST APIs", "bcrypt", "CORS"] },
    { category: "Database", items: ["MongoDB", "Mongoose"] },
    { category: "Tools & Workflow", items: ["Git", "GitHub", "VS Code", "Postman"] }
  ];

  return (
    <section id="about" className="section-container about-section">
      <SectionLabel number="02" text="ABOUT ME" />

      <div className="about-editorial-grid">
        {/* Left Column: Heading & Academic Background */}
        <div className="about-statement-col">
          <h2 className="about-large-heading">
            BUILDING WITH <br />
            <span className="accent-glow">DISCIPLINE.</span>
          </h2>
          <p className="about-lead-quote">
            "Engineering software demands the same consistency as physical training: focus on fundamentals, repetition, and steady daily execution."
          </p>

          <div className="about-education-card">
            <div className="education-card-header">
              <GraduationCap size={20} className="accent-icon" />
              <span className="education-tag">EDUCATION</span>
            </div>
            <h3 className="education-degree">B.Tech in Electronics & Communication Engineering</h3>
            <p className="education-sub">Undergraduate Degree • Expected Graduation 2027</p>

            <div className="academic-pills-row">
              <div className="academic-pill">
                <span className="pill-year">2022</span>
                <span className="pill-text">12th: <strong>86.4%</strong></span>
              </div>
              <div className="academic-pill">
                <span className="pill-year">2020</span>
                <span className="pill-text">10th: <strong>90.8%</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Natural Bio & Core Stack */}
        <div className="about-details-col">
          <div className="about-bio-text">
            <p>
              I am a <strong>Full Stack Developer</strong> and an engineering student pursuing my <strong>B.Tech in Electronics & Communication Engineering</strong> with expected graduation in <strong>2027</strong>.
            </p>
            <p>
              I focus on building practical, full-stack web applications from the ground up—handling user authentication, server-side business logic, database persistence, and clean, responsive user interfaces.
            </p>
            <p>
              Instead of relying on superficial buzzwords, I prioritize solid fundamentals: understanding how the backend coordinates with the database, structuring maintainable code, and improving steadily through hands-on project building.
            </p>
          </div>

          {/* Tools & Technologies */}
          <div className="tools-ecosystem-wrapper">
            <h3 className="tools-title">CORE TECHNOLOGIES</h3>
            <div className="tools-grid">
              {tools.map((group, idx) => (
                <div key={idx} className="tool-category-card">
                  <span className="tool-cat-name">{group.category}</span>
                  <div className="tool-tags-flex">
                    {group.items.map((item, itemIdx) => (
                      <span key={itemIdx} className="tool-badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
