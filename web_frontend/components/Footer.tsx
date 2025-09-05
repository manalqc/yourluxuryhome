import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-white py-12 md:py-14 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* top */}
        <div className="grid gap-10 md:gap-8 md:grid-cols-3 items-start">
          {/* Brand + location */}
          <div>
            <div className="flex items-center gap-2">
              <Logo size={40} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
              <svg className="w-4 h-4 text-[#c99362]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M12 2C8.7 2 6 4.7 6 8c0 4.2 6 12 6 12s6-7.8 6-12c0-3.3-2.7-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z"/>
              </svg>
              <span>Tangier, Morocco</span>
            </div>
          </div>

          {/* Links */}
          <nav className="grid grid-cols-2 gap-2 text-sm md:text-[13px]">
            <Link href="/" className="text-white/80 hover:text-[#c99362] transition-colors">Home</Link>
            <Link href="/about" className="text-white/80 hover:text-[#c99362] transition-colors">About Us</Link>
            <Link href="/apartment" className="text-white/80 hover:text-[#c99362] transition-colors">Apartment</Link>
            <Link href="/services" className="text-white/80 hover:text-[#c99362] transition-colors">Services</Link>
            <Link href="/contact" className="text-white/80 hover:text-[#c99362] transition-colors">Contact</Link>
          </nav>

          {/* Newsletter + Social */}
          <div className="md:justify-self-end w-full md:w-80">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Subscribe Newsletter</p>
            <form className="mt-3 flex rounded-sm overflow-hidden ring-1 ring-white/20 focus-within:ring-[#c99362]/60">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-transparent px-3 py-2 text-sm placeholder:text-white/40 outline-none"
              />
              <button type="button" className="bg-[#c99362] text-black px-4 text-sm hover:bg-[#b58252] transition-colors">Subscribe</button>
            </form>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-xs text-white/60">Follow us</span>
              <a
                href="https://www.instagram.com/yourluxuryhometanger/"
                aria-label="Instagram"
                className="text-white/70 hover:text-[#c99362]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 8zm6.5-2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
              </a>
              <a
                href="https://www.snapchat.com/add/yourluxuryhome"
                aria-label="Snapchat"
                className="text-white/70 hover:text-[#c99362]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2c2.9 0 5 2.2 5 5.1 0 1.1-.1 1.9.5 2.9.3.5.8.9 1.3 1.2.4.2.7.6.7 1 0 .6-.6 1-1.2 1.2-.5.2-1 .3-1 .7 0 .6.8.9 1.4 1.1.4.1.8.3.8.7 0 .6-.9 1-1.6 1.1-.7.1-1.2.4-1.6.8-.8.8-1.8 1.8-4.3 1.8s-3.5-1-4.3-1.8c-.4-.4-.9-.7-1.6-.8-.7-.1-1.6-.5-1.6-1.1 0-.4.4-.6.8-.7.6-.2 1.4-.5 1.4-1.1 0-.4-.5-.5-1-.7-.6-.2-1.2-.6-1.2-1.2 0-.4.3-.8.7-1 .5-.3 1-.7 1.3-1.2.6-1 .5-1.8.5-2.9C7 4.2 9.1 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#c99362]">Privacy Policy</a>
            <span className="opacity-30">|</span>
            <a href="#" className="hover:text-[#c99362]">Terms & Conditions</a>
          </div>
          <p>© {new Date().getFullYear()} Your Luxury Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
