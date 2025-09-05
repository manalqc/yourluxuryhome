import React from "react";

export default function LocationMap() {
  return (
    <section id="location" className="relative py-16 bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-black/60 backdrop-blur-md border border-gold-600/30 shadow-[0_10px_40px_-10px_rgba(201,147,98,0.25)]">
          {/* Text panel */}
          <div className="p-8 lg:p-10">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/60 mb-2">Location & Maps</p>
            <h3 className="text-2xl md:text-3xl font-playfair font-medium mb-4">Find Us in Tangier</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Marina Bay, Avenue Mohammed VI, Tanger, Morocco.
              Nestled in the vibrant seafront, our residences offer easy access to
              the city's finest dining, shopping, and coastal promenades.
            </p>
            <a
              href="https://www.google.com/maps/place/Marina+Bay,Tangier/@35.7833,-5.808,14z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold-600 text-gold-500 px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-[#cd9766] hover:text-black transition-colors"
            >
              View location
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 5l7 7-7 7" />
                <path d="M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Map panel */}
          <div className="relative min-h-[280px] md:min-h-[380px]">
            <iframe
              title="Tangier Map"
              className="absolute inset-0 w-full h-full brightness-95 contrast-90 saturate-[0.2]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1645.632600932968!2d-5.806!3d35.783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTangier%20Marina!5e0!3m2!1sen!2sma!4v1700000000000"
            />
            {/* thin gold borders top/bottom */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
