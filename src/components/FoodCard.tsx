import { Link } from 'react-router-dom';
import { Clock, Plus, Star, MessageCircle } from 'lucide-react';
import type { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatNaira, buildWhatsAppOrderLink } from '@/lib/utils';

interface FoodCardProps {
  item: MenuItem;
  onQuickView?: (item: MenuItem) => void;
}

export default function FoodCard({ item, onQuickView }: FoodCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <Link to={`/food/${item.slug}`}>
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        {item.is_popular && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            Popular
          </span>
        )}
        {onQuickView && (
          <button
            onClick={() => onQuickView(item)}
            className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-charcoal-700 opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
          >
            Quick View
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link to={`/food/${item.slug}`}>
            <h3 className="font-serif text-lg font-semibold leading-tight text-charcoal-900 transition-colors hover:text-primary-600">
              {item.name}
            </h3>
          </Link>
        </div>

        <div className="mb-2 flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1">
            <Star size={13} className="fill-gold-400 text-gold-400" />
            <span className="font-medium text-charcoal-700">{item.rating}</span>
            <span>({item.review_count})</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {item.prep_time}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 flex-1 text-sm text-charcoal-600">{item.description}</p>

        <div className="flex items-center justify-between gap-2">
          <span className="font-serif text-xl font-bold text-primary-700">
            {formatNaira(Number(item.price))}
          </span>
          <div className="flex items-center gap-1.5">
            <a
              href={buildWhatsAppOrderLink(item.name, 1, Number(item.price))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all duration-300 hover:bg-[#1da851] hover:shadow-lg active:scale-95"
              aria-label={`Order ${item.name} on WhatsApp`}
            >
              <MessageCircle size={16} />
              Order
            </a>
            <button
              onClick={() => addToCart(item)}
              className="flex items-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition-all duration-300 hover:bg-primary-700 hover:shadow-lg active:scale-95"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
