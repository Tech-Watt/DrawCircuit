import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, X, Cpu, Zap, Activity, ArrowLeft, Download, Book, Bot, Layers, Shield, ChevronDown, Plane, BarChart } from 'lucide-react';
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
    const courseTitle = selectedCourse === 'kids' ? 'Tech Watt AI for Kids' : 
                        selectedCourse === 'drone_building' ? 'Tech Watt Drone Building Course' : 
                        selectedCourse === 'data_analytics' ? 'Tech Watt Data Analytics Course' : 
                        'Tech Watt Python & AI Master Course';
    const courseSubtitle = selectedCourse === 'kids' ? 'Future-Ready Artificial Intelligence Curriculum' : 
                           selectedCourse === 'drone_building' ? 'From Basics to Advanced Flight - Professional Drone Curriculum' : 
                           selectedCourse === 'data_analytics' ? 'Master Excel, SQL, Python, and PowerBI - Zero to Analyst' : 
                           'From Python Fundamentals to Deployment - A Complete Master Course';

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
    <div className="page-shell relative">
      <div className="bg-mesh" />

      <div className="relative z-10 page-container py-6 sm:py-10">
        {/* Header */}
        <header className="flex flex-col gap-5 sm:gap-6 mb-8 sm:mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 w-full lg:w-auto min-w-0">
              {selectedCourse ? (
                 <button 
                  onClick={() => setSelectedCourse(null)}
                   className="p-2.5 rounded-xl bg-tw-surface-2 border border-tw-border hover:bg-tw-surface-3 transition-colors shrink-0 group"
                 >
                   <ArrowLeft size={20} className="text-tw-primary group-hover:-translate-x-0.5 transition-transform" />
                 </button>
              ) : activeModule ? (
                  <button 
                    onClick={() => setActiveModule(null)}
                    className="p-2.5 rounded-xl bg-tw-surface-2 border border-tw-border hover:bg-tw-surface-3 transition-colors shrink-0 group"
                  >
                  <ArrowLeft size={20} className="text-tw-primary group-hover:-translate-x-0.5 transition-transform" />
                  </button>
              ) : (
                <Link to="/" className="p-2.5 rounded-xl bg-tw-surface-2 border border-tw-border hover:bg-tw-surface-3 transition-colors shrink-0">
                  <ArrowLeft size={20} className="text-tw-primary" />
                </Link>
              )}
              
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold gradient-text leading-tight">
                  {selectedCourse === 'kids' ? 'Tech Watt AI for Kids' : 
                   selectedCourse === 'python_master' ? 'Python & AI Master Course' :
                   selectedCourse === 'drone_building' ? 'Drone Building Course' :
                   selectedCourse === 'data_analytics' ? 'Data Analytics Course' :
                   activeModule === 'components' ? 'Robotics Kit Components' : 
                   activeModule === 'ai' ? 'Choose Your Path' : 
                   activeModule === 'courses' ? 'Explore Courses' : 
                   'Study Hub Dashboard'}
                </h1>
                <p className="text-tw-muted mt-1 text-sm sm:text-base">
                  {selectedCourse ? 'Explore the curriculum week by week.' : 
                   activeModule ? 'Master your skills with our interactive guides.' : 'Select a module below to start learning.'}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {activeModule === 'components' && (
                <>
                  <div className="relative flex items-center input-field !py-2.5 w-full sm:w-64">
                      <Search size={18} className="text-tw-muted mr-2 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Search components..." 
                        className="bg-transparent border-none outline-none text-tw-text w-full placeholder:text-tw-muted"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                  </div>
                  
                  <button 
                    onClick={handleDownload}
                    className="btn btn-secondary btn-sm justify-center"
                  >
                    <Download size={18} /> Download Guide
                  </button>
                </>
              )}

              {activeModule === 'ai' && selectedCourse && (
                  <button 
                    onClick={handleAIDownload}
                    className="btn btn-secondary btn-sm justify-center"
                  >
                    <Download size={18} /> Download Outline
                  </button>
              )}
              
              <Link to="/admin" className="btn btn-ghost btn-sm self-end sm:self-auto" title="Admin Access">
                  <Shield size={18} />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        {activeModule === null && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mt-2">
            {[
              { action: () => setActiveModule('components'), icon: Book, title: 'Robotics Kit Guide', desc: 'Detailed pinouts, wiring diagrams, and usage examples for every component in your kit.', cta: 'Start Learning', color: 'text-tw-primary bg-tw-primary/10 border-tw-primary/20' },
              { action: () => { setActiveModule('ai'); setSelectedCourse('kids'); }, icon: Bot, title: 'Tech Watt AI for Kids', desc: 'Designed for young innovators (Ages 10+). Learn AI basics, safety, and create fun projects.', cta: 'Start Learning', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
              { action: () => { setActiveModule('ai'); setSelectedCourse('python_master'); }, icon: Layers, title: 'Python & AI Master', desc: 'From core Python foundations to advanced Machine Learning and Deployment.', cta: 'Explore Course', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              { action: () => { setActiveModule('ai'); setSelectedCourse('drone_building'); }, icon: Plane, title: 'Drone Building', desc: 'Build, fly, and master drones. From aerodynamics to autonomous flight.', cta: 'Start Flying', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
              { action: () => { setActiveModule('ai'); setSelectedCourse('data_analytics'); }, icon: BarChart, title: 'Data Analytics', desc: 'Master Excel, SQL, Python & PowerBI. Become a certified Data Analyst.', cta: 'Start Analyzing', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { action: () => setActiveModule('courses'), icon: Layers, title: 'Other Courses', desc: 'Explore advanced topics including Computer Vision, Game Dev, and Web Design.', cta: 'View Catalog', color: 'text-tw-accent bg-sky-500/10 border-sky-500/20' },
            ].map((card) => (
              <div key={card.title} onClick={card.action} className="card p-6 sm:p-8 cursor-pointer group hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-colors ${card.color}`}>
                  <card.icon size={28} />
                </div>
                <h2 className="text-xl font-bold text-tw-text mb-2">{card.title}</h2>
                <p className="text-tw-muted text-sm leading-relaxed mb-5">{card.desc}</p>
                <div className="flex items-center text-tw-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  {card.cta} <ArrowLeft className="ml-1.5 rotate-180" size={15} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Components View */}
        {activeModule === 'components' && (
          <>
            {/* Kit Gallery */}
            <div className="mb-10 sm:mb-12">
               <h2 className="text-xl sm:text-2xl font-bold text-tw-text mb-5 flex items-center gap-2">
                 <img src={kitImg} className="w-8 h-8 rounded-full border border-tw-primary/40" alt="Kit Icon" /> Meet Your Kit
               </h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                 {kitImages.map((img, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setSelectedImage(img)}
                     className="rounded-xl overflow-hidden border border-tw-border aspect-video group relative cursor-pointer hover:border-tw-primary/40 transition-all"
                   >
                       <img src={img} alt={`Robotics Kit ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-tw-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                           <span className="text-tw-primary text-xs font-bold uppercase tracking-wider">View Image</span>
                        </div>
                   </div>
                 ))}
               </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tw-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredComponents.map(comp => (
                  <div 
                    key={comp.id}
                    onClick={() => setSelectedComponent(comp)}
                    className="card p-5 sm:p-6 cursor-pointer group hover:-translate-y-0.5 flex flex-col h-full"
                  >
                      <div className="h-40 sm:h-48 rounded-xl bg-tw-surface-2 mb-4 overflow-hidden flex items-center justify-center border border-tw-border">
                        {comp.image_url && (Array.isArray(comp.image_url) ? comp.image_url.length > 0 : comp.image_url) ? (
                          <img 
                            src={Array.isArray(comp.image_url) ? comp.image_url[0] : comp.image_url} 
                            alt={comp.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        ) : (
                          <Cpu size={48} className="text-tw-muted group-hover:text-tw-primary transition-colors" />
                        )}
                      </div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="text-lg font-bold text-tw-text group-hover:text-tw-primary-light transition-colors">{comp.name}</h3>
                        <span className="px-2 py-0.5 rounded-md bg-tw-surface-2 text-xs text-tw-primary border border-tw-border shrink-0">
                          {comp.category}
                        </span>
                      </div>
                      <p className="text-tw-muted text-sm line-clamp-3 mb-4 flex-grow">{comp.description}</p>
                      <div className="flex items-center text-tw-primary text-sm font-semibold mt-auto">
                        View Guide <Activity size={15} className="ml-1" />
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
                  <div className={`inline-block p-3 rounded-2xl border mb-4 
                    ${selectedCourse === 'kids' ? 'bg-pink-500/10 border-pink-500/20' : 
                      selectedCourse === 'drone_building' ? 'bg-orange-500/10 border-orange-500/20' : 
                      selectedCourse === 'data_analytics' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                      'bg-purple-500/10 border-purple-500/20'}`}>
                     {selectedCourse === 'kids' ? <Bot size={32} className="text-pink-400" /> : 
                      selectedCourse === 'drone_building' ? <Plane size={32} className="text-orange-400" /> : 
                      selectedCourse === 'data_analytics' ? <BarChart size={32} className="text-emerald-400" /> : 
                      <Bot size={32} className="text-purple-400" />}
                  </div>
                  <h2 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4 
                    ${selectedCourse === 'kids' ? 'bg-gradient-to-r from-white via-pink-200 to-pink-400' : 
                      selectedCourse === 'drone_building' ? 'bg-gradient-to-r from-white via-orange-200 to-orange-400' : 
                      selectedCourse === 'data_analytics' ? 'bg-gradient-to-r from-white via-emerald-200 to-emerald-400' : 
                      'bg-gradient-to-r from-white via-purple-200 to-purple-400'}`}>
                      {selectedCourse === 'kids' ? 'AI for Kids Curriculum' : 
                       selectedCourse === 'drone_building' ? 'Drone Building Curriculum' : 
                       selectedCourse === 'data_analytics' ? 'Data Analytics Curriculum' : 
                       'Python & AI Master Curriculum'}
                  </h2>
                  <p className="text-tw-muted text-lg">
                    {selectedCourse === 'kids' ? 'Fun, safe, and interactive AI learning.' : 
                     selectedCourse === 'drone_building' ? 'Master the skies with drone engineering.' : 
                     selectedCourse === 'data_analytics' ? 'Turn raw data into actionable insights.' : 
                     'Master the future of intelligent machines.'}
                  </p>
              </div>
              
              {aiModules.map((mod, index) => (
                  <div key={mod.id} className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{animationDelay: `${index * 100}ms`}}>
                      {/* Connector Line */}
                      {index !== aiModules.length - 1 && (
                          <div className={`absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b to-transparent -z-10 h-full 
                            ${selectedCourse === 'kids' ? 'from-pink-500/30' : 
                              selectedCourse === 'drone_building' ? 'from-orange-500/30' : 
                              selectedCourse === 'data_analytics' ? 'from-emerald-500/30' : 
                              'from-purple-500/30'}`}></div>
                      )}
                      
                      <div className={`bg-tw-surface/80 backdrop-blur border border-tw-border rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg 
                        ${selectedCourse === 'kids' ? 'hover:border-pink-500/30' : 
                          selectedCourse === 'drone_building' ? 'hover:border-orange-500/30' : 
                          selectedCourse === 'data_analytics' ? 'hover:border-emerald-500/30' : 
                          'hover:border-purple-500/30'}
                        ${expandedModuleId === mod.id ? 
                            (selectedCourse === 'kids' ? 'ring-1 ring-pink-500/50 bg-tw-surface' : 
                             selectedCourse === 'drone_building' ? 'ring-1 ring-orange-500/50 bg-tw-surface' : 
                             selectedCourse === 'data_analytics' ? 'ring-1 ring-emerald-500/50 bg-tw-surface' : 
                             'ring-1 ring-purple-500/50 bg-tw-surface') : ''}`}>
                          <div 
                            className="p-6 md:p-8 cursor-pointer flex gap-6 items-start"
                            onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
                          >
                              {/* Week Badge */}
                              <div className={`shrink-0 w-16 h-16 rounded-2xl bg-tw-surface-3 border border-tw-border flex flex-col items-center justify-center shadow-inner transition-all duration-300 group-hover:scale-105 
                                ${expandedModuleId === mod.id ? 
                                    (selectedCourse === 'kids' ? 'border-pink-500/50 text-pink-400' : 
                                     selectedCourse === 'drone_building' ? 'border-orange-500/50 text-orange-400' : 
                                     selectedCourse === 'data_analytics' ? 'border-emerald-500/50 text-emerald-400' : 
                                     'border-purple-500/50 text-purple-400') : 'text-tw-muted'}`}>
                                  <span className="text-[10px] font-mono uppercase tracking-wider">Week</span>
                                  <span className="text-2xl font-bold font-mono">{mod.week}</span>
                              </div>
                              
                              <div className="flex-1 pt-1">
                                  <h3 className={`text-2xl font-bold mb-2 transition-colors 
                                    ${expandedModuleId === mod.id ? 
                                        (selectedCourse === 'kids' ? 'text-pink-400' : 
                                         selectedCourse === 'drone_building' ? 'text-orange-400' : 
                                         selectedCourse === 'data_analytics' ? 'text-emerald-400' : 
                                         'text-purple-400') : 
                                        'text-tw-text group-hover:text-tw-primary'}`}>
                                      {mod.title}
                                  </h3>
                                  <p className="text-tw-muted leading-relaxed text-sm md:text-base">{mod.description}</p>
                              </div>
                              
                              <div className={`p-3 rounded-full border border-tw-border bg-tw-surface-3 transition-transform duration-300 
                                ${expandedModuleId === mod.id ? 
                                    (selectedCourse === 'kids' ? 'rotate-180 border-pink-500/30 text-pink-400' : 
                                     selectedCourse === 'drone_building' ? 'rotate-180 border-orange-500/30 text-orange-400' : 
                                     selectedCourse === 'data_analytics' ? 'rotate-180 border-emerald-500/30 text-emerald-400' : 
                                     'rotate-180 border-purple-500/30 text-purple-400') : 
                                    'rotate-0 text-tw-muted group-hover:text-tw-text'}`}>
                                  <ChevronDown size={20} />
                              </div>
                          </div>
                          
                          {/* Expanded Content */}
                          {expandedModuleId === mod.id && (
                              <div className="border-t border-tw-border/50 bg-tw-surface-3/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                  <div className="p-8 pt-6">
                                      <div className="text-tw-text-secondary leading-relaxed text-base md:text-lg">
                                          <ReactMarkdown
                                            components={{
                                                h1: ({...props}) => <h1 className={`text-2xl font-bold mt-6 mb-3 ${selectedCourse === 'kids' ? 'text-pink-400' : selectedCourse === 'drone_building' ? 'text-orange-400' : selectedCourse === 'data_analytics' ? 'text-emerald-400' : 'text-purple-400'}`} {...props} />,
                                                h2: ({...props}) => <h2 className={`text-xl font-bold mt-5 mb-2 ${selectedCourse === 'kids' ? 'text-pink-300' : selectedCourse === 'drone_building' ? 'text-orange-300' : selectedCourse === 'data_analytics' ? 'text-emerald-300' : 'text-purple-300'}`} {...props} />,
                                                ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-tw-text-secondary" {...props} />,
                                                li: ({...props}) => <li className={`marker:${selectedCourse === 'kids' ? 'text-pink-500' : selectedCourse === 'drone_building' ? 'text-orange-500' : selectedCourse === 'data_analytics' ? 'text-emerald-500' : 'text-purple-500'}`} {...props} />,
                                                strong: ({...props}) => <strong className="font-bold text-tw-text" {...props} />,
                                                code: ({...props}) => <code className="bg-tw-surface border border-tw-border px-1.5 py-0.5 rounded text-tw-text-secondary font-mono text-sm" {...props} />,
                                            }}
                                          >
                                            {mod.content}
                                          </ReactMarkdown>
                                      </div>
                                      
                                      {mod.image_url && (Array.isArray(mod.image_url) ? mod.image_url.length > 0 : mod.image_url) && (
                                          <div className="mt-8 rounded-2xl overflow-hidden border border-tw-border/50 shadow-2xl">
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
                  <div className="text-center py-20 bg-tw-surface/50 rounded-3xl border border-tw-border border-dashed">
                      <p className="text-tw-muted">Curriculum is loading or empty...</p>
                  </div>
              )}
          </div>
        )}

        {/* Other Courses View */}
        {activeModule === 'courses' && (
            <div className="card-elevated p-10 sm:p-16 text-center max-w-2xl mx-auto">
                <Layers size={48} className="mx-auto text-tw-accent mb-5" />
                <h2 className="text-2xl sm:text-3xl font-bold text-tw-text mb-3">Explore More Courses</h2>
                <p className="text-tw-muted max-w-md mx-auto mb-8">Take your skills to the next level with our advanced curriculum.</p>
                <a 
                    href="https://www.techwatt.ai/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                >
                    Visit TechWatt Academy
                </a>
            </div>
        )}
      </div>

      {/* Detail Modal (Full Page View) */}
      {selectedComponent && (
        <div className="fixed inset-0 z-50 bg-tw-bg overflow-y-auto">
           <div className="page-container py-6 sm:py-8 max-w-5xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 sticky top-0 bg-tw-bg/95 backdrop-blur-xl py-4 z-10 border-b border-tw-border gap-4">
                <button 
                  onClick={() => setSelectedComponent(null)}
                  className="flex items-center gap-2 text-tw-muted hover:text-tw-text transition-colors group"
                >
                  <div className="p-2 rounded-xl bg-tw-surface-2 border border-tw-border group-hover:bg-tw-surface-3">
                    <ArrowLeft size={20} />
                  </div>
                  <span className="font-medium text-sm sm:text-base">Back to Guide</span>
                </button>
              </div>

              {/* Main Content */}
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">


               {/* Left Column: Image & Quick Info */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-tw-surface-2 rounded-3xl p-4 border border-tw-border shadow-xl">
                      <div className="aspect-square rounded-2xl bg-white flex items-center justify-center overflow-hidden mb-4">
                        {activeDisplayImage ? (
                          <img src={activeDisplayImage} alt={selectedComponent.name} className="w-full h-full object-contain" />
                        ) : (
                          <Cpu size={128} className="text-tw-muted" />
                        )}
                      </div>
                      
                      {/* Thumbnails */}
                      {Array.isArray(selectedComponent.image_url) && selectedComponent.image_url.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedComponent.image_url.map((img, idx) => (
                            <div 
                              key={idx} 
                              onClick={() => setActiveDisplayImage(img)}
                              className={`w-16 h-16 shrink-0 rounded-lg bg-white overflow-hidden cursor-pointer border-2 transition-all ${activeDisplayImage === img ? 'border-tw-primary ring-2 ring-tw-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                   
                   <div className="bg-tw-surface-2/50 rounded-2xl p-6 border border-tw-border">
                      <h3 className="text-tw-muted text-sm font-bold uppercase tracking-wider mb-4">Quick Specs</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-tw-border/50">
                          <span className="text-tw-muted">Category</span>
                          <span className="text-tw-primary font-medium">{selectedComponent.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-tw-border/50">
                          <span className="text-tw-muted">Added On</span>
                          <span className="text-tw-text">{new Date(selectedComponent.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Right Column: Detailed Guide */}
                <div className="lg:col-span-3 space-y-10">
                   <div>
                      <h1 className="text-3xl md:text-5xl font-extrabold text-tw-text mb-6 leading-tight">
                        {selectedComponent.name}
                      </h1>
                      <div className="h-1 w-24 bg-gradient-to-r from-tw-primary to-tw-accent rounded-full"></div>
                   </div>

                   <div className="prose prose-invert prose-lg max-w-none">
                      <div className="bg-tw-surface-2/30 rounded-3xl p-6 md:p-8 border border-tw-border/50 hover:border-tw-primary/30 transition-colors">
                        <h2 className="flex items-center gap-3 text-2xl font-bold text-tw-primary mb-6 m-0">
                          <Zap className="fill-tw-primary/20" /> How It Works
                        </h2>
                        <div className="text-tw-text-secondary leading-relaxed text-base md:text-lg">
                           <ReactMarkdown
                             components={{
                               h1: ({...props}) => <h1 className="text-2xl font-bold text-tw-primary mt-6 mb-3 border-b border-tw-border pb-2" {...props} />,
                               h2: ({...props}) => <h2 className="text-xl font-bold text-tw-primary mt-5 mb-2" {...props} />,
                               h3: ({...props}) => <h3 className="text-lg font-bold text-tw-text mt-4 mb-2" {...props} />,
                               ul: ({...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                               ol: ({...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                               li: ({...props}) => <li className="mb-1" {...props} />,
                               p: ({...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                               strong: ({...props}) => <strong className="font-bold text-tw-text" {...props} />,
                               code: ({...props}) => <code className="bg-tw-surface px-1 py-0.5 rounded text-tw-primary font-mono text-sm" {...props} />,
                             }}
                           >
                             {selectedComponent.description}
                           </ReactMarkdown>
                        </div>
                      </div>

                      {selectedComponent.wiring_guide && (
                        <div className="bg-tw-surface-2/30 rounded-3xl p-6 md:p-8 border border-tw-border/50 hover:border-tw-primary/30 transition-colors mt-8">
                          <h2 className="flex items-center gap-3 text-2xl font-bold text-tw-primary mb-6 m-0">
                            <Activity className="fill-tw-primary/20" /> Wiring Guide
                          </h2>
                          <div className="bg-tw-surface-3 rounded-xl p-4 md:p-6 font-mono text-sm text-tw-text-secondary border border-tw-border shadow-inner overflow-x-auto">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tw-text/50 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 sm:-top-12 sm:right-0 p-2 rounded-xl bg-tw-surface text-tw-text hover:text-tw-primary transition-colors"
            >
              <X size={24} />
            </button>
            <img src={selectedImage} alt="Full View" className="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl border border-tw-border" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGuide;
