import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  LocateFixed,
  Clock,
  Truck,
  ChefHat,
  ShieldCheck,
  Headphones,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  useCategories,
  useMenuItems,
  useTestimonials,
  usePromotions,
} from '@/hooks/useData';
import FoodCard from '@/components/FoodCard';
import CategoryCard from '@/components/CategoryCard';
import QuickViewModal from '@/components/QuickViewModal';
import StarRating from '@/components/StarRating';
import type { MenuItem } from '@/types';
import { DELIVERY_AREAS } from '@/types';

const whyChooseUs = [
  {
    icon: Sparkles,
    title: 'Fresh Ingredients',
    desc: 'Meals prepared daily with quality ingredients sourced from trusted suppliers.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick and reliable delivery service straight to your doorstep.',
  },
  {
    icon: ChefHat,
    title: 'Professional Chefs',
    desc: 'Expert chefs creating memorable meals with passion and skill.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    desc: 'Safe and trusted payment processing for your peace of mind.',
  },
  {
    icon: Headphones,
    title: 'Customer Satisfaction',
    desc: 'Dedicated customer support team ready to assist you anytime.',
  },
  {
    icon: Clock,
    title: 'Affordable Luxury',
    desc: 'Premium quality meals at reasonable prices for everyone.',
  },
];

export default function HomePage() {
  const { categories } = useCategories();
  const { items: popularItems } = useMenuItems({ popularOnly: true });
  const { testimonials } = useTestimonials();
  const { promotions } = usePromotions();
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [areaConfirmed, setAreaConfirmed] = useState(false);

  const handleConfirmArea = () => {
    if (selectedArea || addressInput) {
      setAreaConfirmed(true);
      setTimeout(() => setAreaConfirmed(false), 3000);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/WhatsApp_Image_2026-07-06_at_1.45.17_PM.jpeg"
            alt="Oooh-Lala Kitchen meals"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-900/70 to-charcoal-900/40" />
        </div>

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-medium text-gold-300 ring-1 ring-gold-500/30">
              <Sparkles size={16} />
              Oooh-Lala Kitchen & Food Delivery Service
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Oooh-Lala Kitchen &{' '}
              <span className="text-gradient-gold">Food Delivery Service</span> in Lagos
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Enjoy freshly prepared meals, grilled specialties, seafood platters, small chops,
              and refreshing drinks delivered straight to your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary text-base">
                Order Now
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                Explore Menu
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                Open 8AM - 11PM Daily
              </div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-gold-400" />
                Fast Delivery in Lagos
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-gold-400" />
                Secure Payments
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Selection */}
      <section className="section-padding bg-white">
        <div className="container-padding">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
              Select Your Delivery Location
            </h2>
            <p className="mt-3 text-charcoal-600">
              Choose your area to check delivery availability and estimated delivery time.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <div className="card p-6 sm:p-8">
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100">
                  <LocateFixed size={18} />
                  Detect Current Location
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-charcoal-100" />
                <span className="text-xs font-medium uppercase tracking-wide text-charcoal-400">
                  Or Select Area
                </span>
                <div className="h-px flex-1 bg-charcoal-100" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {DELIVERY_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                      selectedArea === area
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100'
                    }`}
                  >
                    <MapPin size={15} />
                    {area}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                  Or Enter Delivery Address Manually
                </label>
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  className="input-field"
                />
              </div>

              <button
                onClick={handleConfirmArea}
                disabled={!selectedArea && !addressInput}
                className="mt-4 w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Delivery Location
              </button>

              {areaConfirmed && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 text-sm text-success-700 animate-fade-in">
                  <ShieldCheck size={18} />
                  Delivery is available in your area! Estimated delivery time: 30-45 minutes.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-padding">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Explore
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
                Popular Categories
              </h2>
            </div>
            <Link
              to="/menu"
              className="hidden items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 sm:flex"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Meals */}
      <section className="section-padding bg-white">
        <div className="container-padding">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Chef's Selection
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
              Featured Meals
            </h2>
            <p className="mt-3 text-charcoal-600">
              Our most loved dishes, crafted with premium ingredients and delivered fresh.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularItems.slice(0, 8).map((item) => (
              <FoodCard key={item.id} item={item} onQuickView={setQuickViewItem} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/menu" className="btn-outline">
              View Full Menu
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding gradient-charcoal text-white">
        <div className="container-padding">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-gold-400">
              Why Choose Us
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
              The Oooh-Lala Kitchen Experience
            </h2>
            <p className="mt-3 text-white/70">
              We deliver more than just food — we deliver excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:ring-gold-500/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                  <feature.icon size={24} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-charcoal-50">
          <div className="container-padding">
            <div className="mb-10 text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Testimonials
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="card card-hover p-6">
                  <StarRating rating={t.rating} className="mb-3" />
                  <p className="text-sm leading-relaxed text-charcoal-600">"{t.review_text}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={t.photo_url}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-gold-200"
                    />
                    <div>
                      <p className="font-semibold text-charcoal-900">{t.name}</p>
                      <p className="text-xs text-charcoal-500">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Promotions */}
      {promotions.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-padding">
            <div className="mb-10 text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Special Offers
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
                Special Promotions
              </h2>
              <p className="mt-3 text-charcoal-600">
                Take advantage of our latest deals and save on your favorite meals.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg"
                >
                  <div className="relative h-64">
                    <img
                      src={promo.image_url}
                      alt={promo.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-900/40 to-transparent" />
                    {promo.badge && (
                      <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-charcoal-900 shadow-lg">
                        {promo.badge}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-serif text-lg font-semibold text-white">{promo.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-white/80">{promo.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuickViewModal item={quickViewItem} onClose={() => setQuickViewItem(null)} />
    </div>
  );
}
