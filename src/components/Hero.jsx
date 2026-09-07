import React, { useEffect, useRef } from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const roleRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const socialsRef = useRef(null);
  const imageWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        roleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      )
      .fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.5'
      )
      .fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
      .fromTo(
        socialsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        imageWrapperRef.current,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        '-=1.2'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToProjects = (e) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeClick = (e) => {
    // Check if resume.pdf exists or gracefully fallback to contact section
    fetch('/resume.pdf', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          window.open('/resume.pdf', '_blank');
        } else {
          const contactSec = document.querySelector('#contact');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      })
      .catch(() => {
        const contactSec = document.querySelector('#contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      });
  };

  return (
    <section id="home" className="hero-viewport" ref={heroRef}>
      <div className="hero-grid-container">
        {/* Left Column: Typography & CTAs (Placed on dark negative space, zero overlap on face) */}
        <div className="hero-left-content">
          <div className="hero-role-wrapper" ref={roleRef}>
            <span className="hero-role-badge">FULL STACK DEVELOPER</span>
            <span className="hero-role-dash" />
          </div>

          <div className="hero-title-container" ref={headlineRef}>
            <h1 className="hero-name-heading">
              <span className="name-part-solid">MAYANK</span>
              <span className="name-part-outline">MALVIYA</span>
            </h1>
            <p className="hero-tagline">
              <span className="accent-word">DISCIPLINE</span> FUELS BETTER CODE.
              <span className="cursor-blink">|</span>
            </p>
          </div>

          <p className="hero-summary-text" ref={descRef}>
            I build scalable web applications with modern technologies, focused on clean code,
            real-world solutions, and continuous improvement.
          </p>

          <div className="hero-button-group" ref={ctaRef}>
            <a href="#projects" className="btn-primary-action" onClick={handleScrollToProjects}>
              <span>View My Work</span>
              <ArrowRight size={16} className="btn-icon" />
            </a>

            <button
              onClick={handleResumeClick}
              className="btn-secondary-action"
              title="View or Request Mayank's Resume"
            >
              <span>Download Resume</span>
              <Download size={15} className="btn-icon" />
            </button>
          </div>

          {/* Real Social Links */}
          <div className="hero-socials-bar" ref={socialsRef}>
            <a
              href="https://github.com/Mayank-Malviyaa"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-item"
              aria-label="Mayank's GitHub Profile"
            >
              <Github size={19} />
            </a>
            <a
              href="https://www.linkedin.com/in/mayank-malviya-9b87882a7/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-item"
              aria-label="Mayank's LinkedIn Profile"
            >
              <Linkedin size={19} />
            </a>
            <a
              href="mailto:mayank.bhadauns@gmail.com"
              className="hero-social-item"
              aria-label="Email Mayank Malviya"
            >
              <Mail size={19} />
            </a>
          </div>
        </div>

        {/* Right Column: High contrast cinematic gym portrait with amber rim lighting */}
        <div className="hero-right-visual" ref={imageWrapperRef}>
          <div className="hero-image-frame">
            <img
              src="frames/frame_000001.jpg"
              alt="Mayank Malviya - Full Stack Developer in gym training atmosphere"
              className="hero-portrait-img"
              loading="eager"
            />
            <div className="portrait-vignette" />
            <div className="portrait-rim-light" />
            
            <div className="hero-corner-meta">
              <span className="meta-pillar">BUILD</span>
              <span className="meta-dot">•</span>
              <span className="meta-pillar">LEARN</span>
              <span className="meta-dot">•</span>
              <span className="meta-pillar">IMPROVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue">
        <span className="cue-line" />
        <span className="cue-text">SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}
