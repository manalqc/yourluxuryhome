import Image from 'next/image';
import {
  FaUtensils,
  FaSpa,
  FaCarAlt,
  FaBaby,
  FaShip,
  FaPlane,
  FaShoppingBag,
  FaCalendarAlt,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaGolfBall,
  FaConciergeBell,
  FaUserTie,
  FaDumbbell,
  FaWineGlassAlt,
  FaPalette,
  FaHelicopter,
  FaBroom
} from 'react-icons/fa';

interface ServiceCardProps {
  service: {
    title: string;
    imageUrl: string;
    description?: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const whatsappLink = `https://wa.me/212600000000?text=${encodeURIComponent(
    `Bonjour, je suis intéressé par le service ${service.title}. Pouvez-vous me donner plus de détails ?`
  )}`;

  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('chef')) return FaUtensils;
    if (t.includes('spa')) return FaSpa;
    if (t.includes('chauffeur') || t.includes('driver') || t.includes('car')) return FaCarAlt;
    if (t.includes('child') || t.includes('baby') || t.includes('kids')) return FaBaby;
    if (t.includes('yacht') || t.includes('boat')) return FaShip;
    if (t.includes('jet') || t.includes('flight') || t.includes('air')) return FaPlane;
    if (t.includes('shop')) return FaShoppingBag;
    if (t.includes('event')) return FaCalendarAlt;
    if (t.includes('security')) return FaShieldAlt;
    if (t.includes('tour')) return FaMapMarkedAlt;
    if (t.includes('golf')) return FaGolfBall;
    if (t.includes('restaurant') || t.includes('concierge')) return FaConciergeBell;
    if (t.includes('butler')) return FaUserTie;
    if (t.includes('fitness') || t.includes('trainer') || t.includes('gym')) return FaDumbbell;
    if (t.includes('sommelier') || t.includes('wine')) return FaWineGlassAlt;
    if (t.includes('art')) return FaPalette;
    if (t.includes('helicopter')) return FaHelicopter;
    if (t.includes('housekeeping') || t.includes('clean')) return FaBroom;
    return FaConciergeBell;
  };

  const Icon = getServiceIcon(service.title);

  return (
    <div className="relative aspect-[2/3] group overflow-hidden rounded-md border border-white/10 bg-black/20">
      {/* Image */}
      <Image
        src={service.imageUrl}
        alt={service.title}
        fill
        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Gradient overlay bottom for title (always visible) */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-sm p-3 border border-white/10 backdrop-blur-[1px]">
          <h3 className="text-base md:text-lg font-playfair font-light text-white tracking-wide">
            {service.title}
          </h3>
          <div className="mt-2 h-px w-10 bg-[#c99362]" />
        </div>
      </div>

      {/* Hover overlay with description and CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
        <div className="w-full h-full bg-black/70 border border-white/10 rounded-sm backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center">
          {/* Service-specific Icon */}
          <Icon className="w-7 h-7 text-[#c99362] mb-3" />
          <h3 className="text-lg font-playfair text-white tracking-wide mb-2">{service.title}</h3>
          <p className="text-xs md:text-[13px] text-white/80 leading-relaxed max-w-xs mb-4">
            {service.description || 'Experience concierge-level attention tailored for your most refined desires.'}
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp - ${service.title}`}
            className="inline-flex items-center gap-2 text-[11px] text-black bg-[#c99362] hover:bg-[#b58252] font-semibold uppercase tracking-wider px-4 py-2 transition-colors"
          >
            <span>Contact Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
