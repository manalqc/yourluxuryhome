import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { apartments } from "@/lib/apartments";
import AnimatedNumber from "@/components/AnimatedNumber";
import HomesSection from "../../components/HomesSection";

export default function ApartmentPage() {
  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] flex items-end pb-10 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://yourluxuryhometanger.com/wp-content/uploads/2025/08/P1093682.jpg"
              alt="Luxury Apartment View"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/85"></div>
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(1200px_600px_at_50%_120%,_rgba(0,0,0,0.9),_transparent_60%)]"></div>
            <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px] [background-position:0_0,0_0]"></div>
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-4xl md:text-5xl font-light text-white tracking-wider font-playfair">OUR APARTMENTS</h1>
            <div className="text-sm text-white/80">
              <Link href="/" className="hover:text-[#c99362] transition-colors">Home</Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white">Our Apartments</span>
            </div>
          </div>
        </section>

        <HomesSection
          headerOverride={
            <div className="relative p-4 md:p-5 bg-black/30 backdrop-blur-sm border border-white/10 rounded-sm">
              {/* decorative corner accents */}
              <div className="pointer-events-none absolute top-0 left-0">
                <div className="h-px w-8 bg-[#c99362]"></div>
                <div className="h-8 w-px bg-[#c99362]"></div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#c99362] shadow-[0_0_14px_rgba(201,147,98,0.75)]"></span>
                  <p className="text-[#c99362] uppercase tracking-[0.3em] text-xs md:text-sm lg:text-base">
                    <span className="tabular-nums">
                      <AnimatedNumber end={apartments.length} />
                    </span>
                    &nbsp;properties found
                  </p>
                </div>
                <div className="ml-4 flex-1 hidden sm:block">
                  <div className="h-px w-full bg-gradient-to-r from-[#c99362]/70 via-[#c99362]/20 to-transparent"></div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-[11px] md:text-xs text-white/65">
                <span className="italic">Handpicked by yourluxuryhome</span>
                <span className="inline-block h-px w-8 bg-[#c99362]/60"></span>
                <span className="hidden sm:inline">Premium stays in Tangier</span>
              </div>
            </div>
          }
          staticCount={12}
          disableAutoRotate
          cardVariant="elegant"
        />

      </main>
      <Footer />
    </div>
  );
}
