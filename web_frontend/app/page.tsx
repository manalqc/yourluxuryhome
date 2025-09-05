import Image from "next/image";
import Link from "next/link";
import StatsStrip from "../components/StatsStrip";
import LocationMap from "../components/LocationMap";
import Testimonials from "../components/Testimonials";
import HomesSection from "../components/HomesSection";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroDateRange from "../components/HeroDateRange";


// Composant de la section héro
function Hero() {
  return (
    <section className="relative h-screen">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent"></div>
        <Image
          src="https://yourluxuryhometanger.com/wp-content/uploads/2025/08/P1093682.jpg"
          alt="Luxury Villa in Tangier"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10 h-full flex flex-col justify-center pb-32 pt-60">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-3 mb-10">
                <div className="text-2xl space-x-1" style={{ color: '#c99362' }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="drop-shadow-glow">★</span>
                  ))}
                </div>
                <p className="text-white font-light tracking-[0.3em] text-xs uppercase">EXCLUSIVE LUXURY RETREATS</p>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-10 leading-tight tracking-wider font-playfair text-shadow-lg">
                Experience the Art of<br/><span className="italic">Luxury Living</span> in Tangier
              </h1>
              
              <div className="flex justify-center">
                <Link href="/apartment" className="group relative overflow-hidden bg-transparent border border-[#c99362] text-white hover:text-black px-10 py-3 text-sm font-light tracking-wider uppercase transition-all duration-500 ease-in-out luxury-btn">
                  <span className="relative z-10 flex items-center gap-2">
                    Discover Our Homes
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
              
              {/* Barre de recherche améliorée */}
              <div className="mt-20 p-5 bg-black/70 backdrop-blur-md border border-[#c99362] shadow-2xl transform transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(201,147,98,0.2)] w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-[#c99362]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <select 
                      className="bg-black/80 border border-[#c99362] text-white/90 text-sm focus:ring-2 focus:ring-[#c99362] focus:border-[#c99362] block w-full pl-10 p-3 transition-all duration-200"
                      defaultValue=""
                    >
                      <option value="" disabled className="text-gray-400">Location</option>
                      <option value="Tanger">Tanger</option>
                      <option value="Marina">Marina</option>
                      <option value="Cap Malabata">Cap Malabata</option>
                    </select>
                  </div>
                  {/* Date range (check-in / check-out) */}
                  <div className="md:col-span-2">
                    <HeroDateRange />
                  </div>
                  
                  <button className="bg-gradient-to-r from-[#c99362] to-[#d8a97c] hover:from-[#b58252] hover:to-[#c99362] text-white font-medium py-3 px-6 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#c99362]/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="tracking-wider">Find</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </section>
  );
}

