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
                Design Circuit
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
          Build Circuits & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Master AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate platform for young innovators. Design circuits instantly with AI and master Artificial Intelligence with our <strong>Tech Watt AI</strong> curriculum.
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
          
          <div className="grid md:grid-cols-4 gap-8">
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
            <FeatureCard 
              icon={<Zap className="text-yellow-500" size={32} />}
              title="AI for Kids Course"
              desc="A complete 8-week curriculum to teach kids AI concepts, prompting, and ethical use."
            />
          </div>
        </div>
      </section>

      {/* AI Course Section */}
      <section id="ai-course" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-50 skew-x-12 opacity-50 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6">
                        <Zap size={14} /> New Curriculum
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Tech Watt AI for Kids</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        Empower the next generation with our structured 8-week AI course. From understanding "What is AI?" to building their own AI-powered study assistants, we guide students through the future of technology responsibly.
                    </p>
                    <ul className="space-y-3 mb-8">
                        <li className="flex items-center gap-3 text-gray-700">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</span>
                            Master Prompt Engineering
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</span>
                            Use Tools like ChatGPT & Teachable Machine
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">✓</span>
                            Build Real-World AI Projects
                        </li>
                    </ul>
                    <Link to="/study" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
                        Start Learning Now <ArrowRight size={18} />
                    </Link>
                </div>
                <div className="flex-1">
                    <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800 rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
                                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xl">01</div>
                                <div>
                                    <div className="text-white font-bold text-lg">Week 1: World of AI</div>
                                    <div className="text-gray-400 text-sm">Introduction & Basics</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
                                <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xl">02</div>
                                <div>
                                    <div className="text-white font-bold text-lg">Week 2: Machine Learning</div>
                                    <div className="text-gray-400 text-sm">Training Models</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">...</div>
                                <div>
                                    <div className="text-white font-bold text-lg">8 Weeks of Content</div>
                                    <div className="text-gray-400 text-sm">Full Interactive Guide</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
