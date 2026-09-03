import { X, Plus, Clock, Star, Minus, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatNaira, buildWhatsAppOrderLink } from '@/lib/utils';

interface QuickViewModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export default function QuickViewModal({ item, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleAdd = () => {
    addToCart(item, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative z-10 w-full max-w-2xl animate-fade-in-scale overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-charcoal-600 shadow-md transition-colors hover:bg-white hover:text-charcoal-900"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="h-64 sm:h-full">
            <img
              src={item.image_url}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col p-6">
            <div className="mb-2 flex items-center gap-3 text-xs text-charcoal-500">
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-gold-400 text-gold-400" />
                <span className="font-medium text-charcoal-700">{item.rating}</span>
                <span>({item.review_count})</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {item.prep_time}
              </span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-charcoal-900">{item.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{item.description}</p>

            <div className="mt-4">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                Key Ingredients
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.slice(0, 5).map((ing, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-charcoal-50 px-2.5 py-1 text-xs text-charcoal-600"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-2xl font-bold text-primary-700">
                  {formatNaira(Number(item.price))}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-charcoal-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-charcoal-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="btn-primary flex-1"
                >
                  Add To Cart
                </button>
                <a
                  href={buildWhatsAppOrderLink(item.name, quantity, Number(item.price))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all duration-300 hover:bg-[#1da851] hover:shadow-lg active:scale-95"
                >
                  <MessageCircle size={18} />
                  Order
                </a>
              </div>
              <Link
                to={`/food/${item.slug}`}
                onClick={onClose}
                className="mt-2 block text-center text-sm font-medium text-charcoal-600 hover:text-primary-600"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
