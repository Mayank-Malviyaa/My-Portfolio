import React from 'react';
import SectionLabel from './SectionLabel';
import { journey } from '../data/journey';
import { School, BookOpen, GraduationCap, Clock } from 'lucide-react';

export default function Journey() {
  const getIcon = (index) => {
    switch (index) {
      case 0: return <School size={18} className="journey-node-icon" />;
      case 1: return <BookOpen size={18} className="journey-node-icon" />;
      case 2: return <GraduationCap size={18} className="journey-node-icon" />;
      case 3: return <Clock size={18} className="journey-node-icon" />;
      default: return <GraduationCap size={18} className="journey-node-icon" />;
    }
  };

  return (
    <section id="journey" className="section-container journey-section">
      <SectionLabel number="03" text="JOURNEY" />

      <div className="section-header-flex">
        <div>
          <h2 className="section-title">MY JOURNEY</h2>
          <p className="section-subtitle">Education and confirmed milestones.</p>
        </div>
      </div>

      <div className="journey-timeline-container">
        <div className="timeline-center-rail"></div>

        {journey.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={item.id || index} className={`journey-item-row ${isEven ? 'left' : 'right'}`}>
              <div className="journey-center-node">
                {getIcon(index)}
              </div>

              <div className="journey-content-card">
                <div className="journey-card-header">
                  <span className="journey-year-pill">{item.year}</span>
                </div>

                <h3 className="journey-role-title">{item.title}</h3>
                <p className="journey-card-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
