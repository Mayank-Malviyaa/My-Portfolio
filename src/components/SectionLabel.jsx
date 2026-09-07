import React from 'react';

/**
 * SectionLabel component provides minimal, consistent numbering and badges
 * e.g., "02 / ABOUT" with an accent indicator line.
 */
export default function SectionLabel({ number, text }) {
  return (
    <div className="section-label-wrapper">
      <div className="section-label-badge">
        <span className="section-label-number">{number}</span>
        <span className="section-label-divider">/</span>
        <span className="section-label-text">{text}</span>
      </div>
      <div className="section-label-line"></div>
    </div>
  );
}
