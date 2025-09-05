"use client";

import React, { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  start?: number;
  durationMs?: number;
};

const useCountUp = (end: number, options?: { start?: number; durationMs?: number; when?: boolean }) => {
  const { start = 0, durationMs = 1500, when = true } = options || {};
  const [value, setValue] = useState(start);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!when) return;
    const step = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - (startTimeRef.current ?? 0);
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setValue(current);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [end, start, durationMs, when]);

  return value;
};

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats: Stat[] = [
    { label: "Active Listings", value: 30, suffix: "+" },
    { label: "Reviews", value: 100, suffix: "+" },
    { label: "Established In", value: 2018, start: 2000 },
  ];

  return (
    <section
      ref={ref}
      className="relative isolate"
      aria-label="company statistics"
    >
      {/* Subtle gold gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-[#0b0b0b] to-black" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 bg-black/60 backdrop-blur-md border border-gold-600/30 shadow-[0_10px_40px_-10px_rgba(201,147,98,0.25)]">
          {stats.map((s, i) => {
            const value = useCountUp(s.value, {
              start: s.start ?? 0,
              durationMs: 1600 + i * 200,
              when: visible,
            });
            return (
              <div
                key={s.label}
                className="p-5 md:p-6 text-center text-white relative"
              >
                <div className="text-3xl md:text-4xl font-light font-playfair tracking-wide">
                  <span className="text-gold-500 drop-shadow-sm">{value}</span>
                  {s.suffix && (
                    <span className="text-gold-600 align-top text-xl md:text-2xl ml-1">{s.suffix}</span>
                  )}
                </div>
                <div className="mt-1 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/70">
                  {s.label}
                </div>
                {/* small gold accent under each item */}
                <div className="mt-3 mx-auto h-0.5 w-8 bg-gold-500/70" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
