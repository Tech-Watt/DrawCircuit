import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, X, Cpu, Zap, Activity, ArrowLeft, Download, Book, Bot, Layers, Trash2, LogOut, Shield, Edit, FileText, List, Plane, BarChart, Calendar, Users, MapPin } from 'lucide-react';
import ConfirmDialog from './components/ConfirmDialog';

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

  // AI Module State
  const [view, setView] = useState('components'); // 'components', 'ai_modules', 'events'
  const [aiModules, setAiModules] = useState([]);
  const [newAIModule, setNewAIModule] = useState({
    title: '',
    week: '',
    description: '',
    content: '',
    image_urls: [],
    course_type: 'python_master' // Default
  });
  const [selectedAICourseType, setSelectedAICourseType] = useState('python_master'); // 'python_master' or 'kids'
  const [editingAIModuleId, setEditingAIModuleId] = useState(null);

  // Events State
  const [eventList, setEventList] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', event_date: '', location: '', max_spots: '', is_active: true
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionError, setActionError] = useState('');
  const [eventSaveError, setEventSaveError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (view === 'components') fetchComponents();
      else if (view === 'ai_modules') fetchAIModules();
      else if (view === 'events') fetchEvents();
    }
  }, [isAuthenticated, view]);

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

  const fetchAIModules = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ai-courses?type=${selectedAICourseType}`);
      setAiModules(res.data);
    } catch (error) {
       console.error("Error fetching AI modules", error);
    }
  };

  useEffect(() => {
    if (view === 'ai_modules') {
        fetchAIModules();
    }
  }, [selectedAICourseType]);

  const requestDelete = (type, id, label) => {
    setActionError('');
    setConfirmDelete({ type, id, label });
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    setLoading(true);
    setActionError('');
    try {
      const { type, id } = confirmDelete;
      if (type === 'component') {
        await axios.delete(`${API_URL}/api/components/${id}`);
        fetchComponents();
      } else if (type === 'ai_module') {
        await axios.delete(`${API_URL}/api/ai-courses/${id}`);
        fetchAIModules();
      } else if (type === 'event') {
        await axios.delete(`${API_URL}/api/events/${id}`);
        fetchEvents();
        if (viewingRegistrations === id) setViewingRegistrations(null);
      }
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting:", error);
      setActionError('Failed to delete. Please try again.');
    } finally {
      setLoading(false);
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

  // AI Module Handlers
  const handleAddAIModule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const payload = {
            title: newAIModule.title,
            week: parseInt(newAIModule.week) || 0,
            description: newAIModule.description,
            content: newAIModule.content,
            image_url: newAIModule.image_urls,
            course_type: selectedAICourseType
        };

        if (editingAIModuleId) {
            await axios.put(`${API_URL}/api/ai-courses/${editingAIModuleId}`, payload);
        } else {
            await axios.post(`${API_URL}/api/ai-courses`, payload);
        }
        
        setNewAIModule({ title: '', week: '', description: '', content: '', image_urls: [], course_type: selectedAICourseType });
        setEditingAIModuleId(null);
        fetchAIModules();
        navigate('/success');
    } catch (error) {
        console.error("Error saving AI module:", error);
        alert("Failed to save AI module.");
    } finally {
        setLoading(false);
    }
  };

  const handleEditAIModule = (mod) => {
     setEditingAIModuleId(mod.id);
     setNewAIModule({
        title: mod.title,
        week: mod.week,
        description: mod.description,
        content: mod.content,
        image_urls: mod.image_url || [],
        course_type: mod.course_type || selectedAICourseType
     });
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEditAIModule = () => {
    setEditingAIModuleId(null);
    setNewAIModule({ title: '', week: '', description: '', content: '', image_urls: [], course_type: selectedAICourseType });
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events?active_only=false`);
      setEventList(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchRegistrations = async (eventId) => {
    try {
      const res = await axios.get(`${API_URL}/api/events/${eventId}/registrations`);
      setRegistrations(res.data);
      setViewingRegistrations(eventId);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEventSaveError('');
    try {
      const payload = {
        title: newEvent.title,
        description: newEvent.description || null,
        event_date: new Date(newEvent.event_date).toISOString(),
        location: newEvent.location || null,
        max_spots: newEvent.max_spots ? parseInt(newEvent.max_spots) : null,
        is_active: newEvent.is_active,
      };
      if (editingEventId) {
        await axios.put(`${API_URL}/api/events/${editingEventId}`, payload);
      } else {
        await axios.post(`${API_URL}/api/events`, payload);
      }
      setNewEvent({ title: '', description: '', event_date: '', location: '', max_spots: '', is_active: true });
      setEditingEventId(null);
      fetchEvents();
      navigate('/success');
    } catch (error) {
      console.error("Error saving event:", error);
      const detail = error.response?.data?.detail;
      setEventSaveError(typeof detail === 'string' ? detail : 'Failed to save event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (ev) => {
    setEventSaveError('');
    setEditingEventId(ev.id);
    const d = new Date(ev.event_date);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setNewEvent({
      title: ev.title,
      description: ev.description || '',
      event_date: local,
      location: ev.location || '',
      max_spots: ev.max_spots != null ? String(ev.max_spots) : '',
      is_active: ev.is_active,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditEvent = () => {
    setEventSaveError('');
    setEditingEventId(null);
    setNewEvent({ title: '', description: '', event_date: '', location: '', max_spots: '', is_active: true });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="page-shell relative flex items-center justify-center p-4">
          <div className="bg-mesh" />
          <div className="card-elevated w-full max-w-md p-8 sm:p-10 relative z-10">
             <div className="flex justify-center mb-6">
                    <div className="p-4 bg-tw-primary/10 rounded-2xl text-tw-primary border border-tw-primary/20">
                        <Shield size={40} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-tw-text text-center mb-2">Admin Dashboard</h2>
                <p className="text-tw-muted text-sm text-center mb-8">Enter your secure password to verify access.</p>
                
                <form onSubmit={handleLogin}>
                  {authError && (
                    <div className="mb-4 p-3 bg-tw-danger/10 border border-tw-danger/20 rounded-xl flex items-center gap-2 text-tw-danger text-sm">
                       <Activity size={16} /> {authError}
                    </div>
                  )}

                  <div className="mb-6">
                    <input 
                      type="password" 
                      autoFocus
                      placeholder="Enter Password"
                      className="input-field"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full py-3"
                  >
                    {loading ? "Verifying..." : "Access Dashboard"}
                  </button>
                </form>
          </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="page-shell pb-16 sm:pb-20">
      <nav className="border-b border-tw-border bg-tw-surface/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="page-container h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg shrink-0">
            <Shield className="text-tw-primary" size={20} /> 
            <span className="gradient-text hidden xs:inline">TechWatt Admin</span>
          </div>
          <div className="flex bg-tw-surface-2 rounded-xl p-1 border border-tw-border overflow-x-auto max-w-[70vw] sm:max-w-none">
               <button 
                  onClick={() => setView('components')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${view === 'components' ? 'bg-tw-primary !text-white' : 'text-tw-muted hover:text-tw-text'}`}
               >
                  Components
               </button>
               <button 
                  onClick={() => setView('ai_modules')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${view === 'ai_modules' ? 'bg-tw-accent !text-white' : 'text-tw-muted hover:text-tw-text'}`}
               >
                  AI Guide
               </button>
               <button 
                  onClick={() => setView('events')}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${view === 'events' ? 'bg-tw-warning !text-white' : 'text-tw-muted hover:text-tw-text'}`}
               >
                  Events
               </button>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="btn btn-ghost btn-sm shrink-0"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="page-container py-6 sm:py-8">
        
        {view === 'events' ? (
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-1">
                <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
                  <h2 className="text-lg sm:text-xl font-bold text-tw-text mb-5 sm:mb-6 flex items-center gap-2">
                    {editingEventId ? <Edit className="text-tw-accent" size={20} /> : <Plus className="text-tw-warning" size={20} />}
                    {editingEventId ? "Edit Event" : "Create Event"}
                  </h2>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    {eventSaveError && (
                      <div className="p-3 rounded-xl bg-tw-danger/10 border border-tw-danger/20 text-tw-danger text-sm">
                        {eventSaveError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-tw-muted mb-1">Title *</label>
                      <input type="text" required className="input-field !py-2.5" placeholder="e.g. Robotics Summer Camp"
                        value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tw-muted mb-1">Date & Time *</label>
                      <input type="datetime-local" required className="input-field !py-2.5"
                        value={newEvent.event_date} onChange={e => setNewEvent({...newEvent, event_date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tw-muted mb-1">Location</label>
                      <input type="text" className="input-field !py-2.5" placeholder="e.g. TechWatt HQ or Online"
                        value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tw-muted mb-1">Max Spots</label>
                      <input type="number" min="1" className="input-field !py-2.5" placeholder="Leave blank for unlimited"
                        value={newEvent.max_spots} onChange={e => setNewEvent({...newEvent, max_spots: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tw-muted mb-1">Description</label>
                      <textarea rows={4} className="input-field resize-none" placeholder="Event details..."
                        value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-tw-muted cursor-pointer">
                      <input type="checkbox" checked={newEvent.is_active}
                        onChange={e => setNewEvent({...newEvent, is_active: e.target.checked})}
                        className="rounded border-tw-border" />
                      Accepting registrations
                    </label>
                    <div className="flex gap-2">
                      {editingEventId && (
                        <button type="button" onClick={handleCancelEditEvent}
                          className="flex-1 py-2.5 bg-tw-surface-2 hover:bg-tw-surface-3 text-tw-text font-semibold rounded-xl border border-tw-border transition-colors">
                          Cancel
                        </button>
                      )}
                      <button type="submit" disabled={loading}
                        className="flex-1 btn btn-primary py-2.5">
                        {loading ? "Saving..." : (editingEventId ? "Update Event" : "Create Event")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="card p-4 flex justify-between items-center">
                  <span className="font-bold text-tw-text flex items-center gap-2"><Calendar size={18} className="text-tw-warning" /> Events</span>
                  <span className="text-tw-muted text-sm">{eventList.length} total</span>
                </div>

                {viewingRegistrations && (
                  <div className="card p-5">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-tw-text flex items-center gap-2">
                        <Users size={18} className="text-tw-primary" /> Registrations ({registrations.length})
                      </h3>
                      <button onClick={() => setViewingRegistrations(null)} className="btn btn-ghost btn-sm"><X size={16} /> Close</button>
                    </div>
                    {registrations.length === 0 ? (
                      <p className="text-tw-muted text-sm text-center py-6">No registrations yet.</p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {registrations.map((reg) => (
                          <div key={reg.id} className="p-3 rounded-xl bg-tw-surface-2 border border-tw-border text-sm">
                            <div className="font-semibold text-tw-text">{reg.name}</div>
                            <div className="text-tw-muted">{reg.email}{reg.phone ? ` · ${reg.phone}` : ''}</div>
                            {reg.organization && <div className="text-tw-muted text-xs mt-1">{reg.organization}</div>}
                            {reg.notes && <div className="text-tw-muted text-xs mt-1 italic">{reg.notes}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-4">
                  {eventList.map(ev => (
                    <div key={ev.id} className="card p-5 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="font-bold text-tw-text">{ev.title}</h3>
                          {!ev.is_active && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-tw-muted/10 text-tw-muted border border-tw-border">Inactive</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-tw-muted">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(ev.event_date).toLocaleString()}</span>
                          {ev.location && <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>}
                          <span className="flex items-center gap-1"><Users size={12} /> {ev.registration_count}{ev.max_spots ? `/${ev.max_spots}` : ''} registered</span>
                        </div>
                        {ev.description && <p className="text-tw-muted text-sm mt-2 line-clamp-2">{ev.description}</p>}
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button onClick={() => fetchRegistrations(ev.id)}
                          className="btn btn-secondary btn-sm"><Users size={15} /> View</button>
                        <button onClick={() => handleEditEvent(ev)}
                          className="p-2 text-tw-muted hover:text-tw-accent hover:bg-tw-surface-2 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button onClick={() => requestDelete('event', ev.id, ev.title)}
                          className="p-2 text-tw-muted hover:text-tw-danger hover:bg-tw-danger/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                  {eventList.length === 0 && (
                    <div className="card p-10 text-center text-tw-muted">No events yet. Create one to get started.</div>
                  )}
                </div>
              </div>
            </div>
        ) : view === 'components' ? (
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
             <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl font-bold text-tw-text mb-5 sm:mb-6 flex items-center gap-2">
                    {editingId ? <Edit className="text-tw-accent" size={20} /> : <Plus className="text-tw-primary" size={20} />} 
                    {editingId ? "Edit Component" : "Add New Component"}
                </h2>
                
                <form onSubmit={handleAddComponent} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-tw-muted mb-1">Name</label>
                        <input 
                            type="text" 
                            required
                            placeholder="e.g. Servo Motor"
                            className="input-field !py-2.5"
                            value={newComponent.name}
                            onChange={e => setNewComponent({...newComponent, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tw-text-secondary mb-1">Category</label>
                        <div className="flex flex-col gap-2">
                            {!isCustomCategory ? (
                                <select 
                                    className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text focus:border-tw-primary outline-none"
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
                                    <option value="custom" className="font-bold text-tw-primary">+ Create New Category</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        autoFocus
                                        placeholder="Enter new category..."
                                        className="w-full bg-tw-surface-2 border border-tw-primary rounded-lg px-3 py-2 text-tw-text outline-none"
                                        value={customCategory}
                                        onChange={e => setCustomCategory(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCustomCategory(false)}
                                        className="p-2 bg-tw-surface-2 border border-tw-border hover:bg-tw-surface-2 rounded-lg"
                                    >
                                        <X size={18} className="text-tw-muted" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tw-text-secondary mb-1">Image Upload</label>
                        <div className="relative border-2 border-dashed border-tw-border rounded-lg p-4 text-center hover:bg-tw-surface-2/50 transition-colors">
                            <input 
                                type="file" 
                                multiple
                                accept="image/*"
                                onChange={e => setSelectedFiles(Array.from(e.target.files))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-tw-muted text-sm">
                                {selectedFiles.length > 0 ? (
                                    <span className="text-tw-primary">{selectedFiles.length} files selected</span>
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
                                        <img src={url} alt="existing" className="w-full h-full object-cover rounded-lg border border-tw-border" />
                                        <button 
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-tw-text rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tw-text-secondary mb-1">Or Image URL</label>
                        <div className="flex gap-2">
                            <input 
                                type="url" 
                                placeholder="https://..."
                                className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none text-sm"
                                value={newComponent.image_url_input}
                                onChange={e => setNewComponent({...newComponent, image_url_input: e.target.value})}
                            />
                             <button
                                type="button"
                                onClick={handleGenerateDetails}
                                disabled={loading}
                                className="px-3 bg-tw-primary hover:bg-tw-primary-dark !text-white rounded-lg flex items-center"
                                title="Auto-Generate Details"
                            >
                                <Bot size={18} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tw-text-secondary mb-1 flex justify-between">
                            Description 
                            <span className="text-xs text-tw-muted font-normal">Markdown Supported</span>
                        </label>
                        <textarea 
                            rows={10}
                            className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none text-sm font-mono leading-relaxed"
                            value={newComponent.description}
                            onChange={e => setNewComponent({...newComponent, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-tw-text-secondary mb-1 flex justify-between">
                            Wiring Guide
                            <span className="text-xs text-tw-muted font-normal">Markdown / Steps</span>
                        </label>
                        <textarea 
                            rows={6}
                            className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none font-mono text-sm leading-relaxed"
                            value={newComponent.wiring_guide}
                            onChange={e => setNewComponent({...newComponent, wiring_guide: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-2">
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={handleCancelEdit}
                                className="flex-1 py-2 bg-tw-surface-2 hover:bg-tw-surface-2 text-tw-text font-bold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 btn btn-primary"
                        >
                            {loading ? "Saving..." : (editingId ? "Update Component" : "Save Component")}
                        </button>
                    </div>
                </form>
             </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex justify-between items-center bg-tw-surface border border-tw-border p-4 rounded-xl">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tw-muted" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search components..."
                        className="w-full bg-tw-surface-3 border border-tw-border rounded-lg pl-10 pr-4 py-2 text-tw-text outline-none focus:border-tw-primary"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="text-tw-muted text-sm">
                    {filteredComponents.length} Components
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-4">
                {filteredComponents.map(comp => (
                    <div key={comp.id} className="bg-tw-surface border border-tw-border rounded-xl p-4 flex gap-4 hover:border-tw-border transition-colors group">
                        <div className="w-16 h-16 bg-tw-surface-2 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                             {comp.image_url && (Array.isArray(comp.image_url) ? comp.image_url.length > 0 : comp.image_url) ? (
                                 <img 
                                    src={Array.isArray(comp.image_url) ? comp.image_url[0] : comp.image_url} 
                                    alt={comp.name} 
                                    className="w-full h-full object-cover" 
                                 />
                             ) : (
                                 <Cpu size={24} className="text-tw-muted" />
                             )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-tw-text truncate">{comp.name}</h3>
                            <span className="text-xs text-tw-primary bg-tw-primary/10 px-2 py-0.5 rounded border border-tw-primary/20">
                                {comp.category}
                            </span>
                            <p className="text-xs text-tw-muted mt-1 line-clamp-1">{comp.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                             <button 
                                onClick={() => handleEdit(comp)}
                                className="p-2 text-tw-muted hover:text-purple-400 hover:bg-purple-900/10 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <Edit size={18} />
                            </button>
                            <button 
                                onClick={() => requestDelete('component', comp.id, comp.name)}
                                className="p-2 text-tw-muted hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
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
        ) : (
            <div className="grid lg:grid-cols-3 gap-8">
                 {/* AI Module Form */}
                 <div className="lg:col-span-1">
                    {/* Course Selector Tabs */}
                    <div className="flex flex-wrap bg-tw-surface-2 p-1 rounded-xl mb-6 border border-tw-border gap-1">
                        <button 
                            type="button"
                            onClick={() => setSelectedAICourseType('kids')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${selectedAICourseType === 'kids' ? 'bg-tw-primary !text-white shadow-lg' : 'text-tw-muted hover:text-tw-text'}`}
                        >
                            AI for Kids
                        </button>
                        <button 
                            type="button"
                            onClick={() => setSelectedAICourseType('python_master')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${selectedAICourseType === 'python_master' ? 'bg-tw-accent !text-white shadow-lg' : 'text-tw-muted hover:text-tw-text'}`}
                        >
                            Python & AI
                        </button>
                        <button 
                            type="button"
                            onClick={() => setSelectedAICourseType('drone_building')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${selectedAICourseType === 'drone_building' ? 'bg-orange-500 !text-white shadow-lg' : 'text-tw-muted hover:text-tw-text'}`}
                        >
                            Drones
                        </button>
                        <button 
                            type="button"
                            onClick={() => setSelectedAICourseType('data_analytics')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${selectedAICourseType === 'data_analytics' ? 'bg-emerald-500 !text-white shadow-lg' : 'text-tw-muted hover:text-tw-text'}`}
                        >
                            Data Analytics
                        </button>
                    </div>

                    <div className="bg-tw-surface border border-tw-border rounded-2xl p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                             {editingAIModuleId ? <Edit className="text-purple-400" /> : <Plus className="text-purple-400" />} 
                             {editingAIModuleId ? "Edit Module" : "Add AI Module"}
                        </h2>
                        <form onSubmit={handleAddAIModule} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-tw-text-secondary mb-1">Module Title</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none"
                                    value={newAIModule.title}
                                    onChange={e => setNewAIModule({...newAIModule, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-tw-text-secondary mb-1">Week / Order</label>
                                <input 
                                    type="number"
                                    required
                                    className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none"
                                    value={newAIModule.week}
                                    onChange={e => setNewAIModule({...newAIModule, week: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-tw-text-secondary mb-1">Short Description</label>
                                <textarea 
                                    rows={3}
                                    className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none"
                                    value={newAIModule.description}
                                    onChange={e => setNewAIModule({...newAIModule, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-tw-text-secondary mb-1 flex justify-between">
                                    Content 
                                    <span className="text-xs text-tw-muted">Markdown</span>
                                </label>
                                <textarea 
                                    rows={10}
                                    className="w-full bg-tw-surface-2 border border-tw-border rounded-lg px-3 py-2 text-tw-text outline-none font-mono text-sm leading-relaxed"
                                    value={newAIModule.content}
                                    onChange={e => setNewAIModule({...newAIModule, content: e.target.value})}
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                {editingAIModuleId && (
                                    <button 
                                        type="button" 
                                        onClick={handleCancelEditAIModule}
                                        className="flex-1 py-2 bg-tw-surface-2 hover:bg-tw-surface-2 text-tw-text font-bold rounded-lg transition-colors"
                                    >   
                                        Cancel
                                    </button>
                                )}
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 btn btn-primary"
                                >
                                    {loading ? "Saving..." : "Save Module"}
                                </button>
                            </div>
                        </form>
                    </div>
                 </div>

                 {/* AI Module List */}
                 <div className="lg:col-span-2 space-y-6">
                    <div className="bg-tw-surface border border-tw-border p-4 rounded-xl flex justify-between items-center">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            {selectedAICourseType === 'kids' ? <Bot className="text-pink-400" /> : 
                             selectedAICourseType === 'drone_building' ? <Plane className="text-orange-400" /> : 
                             selectedAICourseType === 'data_analytics' ? <BarChart className="text-emerald-400" /> : 
                             <Layers className="text-purple-400" />}
                            {selectedAICourseType === 'kids' ? 'AI for Kids Curriculum' : 
                             selectedAICourseType === 'drone_building' ? 'Drone Building Curriculum' : 
                             selectedAICourseType === 'data_analytics' ? 'Data Analytics Curriculum' : 
                             'Python & AI Master Curriculum'}
                        </h2>
                        <div className="text-tw-muted text-sm">{aiModules.length} Modules</div>
                    </div>
                    
                    <div className="grid gap-4">
                        {aiModules.map(mod => (
                            <div key={mod.id} className="bg-tw-surface border border-tw-border rounded-xl p-6 flex gap-4 hover:border-purple-500/30 transition-colors group">
                                <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-400 shrink-0 font-bold text-xl border border-purple-500/20">
                                    {mod.week}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-tw-text text-lg">{mod.title}</h3>
                                    <p className="text-tw-muted text-sm mt-1 mb-2">{mod.description}</p>
                                    <div className="text-xs text-tw-muted font-mono bg-tw-surface-3 p-2 rounded truncate">
                                        {mod.content ? mod.content.substring(0, 100) + '...' : 'No content'}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <button 
                                        onClick={() => handleEditAIModule(mod)}
                                        className="p-2 text-tw-muted hover:text-purple-400 hover:bg-purple-900/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => requestDelete('ai_module', mod.id, mod.title)}
                                        className="p-2 text-tw-muted hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Confirm Delete"
        message={
          confirmDelete?.type === 'event'
            ? `Delete "${confirmDelete.label}" and all its registrations? This cannot be undone.`
            : confirmDelete?.type === 'ai_module'
            ? `Delete the module "${confirmDelete.label}"? This cannot be undone.`
            : `Delete "${confirmDelete?.label}"? This cannot be undone.`
        }
        onConfirm={executeDelete}
        onCancel={() => { setConfirmDelete(null); setActionError(''); }}
        loading={loading}
      />

      {actionError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 rounded-xl bg-tw-danger text-white text-sm shadow-lg">
          {actionError}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