// Composant de la section services
function Services() {
  const services = [
    {
      title: "Beauty & Spa",
      description: "Wellness rituals, massage and premium spa care.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3c3 4 3 7 0 11-3-4-3-7 0-11z" />
          <path d="M7 17c3-1.5 7-1.5 10 0" />
        </svg>
      )
    },
    {
      title: "High Speed Wifi",
      description: "Reliable fiber connection for work and streaming.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 8.5A16 16 0 0 1 22 8.5" />
          <path d="M5 12a11 11 0 0 1 14 0" />
          <path d="M8.5 15.5a6 6 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1.25" fill="currentColor" />
        </svg>
      )
    },
    {
      title: "Private Chef",
      description: "Tailored menus and in‑residence dining experiences.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 10h16" />
          <path d="M6 10V8a6 6 0 0 1 12 0v2" />
          <path d="M8 15v4M16 15v4" />
        </svg>
      )
    },
    {
      title: "Housekeeping",
      description: "Daily cleaning and turndown on request.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 18h18" />
          <path d="M7 18V8l5-3 5 3v10" />
          <path d="M9 18v-3h6v3" />
        </svg>
      )
    },
    {
      title: "Concierge",
      description: "Reservations, local tips, and bespoke experiences.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="7" r="3" />
          <path d="M4 20a8 8 0 0 1 16 0" />
        </svg>
      )
    },
    {
      title: "Airport Transfer",
      description: "Private transfers to and from the airport.",
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 13l9-2 2-7 2 7 7 2-7 2-2 7-2-7-9-2z" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="relative py-12 md:py-16 bg-[#0b0b0b] text-white">
      {/* thin gold separators top/bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-white font-light tracking-[0.2em] text-[10px] uppercase mb-1">FACILITIES & SERVICES</p>
          <h2 className="text-4xl font-playfair font-light text-white tracking-wider">Our Services</h2>
          <div className="w-12 h-0.5 bg-[#c99362] mx-auto" />
          <p className="mt-4 text-gray-300 text-xs tracking-wider max-w-2xl mx-auto">Carefully curated amenities to complement your luxury stay.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-black/60 border border-white/10 hover:border-gold-600/50 transition-all p-6 md:p-7 flex items-start gap-4 hover:-translate-y-0.5 shadow-[0_6px_20px_-10px_rgba(0,0,0,0.6)] hover:shadow-[0_14px_35px_-12px_rgba(201,147,98,0.35)]"
            >
              <div className="shrink-0 p-3 rounded-full bg-black/70 ring-1 ring-inset ring-gold-600/40 text-gold-500">
                {service.icon}
              </div>
              <div>
                <h3 className="text-base md:text-lg font-playfair font-medium text-white tracking-wide">{service.title}</h3>
                <div className="mt-1 h-0.5 w-6 bg-gold-500/70" />
                <p className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed">{service.description}</p>
              </div>
              {/* gold corner accent */}
              <span className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rotate-45 bg-gradient-to-br from-gold-600/0 via-gold-600/20 to-gold-600/0" />
            </div>
          ))}
        </div>
        {/* CTA button under services */}
        <div className="mt-10 text-center">
          <a
            href="/services"
            className="inline-flex items-center gap-2 border border-[#c99362] text-white px-8 py-3 text-xs font-light tracking-[0.25em] uppercase hover:bg-[#c99362] hover:text-black transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// Composant de la section Welcome
function WelcomeSection() {
  return (
    <section className="bg-black py-20 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Gallery */}
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 transform -rotate-6 transition hover:rotate-0 hover:scale-105 duration-300">
              <Image
                src="https://yourluxuryhometanger.com/wp-content/uploads/2025/04/P1079332-1140x760.jpg"
                alt="Luxury Interior 1"
                width={400}
                height={500}
                className="object-cover w-full h-full border-4 border-white/10"
              />
            </div>
            <div className="col-span-2 self-end transform rotate-6 transition hover:rotate-0 hover:scale-105 duration-300">
              <Image
                src="https://yourluxuryhometanger.com/wp-content/uploads/2025/01/3-Panorama-5A-MalabatHillsTangier-scaled.jpg"
                alt="Luxury Interior 2"
                width={300}
                height={400}
                className="object-cover w-full h-full border-4 border-white/10"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-md">
            <p className="text-[#c99362] font-light tracking-widest text-sm uppercase">Welcome to</p>
            <h2 className="text-3xl lg:text-4xl font-playfair font-semibold text-white my-3">Your Luxury Home</h2>
            <p className="text-gray-400 mb-8 leading-relaxed font-light">
              Experience an unparalleled stay where luxury meets comfort. Our properties are meticulously designed to offer you an unforgettable retreat in the heart of Tangier. Discover a world of elegance and sophistication.
            </p>
            <Link href="/about" className="bg-transparent border border-[#c99362] text-[#c99362] py-3 px-8 text-sm uppercase tracking-wider font-medium transition-colors duration-300 hover:bg-[#c99362] hover:text-black">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant principal de la page
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />
        <WelcomeSection />
        {/* Black & Gold animated statistics */}
        <StatsStrip />
        {/* Location & Map section */}
        <LocationMap />
        <HomesSection />
        <Services />
        <Testimonials />
        {/* Ajoutez d'autres sections ici */}
      </main>
      <Footer />
    </div>
  );
}
