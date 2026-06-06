import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Download, Cpu, Loader2, Zap, Save, Check, Clock, X, Code, FileText, LayoutTemplate, Copy, Book, Home
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
    <div className="h-[100dvh] flex flex-col bg-tw-bg text-tw-text font-sans relative">
      
      {/* History Drawer */}
      {showHistory && (
          <div className="absolute inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
              <div className="relative w-full max-w-sm bg-tw-surface shadow-2xl h-full ml-auto flex flex-col border-l border-tw-border">
                  <div className="p-4 border-b border-tw-border flex justify-between items-center">
                      <h3 className="font-bold text-tw-text flex items-center gap-2"><Clock size={16}/> Recent Designs</h3>
                      <button onClick={() => setShowHistory(false)} className="p-2 rounded-lg hover:bg-tw-surface-2 text-tw-muted"><X size={16}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {recentCircuits.length === 0 ? (
                          <p className="text-tw-muted text-center text-sm py-10">
                             No saved circuits yet.
                          </p>
                      ) : (
                          recentCircuits.map((c) => (
                              <button 
                                  key={c.id} 
                                  onClick={() => loadFromHistory(c.id)}
                                  className="w-full text-left p-3 rounded-xl border border-tw-border hover:border-tw-primary/50 hover:bg-tw-surface-2 transition-all group"
                              >
                                  <div className="font-medium text-sm text-tw-text line-clamp-2 leading-snug group-hover:text-tw-primary-light">
                                      {c.query}
                                  </div>
                                  <div className="text-xs text-tw-muted mt-2 flex justify-between">
                                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                                      <span className="font-mono bg-tw-surface-3 px-1.5 rounded">#{c.id}</span>
                                  </div>
                              </button>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <header className="bg-tw-surface border-b border-tw-border px-3 sm:px-5 py-2.5 flex items-center justify-between z-20 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <Link to="/" className="p-2 rounded-lg text-tw-muted hover:text-tw-text hover:bg-tw-surface-2 transition-colors shrink-0">
            <Home size={18} />
          </Link>
          <div className="bg-tw-primary/15 border border-tw-primary/25 p-1.5 sm:p-2 rounded-lg text-tw-primary shrink-0"><Zap size={20} /></div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold gradient-text truncate">TechWatt Circuit AI</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-x-auto">
            <button onClick={fetchHistory} className="btn btn-secondary btn-sm !px-2.5 sm:!px-3">
                <Clock size={15} /> <span className="hidden sm:inline">Recent</span>
            </button>
            <Link to="/study" className="btn btn-secondary btn-sm !px-2.5 sm:!px-3">
                <Book size={15} /> <span className="hidden sm:inline">Guide</span>
            </Link>
            
            {shareUrl && (
                <div className="flex items-center gap-1.5 bg-tw-success/10 text-tw-success px-2.5 py-1.5 rounded-lg text-xs sm:text-sm border border-tw-success/20 whitespace-nowrap">
                    <Check size={13} /> <span className="hidden sm:inline">Saved!</span> 
                    <button onClick={() => copyToClipboard(shareUrl)} className="underline font-semibold">Copy</button>
                </div>
            )}
            <button onClick={handleSave} disabled={saving || !nodes.length} className="btn btn-secondary btn-sm !px-2.5 sm:!px-3">
                {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />} <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={handleExport} disabled={nodes.length === 0} className="btn btn-primary btn-sm !px-2.5 sm:!px-3">
                <Download size={15} /> <span className="hidden sm:inline">Export</span>
            </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Canvas Area */}
        <main className="relative bg-tw-surface-2 order-1 md:order-2 h-[40vh] sm:h-[45vh] md:h-auto md:flex-1 w-full" ref={canvasRef}>
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
            <Background color="#243049" gap={20} />
            <Controls className="!bg-tw-surface !border-tw-border" />
            <MiniMap className="!bg-tw-surface !border-tw-border" />
          </ReactFlow>
          
           {nodes.length === 0 && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
              <div className="card-elevated p-4 sm:p-8 text-center max-w-xs sm:max-w-sm w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-tw-primary/10 border border-tw-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                     <Cpu size={24} className="text-tw-primary" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-tw-text mb-1 sm:mb-2">Design Your Circuit</h2>
                <p className="text-xs sm:text-base text-tw-muted">Describe your idea to generate wiring, code, and costs.</p>
              </div>
            </div>
          )}
        </main>

        {/* Controls Sidebar */}
        <aside 
            className="bg-tw-surface border-t md:border-t-0 md:border-r border-tw-border flex flex-col z-10 relative shrink-0 order-2 md:order-1 flex-1 md:flex-none md:h-auto overflow-hidden"
            style={{ width: isMobile ? '100%' : sidebarWidth }}
        >
            <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-tw-primary active:bg-tw-primary-dark transition-colors z-50 hidden md:block"
                onMouseDown={startResizing}
            />

            <div className="p-3 sm:p-5 border-b border-tw-border shrink-0">
                <label className="block text-xs sm:text-sm font-medium text-tw-muted mb-1.5 sm:mb-2">Project Description</label>
                <div className="relative">
                    <textarea
                        className="input-field h-16 sm:h-24 p-3 text-sm resize-none !pr-12"
                        placeholder="e.g. Arduino UNO with HC-SR04..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !query.trim()}
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 btn btn-primary !px-2.5 !py-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                    </button>
                </div>
            </div>

            <div className="flex border-b border-tw-border bg-tw-surface-2 shrink-0">
                {[
                  { id: 'diagram', icon: LayoutTemplate, label: 'Diagram' },
                  { id: 'code', icon: Code, label: 'Code' },
                  { id: 'bom', icon: FileText, label: 'Cost' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                      activeTab === id
                        ? 'border-tw-primary text-tw-primary bg-tw-surface'
                        : 'border-transparent text-tw-muted hover:text-tw-text hover:bg-tw-surface'
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                {/* ... (Existing Content Panels - no changes needed internally) ... */}
                {activeTab === 'diagram' && (
                    <div className="space-y-4">
                        {explanation ? (
                            <div className="rounded-xl p-4 border border-tw-primary/20 bg-tw-primary/5">
                                <h3 className="text-sm font-bold text-tw-primary-light mb-2">Analysis</h3>
                                <p className="text-sm text-tw-text leading-relaxed">{explanation}</p>
                            </div>
                        ) : (
                            <p className="text-tw-muted text-sm text-center mt-10">Generate a circuit to see analysis.</p>
                        )}
                        
                        <div className="card p-4">
                            <h3 className="text-xs font-bold text-tw-muted uppercase tracking-wider mb-3">Wire Legend</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {Object.entries(WIRE_COLORS).map(([name, color]) => (
                                    <div key={name} className="flex items-center gap-2 text-tw-text">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }}></div>
                                        <span className="capitalize">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="h-full flex flex-col min-h-[200px]">
                        {codeData ? (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-tw-text">Firmware</h3>
                                    <button onClick={() => copyToClipboard(codeData.code)} className="text-xs flex items-center gap-1 text-tw-primary hover:underline"><Copy size={12}/> Copy</button>
                                </div>
                                <pre className="flex-1 bg-tw-bg text-tw-text p-4 rounded-xl text-xs font-mono overflow-auto whitespace-pre-wrap border border-tw-border">
                                    {codeData.code}
                                </pre>
                                <p className="mt-3 text-xs text-tw-muted italic border-l-2 border-tw-border pl-2">{codeData.explanation}</p>
                            </>
                        ) : (
                            <div className="text-center mt-10 text-tw-muted">
                                {loading ? <Loader2 className="animate-spin mx-auto mb-2" /> : <Code size={32} className="mx-auto mb-2 opacity-40"/>}
                                <p className="text-sm">Generate a circuit to get code.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bom' && (
                    <div>
                         {bomData ? (
                            <>
                                <div className="flex justify-between items-end mb-4 gap-2">
                                    <h3 className="font-bold text-tw-text">Bill of Materials</h3>
                                    <span className="text-lg sm:text-xl font-bold text-tw-success shrink-0">{bomData.total_estimated_cost}</span>
                                </div>
                                <div className="card overflow-x-auto">
                                    <table className="w-full text-sm text-left min-w-[320px]">
                                        <thead className="bg-tw-surface-2 text-tw-muted font-medium">
                                            <tr>
                                                <th className="px-3 sm:px-4 py-2">Component</th>
                                                <th className="px-3 sm:px-4 py-2 text-right">Qty</th>
                                                <th className="px-3 sm:px-4 py-2 text-right">Price</th>
                                                <th className="px-3 sm:px-4 py-2 text-right hidden sm:table-cell">Source</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-tw-border">
                                            {bomData.items.map((item, i) => (
                                                <tr key={i} className="hover:bg-tw-surface-2">
                                                    <td className="px-3 sm:px-4 py-2 font-medium text-tw-text">{item.component}</td>
                                                    <td className="px-3 sm:px-4 py-2 text-right text-tw-muted">{item.quantity}</td>
                                                    <td className="px-3 sm:px-4 py-2 text-right text-tw-muted">{item.estimated_price}</td>
                                                    <td className="px-3 sm:px-4 py-2 text-right text-xs text-tw-accent hidden sm:table-cell">{item.source || 'Online'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-xs text-center text-tw-muted">
                                    {bomData.notes || "Prices sourced from major online distributors."}
                                </p>
                            </>
                        ) : (
                            <div className="text-center mt-10 text-tw-muted">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        <p className="text-sm">Searching current market prices...</p>
                                    </>
                                ) : (
                                    <>
                                        <FileText size={32} className="mx-auto mb-2 opacity-40"/>
                                        <p className="text-sm">Generate a circuit to estimate costs.</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
      </div>
    </div>
  );
};

export default CircuitMaker;
