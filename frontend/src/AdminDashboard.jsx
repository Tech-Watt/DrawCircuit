import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, X, Cpu, Zap, Activity, ArrowLeft, Download, Book, Bot, Layers, Trash2, LogOut, Shield, Edit } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Dashboard Data
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredComponents, setFilteredComponents] = useState([]);

  // Form State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newComponent, setNewComponent] = useState({
    name: '',
    category: '', // Allow custom category
    description: '',
    wiring_guide: '',
    image_urls: [],
    image_url_input: ''
  });
  
  // Category logic
  const [categories, setCategories] = useState(['Robotics', 'AI', 'Microcontroller', 'Sensor', 'Actuator', 'Power', 'Module']);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchComponents();
    }
  }, [isAuthenticated]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/verify-password`, { password });
      setIsAuthenticated(true);
      setAuthError('');
    } catch (error) {
      setAuthError("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  const fetchComponents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/components`);
      setComponents(res.data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this component?")) return;
    try {
      await axios.delete(`${API_URL}/api/components/${id}`);
      fetchComponents();
    } catch (error) {
      console.error("Error deleting component:", error);
      alert("Failed to delete component");
    }
  };

  const handleGenerateDetails = async () => {
    if (!newComponent.name) {
      alert("Please enter a component name first.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/generate-component-details`, {
        name: newComponent.name,
        category: isCustomCategory ? customCategory : newComponent.category
      });
      
      setNewComponent(prev => ({
        ...prev,
        description: res.data.description,
        wiring_guide: res.data.wiring_guide
      }));
    } catch (error) {
      console.error("Error generating details:", error);
      alert("Failed to generate details with AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (comp) => {
    setEditingId(comp.id);
    setNewComponent({
      name: comp.name,
      category: comp.category,
      description: comp.description,
      wiring_guide: comp.wiring_guide || '',
      image_urls: Array.isArray(comp.image_url) ? comp.image_url : (comp.image_url ? [comp.image_url] : []),
      image_url_input: ''
    });

    if (!categories.includes(comp.category)) {
        setIsCustomCategory(true);
        setCustomCategory(comp.category);
    } else {
        setIsCustomCategory(false);
        setCustomCategory('');
    }
    
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleRemoveImage = (indexToRemove) => {
    setNewComponent(prev => ({
        ...prev,
        image_urls: prev.image_urls.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewComponent({ name: '', category: '', description: '', wiring_guide: '', image_urls: [], image_url_input: '' });
    setSelectedFiles([]);
    setCustomCategory('');
    setIsCustomCategory(false);
  };

  const handleAddComponent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrls = [...newComponent.image_urls];

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append("file", file);
          
          try {
             const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
               headers: { "Content-Type": "multipart/form-data" }
             });
             finalImageUrls.push(uploadRes.data.url);
          } catch (uploadError) {
             console.error("Upload failed for file:", file.name, uploadError);
          }
        }
      }

      if (newComponent.image_url_input) {
          finalImageUrls.push(newComponent.image_url_input);
      }

      const categoryToSubmit = isCustomCategory ? customCategory : newComponent.category;
      
      const payload = {
        ...newComponent, 
        category: categoryToSubmit,
        image_url: finalImageUrls 
      };

      if (editingId) {
          await axios.put(`${API_URL}/api/components/${editingId}`, payload);
      } else {
          await axios.post(`${API_URL}/api/components`, payload);
      }
      
      handleCancelEdit(); // Reset form
      fetchComponents();
      navigate('/success');
      
    } catch (error) {
      console.error("Error saving component:", error);
      alert("Failed to save component.");
    } finally {
        setLoading(false);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
             {/* Glow */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-slate-800 rounded-full text-cyan-400 border border-slate-700">
                        <Shield size={48} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-2">Admin Dashboard</h2>
                <p className="text-slate-400 text-sm text-center mb-8">Enter your secure password to verify access.</p>
                
                <form onSubmit={handleLogin}>
                  {authError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                       <Activity size={16} /> {authError}
                    </div>
                  )}

                  <div className="mb-6">
                    <input 
                      type="password" 
                      autoFocus
                      placeholder="Enter Password"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder-slate-500"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all"
                  >
                    {loading ? "Verifying..." : "Access Dashboard"}
                  </button>
                </form>
             </div>
          </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="text-purple-500" /> 
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TechWatt Admin</span>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Add Component Column */}
          <div className="lg:col-span-1">
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    {editingId ? <Edit className="text-purple-400" /> : <Plus className="text-cyan-400" />} 
                    {editingId ? "Edit Component" : "Add New Component"}
                </h2>
                
                <form onSubmit={handleAddComponent} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Servo Motor"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                            value={newComponent.name}
                            onChange={e => setNewComponent({...newComponent, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                        <div className="flex flex-col gap-2">
                            {!isCustomCategory ? (
                                <select 
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
                                    value={newComponent.category}
                                    onChange={e => {
                                        if (e.target.value === 'custom') {
                                            setIsCustomCategory(true);
                                        } else {
                                            setNewComponent({...newComponent, category: e.target.value});
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    <option value="custom" className="font-bold text-cyan-400">+ Create New Category</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        autoFocus
                                        placeholder="Enter new category..."
                                        className="w-full bg-slate-800 border border-cyan-500 rounded-lg px-3 py-2 text-white outline-none"
                                        value={customCategory}
                                        onChange={e => setCustomCategory(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCustomCategory(false)}
                                        className="p-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg"
                                    >
                                        <X size={18} className="text-slate-400" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Image Upload</label>
                        <div className="relative border-2 border-dashed border-slate-700 rounded-lg p-4 text-center hover:bg-slate-800/50 transition-colors">
                            <input 
                                type="file" 
                                multiple
                                accept="image/*"
                                onChange={e => setSelectedFiles(Array.from(e.target.files))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-slate-400 text-sm">
                                {selectedFiles.length > 0 ? (
                                    <span className="text-cyan-400">{selectedFiles.length} files selected</span>
                                ) : (
                                    <span>Drag & Drop or Click (Add New)</span>
                                )}
                            </div>
                        </div>
                        
                        {/* Existing Images Display */}
                        {newComponent.image_urls.length > 0 && (
                            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                                {newComponent.image_urls.map((url, idx) => (
                                    <div key={idx} className="relative w-16 h-16 shrink-0 group">
                                        <img src={url} alt="existing" className="w-full h-full object-cover rounded-lg border border-slate-600" />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Or Image URL</label>
                        <div className="flex gap-2">
                            <input 
                                type="url" 
                                placeholder="https://..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none text-sm"
                                value={newComponent.image_url_input}
                                onChange={e => setNewComponent({...newComponent, image_url_input: e.target.value})}
                            />
                             <button
                                type="button"
                                onClick={handleGenerateDetails}
                                disabled={loading}
                                className="px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center"
                                title="Auto-Generate Details"
                            >
                                <Bot size={18} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none text-sm"
                            value={newComponent.description}
                            onChange={e => setNewComponent({...newComponent, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Wiring Guide</label>
                        <textarea 
                            rows={3}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none font-mono text-sm"
                            value={newComponent.wiring_guide}
                            onChange={e => setNewComponent({...newComponent, wiring_guide: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-2">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={handleCancelEdit}
                                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                            {loading ? "Saving..." : (editingId ? "Update Component" : "Save Component")}
                        </button>
                    </div>
                </form>
             </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search components..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-cyan-500"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-slate-400 text-sm">
                    {filteredComponents.length} Components
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-4">
                {filteredComponents.map(comp => (
                    <div key={comp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 hover:border-slate-600 transition-colors group">
                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                             {comp.image_url && (Array.isArray(comp.image_url) ? comp.image_url.length > 0 : comp.image_url) ? (
                                 <img 
                                    src={Array.isArray(comp.image_url) ? comp.image_url[0] : comp.image_url} 
                                    alt={comp.name} 
                                    className="w-full h-full object-cover" 
                                 />
                             ) : (
                                 <Cpu size={24} className="text-slate-500" />
                             )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white truncate">{comp.name}</h3>
                            <span className="text-xs text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-900/30">
                                {comp.category}
                            </span>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{comp.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                             <button 
                                onClick={() => handleEdit(comp)}
                                className="p-2 text-slate-500 hover:text-purple-400 hover:bg-purple-900/10 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(comp.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
