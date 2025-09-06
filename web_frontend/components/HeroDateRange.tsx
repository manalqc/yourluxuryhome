"use client";

import { useMemo, useRef, useState } from "react";

export default function HeroDateRange() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const inRef = useRef<HTMLInputElement | null>(null);
  const outRef = useRef<HTMLInputElement | null>(null);

  const today = useMemo(() => new Date(), []);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const minIn = fmt(today);
  const minOut = checkIn ? checkIn : fmt(new Date(today.getTime() + 86400000));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Check-in */}
      <div className="relative">
        <input
          ref={inRef}
          type="date"
          value={checkIn}
          onChange={(e) => {
            const v = e.target.value;
            setCheckIn(v);
            if (checkOut && v && checkOut <= v) {
              const next = new Date(v);
              next.setDate(next.getDate() + 1);
              setCheckOut(fmt(next));
            }
          }}
          min={minIn}
          className={`bg-black/80 border border-[#c99362] text-white/90 text-sm focus:ring-2 focus:ring-[#c99362] focus:border-[#c99362] block w-full p-3 pr-10 transition-all duration-200 ${!checkIn ? 'text-transparent caret-transparent date-empty' : 'text-white'}`}
        />
        {!checkIn && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">Check-in</span>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); const i = inRef.current as any; if (i && typeof i.showPicker === 'function') i.showPicker(); else inRef.current?.focus(); }}
          aria-label="Open check-in calendar"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#c99362] hover:text-white/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM6 7h12V6H6v1z"/></svg>
        </button>
      </div>

      {/* Check-out */}
      <div className="relative">
        <input
          ref={outRef}
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          min={minOut}
          className={`bg-black/80 border border-[#c99362] text-white/90 text-sm focus:ring-2 focus:ring-[#c99362] focus:border-[#c99362] block w-full p-3 pr-10 transition-all duration-200 ${!checkOut ? 'text-transparent caret-transparent date-empty' : 'text-white'}`}
        />
        {!checkOut && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">Check-out</span>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); const i = outRef.current as any; if (i && typeof i.showPicker === 'function') i.showPicker(); else outRef.current?.focus(); }}
          aria-label="Open check-out calendar"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#c99362] hover:text-white/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1zm12 7H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9zM6 7h12V6H6v1z"/></svg>
        </button>
      </div>

      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; }
        input[type="date"].date-empty::-webkit-datetime-edit { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-text { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-month-field { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-day-field { color: transparent; }
        input[type="date"].date-empty::-webkit-datetime-edit-year-field { color: transparent; }
        input[type="date"] { -webkit-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}
