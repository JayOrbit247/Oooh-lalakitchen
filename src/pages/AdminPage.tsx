import { useEffect, useState, useCallback } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  DollarSign,
  ChefHat,
  Loader2,
  Eye,
  Bike,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { formatNaira, formatDate, slugify } from '@/lib/utils';
import type {
  MenuItem,
  Category,
  Order,
  Profile,
  OrderStatus,
} from '@/types';
import { ORDER_STATUS_LABELS } from '@/types';

type Tab = 'overview' | 'products' | 'orders' | 'customers';

interface BestSeller {
  name: string;
  total_quantity: number;
  total_revenue: number;
}

export default function AdminPage() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');

  // Overview data
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    avgOrder: 0,
  });
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Products
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<{ name: string; price: number; quantity: number; image_url: string }[]>([]);

  // Customers
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('');

  const fetchOverview = useCallback(async () => {
    setOverviewLoading(true);
    const [ordersRes, customersRes, itemsRes] = await Promise.all([
      supabase.from('orders').select('grand_total, status, created_at'),
      supabase.from('profiles').select('id').eq('role', 'customer'),
      supabase.from('order_items').select('name, quantity, price'),
    ]);

    const allOrders = (ordersRes.data as Order[]) ?? [];
    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.grand_total), 0);
    const customerCount = customersRes.data?.length ?? 0;
    setStats({
      revenue: totalRevenue,
      orders: allOrders.length,
      customers: customerCount,
      avgOrder: allOrders.length > 0 ? totalRevenue / allOrders.length : 0,
    });

    const sellerMap = new Map<string, BestSeller>();
    ((itemsRes.data as { name: string; quantity: number; price: number }[]) ?? []).forEach((item) => {
      const existing = sellerMap.get(item.name);
      if (existing) {
        existing.total_quantity += item.quantity;
        existing.total_revenue += item.price * item.quantity;
      } else {
        sellerMap.set(item.name, {
          name: item.name,
          total_quantity: item.quantity,
          total_revenue: item.price * item.quantity,
        });
      }
    });
    setBestSellers(Array.from(sellerMap.values()).sort((a, b) => b.total_quantity - a.total_quantity).slice(0, 5));
    setRecentOrders(allOrders.slice(0, 5));
    setOverviewLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    const [itemsRes, catsRes] = await Promise.all([
      supabase.from('menu_items').select('*, category:categories(*)').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setMenuItems((itemsRes.data as MenuItem[]) ?? []);
    setCategories((catsRes.data as Category[]) ?? []);
    setProductsLoading(false);
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    const { data } = await query;
    setOrders((data as Order[]) ?? []);
    setOrdersLoading(false);
  }, [statusFilter]);

  const fetchCustomers = useCallback(async () => {
    setCustomersLoading(true);
    const { data } = await supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false });
    setCustomers((data as Profile[]) ?? []);
    setCustomersLoading(false);
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchOverview();
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, [user, isAdmin, fetchOverview, fetchProducts, fetchOrders, fetchCustomers]);

  useEffect(() => {
    if (user && isAdmin) fetchOrders();
  }, [statusFilter, user, isAdmin, fetchOrders]);

  const handleSelectOrder = async (order: Order) => {
    setSelectedOrder(order);
    const { data } = await supabase.from('order_items').select('name, price, quantity, image_url').eq('order_id', order.id);
    setOrderItems((data as { name: string; price: number; quantity: number; image_url: string }[]) ?? []);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, rider: string) => {
    const updates: Record<string, unknown> = { status };
    if (status === 'delivered') updates.delivered_at = new Date().toISOString();
    if (rider !== undefined) updates.assigned_rider = rider;
    const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
    if (error) {
      showToast('Failed to update order');
    } else {
      showToast('Order updated successfully');
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status, assigned_rider: rider } : o)));
      setSelectedOrder((prev) => (prev ? { ...prev, status, assigned_rider: rider } : null));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete item');
    } else {
      showToast('Item deleted');
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id);
    if (error) {
      showToast('Failed to update');
    } else {
      setMenuItems((prev) => prev.map((m) => (m.id === item.id ? { ...m, is_available: !m.is_available } : m)));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const tabs: { value: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { value: 'overview', label: 'Overview', icon: LayoutDashboard },
    { value: 'products', label: 'Products', icon: Package },
    { value: 'orders', label: 'Orders', icon: ShoppingCart },
    { value: 'customers', label: 'Customers', icon: Users },
  ];

  const statCards = [
    { label: 'Total Revenue', value: formatNaira(stats.revenue), icon: DollarSign, color: 'bg-success-50 text-success-600' },
    { label: 'Total Orders', value: String(stats.orders), icon: ShoppingCart, color: 'bg-primary-50 text-primary-600' },
    { label: 'Customers', value: String(stats.customers), icon: Users, color: 'bg-gold-50 text-gold-600' },
    { label: 'Avg Order Value', value: formatNaira(stats.avgOrder), icon: TrendingUp, color: 'bg-warning-50 text-warning-600' },
  ];

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
            <ChefHat size={28} className="text-white" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal-900">Admin Dashboard</h1>
            <p className="text-sm text-charcoal-500">Manage your restaurant operations</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside>
            <div className="card p-3 lg:sticky lg:top-24">
              <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {tabs.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      tab === t.value
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-charcoal-600 hover:bg-charcoal-50'
                    }`}
                  >
                    <t.icon size={18} />
                    {t.label}
                  </button>
                ))}
              </nav>
              <hr className="my-3 border-charcoal-100" />
              <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-charcoal-600 hover:bg-charcoal-50">
                <Eye size={18} />
                View Site
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div>
            {tab === 'overview' && (
              <div className="space-y-6">
                {overviewLoading ? (
                  <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-600" /></div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      {statCards.map((card) => (
                        <div key={card.label} className="card p-5">
                          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
                            <card.icon size={20} />
                          </div>
                          <p className="text-xs text-charcoal-500">{card.label}</p>
                          <p className="mt-1 font-serif text-xl font-bold text-charcoal-900">{card.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      <div className="card p-6">
                        <h2 className="font-serif text-lg font-bold text-charcoal-900">Best Selling Meals</h2>
                        {bestSellers.length === 0 ? (
                          <p className="mt-4 text-sm text-charcoal-400">No sales data yet.</p>
                        ) : (
                          <div className="mt-4 space-y-3">
                            {bestSellers.map((seller, i) => (
                              <div key={seller.name} className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600">
                                  {i + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-charcoal-900">{seller.name}</p>
                                  <p className="text-xs text-charcoal-500">{seller.total_quantity} sold</p>
                                </div>
                                <p className="text-sm font-semibold text-success-600">{formatNaira(seller.total_revenue)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="card p-6">
                        <h2 className="font-serif text-lg font-bold text-charcoal-900">Recent Orders</h2>
                        {recentOrders.length === 0 ? (
                          <p className="mt-4 text-sm text-charcoal-400">No orders yet.</p>
                        ) : (
                          <div className="mt-4 space-y-3">
                            {recentOrders.map((order) => (
                              <div key={order.id} className="flex items-center justify-between border-b border-charcoal-50 pb-3 last:border-0">
                                <div>
                                  <p className="text-sm font-medium text-charcoal-900">#{order.order_number}</p>
                                  <p className="text-xs text-charcoal-500">{formatDate(order.placed_at)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-charcoal-900">{formatNaira(order.grand_total)}</p>
                                  <span className={`text-xs font-medium ${
                                    order.status === 'delivered' ? 'text-success-600' : order.status === 'cancelled' ? 'text-error-600' : 'text-warning-600'
                                  }`}>
                                    {ORDER_STATUS_LABELS[order.status]}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === 'products' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-charcoal-900">Product Management</h2>
                  <button
                    onClick={() => { setEditingItem(null); setShowProductForm(true); }}
                    className="btn-primary"
                  >
                    <Plus size={18} /> Add Food
                  </button>
                </div>

                {productsLoading ? (
                  <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-600" /></div>
                ) : (
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-xs uppercase text-charcoal-500">
                          <tr>
                            <th className="px-4 py-3">Item</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Available</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50">
                          {menuItems.map((item) => (
                            <tr key={item.id} className="hover:bg-charcoal-50">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                                  <span className="font-medium text-charcoal-900">{item.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-charcoal-600">{item.category?.name ?? '—'}</td>
                              <td className="px-4 py-3 font-semibold text-charcoal-900">{formatNaira(Number(item.price))}</td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleToggleAvailability(item)}
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                    item.is_available ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
                                  }`}
                                >
                                  {item.is_available ? 'Available' : 'Unavailable'}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => { setEditingItem(item); setShowProductForm(true); }}
                                    className="rounded-lg p-2 text-charcoal-500 hover:bg-charcoal-100 hover:text-primary-600"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(item.id)}
                                    className="rounded-lg p-2 text-charcoal-500 hover:bg-error-50 hover:text-error-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {showProductForm && (
                  <ProductFormModal
                    item={editingItem}
                    categories={categories}
                    onClose={() => { setShowProductForm(false); setEditingItem(null); }}
                    onSaved={() => { fetchProducts(); setShowProductForm(false); setEditingItem(null); }}
                    showToast={showToast}
                  />
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif text-xl font-bold text-charcoal-900">Order Management</h2>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field w-auto"
                  >
                    <option value="all">All Statuses</option>
                    {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                {ordersLoading ? (
                  <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-600" /></div>
                ) : orders.length === 0 ? (
                  <div className="card p-12 text-center text-charcoal-400">No orders found.</div>
                ) : (
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-xs uppercase text-charcoal-500">
                          <tr>
                            <th className="px-4 py-3">Order #</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-charcoal-50">
                              <td className="px-4 py-3 font-medium text-charcoal-900">{order.order_number}</td>
                              <td className="px-4 py-3 text-charcoal-600">{order.full_name}</td>
                              <td className="px-4 py-3 font-semibold text-charcoal-900">{formatNaira(order.grand_total)}</td>
                              <td className="px-4 py-3">
                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                  order.status === 'delivered' ? 'bg-success-100 text-success-700' :
                                  order.status === 'cancelled' ? 'bg-error-100 text-error-700' :
                                  'bg-warning-100 text-warning-700'
                                }`}>
                                  {ORDER_STATUS_LABELS[order.status]}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-charcoal-500">{formatDate(order.placed_at)}</td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleSelectOrder(order)}
                                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedOrder && (
                  <OrderManageModal
                    order={selectedOrder}
                    items={orderItems}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={handleUpdateOrderStatus}
                  />
                )}
              </div>
            )}

            {tab === 'customers' && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-serif text-xl font-bold text-charcoal-900">Customer Management</h2>
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="input-field w-auto"
                  />
                </div>

                {customersLoading ? (
                  <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-primary-600" /></div>
                ) : (
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-charcoal-100 bg-charcoal-50 text-xs uppercase text-charcoal-500">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-50">
                          {customers
                            .filter((c) =>
                              !customerSearch ||
                              c.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                              c.phone.includes(customerSearch)
                            )
                            .map((customer) => (
                              <tr key={customer.id} className="hover:bg-charcoal-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-600">
                                      {customer.full_name?.charAt(0).toUpperCase() ?? 'U'}
                                    </div>
                                    <span className="font-medium text-charcoal-900">{customer.full_name || 'Unknown'}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-charcoal-600">{customer.phone || '—'}</td>
                                <td className="px-4 py-3 text-xs text-charcoal-500">{formatDate(customer.created_at)}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Product Form Modal ---

interface ProductFormModalProps {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
  showToast: (msg: string) => void;
}

function ProductFormModal({ item, categories, onClose, onSaved, showToast }: ProductFormModalProps) {
  const [form, setForm] = useState({
    name: item?.name ?? '',
    description: item?.description ?? '',
    price: item?.price?.toString() ?? '',
    image_url: item?.image_url ?? '',
    category_id: item?.category_id ?? categories[0]?.id ?? '',
    prep_time: item?.prep_time ?? '20-30 mins',
    ingredients: item?.ingredients?.join(', ') ?? '',
    is_popular: item?.is_popular ?? false,
    is_available: item?.is_available ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description,
      price: Number(form.price),
      image_url: form.image_url,
      category_id: form.category_id || null,
      prep_time: form.prep_time,
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      is_popular: form.is_popular,
      is_available: form.is_available,
    };

    let error;
    if (item) {
      ({ error } = await supabase.from('menu_items').update(payload).eq('id', item.id));
    } else {
      ({ error } = await supabase.from('menu_items').insert(payload));
    }

    setSaving(false);
    if (error) {
      showToast('Failed to save item');
    } else {
      showToast(item ? 'Item updated' : 'Item added');
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-scale rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-charcoal-100 p-6">
          <h2 className="font-serif text-xl font-bold text-charcoal-900">
            {item ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-charcoal-400 hover:bg-charcoal-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Name *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Description *</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Price (₦) *</label>
              <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Category</label>
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input-field">
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Preparation Time</label>
            <input value={form.prep_time} onChange={(e) => setForm({ ...form, prep_time: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Ingredients (comma-separated)</label>
            <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="input-field" placeholder="Rice, Chicken, Tomatoes" />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
              <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="rounded accent-primary-600" />
              Popular
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="rounded accent-primary-600" />
              Available
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? <Loader2 size={18} className="animate-spin" /> : null}
              {item ? 'Save Changes' : 'Add Item'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Order Manage Modal ---

interface OrderManageModalProps {
  order: Order;
  items: { name: string; price: number; quantity: number; image_url: string }[];
  onClose: () => void;
  onUpdate: (orderId: string, status: OrderStatus, rider: string) => void;
}

function OrderManageModal({ order, items, onClose, onUpdate }: OrderManageModalProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [rider, setRider] = useState(order.assigned_rider ?? '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-scale rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-charcoal-100 p-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal-900">Manage Order</h2>
            <p className="text-sm text-charcoal-500">#{order.order_number}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-charcoal-400 hover:bg-charcoal-100">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl bg-charcoal-50 p-4">
            <p className="text-xs font-medium uppercase text-charcoal-400">Customer</p>
            <p className="mt-1 text-sm font-semibold text-charcoal-900">{order.full_name}</p>
            <p className="text-sm text-charcoal-600">{order.phone}</p>
            <p className="text-xs text-charcoal-500 mt-2">{order.delivery_address}, {order.delivery_area}</p>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium uppercase text-charcoal-400">Items</p>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image_url} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal-900">{item.name}</p>
                    <p className="text-xs text-charcoal-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal-700">{formatNaira(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t border-charcoal-100 pt-3 flex justify-between">
              <span className="font-semibold text-charcoal-900">Total</span>
              <span className="font-serif text-lg font-bold text-primary-700">{formatNaira(order.grand_total)}</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="input-field"
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
              <Bike size={15} className="inline mr-1" /> Assign Delivery Rider
            </label>
            <input
              value={rider}
              onChange={(e) => setRider(e.target.value)}
              className="input-field"
              placeholder="Enter rider name"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onUpdate(order.id, status, rider)}
              className="btn-primary flex-1"
            >
              Update Order
            </button>
            <button onClick={onClose} className="btn-outline">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
