import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  ChevronRight,
  Flame,
  Check,
  MessageCircle,
} from 'lucide-react';
import { useMenuItem, useMenuItems } from '@/hooks/useData';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { formatNaira, buildWhatsAppOrderLink } from '@/lib/utils';
import FoodCard from '@/components/FoodCard';

export default function FoodDetailsPage() {
  const { slug } = useParams();
  const { item, loading } = useMenuItem(slug);
  const { items: relatedItems } = useMenuItems({
    categoryId: item?.category_id ?? undefined,
  });
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-96 shimmer-bg rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 shimmer-bg rounded" />
              <div className="h-4 w-full shimmer-bg rounded" />
              <div className="h-4 w-3/4 shimmer-bg rounded" />
              <div className="h-24 w-full shimmer-bg rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Meal Not Found</h2>
        <p className="mt-2 text-charcoal-600">This meal doesn't exist or is no longer available.</p>
        <Link to="/menu" className="mt-6 btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  const gallery = item.gallery.length > 0 ? item.gallery : [item.image_url];
  const related = relatedItems.filter((i) => i.id !== item.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(item, quantity);
    showToast(`${item.name} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(item, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-padding px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-charcoal-500">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={14} />
          <Link to="/menu" className="hover:text-primary-600">Menu</Link>
          <ChevronRight size={14} />
          <span className="font-medium text-charcoal-700">{item.name}</span>
        </nav>

        <Link
          to="/menu"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-primary-600"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={gallery[activeImage]}
                alt={item.name}
                className="h-96 w-full object-cover sm:h-[500px]"
              />
              {item.is_popular && (
                <span className="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  Popular Choice
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 overflow-hidden rounded-xl transition-all ${
                      activeImage === i
                        ? 'ring-2 ring-primary-600 ring-offset-2'
                        : 'ring-1 ring-charcoal-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${item.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-3 text-sm text-charcoal-500">
              <span className="flex items-center gap-1">
                <Star size={16} className="fill-gold-400 text-gold-400" />
                <span className="font-medium text-charcoal-700">{item.rating}</span>
                <span>({item.review_count} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {item.prep_time}
              </span>
              {item.is_available && (
                <span className="flex items-center gap-1 text-success-600">
                  <Check size={16} />
                  Available
                </span>
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
              {item.name}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-charcoal-600">{item.description}</p>

            <div className="mt-6">
              <span className="font-serif text-3xl font-bold text-primary-700">
                {formatNaira(Number(item.price))}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-charcoal-200 bg-white p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-charcoal-100"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 text-center font-semibold text-charcoal-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-charcoal-100"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-outline">
                <ShoppingBag size={18} />
                Add To Cart
              </button>

              <a
                href={buildWhatsAppOrderLink(item.name, quantity, Number(item.price))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all duration-300 hover:bg-[#1da851] hover:shadow-lg active:scale-95"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>

              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal-200 text-charcoal-400 transition-colors hover:border-primary-500 hover:text-primary-600">
                <Heart size={20} />
              </button>
            </div>

            {/* Ingredients */}
            {item.ingredients.length > 0 && (
              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">Ingredients</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-charcoal-50 px-3 py-1.5 text-sm text-charcoal-600"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Info */}
            {item.nutrition_info && Object.keys(item.nutrition_info).length > 0 && (
              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">
                  Nutrition Information
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {item.nutrition_info.calories && (
                    <div className="rounded-xl bg-primary-50 p-4 text-center">
                      <Flame size={20} className="mx-auto text-primary-600" />
                      <p className="mt-1.5 text-xs text-charcoal-500">Calories</p>
                      <p className="font-semibold text-charcoal-900">{item.nutrition_info.calories}</p>
                    </div>
                  )}
                  {item.nutrition_info.protein && (
                    <div className="rounded-xl bg-gold-50 p-4 text-center">
                      <p className="text-xs text-charcoal-500">Protein</p>
                      <p className="font-semibold text-charcoal-900">{item.nutrition_info.protein}</p>
                    </div>
                  )}
                  {item.nutrition_info.carbs && (
                    <div className="rounded-xl bg-success-50 p-4 text-center">
                      <p className="text-xs text-charcoal-500">Carbs</p>
                      <p className="font-semibold text-charcoal-900">{item.nutrition_info.carbs}</p>
                    </div>
                  )}
                  {item.nutrition_info.fat && (
                    <div className="rounded-xl bg-warning-50 p-4 text-center">
                      <p className="text-xs text-charcoal-500">Fat</p>
                      <p className="font-semibold text-charcoal-900">{item.nutrition_info.fat}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Meals */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">Related Meals</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((rel) => (
                <FoodCard key={rel.id} item={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
