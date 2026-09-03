import { Link } from 'react-router-dom';
import { useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from 'lucide-react';

const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Order Food', path: '/menu' },
  { label: 'Locations', path: '/locations' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const foodCategories = [
  { label: 'Jollof Rice', path: '/menu?category=jollof-rice' },
  { label: 'Fried Rice', path: '/menu?category=fried-rice' },
  { label: 'Grilled Chicken', path: '/menu?category=chicken' },
  { label: 'Seafood', path: '/menu?category=fish' },
  { label: 'Small Chops', path: '/menu' },
  { label: 'Fresh Juice', path: '/menu?category=salad' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="gradient-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo light />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Exceptional Taste, Delivered Fresh. Premium restaurant and food delivery
              service in Lagos, serving freshly prepared meals with the finest ingredients.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary-600"
                  aria-label="Social media"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-gold-400">Quick Links</h4>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/70 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-gold-400">Food Categories</h4>
            <ul className="mt-4 space-y-2">
              {foodCategories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.path}
                    className="text-sm text-white/70 transition-colors hover:text-gold-400"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-gold-400">Get In Touch</h4>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold-400" />
                <span>Agbelekale, Abule-Egba, Lagos State, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone size={18} className="shrink-0 text-gold-400" />
                <span>08117926084 / 08101581209</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail size={18} className="shrink-0 text-gold-400" />
                <span>onimixjay4@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <Clock size={18} className="mt-0.5 shrink-0 text-gold-400" />
                <span>Mon - Sun: 8:00 AM - 11:00 PM</span>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="mt-6">
              <p className="mb-2 text-sm font-medium text-white/80">Newsletter Signup</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-gold-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500 text-charcoal-900 transition-colors hover:bg-gold-400"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-xs text-success-400">Subscribed! Thank you.</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/60">
          © 2026 Oooh-Lala Kitchen & Food Delivery Service in Lagos. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
