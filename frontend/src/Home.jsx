import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Cpu, Code, FileText, ArrowRight, X, Layers, Activity } from 'lucide-react';
import logo from './assets/logo.png';
import exampleImage from './assets/example.png';

const Home = () => {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans relative selection:bg-blue-500/30">
      {/* Example Modal */}
      {showExample && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-4" onClick={() => setShowExample(false)}>
          <div className="relative max-w-5xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowExample(false)}
              className="absolute top-4 right-4 bg-slate-800/90 p-2 rounded-full hover:bg-slate-700 text-white transition-colors z-10 border border-slate-700"
            >
              <X size={24} />
            </button>
            <img src={exampleImage} alt="Circuit Example" className="w-full h-auto" />
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="TechWatt Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                TechWatt Circuit AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">Features</a>
              <Link to="/study" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">Study Guide</Link>
              <Link to="/app" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Design Circuit
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap size={16} fill="currentColor" /> AI-Powered Circuit Design
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Build Circuits & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Master AI</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          The ultimate platform for young innovators. Design circuits instantly with AI and master Artificial Intelligence with our <strong>Tech Watt AI</strong> curriculum.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <Link to="/app" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95">
            Start Designing Free <ArrowRight size={20} />
          </Link>
          <button 
            onClick={() => setShowExample(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-slate-600 transition-all hover:scale-105 active:scale-95"
          >
            View Example
          </button>
        </div>
        
        {/* Abstract Floating UI Elements */}
        <div className="mt-20 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 h-20 bottom-0 top-auto"></div>
          <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl shadow-blue-900/20 border border-slate-800 max-w-5xl mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-700 relative group">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
             <div className="bg-slate-950 rounded-xl overflow-hidden h-64 md:h-96 flex item-center justify-center relative border border-slate-800">
                 {/* Mock UI */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
                        <Cpu size={64} className="text-blue-500 mx-auto mb-4 relative z-10" />
                    </div>
                    <p className="text-blue-400 font-mono flex items-center gap-2">Generating Wiring Diagram<span className="animate-pulse">...</span></p>
                 </div>
                 
                 {/* Decorative code lines */}
                 <div className="absolute top-4 left-4 right-4 space-y-2 opacity-30">
                    <div className="h-2 w-1/3 bg-slate-700 rounded"></div>
                    <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                    <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Build</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">From concept to code, TechWatt handles the heavy lifting so you can focus on innovation.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Cpu className="text-blue-400" size={32} />}
              title="Intelligent Diagrams"
              desc="Enter a prompt like 'Arduino with Servo' and get a perfect pin-to-pin wiring diagram instantly."
              color="blue"
            />
            <FeatureCard 
              icon={<Code className="text-purple-400" size={32} />}
              title="Auto-Generated Code"
              desc="Don't just plug it in—run it. Get production-ready C++ (Arduino) or Python code for your new circuit."
              color="purple"
            />
            <FeatureCard 
              icon={<FileText className="text-emerald-400" size={32} />}
              title="Instant BOM & Cost"
              desc="Get a detailed Bill of Materials with real-time market price estimations for every component."
              color="emerald"
            />
            <FeatureCard 
              icon={<Zap className="text-orange-400" size={32} />}
              title="AI & Drone Courses"
              desc="Comprehensive curriculum covering AI, Python, Drones, and Data Analytics for all ages."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* AI Course Section */}
      <section id="ai-course" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/5 skew-x-12 z-0 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 text-left">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20">
                        <Activity size={14} /> Comprehensive Curriculum
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-6">Master the Future with TechWatt</h2>
                    <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                        Empower the next generation with our structured learning paths. From AI for Kids to Advanced Python, Drone Engineering, and Data Analytics, we provide the skills needed for tomorrow.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-300">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30">✓</span>
                            Master Prompt Engineering & AI Tools
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/30">✓</span>
                            Build Real Flying Drones
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/30">✓</span>
                            Analyze Data with Python & SQL
                        </li>
                    </ul>
                    <Link to="/study" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                        Explore All Courses <ArrowRight size={18} />
                    </Link>
                </div>
                <div className="flex-1 w-full">
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-500 group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500 -z-10"></div>
                        <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                                <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold text-xl">01</div>
                                <div>
                                    <div className="text-white font-bold text-lg">AI for Kids</div>
                                    <div className="text-slate-500 text-sm">Ages 10+ • 8 Weeks</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xl">02</div>
                                <div>
                                    <div className="text-white font-bold text-lg">Drone Building</div>
                                    <div className="text-slate-500 text-sm">Engineering • flight</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl">03</div>
                                <div>
                                    <div className="text-white font-bold text-lg">Data Analytics</div>
                                    <div className="text-slate-500 text-sm">Excel & Python • Professional</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex items-center gap-2 mb-4 md:mb-0 opacity-70 hover:opacity-100 transition-opacity">
             <img src={logo} alt="TechWatt Logo" className="h-6 grayscale brightness-200" />
             <span>© 2026 TechWatt AI. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component with Custom Styling
const FeatureCard = ({ icon, title, desc, color = "blue" }) => {
    // Map color props to Tailwind classes
    const colorClasses = {
        blue: "hover:border-blue-500/50 from-blue-500/5",
        purple: "hover:border-purple-500/50 from-purple-500/5",
        emerald: "hover:border-emerald-500/50 from-emerald-500/5",
        orange: "hover:border-orange-500/50 from-orange-500/5"
    };

    // Use a default gradient from color if mapping fails (fallback)
    const activeColor = colorClasses[color] || colorClasses.blue;

    return (
      <div className={`bg-slate-950 p-8 rounded-2xl shadow-sm border border-slate-800 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group ${activeColor.split(' ')[0]}`}>
        {/* Dynamic Gradient Background on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${activeColor.split(' ')[1]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        <div className="mb-4 bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center border border-slate-700 relative z-10 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
        <p className="text-slate-400 leading-relaxed relative z-10">{desc}</p>
      </div>
    );
};

export default Home;
