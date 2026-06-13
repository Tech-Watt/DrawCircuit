import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Users, X, CheckCircle, Loader2, Clock } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', organization: '', notes: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      const now = new Date();
      const upcoming = res.data
        .filter((e) => new Date(e.event_date) >= now)
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      setEvents(upcoming);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openRegister = (event) => {
    setSelectedEvent(event);
    setSuccess(false);
    setError('');
    setForm({ name: '', email: '', phone: '', organization: '', notes: '' });
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_URL}/api/events/${selectedEvent.id}/register`, form);
      setSuccess(true);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFull = (event) =>
    event.max_spots != null && event.spots_remaining != null && event.spots_remaining <= 0;

  return (
    <div className="page-shell relative">
      <div className="bg-mesh" />
      <Navbar />

      <section className="relative z-10 page-section pb-16 sm:pb-24">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <div className="badge mx-auto mb-5">
              <Calendar size={14} /> Upcoming Events
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Register for <span className="gradient-text">TechWatt Events</span>
            </h1>
            <p className="section-subheading mx-auto">
              Join our workshops, robotics camps, and AI learning sessions. Reserve your spot below.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-tw-primary" size={36} />
            </div>
          ) : events.length === 0 ? (
            <div className="card-elevated p-10 sm:p-16 text-center max-w-lg mx-auto">
              <Calendar size={48} className="mx-auto text-tw-muted mb-5 opacity-50" />
              <h2 className="text-xl font-bold text-tw-text mb-2">No Upcoming Events</h2>
              <p className="text-tw-muted">
                Check back soon for new workshops and learning sessions. Follow us at{' '}
                <a href="https://www.techwatt.ai" target="_blank" rel="noopener noreferrer" className="text-tw-primary hover:underline">
                  techwatt.ai
                </a>
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => {
                const full = isFull(event);
                return (
                  <div key={event.id} className="card p-6 flex flex-col h-full hover:-translate-y-0.5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h2 className="text-lg font-bold text-tw-text leading-snug min-w-0">{event.title}</h2>
                      {full && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-tw-danger/10 text-tw-danger border border-tw-danger/20 shrink-0">
                          Full
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-tw-muted text-sm leading-relaxed mb-5 flex-grow line-clamp-4">
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-2.5 mb-6 text-sm">
                      <div className="flex items-center gap-2.5 text-tw-muted">
                        <Calendar size={15} className="text-tw-primary shrink-0" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-tw-muted">
                        <Clock size={15} className="text-tw-primary shrink-0" />
                        <span>{formatTime(event.event_date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2.5 text-tw-muted">
                          <MapPin size={15} className="text-tw-primary shrink-0" />
                          <span className="min-w-0 break-words">{event.location}</span>
                        </div>
                      )}
                      {event.max_spots != null && (
                        <div className="flex items-center gap-2.5 text-tw-muted">
                          <Users size={15} className="text-tw-primary shrink-0" />
                          <span>
                            {event.spots_remaining ?? event.max_spots} of {event.max_spots} spots left
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => openRegister(event)}
                      disabled={full}
                      className={`btn w-full mt-auto ${full ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                    >
                      {full ? 'Event Full' : 'Register Now'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-tw-text/50 backdrop-blur-sm" onClick={closeModal}>
          <div
            className="card-elevated w-full sm:max-w-md p-6 sm:p-8 relative max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-tw-surface-2 text-tw-muted transition-colors"
            >
              <X size={20} />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-tw-success/10 border border-tw-success/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-tw-success" />
                </div>
                <h3 className="text-xl font-bold text-tw-text mb-2">You're Registered!</h3>
                <p className="text-tw-muted text-sm mb-6">
                  We've received your registration for <strong className="text-tw-text">{selectedEvent.title}</strong>.
                  A confirmation will be sent to your email.
                </p>
                <button onClick={closeModal} className="btn btn-primary w-full">Done</button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-tw-text mb-1 pr-8">Register for Event</h3>
                <p className="text-tw-primary text-sm font-medium mb-6">{selectedEvent.title}</p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-tw-danger/10 border border-tw-danger/20 text-tw-danger text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-tw-muted mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tw-muted mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tw-muted mb-1.5">Phone *</label>
                    <input
                      type="tel"
                      required
                      className="input-field"
                      placeholder="Your phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tw-muted mb-1.5">School / Organization</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Optional"
                      value={form.organization}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-tw-muted mb-1.5">Notes</label>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Any questions or special requirements?"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn btn-primary w-full py-3">
                    {submitting ? <><Loader2 className="animate-spin" size={18} /> Submitting...</> : 'Confirm Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
