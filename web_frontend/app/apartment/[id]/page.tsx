import { apartments } from '@/lib/apartments';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import BookingForm from '@/components/BookingForm';
import VirtualTour from '@/components/VirtualTour';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaBed, FaBath, FaUserFriends, FaCheckCircle, FaHashtag, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

export default function ApartmentPage({ params }: { params: { id: string } }) {
  const apartment = apartments.find((apt) => apt.id === params.id);

  if (!apartment) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-black text-white min-h-screen">
        {/* Hero Header */}
        <section className="relative h-[42vh] min-h-[280px] flex items-end pb-8 md:pb-10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src={apartment.image} alt={apartment.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/55 to-black/85" />
            <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(60%_50% at 50% 100%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)'}} />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wider font-playfair">{apartment.name}</h1>
              <p className="mt-2 text-sm text-white/80">{apartment.location.city}, {apartment.location.country}</p>
            </div>
            <div className="text-sm text-white/80 hidden sm:block">
              <Link href="/" className="hover:text-[#c99362] transition-colors">Home</Link>
              <span className="mx-2 text-white/50">/</span>
              <Link href="/apartment" className="hover:text-[#c99362] transition-colors">Our Apartments</Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white/90">{apartment.name}</span>
            </div>
          </div>
        </section>
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <ImageGallery mainImage={apartment.image} images={apartment.images} />
              
              {/* Details Row */}
              <div className="flex flex-wrap items-center gap-4 text-white/80 my-5 py-3 border-y border-white/10">
                  <div className="flex items-center text-sm"><FaUserFriends className="text-[#c99362] mr-2" size={18} /><span>{apartment.guests} Guests</span></div>
                  <div className="flex items-center text-sm"><FaBed className="text-[#c99362] mr-2" size={18} /><span>{apartment.details.bedrooms} Bedrooms</span></div>
                  <div className="flex items-center text-sm"><FaBath className="text-[#c99362] mr-2" size={18} /><span>{apartment.details.bathrooms} Bathrooms</span></div>
              </div>

              {/* Description Section */}
              <div className="mt-4">
                <div className="mb-2 flex items-end gap-3">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide font-playfair">Description</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#c99362]/70 via-[#c99362]/20 to-transparent" />
                </div>
                <p className="text-white/85 text-[15px] whitespace-pre-line leading-relaxed">{apartment.description}</p>
              </div>

              {/* Amenities Section */}
              <div className="mt-6">
                <div className="mb-2 flex items-end gap-3">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide font-playfair">What this place offers</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#c99362]/70 via-[#c99362]/20 to-transparent" />
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3 text-[12px]">
                  {apartment.amenities.map(amenity => (
                    <li key={amenity} className="flex items-center gap-2 px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white/80 hover:border-[#c99362]/40 transition">
                      <FaCheckCircle className="text-[#c99362]" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location Section */}
              <div className="mt-6">
                <div className="mb-2 flex items-end gap-3">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide font-playfair">Location</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#c99362]/70 via-[#c99362]/20 to-transparent" />
                </div>
                <p className="text-sm text-white/70 mb-2">{apartment.location.city}, {apartment.location.country}</p>
                <div className="overflow-hidden rounded-sm border border-white/10 h-80">
                    <iframe src={apartment.location.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                </div>
              </div>

              {/* Listing Details Section */}
              <div className="mt-6">
                <div className="mb-2 flex items-end gap-3">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide font-playfair">Listing Details</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#c99362]/70 via-[#c99362]/20 to-transparent" />
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-[12px]">
                    <li className="flex items-center px-3 py-2 bg-black/30 border border-white/10 rounded-sm"><FaHashtag className="text-[#c99362] mr-2" /> Property ID: {apartment.details.propertyId}</li>
                    <li className="flex items-center px-3 py-2 bg-black/30 border border-white/10 rounded-sm"><FaBed className="text-[#c99362] mr-2" /> Bedrooms: {apartment.details.bedrooms}</li>
                    <li className="flex items-center px-3 py-2 bg-black/30 border border-white/10 rounded-sm"><FaBath className="text-[#c99362] mr-2" /> Bathrooms: {apartment.details.bathrooms}</li>
                    <li className="flex items-center px-3 py-2 bg-black/30 border border-white/10 rounded-sm"><FaSignInAlt className="text-[#c99362] mr-2" /> Check In: {apartment.details.checkIn}</li>
                    <li className="flex items-center px-3 py-2 bg-black/30 border border-white/10 rounded-sm"><FaSignOutAlt className="text-[#c99362] mr-2" /> Check Out: {apartment.details.checkOut}</li>
                </ul>
              </div>

              {/* Virtual Tour Section */}
              <div className="mt-6">
                <div className="mb-2 flex items-end gap-3">
                  <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide font-playfair">Virtual Tour 360°</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#c99362]/70 via-[#c99362]/20 to-transparent" />
                </div>
                <p className="text-sm text-white/70 mb-3">Explore this apartment with our immersive 360° virtual tour</p>
                <VirtualTour panoramaUrl="https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg" />
              </div>

            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-black/40 border border-white/10 rounded-sm p-4 backdrop-blur-sm">
                <BookingForm price={apartment.price} />
              </div>
            </div>

          </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
