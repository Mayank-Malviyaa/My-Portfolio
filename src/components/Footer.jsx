import React from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-container">
      <div className="footer-top-row">
        <div className="footer-brand-summary">
          <div className="footer-logo">
            <span className="logo-white">MAYANK</span>
            <span className="logo-orange">MALVIYA</span>
          </div>
          <p className="footer-tagline">
            Full Stack Developer — Discipline fuels better code. Focused on building scalable, real-world web applications.
          </p>
        </div>

        {/* Footer Navigation: Home, About, Journey, Projects, Contact */}
        <div className="footer-links-group">
          <span className="footer-group-title">NAVIGATION</span>
          <div className="footer-links-list">
            <a href="#home" className="footer-link">Home</a>
            <a href="#about" className="footer-link">About</a>
            <a href="#journey" className="footer-link">Journey</a>
            <a href="#projects" className="footer-link">Projects</a>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
        </div>

        {/* Social / Connect: Real GitHub & LinkedIn */}
        <div className="footer-links-group">
          <span className="footer-group-title">CONNECT</span>
          <div className="footer-links-list">
            <a href="https://github.com/Mayank-Malviyaa" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="https://www.linkedin.com/in/mayank-malviya-9b87882a7/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
            <a href="mailto:mayank.bhadauns@gmail.com" className="footer-link">Email</a>
          </div>
        </div>

        {/* Back to top */}
        <div className="footer-back-top-col">
          <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Scroll to top of page">
            <ArrowUp size={18} />
            <span>BACK TO TOP</span>
          </button>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-copyright">
          © 2026 Mayank Malviya. All rights reserved.
        </div>

        <div className="footer-tech-note">
          <span>React • Node.js • Express</span>
          <span className="footer-sep">•</span>
          <span className="gym-mantra">DISCIPLINE FUELS BETTER CODE</span>
        </div>
      </div>
    </footer>
  );
}
