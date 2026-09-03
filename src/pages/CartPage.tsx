import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  X,
  ArrowRight,
  Truck,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatNaira, buildWhatsAppCartLink } from '@/lib/utils';
import type { Coupon } from '@/types';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    const coupon = data as Coupon | null;

    if (!coupon) {
      setCouponError('Invalid coupon code');
      setCouponLoading(false);
      return;
    }

    if (coupon.min_order > subtotal) {
      setCouponError(`Minimum order of ${formatNaira(coupon.min_order)} required`);
      setCouponLoading(false);
      return;
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.max_discount > 0) {
        discountAmount = Math.min(discountAmount, coupon.max_discount);
      }
    } else {
      discountAmount = coupon.value;
    }

    applyCoupon(coupon.code, discountAmount);
    setCouponInput('');
    setCouponLoading(false);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-charcoal-50">
        <div className="container-padding flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md">
            <ShoppingBag size={40} className="text-charcoal-300" />
          </div>
          <h2 className="mt-6 font-serif text-2xl font-bold text-charcoal-900">
            Your Cart is Empty
          </h2>
          <p className="mt-2 text-charcoal-600">
            Browse our menu and add some delicious meals to your cart.
          </p>
          <Link to="/menu" className="mt-8 btn-primary">
            Explore Menu
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">Your Cart</h1>
        <p className="mt-2 text-charcoal-600">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card flex items-center gap-4 p-4"
              >
                <Link to={`/food/${item.slug}`}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-20 w-20 rounded-xl object-cover sm:h-24 sm:w-24"
                  />
                </Link>

                <div className="flex-1">
                  <Link
                    to={`/food/${item.slug}`}
                    className="font-serif text-lg font-semibold text-charcoal-900 transition-colors hover:text-primary-600"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-charcoal-500">{formatNaira(item.price)} each</p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-charcoal-200 bg-white p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-charcoal-100"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-700 transition-colors hover:bg-charcoal-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 text-sm text-error-500 transition-colors hover:text-error-700"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-serif text-lg font-bold text-primary-700">
                    {formatNaira(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={clearCart}
                className="text-sm font-medium text-error-500 transition-colors hover:text-error-700"
              >
                Clear Cart
              </button>
              <Link
                to="/menu"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Order Summary</h2>

              {/* Coupon */}
              <div className="mt-4">
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-xl bg-success-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-success-700">
                      <Tag size={16} />
                      {couponCode}
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-success-700 hover:text-success-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter code"
                        className="input-field flex-1"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="rounded-xl bg-charcoal-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-charcoal-900 disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="mt-1.5 text-xs text-error-600">{couponError}</p>
                    )}
                    <p className="mt-2 text-xs text-charcoal-400">
                      Try: WELCOME10, WEEKEND15, FLAT500
                    </p>
                  </>
                )}
              </div>

              <hr className="my-4 border-charcoal-100" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal-900">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span className="flex items-center gap-1">
                    <Truck size={15} />
                    Delivery Fee
                  </span>
                  <span className="font-semibold text-charcoal-900">{formatNaira(deliveryFee)}</span>
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
                <span className="font-serif text-lg font-semibold text-charcoal-900">Grand Total</span>
                <span className="font-serif text-2xl font-bold text-primary-700">
                  {formatNaira(grandTotal)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full btn-primary text-base"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              <a
                href={buildWhatsAppCartLink(items, grandTotal)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#25D366]/20 transition-all duration-300 hover:bg-[#1da851] hover:shadow-lg active:scale-95"
              >
                <MessageCircle size={18} />
                Order on WhatsApp
              </a>

              {!user && (
                <p className="mt-3 text-center text-xs text-charcoal-500">
                  You'll need to sign in to complete your order.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
