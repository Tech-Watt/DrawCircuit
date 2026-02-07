import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Cpu, Code, FileText, ArrowRight, X } from 'lucide-react';
import logo from './assets/logo.png';
import exampleImage from './assets/example.png';

const Home = () => {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative">
      {/* Example Modal */}
      {showExample && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-4" onClick={() => setShowExample(false)}>
          <div className="relative max-w-3xl w-full bg-white rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowExample(false)}
              className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white text-gray-800 transition-colors z-10"
            >
              <X size={24} />
            </button>
            <img src={exampleImage} alt="Circuit Example" className="w-full h-auto" />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="TechWatt Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                TechWatt Circuit AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <Link to="/study" className="text-gray-600 hover:text-blue-600 transition-colors">Study Guide</Link>
              <Link to="/app" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
          <Zap size={16} fill="currentColor" /> AI-Powered Circuit Design
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          Design Circuits at the <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Speed of Thought</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Describe your idea in plain English and let AI generate the professional wiring diagram, 
          Arduino code, and component cost estimate instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/app" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30">
            Start Designing Free <ArrowRight size={20} />
          </Link>
          <button 
            onClick={() => setShowExample(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
          >
            View Example
          </button>
        </div>
        
        {/* Abstract Floating UI Elements */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
          <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl border border-gray-800 max-w-5xl mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-700">
             <div className="bg-gray-800 rounded-xl overflow-hidden h-64 md:h-96 flex item-center justify-center relative">
                 {/* Mock UI */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <Cpu size={64} className="text-blue-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-400 font-mono">Generating Wiring Diagram...</p>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Build</h2>
            <p className="text-gray-600 max-w-xl mx-auto">From concept to code, TechWatt handles the heavy lifting so you can focus on innovation.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Cpu className="text-blue-600" size={32} />}
              title="Intelligent Diagrams"
              desc="Enter a prompt like 'Arduino with Servo' and get a perfect pin-to-pin wiring diagram instantly."
            />
            <FeatureCard 
              icon={<Code className="text-purple-600" size={32} />}
              title="Auto-Generated Code"
              desc="Don't just plug it in—run it. Get production-ready C++ (Arduino) or Python code for your new circuit."
            />
            <FeatureCard 
              icon={<FileText className="text-green-600" size={32} />}
              title="Instant BOM & Cost"
              desc="Get a detailed Bill of Materials with real-time market price estimations for every component."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
             <img src={logo} alt="TechWatt Logo" className="h-6 opacity-50 grayscale" />
             <span>© 2026 TechWatt AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="mb-4 bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
