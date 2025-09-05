"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apartments } from '@/lib/apartments';

// Composant pour la section "Our Rooms"
type HomesSectionProps = {
  showHeader?: boolean;
  headerOverride?: React.ReactNode;
  staticCount?: number; // if provided, show first N apartments and disable auto-rotate
  disableAutoRotate?: boolean; // optionally disable auto-rotate
  cardVariant?: 'default' | 'elegant'; // visual style of cards
};

const HomesSection = ({ showHeader = true, headerOverride, staticCount, disableAutoRotate, cardVariant = 'default' }: HomesSectionProps) => {
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(apartments.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (disableAutoRotate || staticCount) return; // skip rotation for static mode
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setPage((prevPage) => (prevPage + 1) % totalPages);
        setIsTransitioning(false);
      }, 500); // Match this with transition duration
    }, 3000);

    return () => clearInterval(timer);
  }, [totalPages, disableAutoRotate, staticCount]);

  const startIndex = page * ITEMS_PER_PAGE;
  const displayedApartments = staticCount
    ? apartments.slice(0, staticCount)
    : apartments.slice(startIndex, startIndex + ITEMS_PER_PAGE);


  return (
    <section id="homes" className="relative py-12">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://yourluxuryhometanger.com/wp-content/uploads/2025/04/P1079215-1140x760.jpg"
          alt="Luxury Home Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {headerOverride ? (
          <div className="mb-6">{headerOverride}</div>
        ) : (
          showHeader && (
            <div className="text-center mb-10">
              <div className="mb-3">
                <p className="text-white font-light tracking-[0.2em] text-[10px] uppercase mb-1">OUR LUXURY HOMES</p>
                <h2 className="text-4xl font-playfair font-light text-white tracking-wider">Our Homes</h2>
              </div>
              <div className="w-12 h-0.5 bg-[#c99362] mx-auto"></div>
              <p className="mt-4 text-gray-300 text-xs tracking-wider max-w-2xl mx-auto">Discover our exclusive collection of luxury homes</p>
            </div>
          )
        )}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${disableAutoRotate || staticCount ? '' : 'transition-opacity duration-500'} ${disableAutoRotate || staticCount ? '' : (isTransitioning ? 'opacity-0' : 'opacity-100')}`}>
          {displayedApartments.map((room, index) => (
            <div
              key={index}
              className={
                cardVariant === 'elegant'
                  ? "relative bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden group transition-all duration-300 hover:border-[#c99362]/50 hover:shadow-[0_0_20px_rgba(201,147,98,0.25)]"
                  : "bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:border-[#c99362]/50"
              }
            >
              <div className="relative">
                <Image
                  src={room.image}
                  alt={room.name}
                  width={400}
                  height={250}
                  className={cardVariant === 'elegant' ? "object-cover w-full h-48 group-hover:scale-105 transition-transform duration-500" : "object-cover w-full h-40"}
                />
                {cardVariant === 'elegant' && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <button aria-label="Save" className="absolute top-3 left-3 h-8 w-8 grid place-items-center rounded-full bg-black/40 backdrop-blur border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M11.645 20.91l-.007-.003-.022-.01a15.247 15.247 0 01-.383-.173 25.18 25.18 0 01-4.244-2.717C4.688 16.678 2.25 13.94 2.25 10.5 2.25 7.462 4.714 5 7.75 5c1.38 0 2.67.56 3.596 1.463A5.123 5.123 0 0114.95 5c3.036 0 5.5 2.462 5.5 5.5 0 3.44-2.438 6.178-4.739 7.507a25.174 25.174 0 01-4.244 2.717 15.247 15.247 0 01-.383.173l-.022.01-.007.003-.003.001a.752.752 0 01-.592 0l-.003-.001z" />
                      </svg>
                    </button>
                  </>
                )}
                <div className={cardVariant === 'elegant' ? "absolute top-3 right-3 bg-black/50 backdrop-blur text-white text-[10px] font-semibold px-3 py-1 rounded-full border border-white/10" : "absolute top-4 right-4 bg-[#c99362] text-white text-xs font-bold px-3 py-1 rounded-none"}>
                  {room.availability}
                </div>
              </div>
              <div className={cardVariant === 'elegant' ? "p-4" : "p-3 bg-gradient-to-t from-black/80 to-transparent"}>
                <div className={cardVariant === 'elegant' ? "flex items-center justify-between text-[11px] text-white/70 mb-2" : "flex items-center justify-between text-xs text-gray-400 mb-2"}>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#c99362]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {room.guests} Guests
                    <span className="mx-2 text-white/20">•</span>
                    {room.size} m²
                  </span>
                  <span className={cardVariant === 'elegant' ? "font-semibold text-white text-sm" : "font-bold text-white text-sm"}>{room.price}€<span className="font-normal text-xs">/nuit</span></span>
                </div>
                <h3 className={cardVariant === 'elegant' ? "text-lg font-playfair font-light text-white mb-1 tracking-wide" : "text-base font-playfair font-medium text-white mb-1"}>{room.name}</h3>
                <p className={cardVariant === 'elegant' ? "text-white/80 text-[12px] mb-3 line-clamp-2" : "text-gray-300 text-[11px] mb-3 line-clamp-2"}>{room.description}</p>
                <Link
                  href={`/apartment/${room.id}`}
                  className={cardVariant === 'elegant'
                    ? "block w-full text-center py-2 text-[10px] uppercase tracking-[0.15em] bg-gradient-to-r from-[#c99362]/90 to-[#c99362] text-black hover:from-[#c99362] hover:to-[#e0aa7b] transition-all"
                    : "block w-full text-center bg-transparent border border-[#c99362] text-[#c99362] py-2 text-[10px] uppercase tracking-wider hover:bg-[#c99362] hover:text-black transition-all"}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomesSection;
