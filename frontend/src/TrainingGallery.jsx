import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { trainingImages } from './data/trainingImages';

const TrainingGallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : trainingImages.length - 1));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i < trainingImages.length - 1 ? i + 1 : 0));
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, goPrev, goNext]);

  const current = lightboxIndex !== null ? trainingImages[lightboxIndex] : null;

  return (
    <div className="page-shell relative">
      <div className="bg-mesh" />
      <Navbar />

      <section className="relative z-10 page-section pb-16 sm:pb-24">
        <div className="page-container">
          <div className="text-center mb-10 sm:mb-14">
            <div className="badge mx-auto mb-5">
              <Images size={14} /> Training Gallery
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              See <span className="gradient-text">TechWatt in Action</span>
            </h1>
            <p className="section-subheading mx-auto">
              Photos from our robotics workshops, AI classes, and hands-on learning sessions
              with students and educators.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {trainingImages.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-tw-border bg-tw-surface-2 focus:outline-none focus:ring-2 focus:ring-tw-primary"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-tw-primary/0 group-hover:bg-tw-primary/10 transition-colors" />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-tw-muted mt-8">
            {trainingImages.length} photos · Click any image to view full size
          </p>
        </div>
      </section>

      <Footer />

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-tw-text/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-xl bg-tw-surface text-tw-text hover:bg-tw-surface-2 z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-xl bg-tw-surface/90 text-tw-text hover:bg-tw-surface z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-xl bg-tw-surface/90 text-tw-text hover:bg-tw-surface z-10"
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.src}
              alt={current.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-tw-border shadow-2xl"
            />
            <p className="text-white/90 text-sm mt-3">
              {lightboxIndex + 1} of {trainingImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingGallery;
