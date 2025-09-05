import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";
import ServiceCard from "../../components/ServiceCard";

const services = [
  { title: "Private Chef", imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800", description: "Seasonal menus cooked in-house by a dedicated chef for intimate dining." },
  { title: "Luxury Spa", imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800", description: "In-villa treatments and wellness rituals for deep relaxation." },
  { title: "Chauffeur", imageUrl: "https://images.unsplash.com/photo-1533129035139-d559c1e4a553?w=800", description: "Discreet, punctual drivers with premium vehicles." },
  { title: "Child Care", imageUrl: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800", description: "Certified nannies ensuring comfort and safety for your little ones." },
  { title: "Yacht Charter", imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2f92c3?w=800", description: "Private cruises along the coast with bespoke itineraries." },
  { title: "Private Jet", imageUrl: "https://images.unsplash.com/photo-1627534910320-9472e7d55b00?w=800", description: "Seamless air travel arranged to your schedule and standards." },
  { title: "Personal Shopper", imageUrl: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=800", description: "Curated fashion and lifestyle selections tailored to you." },
  { title: "Event Planning", imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd51622?w=800", description: "From private dinners to celebrations—elegantly orchestrated." },
  { title: "Security Services", imageUrl: "https://images.unsplash.com/photo-1562887189-e5d83913757a?w=800", description: "Professional protection with absolute discretion." },
  { title: "Exclusive Tours", imageUrl: "https://images.unsplash.com/photo-1527633244603-a3c33af51742?w=800", description: "Insider access to the city’s landmarks, culture, and hidden gems." },
  { title: "Golf Tee Times", imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800", description: "Priority bookings at premier courses and clubs." },
  { title: "Restaurant Reservations", imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", description: "Sought-after tables at top culinary addresses—secured for you." },
  { title: "Butler Service", imageUrl: "https://images.unsplash.com/photo-1596724332398-92739530b341?w=800", description: "Flawless day-to-day assistance, always a step ahead." },
  { title: "Fitness Trainer", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800", description: "Personal sessions tailored to your goals and routine." },
  { title: "Sommelier", imageUrl: "https://images.unsplash.com/photo-1557690267-fad34a2334a7?w=800", description: "Private tastings and cellar curation by experts." },
  { title: "Art Curation", imageUrl: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800", description: "Gallery visits and acquisitions with specialist guidance." },
  { title: "Helicopter Transfer", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800", description: "Rapid transfers and scenic flights with certified pilots." },
  { title: "Housekeeping", imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800", description: "Impeccable daily care for a spotless, serene home." },
];

export default function ServicesPage() {
  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] flex items-end pb-10 md:pb-14 overflow-hidden">
          <Image
            src="https://yourluxuryhometanger.com/wp-content/uploads/2025/08/P1093682.jpg"
            alt="Our Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/85" />
          <div className="relative z-10 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-light text-white tracking-wider font-playfair">OUR SERVICES</h1>
                </div>
                <div className="text-sm text-white/80 hidden sm:block">
                  <Link href="/" className="hover:text-[#c99362] transition-colors">Home</Link>
                  <span className="mx-2 text-white/50">/</span>
                  <span>Our Services</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <div className="bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-4 py-8 md:py-12">
            <div className="mb-10 md:mb-14">
              {/* Small label with leading line (left-aligned) */}
              <div className="flex items-center gap-3 mb-2">
                <span className="hidden sm:block h-px w-24 bg-white/30" />
                <span className="inline-flex items-center text-[10px] uppercase tracking-[0.22em] text-[#c99362]">
                  BESPOKE SERVICES
                </span>
              </div>

              {/* Main heading (left) */}
              <h2 className="text-3xl md:text-4xl font-playfair font-light text-white tracking-wider">
                Signature Services
              </h2>

              {/* Subtitle (left) */}
              <p className="mt-3 text-[13px] md:text-sm text-white/80 leading-relaxed max-w-2xl">
                Meticulously curated amenities and concierge care for an effortless, unforgettable stay.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
