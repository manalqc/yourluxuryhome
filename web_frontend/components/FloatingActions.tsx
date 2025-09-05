"use client";

import Link from "next/link";

export default function FloatingActions() {
  return (
    <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[60] flex flex-col items-center gap-3">
      {/* WhatsApp */}
      <Link
        href="https://wa.me/212751885247"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp +212 751 885 247"
        className="group w-12 h-12 md:w-14 md:h-14 grid place-items-center rounded-full bg-[#c99362] text-black shadow-lg shadow-black/30 ring-1 ring-white/10 hover:brightness-110 hover:scale-105 transition-transform"
        title="WhatsApp"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.08 1.52 5.8L0 24l6.35-1.66A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.28-6.24-3.48-8.52zM12 21.82a9.8 9.8 0 01-4.99-1.36l-.36-.21-3.77.99 1.01-3.68-.24-.38A9.8 9.8 0 012.18 12C2.18 6.6 6.6 2.18 12 2.18S21.82 6.6 21.82 12 17.4 21.82 12 21.82zm5.32-7.35c-.29-.15-1.72-.85-1.98-.94-.27-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.21-.63.06-.29-.15-1.24-.46-2.37-1.46-.88-.77-1.47-1.72-1.64-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.19.06-.36-.03-.51-.1-.15-.65-1.56-.9-2.13-.24-.58-.48-.5-.65-.5h-.56c-.19 0-.5.07-.77.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.35.69.3 1.22.48 1.64.62.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.96-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z" />
        </svg>
      </Link>

      {/* Concierge */}
      <Link
        href="/services"
        aria-label="Concierge Services"
        className="group w-12 h-12 md:w-14 md:h-14 grid place-items-center rounded-full bg-black/90 text-white shadow-lg shadow-black/30 ring-1 ring-white/20 hover:text-[#c99362] hover:scale-105 transition-transform"
        title="Concierge"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2a7 7 0 00-7 7v3H4a2 2 0 100 4h16a2 2 0 100-4h-1V9a7 7 0 00-7-7zm0 2a5 5 0 015 5v3H7V9a5 5 0 015-5zM8 19a2 2 0 104 0H8z" />
        </svg>
      </Link>
    </div>
  );
}
