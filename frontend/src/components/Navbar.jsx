import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = ({ links = [], cta }) => {
  const [open, setOpen] = useState(false);

  const defaultLinks = [
    { to: '/#features', label: 'Features', external: false },
    { to: '/events', label: 'Events' },
    { to: '/study', label: 'Study Guide' },
    { to: '/app', label: 'Circuit Designer' },
  ];

  const navLinks = links.length ? links : defaultLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-tw-border bg-tw-bg/90 backdrop-blur-xl">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
            <img src={logo} alt="TechWatt" className="h-8 w-auto" />
            <span className="text-lg font-bold gradient-text hidden xs:block sm:block">TechWatt</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.external ? (
                <a key={link.label} href={link.to} className="btn btn-ghost text-sm">
                  {link.label}
                </a>
              ) : link.to.startsWith('/#') ? (
                <a key={link.label} href={link.to} className="btn btn-ghost text-sm">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.to} className="btn btn-ghost text-sm">
                  {link.label}
                </Link>
              )
            )}
            {cta || (
              <Link to="/app" className="btn btn-primary btn-sm ml-2">
                Start Designing
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-tw-muted hover:text-tw-text hover:bg-tw-surface-2 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-tw-border bg-tw-surface animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="page-container py-4 flex flex-col gap-1">
            {navLinks.map((link) =>
              link.to.startsWith('/#') ? (
                <a
                  key={link.label}
                  href={link.to}
                  className="px-4 py-3 rounded-lg text-tw-muted hover:text-tw-text hover:bg-tw-surface-2 transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  className="px-4 py-3 rounded-lg text-tw-muted hover:text-tw-text hover:bg-tw-surface-2 transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/app"
              className="btn btn-primary mt-2 mx-4"
              onClick={() => setOpen(false)}
            >
              Start Designing
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
