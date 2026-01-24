import React, { useState, useCallback, useRef } from 'react';
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
import { Download, Cpu, Loader2, Zap } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

// API Base URL - uses relative path in production, localhost in development
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

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

// Custom Node Component - Wiring Block
const WiringNode = ({ data }) => {
  const pins = data.pins || [];
  const isController = data.type === 'Microcontroller';
  
  // Split pins for two-column layout on controllers
  const midpoint = Math.ceil(pins.length / 2);
  const leftPins = isController ? pins.slice(0, midpoint) : [];
  const rightPins = isController ? pins.slice(midpoint) : pins;

  return (
    <div className={`bg-white rounded-lg shadow-xl border-2 ${isController ? 'border-blue-500' : 'border-gray-400'}`}>
      {/* Header */}
      <div className={`px-4 py-2 rounded-t-md font-bold text-sm text-center ${isController ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
        {data.label}
      </div>
      
      {/* Pins */}
      <div className="flex">
        {/* Left Column */}
        {isController && leftPins.length > 0 && (
          <div className="flex flex-col border-r border-gray-200">
            {leftPins.map((pin, idx) => (
              <div key={`l-${idx}`} className="relative flex items-center px-3 py-1 text-xs font-mono">
                <Handle
                  type="source"
                  position={Position.Left}
                  id={pin}
                  className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5"
                />
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${pin}-in`}
                  className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5"
                />
                <span className="ml-2">{pin}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Right Column */}
        <div className="flex flex-col">
          {rightPins.map((pin, idx) => (
            <div key={`r-${idx}`} className={`relative flex items-center px-3 py-1 text-xs font-mono ${isController ? 'justify-end' : ''}`}>
              {!isController && (
                <>
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={pin}
                    className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5"
                  />
                  <Handle
                    type="source"
                    position={Position.Left}
                    id={`${pin}-out`}
                    className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-left-1.5"
                  />
                </>
              )}
              <span className={isController ? 'mr-2' : 'ml-2'}>{pin}</span>
              {isController && (
                <>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={pin}
                    className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-right-1.5"
                  />
                  <Handle
                    type="target"
                    position={Position.Right}
                    id={`${pin}-in`}
                    className="!w-2.5 !h-2.5 !bg-gray-600 !border-2 !border-white !-right-1.5"
                  />
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

// Main App Component
const CircuitMaker = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const canvasRef = useRef(null);

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Generate wiring diagram
  const handleGenerate = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setExplanation('');
    
    try {
      const res = await axios.post(`${API_BASE_URL}/generate`, { query });
      const data = res.data;

      // Calculate positions - Controller in center, peripherals around it
      const controllerNode = data.nodes.find(n => n.type === 'Microcontroller');
      const peripheralNodes = data.nodes.filter(n => n.type !== 'Microcontroller');
      
      let newNodes = [];
      
      // Position controller in center
      if (controllerNode) {
        newNodes.push({
          id: controllerNode.id,
          type: 'wiring',
          position: { x: 300, y: 200 },
          data: { label: controllerNode.label, type: controllerNode.type, pins: controllerNode.pins }
        });
      }
      
      // Position peripherals
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

      // Create edges from connections
      const newEdges = data.connections.map((conn) => ({
        id: conn.id,
        source: conn.from,
        sourceHandle: conn.fromPin,
        target: conn.to,
        targetHandle: conn.toPin,
        type: 'smoothstep',
        animated: false,
        label: `${conn.fromPin} → ${conn.toPin}`,
        labelStyle: { fontSize: 10, fontWeight: 600, fill: WIRE_COLORS[conn.color] || '#000' },
        labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
        style: { stroke: WIRE_COLORS[conn.color] || '#000', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: WIRE_COLORS[conn.color] || '#000' }
      }));

      setNodes(newNodes);
      setEdges(newEdges);
      setExplanation(data.explanation || '');

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate diagram. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Export as PNG
  const handleExport = () => {
    if (!canvasRef.current) return;
    
    htmlToImage.toPng(canvasRef.current, { backgroundColor: '#f9fafb' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'wiring-diagram.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Export failed:', err));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">TechWatt Circuit AI</h1>
            <p className="text-xs text-gray-500">Wiring Diagram Generator</p>
          </div>
        </div>
        <button 
          onClick={handleExport}
          disabled={nodes.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} /> Export PNG
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r p-5 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe Your Circuit
            </label>
            <textarea
              className="w-full h-28 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Arduino with DHT11 temperature sensor and OLED display"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleGenerate()}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !query.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Cpu size={20} />
                Generate Diagram
              </>
            )}
          </button>

          {explanation && (
            <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-2">Circuit Explanation</h3>
              <p className="text-sm text-blue-800 leading-relaxed">{explanation}</p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Wire Colors</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-600 rounded"></div>
                <span>Power (5V/3.3V)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-gray-800 rounded"></div>
                <span>Ground</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-600 rounded"></div>
                <span>Data/Signal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-600 rounded"></div>
                <span>Data/Signal</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 relative" ref={canvasRef}>
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
            <Background color="#e5e7eb" gap={20} />
            <Controls className="bg-white border shadow-lg rounded-lg" />
            <MiniMap className="border shadow-lg rounded-lg" />
          </ReactFlow>

          {/* Empty State */}
          {nodes.length === 0 && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-400">
                <Cpu size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No Diagram Yet</p>
                <p className="text-sm">Enter a circuit description and click Generate</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CircuitMaker;
