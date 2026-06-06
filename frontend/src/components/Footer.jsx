import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => (
  <footer className="border-t border-tw-border bg-tw-surface py-12">
    <div className="page-container">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="TechWatt" className="h-7 w-auto opacity-80" />
          <div>
            <p className="font-semibold text-tw-text">TechWatt AI</p>
            <p className="text-sm text-tw-muted">© 2026 All rights reserved.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/events" className="text-tw-muted hover:text-tw-primary transition-colors">Events</Link>
          <Link to="/app" className="text-tw-muted hover:text-tw-primary transition-colors">Circuit Designer</Link>
          <Link to="/study" className="text-tw-muted hover:text-tw-primary transition-colors">Study Guide</Link>
          <a href="https://www.techwatt.ai/" target="_blank" rel="noopener noreferrer" className="text-tw-muted hover:text-tw-primary transition-colors">
            Academy
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
