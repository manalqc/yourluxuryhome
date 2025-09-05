"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "A breathtaking stay. The attention to detail and the concierge service made our trip unforgettable.",
    name: "Priscilla Williamson",
    role: "MNC Company",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "Elegant interiors and a panoramic view of Tangier. Perfect Wi‑Fi and a flawless airport transfer.",
    name: "Thomas Becker",
    role: "Travel Editor",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "Our private chef experience was outstanding. Subtle luxury everywhere — we will be back!",
    name: "Sofia Martins",
    role: "Fashion Consultant",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "Housekeeping and spa were impeccable. A sanctuary in the city with genuine five‑star service.",
    name: "Karim El Amrani",
    role: "Entrepreneur",
    avatar:
      "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?q=80&w=200&auto=format&fit=crop",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-24 text-white overflow-hidden"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://yourluxuryhometanger.com/wp-content/uploads/2025/01/2-Panorama-5B-RentTangier-1140x760.jpg"
          alt="Architectural luxury background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/60" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left intro */}
          <div className="max-w-md">
            <p className="text-white font-light tracking-[0.2em] text-[10px] uppercase mb-2">
              Reviews
            </p>
            <h2 className="text-4xl font-playfair font-light tracking-wider">What people say about our company?</h2>
            <div className="w-12 h-0.5 bg-[#c99362] mt-4" />
            <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
              Genuine words from our distinguished guests. Crafted experiences,
              curated comfort.
            </p>
          </div>

          {/* Slider */}
          <div className="relative">
            {/* quote mark */}
            <div className="absolute -top-4 -left-2 text-[#c99362] opacity-90">
              <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
                <path d="M7 7h4v10H5V9a2 2 0 012-2zm10 0h4v10h-6V9a2 2 0 012-2z" />
              </svg>
            </div>

            <div className="relative bg-black/40 border border-white/10 p-6 md:p-8 backdrop-blur-sm shadow-[0_10px_35px_-10px_rgba(201,147,98,0.25)]">
              {testimonials.map((t, i) => (
                <article
                  key={i}
                  className={`transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0 absolute inset-0"
                  }`}
                >
                  <p className="text-sm md:text-base text-white/85 leading-relaxed">{t.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#c99362]/50">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{t.name}</p>
                      <p className="text-xs text-white/60">{t.role}</p>
                    </div>
                  </div>
                </article>
              ))}

              {/* Dots */}
              <div className="mt-6 flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-1.5 w-6 transition-all ${
                      i === index ? "bg-[#c99362]" : "bg-white/20 hover:bg-white/40"
                    }`}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* thin gold separators top/bottom to match style */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
    </section>
  );
}
