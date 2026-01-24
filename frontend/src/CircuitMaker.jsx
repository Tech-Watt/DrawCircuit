import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  applyEdgeChanges, 
  applyNodeChanges, 
  addEdge,
  MiniMap,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { 
  Download, Cpu, Loader2, Zap, Save, Check, Clock, X, Code, FileText, LayoutTemplate, Copy
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// Wire color mapping
const WIRE_COLORS = {
  red: '#DC2626',
  black: '#1F2937',
  blue: '#2563EB',
  green: '#16A34A',
  yellow: '#CA8A04',
  orange: '#EA580C',
  purple: '#9333EA',
  white: '#9CA3AF'
};

// --- COMPONENTS ---

// Custom Node Component
const WiringNode = ({ data }) => {
  const pins = data.pins || [];
  const isController = data.type === 'Microcontroller';
  const midpoint = Math.ceil(pins.length / 2);
  const leftPins = isController ? pins.slice(0, midpoint) : [];
  const rightPins = isController ? pins.slice(midpoint) : pins;

  return (
    <div className={`bg-white rounded-lg shadow-xl border-2 ${isController ? 'border-blue-500' : 'border-gray-400'}`}>
      <div className={`px-4 py-2 rounded-t-md font-bold text-sm text-center ${isController ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
        {data.label}
      </div>
      <div className="flex">
        {isController && leftPins.length > 0 && (
          <div className="flex flex-col border-r border-gray-200">
            {leftPins.map((pin, idx) => (
              <div key={`l-${idx}`} className="relative flex items-center px-3 py-1 text-xs font-mono">
                <Handle type="source" position={Position.Left} id={pin} className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5" />
                <Handle type="target" position={Position.Left} id={`${pin}-in`} className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5" />
                <span className="ml-2">{pin}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col">
          {rightPins.map((pin, idx) => (
            <div key={`r-${idx}`} className={`relative flex items-center px-3 py-1 text-xs font-mono ${isController ? 'justify-end' : ''}`}>
              {!isController && (
                <>
                  <Handle type="target" position={Position.Left} id={pin} className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5" />
                  <Handle type="source" position={Position.Left} id={`${pin}-out`} className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5" />
                </>
              )}
              <span className={isController ? 'mr-2' : 'ml-2'}>{pin}</span>
              {isController && (
                <>
                  <Handle type="source" position={Position.Right} id={pin} className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-right-1.5" />
                  <Handle type="target" position={Position.Right} id={`${pin}-in`} className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-right-1.5" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const nodeTypes = { wiring: WiringNode };

const CircuitMaker = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [query, setQuery] = useState('');
  
  // History State
  const [showHistory, setShowHistory] = useState(false);
  const [recentCircuits, setRecentCircuits] = useState([]);
  
  // App Feature States
  const [activeTab, setActiveTab] = useState('diagram');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  // Data States
  const [codeData, setCodeData] = useState(null);
  const [bomData, setBomData] = useState(null);
  const [explanation, setExplanation] = useState('');
  
  const canvasRef = useRef(null);
  
  // Check URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
       loadSharedCircuit(id);
    }
  }, []);

  const loadSharedCircuit = async (id) => {
      setLoading(true);
      try {
          const res = await axios.get(`${API_BASE_URL}/circuit/${id}`);
          const { query, diagram_data, code, bom } = res.data;
          
          setQuery(query);
          if (diagram_data) renderDiagram(diagram_data);
          if (code) setCodeData({ code: code, explanation: "Loaded from save" });
          if (bom) setBomData({ items: bom, total_estimated_cost: "Unknown" });
          
      } catch (err) {
          console.error(err);
          alert("Could not load shared circuit");
      } finally {
          setLoading(false);
      }
  };

  const fetchHistory = async () => {
      try {
          const res = await axios.get(`${API_BASE_URL}/recent`);
          setRecentCircuits(res.data);
          setShowHistory(true);
      } catch (e) {
          console.error("Failed to load history");
      }
  };

  const loadFromHistory = (id) => {
      loadSharedCircuit(id);
      setShowHistory(false);
      window.history.pushState({}, '', `?id=${id}`);
  };

  // React Flow Callbacks
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const renderDiagram = (data) => {
      if (!data) return;
      
      const controllerNode = data.nodes.find(n => n.type === 'Microcontroller');
      const peripheralNodes = data.nodes.filter(n => n.type !== 'Microcontroller');
      
      let newNodes = [];
      if (controllerNode) {
        newNodes.push({
          id: controllerNode.id,
          type: 'wiring',
          position: { x: 300, y: 200 },
          data: { label: controllerNode.label, type: controllerNode.type, pins: controllerNode.pins }
        });
      }
      peripheralNodes.forEach((node, idx) => {
        const angle = (idx / peripheralNodes.length) * Math.PI - Math.PI / 2;
        const radius = 300;
        newNodes.push({
          id: node.id,
          type: 'wiring',
          position: { 
            x: 300 + Math.cos(angle) * radius + 200,
            y: 200 + Math.sin(angle) * radius + 100
          },
          data: { label: node.label, type: node.type, pins: node.pins }
        });
      });

      const newEdges = data.connections.map((conn) => ({
        id: conn.id,
        source: conn.from,
        sourceHandle: conn.fromPin,
        target: conn.to,
        targetHandle: conn.toPin,
        type: 'smoothstep',
        label: `${conn.fromPin} → ${conn.toPin}`,
        labelStyle: { fontSize: 10, fontWeight: 600, fill: WIRE_COLORS[conn.color] || '#000' },
        labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
        style: { stroke: WIRE_COLORS[conn.color] || '#000', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: WIRE_COLORS[conn.color] || '#000' }
      }));

      setNodes(newNodes);
      setEdges(newEdges);
      setExplanation(data.explanation || '');
      window.lastDiagramData = data; 
  };

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setCodeData(null);
    setBomData(null);
    setShareUrl('');
    
    try {
      const res = await axios.post(`${API_BASE_URL}/generate`, { query });
      renderDiagram(res.data);
      generateCodeAndBom();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  const generateCodeAndBom = async () => {
      try {
          const [codeRes, bomRes] = await Promise.all([
             axios.post(`${API_BASE_URL}/generate-code`, { query }),
             axios.post(`${API_BASE_URL}/generate-bom`, { query })
          ]);
          setCodeData(codeRes.data);
          setBomData(bomRes.data);
      } catch (e) {
          console.error("Secondary generation failed", e);
      }
  };

  const handleSave = async () => {
      if (!window.lastDiagramData) return;
      setSaving(true);
      try {
          // No Auth Header needed
          const res = await axios.post(`${API_BASE_URL}/save`, { 
              query,
              diagram_data: window.lastDiagramData,
              code: codeData ? codeData.code : "",
              bom: bomData ? bomData.items : []
          });
          
          const url = `${window.location.origin}?id=${res.data.id}`;
          setShareUrl(url);
      } catch (e) {
          alert("Failed to save");
      } finally {
          setSaving(false);
      }
  };

  const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
  };

  const handleExport = () => {
    if (!canvasRef.current) return;
    htmlToImage.toPng(canvasRef.current, { backgroundColor: '#f9fafb' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'techwatt-circuit.png';
        link.href = dataUrl;
        link.click();
      });
  };

  // Resizable Sidebar Logic
  const [sidebarWidth, setSidebarWidth] = useState(384); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isResizing = useRef(false);

  const startResizing = useCallback(() => { isResizing.current = true; }, []);
  const stopResizing = useCallback(() => { isResizing.current = false; }, []);
  const resize = useCallback((mouseMoveEvent) => {
      if (isResizing.current) {
        let newWidth = mouseMoveEvent.clientX;
        if (newWidth < 250) newWidth = 250; 
        if (newWidth > 600) newWidth = 600; 
        setSidebarWidth(newWidth);
      }
    }, []
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 text-gray-900 font-sans relative">
      
      {/* History Drawer */}
      {showHistory && (
          <div className="absolute inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
              <div className="relative w-full md:w-80 bg-white shadow-2xl h-full ml-auto flex flex-col animate-in slide-in-from-right duration-200">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2"><Clock size={16}/> Recent Designs</h3>
                      <button onClick={() => setShowHistory(false)} className="hover:bg-gray-200 p-1 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {recentCircuits.length === 0 ? (
                          <p className="text-gray-400 text-center text-sm py-10">
                             No saved circuits yet.
                          </p>
                      ) : (
                          recentCircuits.map((c) => (
                              <button 
                                  key={c.id} 
                                  onClick={() => loadFromHistory(c.id)}
                                  className="w-full text-left p-3 rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-all group"
                              >
                                  <div className="font-medium text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-700">
                                      {c.query}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-2 flex justify-between">
                                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                      <span className="font-mono bg-gray-100 px-1 rounded">#{c.id}</span>
                                  </div>
                              </button>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center justify-between shadow-sm z-20 overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Zap size={24} /></div>
          <div>
            <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 hidden sm:block">TechWatt Circuit AI</h1>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 sm:hidden">TechWatt</h1>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
            <button onClick={fetchHistory} className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors border border-gray-200 lg:mr-2">
                <Clock size={16} /> <span className="hidden sm:inline">Recent</span>
            </button>
            
            {shareUrl && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded text-sm border border-green-200">
                    <Check size={14} /> <span className="hidden sm:inline">Saved!</span> 
                    <button onClick={() => copyToClipboard(shareUrl)} className="underline font-semibold ml-1">Copy<span className="hidden sm:inline"> Link</span></button>
                </div>
            )}
            <button onClick={handleSave} disabled={saving || !nodes.length} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} <span className="hidden sm:inline">Save Publicly</span><span className="sm:hidden">Save</span>
            </button>
            <button onClick={handleExport} disabled={nodes.length === 0} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-gray-900/20 whitespace-nowrap">
                <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Resizable Sidebar - INPUT FIRST on Mobile */}
        <aside 
            className="bg-white border-b md:border-b-0 md:border-r flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative shrink-0 order-1 md:order-1 h-auto md:h-auto"
            style={{ width: isMobile ? '100%' : sidebarWidth, maxHeight: isMobile ? '50vh' : 'none' }}
        >
            {/* Drag Handle - Desktop Only */}
            <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 active:bg-blue-600 transition-colors z-50 hidden md:block"
                onMouseDown={startResizing}
            />

            <div className="p-4 md:p-5 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <div className="relative">
                    <textarea
                        className="w-full h-20 md:h-24 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g. Arduino UNO with HC-SR04..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !query.trim()}
                        className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-md shadow-sm transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
                    </button>
                </div>
            </div>

            {/* Feature Tabs */}
            <div className="flex border-b bg-gray-50">
                <button onClick={() => setActiveTab('diagram')} className={`flex-1 py-2 md:py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'diagram' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
                    <LayoutTemplate size={16} /> <span className="hidden xs:inline">Diagram</span>
                </button>
                <button onClick={() => setActiveTab('code')} className={`flex-1 py-2 md:py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'code' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
                    <Code size={16} /> <span className="hidden xs:inline">Code</span>
                </button>
                <button onClick={() => setActiveTab('bom')} className={`flex-1 py-2 md:py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'bom' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}>
                    <FileText size={16} /> <span className="hidden xs:inline">Cost</span>
                </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-5 bg-gray-50/50">
                {/* ... (Existing Content Panels - no changes needed internally) ... */}
                {activeTab === 'diagram' && (
                    <div className="space-y-4">
                        {explanation ? (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h3 className="text-sm font-bold text-blue-900 mb-2">Analysis</h3>
                                <p className="text-sm text-blue-800 leading-relaxed">{explanation}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm text-center mt-10">Generate a circuit to see analysis.</p>
                        )}
                        
                        <div className="bg-white rounded-lg p-4 border shadow-sm">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Wire Legend</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(WIRE_COLORS).map(([name, color]) => (
                                    <div key={name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ background: color }}></div>
                                        <span className="capitalize">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex flex-col">
                        {codeData ? (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-gray-700">Firmware</h3>
                                    <button onClick={() => copyToClipboard(codeData.code)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline"><Copy size={12}/> Copy</button>
                                </div>
                                <pre className="flex-1 bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-auto whitespace-pre-wrap shadow-inner border border-gray-700">
                                    {codeData.code}
                                </pre>
                                <p className="mt-3 text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2">{codeData.explanation}</p>
                            </>
                        ) : (
                            <div className="text-center mt-10 text-gray-400">
                                {loading ? <Loader2 className="animate-spin mx-auto mb-2" /> : <Code size={32} className="mx-auto mb-2 opacity-50"/>}
                                <p>Generate a circuit to get code.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bom' && (
                    <div>
                         {bomData ? (
                            <>
                                <div className="flex justify-between items-end mb-4">
                                    <h3 className="font-bold text-gray-700">Bill of Materials</h3>
                                    <span className="text-xl font-bold text-green-600">{bomData.total_estimated_cost}</span>
                                </div>
                                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-500 font-medium">
                                            <tr>
                                                <th className="px-4 py-2">Component</th>
                                                <th className="px-4 py-2 text-right">Qty</th>
                                                <th className="px-4 py-2 text-right">Price</th>
                                                <th className="px-4 py-2 text-right">Source</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {bomData.items.map((item, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    <td className="px-4 py-2 font-medium text-gray-800">{item.component}</td>
                                                    <td className="px-4 py-2 text-right text-gray-600">{item.quantity}</td>
                                                    <td className="px-4 py-2 text-right text-gray-600">{item.estimated_price}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-blue-500">{item.source || 'Online'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-xs text-center text-gray-400">
                                    {bomData.notes || "Prices sourced from major online distributors."}
                                </p>
                            </>
                        ) : (
                            <div className="text-center mt-10 text-gray-400">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        <p className="text-sm">Searching current market prices...</p>
                                    </>
                                ) : (
                                    <>
                                        <FileText size={32} className="mx-auto mb-2 opacity-50"/>
                                        <p>Generate a circuit to estimate costs.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>

        {/* Canvas - Order 2 on Mobile (Below Sidebar) */}
        <main className="flex-1 relative bg-gray-100 order-2" ref={canvasRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background color="#cbd5e1" gap={20} />
            <Controls className="bg-white border shadow-lg rounded-lg" />
            <MiniMap className="border shadow-lg rounded-lg" />
          </ReactFlow>
          
           {nodes.length === 0 && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-8 rounded-2xl shadow-xl text-center border max-w-sm w-full">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                     <Cpu size={20} className="text-blue-600 md:w-8 md:h-8" />
                </div>
                <h2 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Design Your Circuit</h2>
                <p className="text-xs md:text-base text-gray-600 mb-0">Describe your idea to generate wiring, code, and costs.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CircuitMaker;
