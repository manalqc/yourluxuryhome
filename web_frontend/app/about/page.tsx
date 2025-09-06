import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] flex items-end pb-10 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://yourluxuryhometanger.com/wp-content/uploads/2025/08/P1093682.jpg"
              alt="Tangier Cityscape"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/85"></div>
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_120%,_rgba(0,0,0,0.9),_transparent_60%)]"></div>
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px] [background-position:0_0,0_0]"></div>
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-light text-white tracking-wider font-playfair">ABOUT US</h1>
            <div className="text-sm text-white/80">
              <Link href="/" className="hover:text-[#c99362] transition-colors">Home</Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white">About Us</span>
            </div>
          </div>
        </section>

        <div className="bg-black text-white">

          {/* Section: Luxe Intro (above Why Choose Us) */}
          <section className="relative bg-black py-12 md:py-16 overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-20 [background:radial-gradient(800px_400px_at_15%_20%,_rgba(201,147,98,0.25),_transparent_70%)]"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
              <div className="md:max-w-md md:ml-auto">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c99362] font-semibold">About Us</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-bold font-playfair text-white leading-tight">We Always Make The Best</h3>
                <div className="mt-3 h-px w-16 bg-[#c99362]"></div>
                <p className="mt-3 text-sm md:text-base text-gray-400">At yourluxuryhome Tanger, we curate refined rental apartments with elegant finishes, hotel-level comfort, and thoughtful layouts—made for effortless short or extended stays.</p>
                <Link href="/contact" className="mt-5 inline-block border border-white/50 text-white px-6 py-3 text-sm tracking-wider hover:border-[#c99362] hover:text-black hover:bg-[#c99362] transition-colors">Contact Us</Link>
              </div>
              <div className="relative">
                <Image
                  src="https://yourluxuryhometanger.com/wp-content/uploads/2018/10/2-Panorama-2A-YourLuxuryHome-1140x760.jpg"
                  alt="yourluxuryhome apartment interior"
                  width={480}
                  height={320}
                  className="object-cover shadow-2xl border border-zinc-800"
                />
                <div className="absolute -inset-3 -z-10 rounded-sm bg-gradient-to-b from-[#c99362]/20 to-transparent blur-2xl opacity-50"></div>
              </div>
            </div>
          </section>

          {/* Section 2: Why Choose Us */}
          <section className="relative bg-[#111111] py-12 md:py-16 overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:44px_44px] [background-position:0_0,0_0]"></div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
              <div className="md:max-w-md md:ml-auto">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c99362] font-semibold">OUR ADVANTAGES</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-bold font-playfair text-white">Why Choose Us?</h3>
                <div className="mt-3 h-px w-16 bg-[#c99362]"></div>
                <p className="mt-2 text-sm md:text-base text-gray-400 leading-relaxed">We offer more than just a place to stay; we provide a lifestyle of luxury and convenience, ensuring every moment of your visit is memorable.</p>
                <Link href="/services" className="mt-4 inline-block border border-[#c99362] text-[#c99362] px-5 py-2.5 text-sm font-semibold tracking-wider hover:bg-[#c99362] hover:text-black transition-colors">
                  VIEW ALL
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-[#0c0c0c] border border-zinc-800/80 p-5 hover:border-[#c99362] transition-all">
                  <div className="h-1 w-10 bg-[#c99362] mb-3"></div>
                  <h4 className="font-semibold text-white">Prime Location</h4>
                  <p className="text-sm text-gray-400 mt-1.5">Enjoy stunning sea views from the comfort of Malabata Hills.</p>
                </div>
                <div className="bg-[#0c0c0c] border border-zinc-800/80 p-5 hover:border-[#c99362] transition-all">
                  <div className="h-1 w-10 bg-[#c99362] mb-3"></div>
                  <h4 className="font-semibold text-white">Exquisite Design</h4>
                  <p className="text-sm text-gray-400 mt-1.5">Meticulously designed interiors for a truly luxurious feel.</p>
                </div>
                <div className="bg-[#0c0c0c] border border-zinc-800/80 p-5 hover:border-[#c99362] transition-all">
                  <div className="h-1 w-10 bg-[#c99362] mb-3"></div>
                  <h4 className="font-semibold text-white">Unmatched Comfort</h4>
                  <p className="text-sm text-gray-400 mt-1.5">High-end amenities to cater to your every need.</p>
                </div>
                <div className="bg-[#0c0c0c] border border-zinc-800/80 p-5 hover:border-[#c99362] transition-all">
                  <div className="h-1 w-10 bg-[#c99362] mb-3"></div>
                  <h4 className="font-semibold text-white">Personalized Service</h4>
                  <p className="text-sm text-gray-400 mt-1.5">24/7 support to make your stay seamless and enjoyable.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Interior Design (Luxury Rentals) */}
          <section className="relative py-12 md:py-16 overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <Image
                src="https://yourluxuryhometanger.com/wp-content/uploads/2025/03/P1082692-1140x760.jpg"
                alt="Award-winning background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/80"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6 items-center">
              <div className="md:max-w-md md:ml-auto">
                <p className="text-sm uppercase tracking-widest text-[#c99362] font-semibold">AWARD-WINNING</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-bold font-playfair text-white leading-tight">A Masterpiece of Design</h3>
                <div className="mt-3 h-px w-16 bg-[#c99362]"></div>
                <div className="mt-3 inline-flex items-center gap-2 text-[#c99362]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 3H7v4H4v4c0 2.21 1.79 4 4 4h.18A3 3 0 0 0 11 17v2H9v2h6v-2h-2v-2a3 3 0 0 0 2.82-2H16c2.21 0 4-1.79 4-4V7h-3V3zm-2 4V5H9v2H7V5h10v2h-2zm-8 2H6v2c0 1.1.9 2 2 2h1.18A3 3 0 0 1 8 11V9zm12 0v2c0 1.1-.9 2-2 2h-1.18c.12-.32.18-.66.18-1V9h3z"/></svg>
                  <span className="text-xs tracking-[0.2em]">yourluxuryhome Collection Award</span>
                </div>
                <p className="mt-2 text-sm md:text-base text-gray-300">Every apartment at yourluxuryhome is curated for luxury rentals: refined finishes, elegant furnishings, and functional layouts ready for short or extended stays. Experience hotel-level comfort with the warmth of a private home.</p>

                <ul className="mt-3 space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 bg-[#c99362] inline-block"></span>
                    <span>Serviced apartments with housekeeping and fresh linens</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 bg-[#c99362] inline-block"></span>
                    <span>Concierge assistance and flexible check-in/out</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 bg-[#c99362] inline-block"></span>
                    <span>Premium amenities and sea-view locations</span>
                  </li>
                </ul>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href="/apartment" className="inline-block bg-[#c99362] text-black px-5 py-2.5 text-sm font-semibold tracking-wider hover:bg-white transition-colors">VIEW APARTMENTS</Link>
                  <Link href="/contact" className="inline-block border border-[#c99362] text-[#c99362] px-5 py-2.5 text-sm font-semibold tracking-wider hover:bg-[#c99362] hover:text-black transition-colors">BOOK NOW</Link>
                </div>

                <div className="mt-3">
                  <p className="text-xs md:text-sm text-gray-400">Guest Relations — yourluxuryhome Rentals</p>
                </div>
              </div>
              <div className="relative group">
                 <Image
                  src="https://yourluxuryhometanger.com/wp-content/uploads/2025/01/2-Panorama-3B-YourLuxuryHome-1140x760.jpeg"
                  alt="Living room of yourluxuryhome"
                  width={500}
                  height={340}
                  className="object-cover shadow-xl border border-zinc-800 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
                <div className="absolute -bottom-2 -right-2 bg-black p-3 border border-zinc-800 shadow-xl max-w-xs transition-all duration-300 group-hover:shadow-2xl group-hover:border-[#c99362]">
                  <p className="text-sm text-gray-300">“Designed for effortless stays — sophistication, comfort, and privacy.”</p>
                  <p className="text-right font-semibold text-sm mt-2 text-[#c99362]">— yourluxuryhome Collection</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Banner Under Award-Winning */}
          <section className="relative bg-black border-t border-white/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl md:text-2xl font-semibold text-white">Ready to book a yourluxuryhome apartment?</h4>
                  <p className="mt-2 text-sm text-white/60 max-w-2xl">Contact us to check availability and receive a personalized offer for your stay.</p>
                </div>
                <Link href="/contact" className="inline-block border border-white/50 text-white px-6 py-3 text-sm tracking-wider hover:border-[#c99362] hover:text-black hover:bg-[#c99362] transition-colors">BOOK NOW</Link>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </section>
        </div>

      </main>
      <Footer />
    </div>
  );
}
