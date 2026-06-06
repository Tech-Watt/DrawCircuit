import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Cpu, Code, FileText, ArrowRight, X, Activity, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import exampleImage from './assets/example.png';

const Home = () => {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="page-shell relative">
      <div className="bg-mesh" />

      {showExample && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowExample(false)}
        >
          <div
            className="relative w-full max-w-5xl card-elevated overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowExample(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-tw-surface-2 hover:bg-tw-surface-3 text-tw-text border border-tw-border transition-colors"
            >
              <X size={20} />
            </button>
            <img src={exampleImage} alt="Circuit Example" className="w-full h-auto" />
          </div>
        </div>
      )}

      <Navbar />

      {/* Hero */}
      <section className="relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="page-container text-center">
          <div className="badge mx-auto mb-6">
            <Zap size={14} /> AI-Powered Circuit Design
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Build Circuits.<br />
            <span className="gradient-text">Master AI.</span>
          </h1>

          <p className="section-subheading mx-auto mb-10">
            The professional platform for young innovators. Design circuits instantly with AI,
            generate production-ready code, and learn with the TechWatt curriculum.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md sm:max-w-none mx-auto">
            <Link to="/app" className="btn btn-primary text-base px-8 py-4">
              Start Designing Free <ArrowRight size={18} />
            </Link>
            <button onClick={() => setShowExample(true)} className="btn btn-secondary text-base px-8 py-4">
              View Example
            </button>
          </div>

          {/* Preview mockup */}
          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
            <div className="card-elevated p-1.5 sm:p-2">
              <div className="rounded-xl bg-tw-bg border border-tw-border h-48 sm:h-72 md:h-80 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-tw-primary/5 via-transparent to-tw-accent/5" />
                <div className="relative text-center px-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-tw-primary/10 border border-tw-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Cpu size={28} className="text-tw-primary" />
                  </div>
                  <p className="text-tw-primary font-mono text-sm sm:text-base">
                    Generating wiring diagram<span className="animate-pulse">...</span>
                  </p>
                </div>
                <div className="absolute top-4 left-4 right-4 space-y-2 opacity-20 hidden sm:block">
                  <div className="h-2 w-1/3 bg-tw-border rounded" />
                  <div className="h-2 w-1/2 bg-tw-border rounded" />
                  <div className="h-2 w-2/5 bg-tw-border rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 border-y border-tw-border bg-tw-surface/50">
        <div className="page-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 'AI', label: 'Diagram Generation' },
              { value: 'C++ / Py', label: 'Auto Code Export' },
              { value: 'BOM', label: 'Cost Estimation' },
              { value: '5+', label: 'Course Tracks' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-tw-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 sm:py-28">
        <div className="page-container">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-4">Everything You Need to Build</h2>
            <p className="section-subheading mx-auto">
              From concept to code, TechWatt handles the heavy lifting so you can focus on innovation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={<Cpu size={28} />}
              title="Intelligent Diagrams"
              desc="Enter a prompt like 'Arduino with Servo' and get a perfect pin-to-pin wiring diagram instantly."
              accent="primary"
            />
            <FeatureCard
              icon={<Code size={28} />}
              title="Auto-Generated Code"
              desc="Get production-ready C++ (Arduino) or Python code tailored to your circuit design."
              accent="accent"
            />
            <FeatureCard
              icon={<FileText size={28} />}
              title="Instant BOM & Cost"
              desc="Detailed Bill of Materials with real-time market price estimations for every component."
              accent="success"
            />
            <FeatureCard
              icon={<GraduationCap size={28} />}
              title="AI & Drone Courses"
              desc="Comprehensive curriculum covering AI, Python, Drones, and Data Analytics for all ages."
              accent="warning"
            />
          </div>
        </div>
      </section>

      {/* Courses CTA */}
      <section className="relative z-10 py-20 sm:py-28 bg-tw-surface/30 border-y border-tw-border">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="badge mb-6">
                <Activity size={14} /> Comprehensive Curriculum
              </div>
              <h2 className="section-heading mb-5">Master the Future with TechWatt</h2>
              <p className="text-tw-muted text-base sm:text-lg leading-relaxed mb-8">
                Empower the next generation with structured learning paths — from AI for Kids to
                Advanced Python, Drone Engineering, and Data Analytics.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Master Prompt Engineering & AI Tools',
                  'Build Real Flying Drones',
                  'Analyze Data with Python & SQL',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-tw-text text-sm sm:text-base">
                    <span className="w-5 h-5 rounded-full bg-tw-primary/15 text-tw-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/study" className="btn btn-primary">
                Explore All Courses <ArrowRight size={18} />
              </Link>
            </div>

            <div className="card-elevated p-6 sm:p-8 space-y-4">
              {[
                { num: '01', title: 'AI for Kids', sub: 'Ages 10+ · 8 Weeks', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                { num: '02', title: 'Drone Building', sub: 'Engineering · Flight', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                { num: '03', title: 'Data Analytics', sub: 'Excel & Python · Professional', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              ].map((course, i) => (
                <div key={course.num} className={`flex items-center gap-4 ${i < 2 ? 'pb-4 border-b border-tw-border' : ''}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border shrink-0 ${course.color}`}>
                    {course.num}
                  </div>
                  <div>
                    <p className="font-bold text-tw-text">{course.title}</p>
                    <p className="text-sm text-tw-muted">{course.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events CTA */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <div className="card-elevated p-8 sm:p-10 text-center">
              <Calendar size={36} className="text-tw-primary mx-auto mb-5" />
              <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Upcoming Events</h2>
              <p className="text-tw-muted text-sm sm:text-base mb-6">
                Join our robotics workshops, AI camps, and hands-on learning sessions.
              </p>
              <Link to="/events" className="btn btn-primary px-8">Register for Events</Link>
            </div>
            <div className="card-elevated p-8 sm:p-10 text-center">
              <BookOpen size={36} className="text-tw-accent mx-auto mb-5" />
              <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Ready to Build?</h2>
              <p className="text-tw-muted text-sm sm:text-base mb-6">
                Jump into the circuit designer or browse our study guides — no account required.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/app" className="btn btn-primary px-6">Circuit Designer</Link>
                <Link to="/study" className="btn btn-secondary px-6">Study Guide</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const accentMap = {
  primary: 'text-tw-primary bg-tw-primary/10 border-tw-primary/20 group-hover:border-tw-primary/40',
  accent: 'text-tw-accent bg-sky-500/10 border-sky-500/20 group-hover:border-sky-500/40',
  success: 'text-tw-success bg-green-500/10 border-green-500/20 group-hover:border-green-500/40',
  warning: 'text-tw-warning bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40',
};

const FeatureCard = ({ icon, title, desc, accent = 'primary' }) => (
  <div className="card p-6 sm:p-8 group hover:-translate-y-1">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-colors ${accentMap[accent]}`}>
      {icon}
    </div>
    <h3 className="text-lg font-bold text-tw-text mb-2">{title}</h3>
    <p className="text-tw-muted text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;
