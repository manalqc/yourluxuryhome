'use client';
import { useMemo, useRef, useState } from 'react';

export default function BookingForm({ price }: { price: number }) {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const checkInRef = useRef<HTMLInputElement | null>(null);
  const checkOutRef = useRef<HTMLInputElement | null>(null);

  const today = useMemo(() => new Date(), []);
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);
  const minCheckIn = formatDate(today);
  const minCheckOut = checkIn ? checkIn : formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000));

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-6 text-white sticky top-36 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#c99362]">Book your stay</h2>
      <form>
        {/* Check-in / Check-out */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="relative">
            <input
              type="date"
              ref={checkInRef}
              value={checkIn}
              onChange={(e) => {
                const v = e.target.value;
                setCheckIn(v);
                if (checkOut && v && checkOut <= v) {
                  // auto-adjust checkout to at least next day
                  const next = new Date(v);
                  next.setDate(next.getDate() + 1);
                  setCheckOut(formatDate(next));
                }
              }}
              min={minCheckIn}
              className={`w-full p-3 pr-10 bg-transparent border border-white/20 rounded-md focus:outline-none focus:border-[#c99362] ${!checkIn ? 'text-transparent caret-transparent date-empty' : 'text-white'}`}
            />
            {!checkIn && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                Check-in
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const i = checkInRef.current as any;
                if (i && typeof i.showPicker === 'function') i.showPicker();
                else checkInRef.current?.focus();
              }}
              aria-label="Open check-in calendar"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#c99362] hover:text-[#b58252]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM6 7h12V6H6v1z"/>
              </svg>
            </button>
          </div>
          <div className="relative">
            <input
              type="date"
              ref={checkOutRef}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={minCheckOut}
              className={`w-full p-3 pr-10 bg-transparent border border-white/20 rounded-md focus:outline-none focus:border-[#c99362] ${!checkOut ? 'text-transparent caret-transparent date-empty' : 'text-white'}`}
            />
            {!checkOut && (
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                Check-out
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const i = checkOutRef.current as any;
                if (i && typeof i.showPicker === 'function') i.showPicker();
                else checkOutRef.current?.focus();
              }}
              aria-label="Open check-out calendar"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#c99362] hover:text-[#b58252]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM6 7h12V6H6v1z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Guests selector */}
        <div className="relative mb-3">
          {/* Gold person icon */}
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#c99362]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <circle cx="12" cy="12" r="8" stroke="#c99362" strokeWidth="1" opacity="0.35" />
              <path d="M9.5 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm6 0a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" fill="#c99362"/>
              <path d="M5.5 17.2c.6-2.3 2.9-3.7 5-3.7s4.4 1.4 5 3.7c.1.4-.2.8-.6.8H6.1c-.4 0-.7-.4-.6-.8Z" fill="#c99362"/>
            </svg>
          </span>
          <input
            type="text"
            value={`${guests} ${guests > 1 ? 'Guests' : 'Guest'}`}
            readOnly
            className="w-full p-3 pl-10 pr-24 bg-transparent border border-white/20 rounded-md focus:outline-none focus:border-[#c99362]"
          />
          {/* Stepper controls */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease guests"
              onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-8 h-8 grid place-items-center border border-white/20 text-white rounded-sm hover:border-[#c99362]/60 hover:text-[#c99362] transition-colors"
            >
              −
            </button>
            <button
              type="button"
              aria-label="Increase guests"
              onClick={() => setGuests((g) => Math.min(12, g + 1))}
              className="w-8 h-8 grid place-items-center border border-white/20 text-white rounded-sm hover:border-[#c99362]/60 hover:text-[#c99362] transition-colors"
            >
              +
            </button>
          </div>
          {/* Hidden form value */}
          <input type="hidden" name="guests" value={guests} />
        </div>
        {/* Add-on services */}
        <div className="mb-4">
          <p className="text-sm text-white/80 mb-2">Add-on services <span className="text-white/50">(optional)</span></p>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <label className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm px-2 py-2 hover:border-[#c99362]/50 transition-colors">
              <input type="checkbox" className="accent-[#c99362]" />
              <span>Private Chef</span>
            </label>
            <label className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm px-2 py-2 hover:border-[#c99362]/50 transition-colors">
              <input type="checkbox" className="accent-[#c99362]" />
              <span>Chauffeur</span>
            </label>
            <label className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm px-2 py-2 hover:border-[#c99362]/50 transition-colors">
              <input type="checkbox" className="accent-[#c99362]" />
              <span>Spa</span>
            </label>
            <label className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm px-2 py-2 hover:border-[#c99362]/50 transition-colors">
              <input type="checkbox" className="accent-[#c99362]" />
              <span>Butler</span>
            </label>
            <label className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm px-2 py-2 hover:border-[#c99362]/50 transition-colors">
              <input type="checkbox" className="accent-[#c99362]" />
              <span>Child Care</span>
            </label>
            <label className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-sm px-2 py-2 hover:border-[#c99362]/50 transition-colors">
              <input type="checkbox" className="accent-[#c99362]" />
              <span>Airport Transfer</span>
            </label>
          </div>
        </div>
        <button className="w-full bg-[#c99362] text-black font-bold py-3 rounded-md hover:bg-opacity-90 transition-all duration-300">Book Now for ${price}</button>
      </form>
      {/* Hide native calendar icon and jj/mm/aa ghost while empty */}
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; }
        /* When empty, hide internal date fields completely */
        input[type="date"].date-empty::-webkit-datetime-edit { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-text { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-month-field { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-day-field { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-year-field { color: transparent; }
        /* Remove spin buttons in some browsers */
        input[type="date"] { -webkit-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}
