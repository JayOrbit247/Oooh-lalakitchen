import { Link } from 'react-router-dom';
import {
  Sparkles,
  Truck,
  ChefHat,
  ShieldCheck,
  Heart,
  Award,
  ArrowRight,
  Phone,
  MapPin,
  Clock,
} from 'lucide-react';
import { useTestimonials } from '@/hooks/useData';
import StarRating from '@/components/StarRating';

const values = [
  {
    icon: Sparkles,
    title: 'Quality First',
    desc: 'We never compromise on the quality of our ingredients. Every meal is prepared fresh, with carefully sourced produce and premium ingredients.',
  },
  {
    icon: ChefHat,
    title: 'Culinary Excellence',
    desc: 'Our professional chefs bring years of experience and passion to every dish, creating memorable dining experiences.',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable',
    desc: 'We understand hunger waits for no one. Our delivery team ensures your food arrives hot, fresh, and on time.',
  },
  {
    icon: Heart,
    title: 'Customer Focused',
    desc: 'Your satisfaction is our priority. From order to delivery, we strive to exceed your expectations every step of the way.',
  },
];

const stats = [
  { value: '15K+', label: 'Orders Delivered' },
  { value: '50+', label: 'Menu Items' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '5', label: 'Delivery Areas' },
];

export default function AboutPage() {
  const { testimonials } = useTestimonials();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5083906/pexels-photo-5083906.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Restaurant kitchen"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/90 via-charcoal-900/75 to-charcoal-900/50" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/20 px-4 py-1.5 text-sm font-medium text-gold-300 ring-1 ring-gold-500/30">
              <Award size={16} />
              About Us
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Exceptional Taste,<br />
              <span className="text-gradient-gold">Delivered Fresh</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Oooh-Lala Kitchen & Food Delivery Service in Lagos is a premium restaurant and food delivery service based in
              Agbelekale, Abule-Egba, Lagos State. We bring the finest Nigerian and continental
              cuisine straight to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-padding px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Our Story
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
                A Passion for Great Food
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal-600">
                Founded with a passion for exceptional cuisine, Oooh-Lala Kitchen & Food Delivery Service in Lagos has grown from
                a small neighborhood kitchen to one of Abule-Egba's most loved food delivery services.
                We believe that great food should be accessible, affordable, and delivered with care.
              </p>
              <p className="mt-4 text-base leading-relaxed text-charcoal-600">
                Our menu features a carefully curated selection of Nigerian favorites and continental
                dishes, all prepared by our team of professional chefs using only the freshest
                ingredients. From our signature jollof rice to our luxurious seafood platters,
                every dish is crafted to deliver an exceptional dining experience.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/menu" className="btn-primary">
                  Explore Our Menu
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="/images/categories/image.png"
                alt="Premium Oooh-Lala Kitchen food"
                loading="lazy"
                className="rounded-2xl shadow-xl object-cover w-full"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-6 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <img src="/ooh_lala_logo.jpeg" alt="Oooh-lala Kitchen" className="h-12 w-12 rounded-full object-cover ring-1 ring-primary-100" />
                  <div>
                    <p className="font-serif text-2xl font-bold text-charcoal-900">8AM - 11PM</p>
                    <p className="text-xs text-charcoal-500">Open Daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="gradient-charcoal py-12 text-white">
        <div className="container-padding px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl font-bold text-gold-400 sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-charcoal-50">
        <div className="container-padding px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              What We Stand For
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="card card-hover p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <v.icon size={24} className="text-primary-600" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding">
          <div className="container-padding px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Customer Love
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold text-charcoal-900 sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="card p-6">
                  <StarRating rating={t.rating} className="mb-3" />
                  <p className="text-sm leading-relaxed text-charcoal-600">"{t.review_text}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <img src={t.photo_url} alt={t.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-gold-200" />
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

      {/* Contact CTA */}
      <section className="gradient-primary py-16 text-white">
        <div className="container-padding px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to Order?</h2>
          <p className="mt-3 text-white/80">
            Experience the Oooh-Lala Kitchen difference today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/menu" className="btn-gold text-base">
              Order Now
              <ArrowRight size={18} />
            </Link>
            <a href="tel:08117926084" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10">
              <Phone size={18} />
              Call Us
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2"><MapPin size={16} /> Agbelekale, Abule-Egba, Lagos</span>
            <span className="flex items-center gap-2"><Clock size={16} /> Open 8AM - 11PM Daily</span>
          </div>
        </div>
      </section>
    </div>
  );
}
