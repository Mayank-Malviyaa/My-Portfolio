import React from 'react';
import SectionLabel from './SectionLabel';
import { testimonials } from '../data/testimonials';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  // If no genuine testimonials are present, hide gracefully
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const activeTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-container testimonials-section">
      <SectionLabel number="05" text="TESTIMONIALS" />

      <div className="section-header-flex">
        <div>
          <h2 className="section-title">WHAT PEOPLE SAY</h2>
          <p className="section-subtitle">Feedback on engineering discipline, velocity, and architecture standards.</p>
        </div>

        <div className="carousel-nav-buttons">
          <button
            className="carousel-btn"
            onClick={handlePrev}
            aria-label="Previous Testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="carousel-counter">
            0{currentIndex + 1} <span className="counter-slash">/</span> 0{testimonials.length}
          </span>
          <button
            className="carousel-btn"
            onClick={handleNext}
            aria-label="Next Testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="testimonial-featured-card">
        <Quote size={48} className="quote-watermark-icon" />

        <div className="testimonial-content-layout">
          <p className="testimonial-quote-text">
            "{activeTestimonial.quote}"
          </p>

          <div className="testimonial-author-row">
            {activeTestimonial.avatar && (
              <img
                src={activeTestimonial.avatar}
                alt={activeTestimonial.name}
                className="author-avatar-img"
                loading="lazy"
              />
            )}
            <div className="author-details">
              <h3 className="author-name">{activeTestimonial.name}</h3>
              <p className="author-role-company">
                <span>{activeTestimonial.role}</span>
                {activeTestimonial.company && (
                  <>
                    <span className="dot-sep">•</span>
                    <span className="accent-company">{activeTestimonial.company}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="testimonial-progress-indicator">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`indicator-step ${currentIndex === idx ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
