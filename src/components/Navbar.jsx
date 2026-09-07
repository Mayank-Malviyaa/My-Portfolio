import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({ activeSection }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Journey', href: '#journey', id: 'journey' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Custom Geometric Monogram Logo */}
        <a
          href="#home"
          className="brand-logo"
          onClick={(e) => handleNavClick(e, '#home')}
          aria-label="Mayank Malviya Home"
        >
          <svg className="logo-svg" width="38" height="38" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="8" fill="#141414" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* First M (White) */}
            <path d="M10 31V13L18 24L26 13V31" stroke="#F5F5F5" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Intersecting Connected Second M (Orange Accent) */}
            <path d="M18 31V18L26 29L34 18V31" stroke="#FF6A00" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="brand-text">
            <span className="brand-name">MAYANK</span>
            <span className="brand-sub">DEV</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`desktop-nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
                {isActive && <span className="active-pill-dot" />}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA Button & Mobile Hamburger Toggle */}
        <div className="navbar-right">
          <a
            href="#contact"
            className="navbar-cta-btn"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="cta-icon" size={15} />
          </a>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <nav className="mobile-nav-links" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              <span className="mobile-nav-name">{link.name}</span>
              <ArrowUpRight size={18} className="mobile-arrow" />
            </a>
          ))}
          <a
            href="#contact"
            className="mobile-cta-btn"
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
