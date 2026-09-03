import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Banknote,
  Building2,
  Wallet,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { formatNaira, generateOrderNumber } from '@/lib/utils';
import { DELIVERY_AREAS, type PaymentMethod } from '@/types';

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { value: 'paystack', label: 'Paystack', icon: CreditCard, desc: 'Pay with card via Paystack' },
  { value: 'flutterwave', label: 'Flutterwave', icon: Wallet, desc: 'Pay with Flutterwave' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2, desc: 'Transfer to our bank account' },
  { value: 'cash_on_delivery', label: 'Cash On Delivery', icon: Banknote, desc: 'Pay with cash on arrival' },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, discount, grandTotal, clearCart, couponCode } = useCart();
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    email: user?.email ?? '',
    delivery_address: '',
    landmark: '',
    delivery_notes: '',
    delivery_area: '',
    payment_method: 'cash_on_delivery' as PaymentMethod,
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          status: 'received',
          items_total: subtotal,
          delivery_fee: deliveryFee,
          discount,
          grand_total: grandTotal,
          payment_method: form.payment_method,
          payment_status: form.payment_method === 'cash_on_delivery' ? 'pending' : 'pending',
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          delivery_address: form.delivery_address,
          landmark: form.landmark,
          delivery_notes: form.delivery_notes,
          delivery_area: form.delivery_area,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      if (couponCode) {
        await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode });
      }

      clearCart();
      setSuccess(orderNumber);
      showToast('Order placed successfully!');
    } catch (err) {
      showToast('Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] bg-charcoal-50">
        <div className="container-padding flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success-100">
            <CheckCircle size={48} className="text-success-600" />
          </div>
          <h2 className="mt-6 font-serif text-3xl font-bold text-charcoal-900">Order Placed!</h2>
          <p className="mt-3 text-charcoal-600">
            Your order has been received and is being processed.
          </p>
          <div className="mt-6 rounded-xl bg-white px-8 py-4 shadow-md">
            <p className="text-sm text-charcoal-500">Order Number</p>
            <p className="font-serif text-2xl font-bold text-primary-700">{success}</p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to={`/track/${success}`} className="btn-primary">
              Track Your Order
              <ArrowRight size={18} />
            </Link>
            <Link to="/menu" className="btn-outline">
              Continue Ordering
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Your Cart is Empty</h2>
        <p className="mt-2 text-charcoal-600">Add items to your cart before checking out.</p>
        <Link to="/menu" className="mt-6 btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-primary-600"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

        <h1 className="font-serif text-3xl font-bold text-charcoal-900">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Delivery Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Delivery Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Full Name *</label>
                  <input
                    required
                    value={form.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Phone Number *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="input-field"
                    placeholder="0812 345 6789"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Delivery Area *</label>
                  <select
                    required
                    value={form.delivery_area}
                    onChange={(e) => handleChange('delivery_area', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select your area</option>
                    {DELIVERY_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Delivery Address *</label>
                  <textarea
                    required
                    value={form.delivery_address}
                    onChange={(e) => handleChange('delivery_address', e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="House number, street name, area details..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Landmark</label>
                  <input
                    value={form.landmark}
                    onChange={(e) => handleChange('landmark', e.target.value)}
                    className="input-field"
                    placeholder="Nearby landmark"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Delivery Notes</label>
                  <input
                    value={form.delivery_notes}
                    onChange={(e) => handleChange('delivery_notes', e.target.value)}
                    className="input-field"
                    placeholder="Special instructions"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Payment Method</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                      form.payment_method === method.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-charcoal-200 hover:border-charcoal-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={form.payment_method === method.value}
                      onChange={(e) => handleChange('payment_method', e.target.value)}
                      className="sr-only"
                    />
                    <method.icon
                      size={24}
                      className={form.payment_method === method.value ? 'text-primary-600' : 'text-charcoal-400'}
                    />
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{method.label}</p>
                      <p className="text-xs text-charcoal-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Order Summary</h2>

              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal-900">{item.name}</p>
                      <p className="text-xs text-charcoal-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-charcoal-700">
                      {formatNaira(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-charcoal-100" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{formatNaira(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatNaira(discount)}</span>
                  </div>
                )}
              </div>

              <hr className="my-4 border-charcoal-100" />

              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold text-primary-700">
                  {formatNaira(grandTotal)}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full btn-primary text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
