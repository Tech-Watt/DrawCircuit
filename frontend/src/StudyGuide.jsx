import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, X, Cpu, Zap, Activity, ArrowLeft, Download, Book, Bot, Layers, Shield, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// ... imports
import kitImg from './assets/kit.jpeg';
import kitsImg from './assets/kits.jpeg';
import roboticKitImg from './assets/robotickit.jpeg';
import roboticKittsImg from './assets/robotickitts.jpeg';
import roboticsImg from './assets/robotics.jpeg';
import roboticsKitImg from './assets/roboticskit.jpeg';
import roboticsKitsImg from './assets/roboticskits.jpeg';
import robotsssImg from './assets/robotsss.jpeg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const kitImages = [kitImg, kitsImg, roboticKitImg, roboticKittsImg, roboticsImg, roboticsKitImg, roboticsKitsImg, robotsssImg];

const StudyGuide = () => {
  const [activeModule, setActiveModule] = useState(null); // 'components', 'ai', 'courses'
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDisplayImage, setActiveDisplayImage] = useState(null);
  const [aiModules, setAiModules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // 'kids', 'python_master'
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  useEffect(() => {
    if (selectedComponent) {
      if (Array.isArray(selectedComponent.image_url) && selectedComponent.image_url.length > 0) {
        setActiveDisplayImage(selectedComponent.image_url[0]);
      } else if (typeof selectedComponent.image_url === 'string') {
        setActiveDisplayImage(selectedComponent.image_url);
      } else {
        setActiveDisplayImage(null);
      }
    }
  }, [selectedComponent]);

  useEffect(() => {
    if (activeModule === 'ai' && selectedCourse) {
        const fetchAI = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/ai-courses?type=${selectedCourse}`);
                setAiModules(res.data);
            } catch (err) { console.error(err); }
        };
        fetchAI();
    }
  }, [activeModule, selectedCourse]);

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredComponents(components.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.category.toLowerCase().includes(search.toLowerCase())
      ));
    } else {
      setFilteredComponents(components);
    }
  }, [search, components]);

  const fetchComponents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/components`);
      setComponents(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching components:", error);
      setLoading(false);
    }
  };


  const handleDownload = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const html = `
      <html>
        <head>
          <title>Tech Watt Robotics Study Guide</title>
          <style>
            body { font-family: 'Arial', sans-serif; color: #333; padding: 20px; }
            h1 { text-align: center; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
            .component { border: 1px solid #ccc; border-radius: 8px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .name { font-size: 24px; font-weight: bold; }
            .category { background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .section { margin-top: 15px; }
            .section-title { font-weight: bold; color: #0056b3; margin-bottom: 5px; }
            .wiring { font-family: monospace; background: #f9f9f9; padding: 10px; border-radius: 4px; border-left: 4px solid #0056b3; }
            img { max-width: 150px; float: right; margin-left: 20px; margin-bottom: 10px; border-radius: 4px; }
            @media print {
              body { padding: 0; }
              .component { border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          <h1>Tech Watt Robotics Kit Guide</h1>
          <p class="subtitle">Complete study guide and wiring instructions for your robotics kit.</p>
          ${filteredComponents.map(comp => `
            <div class="component">
              <div class="header">
                <span class="name">${comp.name}</span>
                <span class="category">${comp.category}</span>
              </div>
              <div style="overflow: auto;">
                ${(comp.image_url && (Array.isArray(comp.image_url) ? comp.image_url.length > 0 : comp.image_url)) ? 
                  `<img src="${Array.isArray(comp.image_url) ? comp.image_url[0] : comp.image_url}" alt="${comp.name}" />` : ''}
                <div class="section">
                  <div class="section-title">How It Works</div>
                  <p>${comp.description ? comp.description.replace(/\n/g, '<br>') : ''}</p>
                </div>
                ${comp.wiring_guide ? `
                  <div class="section">
                    <div class="section-title">Wiring Guide</div>
                    <div class="wiring">${comp.wiring_guide.replace(/\n/g, '<br>')}</div>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
          <div style="text-align: center; margin-top: 50px; color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} TechWatt AI. Visit us at www.techwatt.ai
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Allow time for images to load before printing
    setTimeout(() => {
      printWindow.print();
      // We do not auto-close the window to ensure the print dialog has time to appear 
      // and to let the user review the document if the dialog is cancelled.
    }, 500);
  };

  const handleAIDownload = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Determine title based on selected course
    const courseTitle = selectedCourse === 'kids' ? 'Tech Watt AI for Kids' : 'Tech Watt Python & AI Master Course';
    const courseSubtitle = selectedCourse === 'kids' ? 'Future-Ready Artificial Intelligence Curriculum' : 'From Python Fundamentals to Deployment - A Complete Master Course';

    const html = `
      <html>
        <head>
          <title>${courseTitle} - Outline</title>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
            h1 { text-align: center; color: #7e22ce; border-bottom: 4px solid #7e22ce; padding-bottom: 20px; margin-bottom: 10px; font-size: 32px; }
            .subtitle { text-align: center; color: #64748b; font-size: 18px; margin-bottom: 50px; font-style: italic; }
            
            .week-card { 
                border: 1px solid #e2e8f0; 
                border-radius: 16px; 
                padding: 30px; 
                margin-bottom: 30px; 
                page-break-inside: avoid; 
                background: #ffffff;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .week-header { 
                display: flex; 
                align-items: center; 
                gap: 20px; 
                margin-bottom: 20px; 
                border-bottom: 2px solid #f1f5f9; 
                padding-bottom: 15px; 
            }
            
            .week-badge { 
                background: #7e22ce; 
                color: white; 
                padding: 8px 16px; 
                border-radius: 12px; 
                font-weight: 800; 
                font-size: 14px; 
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .week-title { 
                font-size: 24px; 
                font-weight: 800; 
                color: #0f172a; 
            }
            
            .week-desc {
                font-size: 16px;
                color: #475569;
                margin-bottom: 20px;
                font-style: italic;
                background: #f8fafc;
                padding: 10px 15px;
                border-left: 4px solid #cbd5e1;
                border-radius: 4px;
            }

            .content { color: #334155; }
            .content h1, .content h2, .content h3 { color: #7e22ce; margin-top: 25px; margin-bottom: 10px; font-weight: 700; }
            .content h1 { font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
            .content h2 { font-size: 18px; }
            .content p { margin-bottom: 10px; }
            .content ul { padding-left: 20px; margin-bottom: 15px; }
            .content li { margin-bottom: 6px; position: relative; }
            .content strong { color: #0f172a; font-weight: 700; }
            
            /* Hide the markdown title if it duplicates the card title */
            .content h1:first-child { display: none; }

            @media print {
              body { padding: 0; background: white; }
              .week-card { box-shadow: none; border: 1px solid #ccc; break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${courseTitle}</h1>
          <p class="subtitle">${courseSubtitle}</p>
          
          ${aiModules.map(mod => `
            <div class="week-card">
              <div class="week-header">
                <span class="week-badge">Week ${mod.week}</span>
                <span class="week-title">${mod.title}</span>
              </div>
              <div class="week-desc">${mod.description}</div>
              <div class="content" id="content-${mod.id}"></div>
              <script>
                document.getElementById('content-${mod.id}').innerHTML = marked.parse(\`${mod.content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
              </script>
            </div>
          `).join('')}

          <div style="text-align: center; margin-top: 50px; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 30px;">
            © ${new Date().getFullYear()} TechWatt AI. Empowering the next generation of innovators. <br/>
            www.techwatt.ai
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for script to load and render before printing
    printWindow.onload = () => {
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 800);
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-start md:items-center gap-4 w-full lg:w-auto">
              {selectedCourse ? (
                 <button 
                  onClick={() => setSelectedCourse(null)}
                   className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors shrink-0 group"
                 >
                   <ArrowLeft size={24} className="text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                 </button>
              ) : activeModule ? (
                  <button 
                    onClick={() => setActiveModule(null)}
                    className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors shrink-0 group"
                  >
                    <ArrowLeft size={24} className="text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                  </button>
              ) : (
                <Link to="/" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors shrink-0">
                  <ArrowLeft size={24} className="text-cyan-400" />
                </Link>
              )}
              
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  {selectedCourse === 'kids' ? 'Tech Watt AI for Kids' : 
                   selectedCourse === 'python_master' ? 'Python & AI Master Course' :
                   activeModule === 'components' ? 'Robotics Kit Components' : 
                   activeModule === 'ai' ? 'Choose Your Path' : 
                   activeModule === 'courses' ? 'Explore Courses' : 
                   'Study Hub Dashboard'}
                </h1>
                <p className="text-slate-400 mt-1 text-sm md:text-base">
                  {selectedCourse ? 'Explore the curriculum week by week.' : 
                   activeModule ? 'Master your skills with our interactive guides.' : 'Select a module below to start learning.'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto justify-end">
              {activeModule === 'components' && (
                <>
                  <div className="relative group w-full md:w-64">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
                    <div className="relative flex items-center bg-slate-800 rounded-lg px-3 py-2">
                      <Search size={20} className="text-slate-400 mr-2 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Search components..." 
                        className="bg-transparent border-none outline-none text-white w-full placeholder-slate-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleDownload}
                    className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-lg border border-slate-700 transition-all flex justify-center items-center gap-2 whitespace-nowrap"
                  >
                    <Download size={20} /> <span className="md:hidden lg:inline">Download Guide</span>
                  </button>
                </>
              )}

              {activeModule === 'ai' && selectedCourse && (
                  <button 
                    onClick={handleAIDownload}
                    className="flex-1 md:flex-none px-4 py-2 bg-purple-900/40 hover:bg-purple-800/60 text-purple-300 hover:text-white font-bold rounded-lg border border-purple-500/30 transition-all flex justify-center items-center gap-2 whitespace-nowrap"
                  >
                    <Download size={20} /> <span className="hidden md:inline">Download Outline</span>
                  </button>
              )}
              
              <Link to="/admin" className="p-2 text-slate-500 hover:text-cyan-400 transition-colors" title="Admin Access">
                  <Shield size={20} />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        {activeModule === null && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <div 
              onClick={() => setActiveModule('components')}
              className="group cursor-pointer relative bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-cyan-500/50 transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <Book size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Robotics Kit Guide</h2>
              <p className="text-slate-400 mb-6">Detailed pinouts, wiring diagrams, and usage examples for every component in your kit.</p>
              <div className="flex items-center text-cyan-400 font-medium group-hover:translate-x-2 transition-transform">
                Start Learning <ArrowLeft className="ml-2 rotate-180" size={16} />
              </div>
            </div>

            <div 
              onClick={() => { setActiveModule('ai'); setSelectedCourse('kids'); }}
              className="group cursor-pointer relative bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-pink-500/50 transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-pink-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                <Bot size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Tech Watt AI for Kids</h2>
              <p className="text-slate-400 mb-6">Designed for young innovators (Ages 10+). Learn AI basics, safety, and create fun projects.</p>
              <div className="flex items-center text-pink-400 font-medium group-hover:translate-x-2 transition-transform">
                Start Learning <ArrowLeft className="ml-2 rotate-180" size={16} />
              </div>
            </div>

            <div 
              onClick={() => { setActiveModule('ai'); setSelectedCourse('python_master'); }}
              className="group cursor-pointer relative bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Layers size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Python & AI Master</h2>
              <p className="text-slate-400 mb-6">From core Python foundations to advanced Machine Learning and Deployment.</p>
              <div className="flex items-center text-purple-400 font-medium group-hover:translate-x-2 transition-transform">
                Explore Course <ArrowLeft className="ml-2 rotate-180" size={16} />
              </div>
            </div>

            <div 
              onClick={() => setActiveModule('courses')}
              className="group cursor-pointer relative bg-slate-800 rounded-3xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Layers size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Other Courses</h2>
              <p className="text-slate-400 mb-6">Explore advanced topics including Computer Vision, Game Dev, and Web Design.</p>
              <div className="flex items-center text-blue-400 font-medium group-hover:translate-x-2 transition-transform">
                 View Catalog <ArrowLeft className="ml-2 rotate-180" size={16} />
              </div>
            </div>
          </div>
        )}

        {/* Components View */}
        {activeModule === 'components' && (
          <>
            {/* Kit Gallery */}
            <div className="mb-12">
               <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                 <img src={kitImg} className="w-8 h-8 rounded-full border border-cyan-500" alt="Kit Icon" /> Meet Your Kit
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {kitImages.map((img, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setSelectedImage(img)}
                     className="rounded-xl overflow-hidden shadow-lg border border-slate-700 aspect-video group relative cursor-pointer hover:border-cyan-500/50 transition-all"
                   >
                       <img src={img} alt={`Robotics Kit ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                           <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">View Image</span>
                        </div>
                   </div>
                 ))}
               </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComponents.map(comp => (
                  <div 
                    key={comp.id}
                    onClick={() => setSelectedComponent(comp)}
                    className="group relative cursor-pointer"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative h-full bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all flex flex-col">
                      <div className="h-48 rounded-xl bg-slate-900 mb-4 overflow-hidden flex items-center justify-center">
                        {comp.image_url && (Array.isArray(comp.image_url) ? comp.image_url.length > 0 : comp.image_url) ? (
                          <img 
                            src={Array.isArray(comp.image_url) ? comp.image_url[0] : comp.image_url} 
                            alt={comp.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        ) : (
                          <Cpu size={64} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        )}
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{comp.name}</h3>
                        <span className="px-2 py-1 rounded-md bg-slate-700 text-xs text-cyan-300 border border-slate-600">
                          {comp.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">{comp.description}</p>
                      <div className="flex items-center text-cyan-500 text-sm font-medium mt-auto">
                        View Guide <Activity size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* AI Guide View */}
        {activeModule === 'ai' && (
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
              <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="inline-block p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
                     <Bot size={32} className="text-purple-400" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-4">AI Robotics Curriculum</h2>
                  <p className="text-slate-400 text-lg">Master the future of intelligent machines.</p>
              </div>
              
              {aiModules.map((mod, index) => (
                  <div key={mod.id} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{animationDelay: `${index * 100}ms`}}>
                      {/* Connector Line */}
                      {index !== aiModules.length - 1 && (
                          <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/30 to-transparent -z-10 h-full"></div>
                      )}
                      
                      <div className={`bg-slate-900/80 backdrop-blur border border-slate-800 rounded-3xl overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)] ${expandedModuleId === mod.id ? 'ring-1 ring-purple-500/50 bg-slate-900' : ''}`}>
                          <div 
                            className="p-6 md:p-8 cursor-pointer flex gap-6 items-start"
                            onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
                          >
                              {/* Week Badge */}
                              <div className={`shrink-0 w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shadow-inner transition-all duration-300 group-hover:scale-105 ${expandedModuleId === mod.id ? 'border-purple-500/50 text-purple-400' : 'text-slate-500'}`}>
                                  <span className="text-[10px] font-mono uppercase tracking-wider">Week</span>
                                  <span className="text-2xl font-bold font-mono">{mod.week}</span>
                              </div>
                              
                              <div className="flex-1 pt-1">
                                  <h3 className={`text-2xl font-bold mb-2 transition-colors ${expandedModuleId === mod.id ? 'text-purple-400' : 'text-white group-hover:text-purple-300'}`}>{mod.title}</h3>
                                  <p className="text-slate-400 leading-relaxed text-sm md:text-base">{mod.description}</p>
                              </div>
                              
                              <div className={`p-3 rounded-full border border-slate-800 bg-slate-950 transition-transform duration-300 ${expandedModuleId === mod.id ? 'rotate-180 border-purple-500/30 text-purple-400' : 'rotate-0 text-slate-500 group-hover:text-white'}`}>
                                  <ChevronDown size={20} />
                              </div>
                          </div>
                          
                          {/* Expanded Content */}
                          {expandedModuleId === mod.id && (
                              <div className="border-t border-slate-800/50 bg-slate-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <div className="p-8 pt-6">
                                      <div className="text-slate-300 leading-relaxed text-base md:text-lg">
                                          <ReactMarkdown
                                            components={{
                                                h1: ({...props}) => <h1 className="text-2xl font-bold text-purple-400 mt-6 mb-3" {...props} />,
                                                h2: ({...props}) => <h2 className="text-xl font-bold text-purple-300 mt-5 mb-2" {...props} />,
                                                ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-300" {...props} />,
                                                li: ({...props}) => <li className="marker:text-purple-500" {...props} />,
                                                strong: ({...props}) => <strong className="font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]" {...props} />,
                                                code: ({...props}) => <code className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm" {...props} />,
                                            }}
                                          >
                                            {mod.content}
                                          </ReactMarkdown>
                                      </div>
                                      
                                      {mod.image_url && (Array.isArray(mod.image_url) ? mod.image_url.length > 0 : mod.image_url) && (
                                          <div className="mt-8 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
                                              <img 
                                                src={Array.isArray(mod.image_url) ? mod.image_url[0] : mod.image_url} 
                                                alt={mod.title} 
                                                className="w-full object-cover max-h-[400px]" 
                                              />
                                          </div>
                                      )}
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              
              {aiModules.length === 0 && (
                  <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800 border-dashed">
                      <p className="text-slate-500">Curriculum is loading or empty...</p>
                  </div>
              )}
          </div>
        )}

        {/* Other Courses View */}
        {activeModule === 'courses' && (
            <div className="text-center py-20">
                <Layers size={64} className="mx-auto text-blue-500 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Explore More Courses</h2>
                <p className="text-slate-400 max-w-lg mx-auto mb-8">Take your skills to the next level with our advanced curriculum.</p>
                <a 
                    href="https://www.techwatt.ai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Visit TechWatt Academy
                </a>
            </div>
        )}
      </div>

      {/* Detail Modal (Full Page View) */}
      {selectedComponent && (
        <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto animate-in fade-in duration-200">
           <div className="container mx-auto px-4 py-8 max-w-5xl">
              {/* Navigation / Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-0 bg-slate-900/95 backdrop-blur py-4 z-10 border-b border-slate-800 gap-4">
                <button 
                  onClick={() => setSelectedComponent(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700">
                    <ArrowLeft size={24} />
                  </div>
                  <span className="font-medium">Back to Guide</span>
                </button>
              </div>

              {/* Main Content */}
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">


               {/* Left Column: Image & Quick Info */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-slate-800 rounded-3xl p-4 border border-slate-700 shadow-xl">
                      <div className="aspect-square rounded-2xl bg-white flex items-center justify-center overflow-hidden mb-4">
                        {activeDisplayImage ? (
                          <img src={activeDisplayImage} alt={selectedComponent.name} className="w-full h-full object-contain" />
                        ) : (
                          <Cpu size={128} className="text-slate-400" />
                        )}
                      </div>
                      
                      {/* Thumbnails */}
                      {Array.isArray(selectedComponent.image_url) && selectedComponent.image_url.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedComponent.image_url.map((img, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setActiveDisplayImage(img)}
                              className={`w-16 h-16 shrink-0 rounded-lg bg-white overflow-hidden cursor-pointer border-2 transition-all ${activeDisplayImage === img ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                   
                   <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                      <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Quick Specs</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-slate-700/50">
                          <span className="text-slate-400">Category</span>
                          <span className="text-cyan-400 font-medium">{selectedComponent.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-700/50">
                          <span className="text-slate-400">Added On</span>
                          <span className="text-white">{new Date(selectedComponent.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Detailed Guide */}
                <div className="lg:col-span-3 space-y-10">
                   <div>
                      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        {selectedComponent.name}
                      </h1>
                      <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                   </div>

                   <div className="prose prose-invert prose-lg max-w-none">
                      <div className="bg-slate-800/30 rounded-3xl p-6 md:p-8 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-cyan-400 mb-6 m-0">
                          <Zap className="fill-cyan-400/20" /> How It Works
                        </h2>
                        <div className="text-slate-300 leading-relaxed text-base md:text-lg">
                           <ReactMarkdown
                             components={{
                               h1: ({...props}) => <h1 className="text-2xl font-bold text-cyan-400 mt-6 mb-3 border-b border-slate-700 pb-2" {...props} />,
                               h2: ({...props}) => <h2 className="text-xl font-bold text-cyan-300 mt-5 mb-2" {...props} />,
                               h3: ({...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                               ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                               ol: ({...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                               li: ({...props}) => <li className="mb-1" {...props} />,
                               p: ({...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                               strong: ({...props}) => <strong className="font-bold text-white" {...props} />,
                               code: ({...props}) => <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono text-sm" {...props} />,
                             }}
                           >
                             {selectedComponent.description}
                           </ReactMarkdown>
                        </div>
                      </div>

                      {selectedComponent.wiring_guide && (
                        <div className="bg-slate-800/30 rounded-3xl p-6 md:p-8 border border-slate-700/50 hover:border-blue-500/30 transition-colors mt-8">
                          <h2 className="flex items-center gap-3 text-2xl font-bold text-blue-400 mb-6 m-0">
                            <Activity className="fill-blue-400/20" /> Wiring Guide
                          </h2>
                          <div className="bg-slate-950 rounded-xl p-4 md:p-6 font-mono text-sm text-blue-200 border border-slate-800 shadow-inner overflow-x-auto">
                             <ReactMarkdown components={{
                                 ul: ({...props}) => <ul className="list-disc pl-6 space-y-2" {...props} />,
                                 ol: ({...props}) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
                                 li: ({...props}) => <li {...props} />,
                                 p: ({...props}) => <p className="mb-2" {...props} />
                             }}>
                                {selectedComponent.wiring_guide}
                             </ReactMarkdown>
                          </div>

                        </div>
                      )}
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-cyan-400 transition-colors"
            >
              <X size={32} />
            </button>
            <img src={selectedImage} alt="Full View" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-slate-700" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGuide;
