import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDate } from '@/lib/utils';
import type { Order, Address, MenuItem } from '@/types';
import { ORDER_STATUS_LABELS } from '@/types';
import { DELIVERY_AREAS } from '@/types';

type Tab = 'orders' | 'addresses' | 'favorites' | 'settings';

export default function AccountPage() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [favorites, setFavorites] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    address: '',
    landmark: '',
    area: '',
    is_default: false,
  });
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
  });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]).then(([ordersRes, addrRes]) => {
      setOrders((ordersRes.data as Order[]) ?? []);
      setAddresses((addrRes.data as Address[]) ?? []);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('favorites')
      .select('menu_item_id, menu_item:menu_items(*)')
      .eq('user_id', user.id)
      .then(({ data }) => {
        const items = (data as unknown as { menu_item: MenuItem }[])?.map((d) => d.menu_item) ?? [];
        setFavorites(items);
      });
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { data } = await supabase
      .from('addresses')
      .insert({ ...addrForm, user_id: user.id })
      .select()
      .single();
    if (data) {
      setAddresses((prev) => [data as Address, ...prev]);
      setShowAddressForm(false);
      setAddrForm({ label: 'Home', full_name: '', phone: '', address: '', landmark: '', area: '', is_default: false });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('profiles').update({
      full_name: profileForm.full_name,
      phone: profileForm.phone,
    }).eq('id', user.id);
    refreshProfile();
  };

  const tabs: { value: Tab; label: string; icon: typeof User; count?: number }[] = [
    { value: 'orders', label: 'Order History', icon: Package, count: orders.length },
    { value: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length },
    { value: 'favorites', label: 'Favorite Meals', icon: Heart, count: favorites.length },
    { value: 'settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-white">
            {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal-900">
              {profile?.full_name ?? 'My Account'}
            </h1>
            <p className="text-sm text-charcoal-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside>
            <div className="card p-4">
              <nav className="space-y-1">
                {tabs.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      tab === t.value
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-charcoal-600 hover:bg-charcoal-50'
                    }`}
                  >
                    <t.icon size={18} />
                    <span className="flex-1 text-left">{t.label}</span>
                    {t.count !== undefined && t.count > 0 && (
                      <span className="rounded-full bg-charcoal-100 px-2 py-0.5 text-xs font-semibold text-charcoal-600">
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
              <hr className="my-3 border-charcoal-100" />
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-error-600 transition-colors hover:bg-error-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Content */}
          <div>
            {loading ? (
              <div className="card p-8 text-center text-charcoal-400">Loading...</div>
            ) : (
              <>
                {/* Orders */}
                {tab === 'orders' && (
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="card flex flex-col items-center justify-center p-12 text-center">
                        <Package size={40} className="text-charcoal-300" />
                        <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal-700">No Orders Yet</h3>
                        <p className="mt-1 text-sm text-charcoal-500">Start ordering to see your history here.</p>
                        <Link to="/menu" className="mt-6 btn-primary">Browse Menu</Link>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order.id} className="card p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-charcoal-900">#{order.order_number}</p>
                              <p className="text-xs text-charcoal-400">{formatDate(order.placed_at)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                order.status === 'delivered'
                                  ? 'bg-success-100 text-success-700'
                                  : order.status === 'cancelled'
                                  ? 'bg-error-100 text-error-700'
                                  : 'bg-warning-100 text-warning-700'
                              }`}>
                                {ORDER_STATUS_LABELS[order.status]}
                              </span>
                              <span className="font-serif text-lg font-bold text-primary-700">
                                {formatNaira(order.grand_total)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-xs text-charcoal-500">
                            <span className="flex items-center gap-1">
                              <Truck size={14} />
                              {order.delivery_area || 'Delivery'}
                            </span>
                            <span className="capitalize">
                              {order.payment_method.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <Link
                            to={`/track/${order.order_number}`}
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            <Clock size={15} />
                            Track Order
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Addresses */}
                {tab === 'addresses' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="btn-primary"
                    >
                      <Plus size={18} />
                      Add New Address
                    </button>

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="card space-y-4 p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Label</label>
                            <select
                              value={addrForm.label}
                              onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                              className="input-field"
                            >
                              <option>Home</option>
                              <option>Work</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Full Name</label>
                            <input
                              required
                              value={addrForm.full_name}
                              onChange={(e) => setAddrForm({ ...addrForm, full_name: e.target.value })}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Phone</label>
                            <input
                              required
                              value={addrForm.phone}
                              onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Area</label>
                            <select
                              value={addrForm.area}
                              onChange={(e) => setAddrForm({ ...addrForm, area: e.target.value })}
                              className="input-field"
                            >
                              <option value="">Select area</option>
                              {DELIVERY_AREAS.map((a) => <option key={a}>{a}</option>)}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Address</label>
                            <input
                              required
                              value={addrForm.address}
                              onChange={(e) => setAddrForm({ ...addrForm, address: e.target.value })}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Landmark</label>
                            <input
                              value={addrForm.landmark}
                              onChange={(e) => setAddrForm({ ...addrForm, landmark: e.target.value })}
                              className="input-field"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" className="btn-primary">Save Address</button>
                          <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline">
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {addresses.length === 0 && !showAddressForm ? (
                      <div className="card flex flex-col items-center justify-center p-12 text-center">
                        <MapPin size={40} className="text-charcoal-300" />
                        <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal-700">No Saved Addresses</h3>
                        <p className="mt-1 text-sm text-charcoal-500">Add an address for faster checkout.</p>
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className="card flex items-start justify-between p-5">
                          <div className="flex items-start gap-3">
                            <MapPin size={20} className="mt-0.5 text-primary-600" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-charcoal-900">{addr.label}</p>
                                {addr.is_default && (
                                  <span className="rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-700">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-charcoal-600">{addr.address}</p>
                              <p className="text-sm text-charcoal-500">{addr.area}</p>
                              <p className="mt-1 text-xs text-charcoal-400">{addr.full_name} · {addr.phone}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-error-500 hover:text-error-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Favorites */}
                {tab === 'favorites' && (
                  <div>
                    {favorites.length === 0 ? (
                      <div className="card flex flex-col items-center justify-center p-12 text-center">
                        <Heart size={40} className="text-charcoal-300" />
                        <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal-700">No Favorites Yet</h3>
                        <p className="mt-1 text-sm text-charcoal-500">Save your favorite meals for quick reordering.</p>
                        <Link to="/menu" className="mt-6 btn-primary">Browse Menu</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {favorites.map((item) => (
                          <Link
                            key={item.id}
                            to={`/food/${item.slug}`}
                            className="card card-hover flex items-center gap-4 p-4"
                          >
                            <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="font-semibold text-charcoal-900">{item.name}</p>
                              <p className="text-sm text-primary-600">{formatNaira(Number(item.price))}</p>
                            </div>
                            <Heart size={20} className="fill-primary-500 text-primary-500" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Settings */}
                {tab === 'settings' && (
                  <div className="card p-6">
                    <h2 className="font-serif text-xl font-bold text-charcoal-900">Profile Settings</h2>
                    <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Full Name</label>
                        <input
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Phone Number</label>
                        <input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Email</label>
                        <input
                          value={user.email ?? ''}
                          disabled
                          className="input-field cursor-not-allowed opacity-60"
                        />
                      </div>
                      <button type="submit" className="btn-primary">
                        <CheckCircle size={18} />
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
