"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthModal from "./AuthModal";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };
  return (
    <>
      <nav className="w-full fixed top-0 z-50 bg-transparent backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo à gauche */}
            <div className="flex-shrink-0">
              <Logo size={36} />
            </div>
          
          {/* Liens centrés (desktop) */}
          <div className="hidden md:flex items-center justify-center space-x-12 flex-1">
            <Link
              href="/"
              aria-current={isActive("/") ? "page" : undefined}
              className={`${isActive("/") ? "text-[#cd9766]" : "text-white"} hover:text-[#cd9766] focus-visible:text-[#cd9766] active:text-[#cd9766] font-medium transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/about"
              aria-current={isActive("/about") ? "page" : undefined}
              className={`${isActive("/about") ? "text-[#cd9766]" : "text-white"} hover:text-[#cd9766] focus-visible:text-[#cd9766] active:text-[#cd9766] font-medium transition-colors`}
            >
              About Us
            </Link>
            <Link
              href="/apartment"
              aria-current={isActive("/apartment") ? "page" : undefined}
              className={`${isActive("/apartment") ? "text-[#cd9766]" : "text-white"} hover:text-[#cd9766] focus-visible:text-[#cd9766] active:text-[#cd9766] font-medium transition-colors`}
            >
              Apartment
            </Link>
            <Link
              href="/services"
              aria-current={isActive("/services") ? "page" : undefined}
              className={`${isActive("/services") ? "text-[#cd9766]" : "text-white"} hover:text-[#cd9766] focus-visible:text-[#cd9766] active:text-[#cd9766] font-medium transition-colors`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              aria-current={isActive("/contact") ? "page" : undefined}
              className={`${isActive("/contact") ? "text-[#cd9766]" : "text-white"} hover:text-[#cd9766] focus-visible:text-[#cd9766] active:text-[#cd9766] font-medium transition-colors`}
            >
              Contact
            </Link>
          </div>
          
          {/* Actions droites: mobile menu + login */}
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-sm border border-white/20 text-white w-9 h-9 hover:text-[#cd9766] hover:border-[#cd9766] transition-colors"
              aria-label="Open menu"
              aria-expanded={isMobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {isMobileOpen ? (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
              )}
            </button>

            {/* Login (desktop) */}
            <button
              onClick={() => setModalOpen(true)}
              aria-label="Se connecter"
              className="hidden md:inline-flex group relative items-center gap-2 overflow-hidden rounded-full bg-[#cd9766] px-5 py-2 text-black shadow-lg transition-all duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <span className="absolute inset-0 -translate-x-full bg-white/30 blur-sm transition-transform duration-300 group-hover:translate-x-0" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="5" y="11" width="14" height="10" rx="2" /></svg>
              <span className="font-semibold tracking-wide">Login</span>
            </button>
          </div>
        </div>
      </div>
      </nav>
      {/* Mobile menu panel */}
      <div
        className={`md:hidden fixed top-[64px] left-0 right-0 z-40 transition-transform duration-300 ${isMobileOpen ? 'translate-y-0' : '-translate-y-4 pointer-events-none'} `}
      >
        <div className={`mx-4 rounded-sm border border-white/10 bg-black/80 backdrop-blur-md ${isMobileOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}> 
          <nav className="flex flex-col divide-y divide-white/10">
            <Link href="/" onClick={() => setMobileOpen(false)} className={`px-4 py-3 ${isActive('/') ? 'text-[#cd9766]' : 'text-white'} hover:text-[#cd9766]`}>Home</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className={`px-4 py-3 ${isActive('/about') ? 'text-[#cd9766]' : 'text-white'} hover:text-[#cd9766]`}>About Us</Link>
            <Link href="/apartment" onClick={() => setMobileOpen(false)} className={`px-4 py-3 ${isActive('/apartment') ? 'text-[#cd9766]' : 'text-white'} hover:text-[#cd9766]`}>Apartment</Link>
            <Link href="/services" onClick={() => setMobileOpen(false)} className={`px-4 py-3 ${isActive('/services') ? 'text-[#cd9766]' : 'text-white'} hover:text-[#cd9766]`}>Services</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className={`px-4 py-3 ${isActive('/contact') ? 'text-[#cd9766]' : 'text-white'} hover:text-[#cd9766]`}>Contact</Link>
          </nav>
          <div className="p-3">
            <button
              onClick={() => { setMobileOpen(false); setModalOpen(true); }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#cd9766] px-4 py-2 text-black hover:brightness-110 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path d="M7 11V7a5 5 0 0 1 10 0v4" /><rect x="5" y="11" width="14" height="10" rx="2" /></svg>
              <span className="font-semibold tracking-wide">Login</span>
            </button>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
