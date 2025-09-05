import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import Link from "next/link";

const ContactInfo = () => {
  const info = [
    {
      icon: <svg className="w-8 h-8 text-[#c99362]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
      title: "Phone",
      details: ["+212 751 885 247"],
    },
    {
      icon: <svg className="w-8 h-8 text-[#c99362]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: "Address",
      details: ["Centre d’Affaire, Immeuble Iris Bloc A2, Avenue Mohammed VI, Etage 1 Bureau 322, Tangier 90000"],
    },
    {
      icon: <svg className="w-8 h-8 text-[#c99362]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      title: "Email",
      details: ["yourluxuryhometanger@gmail.com"],
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 md:gap-5 text-center">
      {info.map((item, index) => (
        <div key={index} className="relative flex flex-col items-center p-6 bg-black/40 border border-white/10 rounded-sm">
          {item.icon}
          <h3 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#c99362]">{item.title}</h3>
          <div className="mt-2 text-sm text-white/70">
            {item.details.map((line, i) => <p key={i}>{line}</p>)}
          </div>
          {index < info.length - 1 && (
            <div className="hidden md:block absolute top-1/2 -right-3 w-px h-20 bg-white/10 transform -translate-y-1/2" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function ContactPage() {
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
            <h1 className="text-4xl md:text-5xl font-light text-white tracking-wider font-playfair">CONTACT US</h1>
            <div className="text-sm text-white/80">
              <Link href="/" className="hover:text-[#c99362] transition-colors">Home</Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white">Contact Us</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="bg-black">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
            {/* Get in touch */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-playfair italic text-[#c99362]">Get in touch with us !</h2>
            </div>

            {/* Contact Info */}
            <div className="mb-16">
              <ContactInfo />
            </div>

            {/* Quick Actions + Business Hours */}
            <div className="mb-16 grid md:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="p-6 bg-black/40 border border-white/10">
                <h3 className="text-lg font-semibold tracking-wide text-white flex items-center gap-2">
                  <span className="inline-block h-px w-8 bg-[#c99362]"></span>
                  Quick actions
                </h3>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link href="tel:+212751885247" aria-label="Call +212 751 885 247" className="group flex items-center justify-center px-4 py-3 border border-white/15 bg-black/30 hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#c99362]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1v3.61a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.61a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.24 1.01l-2.32 2.22z"/></svg>
                    <span className="sr-only">Call +212 751 885 247</span>
                  </Link>
                  <Link href="mailto:yourluxuryhometanger@gmail.com" aria-label="Email yourluxuryhometanger@gmail.com" className="group flex items-center justify-center px-4 py-3 border border-white/15 bg-black/30 hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#c99362]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h16a2 2 0 012 2v.4l-10 5.6L2 8.4V8a2 2 0 012-2zm18 4.2V16a2 2 0 01-2 2H4a2 2 0 01-2-2v-5.8l10 5.6 10-5.6z"/></svg>
                    <span className="sr-only">Email yourluxuryhometanger@gmail.com</span>
                  </Link>
                  <Link href="https://wa.me/212751885247?text=Bonjour%2C%20je%20souhaite%20plus%20d%E2%80%99informations%20sur%20vos%20services.%20Merci." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +212 751 885 247" className="group flex items-center justify-center px-4 py-3 border border-white/15 bg-black/30 hover:bg-white/10 transition-colors">
                    <svg className="w-5 h-5 text-[#c99362]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.08 1.52 5.8L0 24l6.35-1.66A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.28-6.24-3.48-8.52zM12 21.82a9.8 9.8 0 01-4.99-1.36l-.36-.21-3.77.99 1.01-3.68-.24-.38A9.8 9.8 0 012.18 12C2.18 6.6 6.6 2.18 12 2.18S21.82 6.6 21.82 12 17.4 21.82 12 21.82zm5.32-7.35c-.29-.15-1.72-.85-1.98-.94-.27-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.21-.63.06-.29-.15-1.24-.46-2.37-1.46-.88-.77-1.47-1.72-1.64-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.19.06-.36-.03-.51-.1-.15-.65-1.56-.9-2.13-.24-.58-.48-.5-.65-.5h-.56c-.19 0-.5.07-.77.36-.26.29-1 1-1 2.43 0 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 4.93 4.35.69.3 1.22.48 1.64.62.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.96-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z"/></svg>
                    <span className="sr-only">WhatsApp +212 751 885 247</span>
                  </Link>
                </div>
              </div>
              {/* Business Hours */}
              <div className="p-6 bg-black/40 border border-white/10">
                <h3 className="text-lg font-semibold tracking-wide text-white flex items-center gap-2">
                  <span className="inline-block h-px w-8 bg-[#c99362]"></span>
                  Business hours
                </h3>
                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  <li className="flex justify-between"><span>Monday - Friday</span><span>09:00 - 20:00</span></li>
                  <li className="flex justify-between"><span>Saturday</span><span>10:00 - 18:00</span></li>
                  <li className="flex justify-between"><span>Sunday</span><span>Closed</span></li>
                </ul>
                <p className="mt-4 text-xs text-white/50">All times are local (GMT+1, Tangier).</p>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-sm uppercase tracking-widest text-white/80">IF YOU GOT ANY QUESTIONS</p>
                <p className="text-sm uppercase tracking-widest text-white/80">PLEASE DO NOT HESITATE TO SEND US A MESSAGE.</p>
              </div>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <input aria-label="Your Name" required type="text" placeholder="Your Name" className="md:col-span-1 bg-black/40 border border-white/20 p-3 placeholder:text-white/50 focus:ring-1 focus:ring-[#c99362] outline-none transition" />
                <input aria-label="Your Email" required type="email" placeholder="Your Email" className="md:col-span-1 bg-black/40 border border-white/20 p-3 placeholder:text-white/50 focus:ring-1 focus:ring-[#c99362] outline-none transition" />
                <input aria-label="Subject" type="text" placeholder="Subject" className="md:col-span-2 bg-black/40 border border-white/20 p-3 placeholder:text-white/50 focus:ring-1 focus:ring-[#c99362] outline-none transition" />
                <textarea aria-label="Message" required placeholder="Message" rows={6} className="md:col-span-2 bg-black/40 border border-white/20 p-3 placeholder:text-white/50 focus:ring-1 focus:ring-[#c99362] outline-none transition"></textarea>
                <div className="md:col-span-2 flex justify-center mt-2">
                  <button type="submit" className="bg-[#c99362] text-black font-bold uppercase tracking-widest px-10 py-3 hover:bg-[#b58252] transition-colors">
                    Send Message
                  </button>
                </div>
              </form>
              <p className="mt-3 text-center text-xs text-white/50">By submitting this form, you agree to be contacted by yourluxuryhome.</p>
            </div>

            {/* Socials */}
            <div className="text-center mt-20">
              <h3 className="text-2xl font-playfair italic text-[#c99362] mb-6">Connect with us !</h3>
              <div className="flex justify-center gap-6">
                {/* Instagram */}
                <Link href="https://www.instagram.com/yourluxuryhometanger" target="_blank" rel="noopener noreferrer" className="text-[#c99362] hover:text-white transition" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 8zm6.5-2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                  </svg>
                </Link>
                {/* Snapchat */}
                <Link href="https://www.snapchat.com/add/yourluxuryhome" target="_blank" rel="noopener noreferrer" className="text-[#c99362] hover:text-white transition" aria-label="Snapchat">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2c3.2 0 5.8 2.6 5.8 5.8 0 1.1-.2 2 .4 2.9.4.7 1.1 1.2 2 1.5.3.1.5.4.5.7 0 .4-.3.7-.7.8-.6.1-1.3.2-1.6.6-.2.3-.2.6-.1.9.2.5.8.8 1.2 1 .3.1.5.4.5.7 0 .5-.5.8-1 .9-.8.1-1.7.3-2.2.9-.6.6-.9 1.5-2.1 1.5-.6 0-1.1-.2-1.6-.4-.4-.2-.8-.3-1.3-.3s-.9.1-1.3.3c-.5.2-1 .4-1.6.4-1.2 0-1.5-.9-2.1-1.5-.5-.6-1.4-.8-2.2-.9-.5-.1-1-.4-1-.9 0-.3.2-.6.5-.7.4-.2 1-.5 1.2-1 .1-.3.1-.6-.1-.9-.3-.4-1-.5-1.6-.6-.4-.1-.7-.4-.7-.8 0-.3.2-.6.5-.7.9-.3 1.6-.8 2-1.5.6-.9.4-1.8.4-2.9C6.2 4.6 8.8 2 12 2z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="h-[400px] bg-black relative">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3235.908092252125!2d-5.876802684738628!3d35.7923919801668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b89e1e1a55555%3A0x1a5b5b5b5b5b5b5b!2sMalabata%20Hills!5e0!3m2!1sen!2sma!4v1678886400000!5m2!1sen!2sma"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale invert hue-rotate-[210deg] contrast-90"
            ></iframe>
        </div>
      </main>
      <Footer />
    </div>
  );
}
