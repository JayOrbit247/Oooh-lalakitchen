import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Order Food', path: '/menu' },
  { label: 'Menu', path: '/menu' },
  { label: 'Locations', path: '/locations' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, profile, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-md backdrop-blur-md'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
            <BrandLogo />

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-charcoal-700 hover:bg-charcoal-50 hover:text-charcoal-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-primary-50 hover:text-primary-600"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative hidden lg:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full bg-charcoal-50 px-3 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:bg-charcoal-100"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                      {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>
                    <span className="max-w-20 truncate">{profile?.full_name?.split(' ')[0] ?? 'Account'}</span>
                    <ChevronDown size={16} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-fade-in-scale rounded-xl bg-white py-2 shadow-xl ring-1 ring-charcoal-100">
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50"
                        >
                          <User size={16} />
                          My Account
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50"
                          >
                            <LayoutDashboard size={16} />
                            Admin Dashboard
                          </Link>
                        )}
                        <hr className="my-1 border-charcoal-100" />
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden items-center gap-2 lg:flex">
                  <Link to="/login" className="btn-ghost">
                    Login
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-charcoal-100 bg-white lg:hidden">
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-charcoal-700 hover:bg-charcoal-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <hr className="my-2 border-charcoal-100" />
              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50"
                  >
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-error-600 hover:bg-error-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 py-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline flex-1"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
