import { Link } from 'react-router-dom';

interface BrandLogoProps {
  compact?: boolean;
  light?: boolean;
}

export default function BrandLogo({ compact = false, light = false }: BrandLogoProps) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5" aria-label="Oooh-Lala Kitchen & Food Delivery Service in Lagos home">
      <img
        src="/ooh_lala_logo.jpeg"
        alt="Oooh-lala Kitchen logo"
        className={`${compact ? 'h-10 w-10' : 'h-12 w-12'} rounded-full object-cover shadow-sm ring-1 ring-primary-100 transition-transform duration-300 group-hover:scale-105`}
      />
      {!compact && (
        <span className="leading-none">
          <span className={`block font-serif text-lg font-bold ${light ? 'text-white' : 'text-charcoal-900'}`}>
            Oooh-Lala Kitchen
          </span>
          <span className={`block text-[10px] font-semibold tracking-[0.22em] ${light ? 'text-gold-300' : 'text-primary-700'}`}>
            FOOD DELIVERY • LAGOS
          </span>
        </span>
      )}
    </Link>
  );
}
