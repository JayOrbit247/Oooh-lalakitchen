import { useState, useRef, useEffect } from 'react';
import {
  UtensilsCrossed,
  MessageCircle,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  X,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

interface MenuPriceOption {
  label: string;
  price: number;
}

interface MenuItemDef {
  name: string;
  options: MenuPriceOption[];
}

interface MenuSection {
  title: string;
  items: MenuItemDef[];
}

const menuSections: MenuSection[] = [
  {
    title: 'Main Dishes',
    items: [
      {
        name: 'Chicken',
        options: [
          { label: 'Small', price: 2000 },
          { label: 'Medium', price: 3000 },
          { label: 'Large', price: 4000 },
        ],
      },
      {
        name: 'Turkey',
        options: [
          { label: 'Small', price: 2000 },
          { label: 'Medium', price: 3000 },
          { label: 'Large', price: 4000 },
        ],
      },
    ],
  },
  {
    title: 'Sides & Extras',
    items: [
      { name: 'Coleslaw', options: [{ label: 'Regular', price: 500 }] },
      { name: 'Moimoi', options: [{ label: 'Regular', price: 500 }] },
      { name: 'Egg', options: [{ label: 'Regular', price: 300 }] },
      { name: 'Fried Meat', options: [{ label: 'Regular', price: 300 }] },
      { name: 'Beef', options: [{ label: 'Regular', price: 300 }] },
      { name: 'Pomo', options: [{ label: 'Regular', price: 300 }] },
      { name: 'Takeaway Pack', options: [{ label: 'Regular', price: 300 }] },
      { name: 'Plantain', options: [{ label: 'Regular', price: 200 }] },
    ],
  },
];

function formatNaira(amount: number): string {
  return `\u20a6${amount.toLocaleString()}`;
}

interface CartLine {
  id: string;
  name: string;
  optionLabel: string;
  price: number;
  quantity: number;
}

const WHATSAPP_NUMBER = '2348117926084';

interface CheckoutForm {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
}

const emptyForm: CheckoutForm = {
  fullName: '',
  phone: '',
  address: '',
  notes: '',
};

export default function MenuPage() {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>(emptyForm);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [cartBarVisible, setCartBarVisible] = useState(false);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartBarVisible(cart.length > 0);
  }, [cart]);

  const getQty = (key: string) => quantities[key] ?? 0;
  const incQty = (key: string) =>
    setQuantities((p) => ({ ...p, [key]: (p[key] ?? 0) + 1 }));
  const decQty = (key: string) =>
    setQuantities((p) => ({ ...p, [key]: Math.max(0, (p[key] ?? 0) - 1) }));

  const getOption = (itemName: string) => {
    const idx = selectedOptions[itemName] ?? 0;
    return menuSections
      .flatMap((s) => s.items)
      .find((i) => i.name === itemName)?.options[idx] ?? { label: '', price: 0 };
  };

  const getCartKey = (itemName: string, optionLabel: string) =>
    `${itemName}__${optionLabel}`;

  const addToCart = (itemName: string) => {
    const option = getOption(itemName);
    const key = getCartKey(itemName, option.label);
    const qty = getQty(key);
    if (qty === 0) {
      showToast('Please select a quantity first');
      return;
    }
    const existing = cart.find((c) => c.id === key);
    if (existing) {
      setCart((prev) =>
        prev.map((c) => (c.id === key ? { ...c, quantity: c.quantity + qty } : c))
      );
    } else {
      setCart((prev) => [
        ...prev,
        { id: key, name: itemName, optionLabel: option.label, price: option.price, quantity: qty },
      ]);
    }
    setQuantities((p) => ({ ...p, [key]: 0 }));
    showToast(`${qty}x ${itemName} added to cart`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalAmount = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
    setOrderSubmitted(false);
    setTimeout(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const buildOrderSummary = () => {
    const lines = cart.map(
      (c) => `${c.quantity}x ${c.name}${c.optionLabel !== 'Regular' ? ` (${c.optionLabel})` : ''} - ${formatNaira(c.price * c.quantity)}`
    );
    lines.push('');
    lines.push(`Total: ${formatNaira(totalAmount)}`);
    return lines.join('\n');
  };

  const buildWhatsAppMessage = () => {
    const parts = [
      'Hello Oooh-Lala Kitchen, I would like to place the following order:',
      '',
      ...cart.map(
        (c) =>
          `${c.quantity}x ${c.name}${c.optionLabel !== 'Regular' ? ` (${c.optionLabel})` : ''} - ${formatNaira(c.price * c.quantity)}`
      ),
      '',
      `Total: ${formatNaira(totalAmount)}`,
      '',
      'Delivery Details:',
      `Name: ${checkoutForm.fullName}`,
      `Phone: ${checkoutForm.phone}`,
      `Address: ${checkoutForm.address}`,
      checkoutForm.notes ? `Notes: ${checkoutForm.notes}` : '',
    ].filter(Boolean);
    return parts.join('\n');
  };

  const handleWhatsAppOrder = () => {
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
      showToast('Please fill in your name, phone, and address');
      return;
    }
    const message = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    setOrderSubmitted(true);
    showToast('Order sent via WhatsApp!');
  };

  const handleOnlineOrder = () => {
    if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
      showToast('Please fill in your name, phone, and address');
      return;
    }
    setOrderSubmitted(true);
    showToast('Order submitted successfully!');
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    if (orderSubmitted) {
      setCart([]);
      setCheckoutForm(emptyForm);
      setOrderSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-50 pb-24">
      {/* Page Header */}
      <div className="gradient-charcoal py-16 text-white">
        <div className="container-padding px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/20 ring-1 ring-gold-500/30">
            <UtensilsCrossed size={26} className="text-gold-400" />
          </div>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            Oooh-Lala Kitchen Menu
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Freshly Prepared Meals Available for Order
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container-padding px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-10">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                  {section.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary-300 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {section.items.map((item) => {
                  const selectedIdx = selectedOptions[item.name] ?? 0;
                  const option = item.options[selectedIdx];
                  const cartKey = getCartKey(item.name, option.label);
                  const qty = getQty(cartKey);

                  return (
                    <div
                      key={item.name}
                      className="card card-hover flex flex-col gap-3 p-5"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-serif text-lg font-semibold text-charcoal-900">
                          {item.name}
                        </h3>
                        {item.options.length > 1 ? (
                          <span className="text-xs font-medium uppercase tracking-wide text-charcoal-400">
                            {item.options.length} sizes
                          </span>
                        ) : (
                          <span className="font-serif text-xl font-bold text-primary-600">
                            {formatNaira(option.price)}
                          </span>
                        )}
                      </div>

                      {/* Size selector for multi-option items */}
                      {item.options.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                          {item.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                setSelectedOptions((p) => ({ ...p, [item.name]: idx }))
                              }
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                selectedIdx === idx
                                  ? 'bg-primary-600 text-white shadow-sm'
                                  : 'bg-charcoal-50 text-charcoal-600 hover:bg-charcoal-100'
                              }`}
                            >
                              {opt.label}
                              <span className="ml-1.5 opacity-80">{formatNaira(opt.price)}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Quantity selector + Add to Cart */}
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decQty(cartKey)}
                            disabled={qty === 0}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-charcoal-100 text-charcoal-700 transition-all hover:bg-charcoal-200 active:scale-90 disabled:opacity-30"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="min-w-[2rem] text-center font-serif text-lg font-semibold text-charcoal-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => incQty(cartKey)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 transition-all hover:bg-primary-200 active:scale-90"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => addToCart(item.name)}
                          disabled={qty === 0}
                          className="btn-primary !px-5 !py-2.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={14} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Checkout Section */}
          {showCheckout && (
            <div ref={checkoutRef} className="mt-8 scroll-mt-4">
              {orderSubmitted ? (
                <div className="card p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                    <Check size={32} className="text-success-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal-900">
                    Order Placed Successfully!
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-600">
                    Thank you for your order. We'll confirm your delivery details and prepare your
                    meals fresh. You will be contacted shortly.
                  </p>
                  <button
                    onClick={handleCloseCheckout}
                    className="mt-6 btn-primary"
                  >
                    Back to Menu
                  </button>
                </div>
              ) : (
                <div className="card overflow-hidden">
                  {/* Order Summary */}
                  <div className="border-b border-charcoal-100 bg-gradient-to-r from-primary-50 to-transparent px-6 py-5">
                    <h2 className="font-serif text-xl font-bold text-charcoal-900">
                      Order Summary
                    </h2>
                  </div>

                  <div className="px-6 py-5">
                    {cart.length === 0 ? (
                      <p className="py-8 text-center text-sm text-charcoal-500">
                        Your cart is empty. Add items from the menu above.
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {cart.map((line) => (
                            <div
                              key={line.id}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-charcoal-800">
                                  {line.name}
                                  {line.optionLabel !== 'Regular' && (
                                    <span className="text-charcoal-400"> ({line.optionLabel})</span>
                                  )}
                                </p>
                                <p className="text-xs text-charcoal-500">
                                  {formatNaira(line.price)} each
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateCartQty(line.id, -1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-md bg-charcoal-100 text-charcoal-700 transition-all hover:bg-charcoal-200 active:scale-90"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="min-w-[1.5rem] text-center text-sm font-semibold text-charcoal-900">
                                  {line.quantity}
                                </span>
                                <button
                                  onClick={() => updateCartQty(line.id, 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-100 text-primary-700 transition-all hover:bg-primary-200 active:scale-90"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <span className="min-w-[5rem] text-right font-serif text-sm font-semibold text-charcoal-900">
                                {formatNaira(line.price * line.quantity)}
                              </span>
                              <button
                                onClick={() => removeFromCart(line.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-charcoal-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-charcoal-100 pt-4">
                          <span className="font-serif text-base font-semibold text-charcoal-900">
                            Total Amount
                          </span>
                          <span className="font-serif text-2xl font-bold text-primary-600">
                            {formatNaira(totalAmount)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Delivery Details Form */}
                  {cart.length > 0 && (
                    <div className="border-t border-charcoal-100 px-6 py-5">
                      <h3 className="mb-4 font-serif text-lg font-semibold text-charcoal-900">
                        Delivery Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={checkoutForm.fullName}
                            onChange={(e) =>
                              setCheckoutForm((p) => ({ ...p, fullName: e.target.value }))
                            }
                            placeholder="Enter your full name"
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={checkoutForm.phone}
                            onChange={(e) =>
                              setCheckoutForm((p) => ({ ...p, phone: e.target.value }))
                            }
                            placeholder="Enter your phone number"
                            className="input-field"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                            Delivery Address
                          </label>
                          <input
                            type="text"
                            value={checkoutForm.address}
                            onChange={(e) =>
                              setCheckoutForm((p) => ({ ...p, address: e.target.value }))
                            }
                            placeholder="Enter your delivery address"
                            className="input-field"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">
                            Additional Notes
                          </label>
                          <textarea
                            value={checkoutForm.notes}
                            onChange={(e) =>
                              setCheckoutForm((p) => ({ ...p, notes: e.target.value }))
                            }
                            placeholder="Any special instructions or notes for your order..."
                            rows={3}
                            className="input-field resize-none"
                          />
                        </div>
                      </div>

                      {/* Checkout Buttons */}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={handleWhatsAppOrder}
                          className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-green-600 to-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/40 active:scale-95"
                        >
                          <MessageCircle size={18} />
                          Order on WhatsApp
                        </button>
                        <button
                          onClick={handleOnlineOrder}
                          className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-primary-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-600/30 transition-all duration-300 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/40 active:scale-95"
                        >
                          <Check size={18} />
                          Submit Order Online
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-charcoal-100 bg-charcoal-50 px-6 py-3 text-right">
                    <button
                      onClick={handleCloseCheckout}
                      className="text-sm font-medium text-charcoal-500 transition-colors hover:text-charcoal-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          cartBarVisible && !showCheckout
            ? 'translate-y-0'
            : 'translate-y-full'
        }`}
      >
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-charcoal-900 px-5 py-4 shadow-2xl ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white">
                <ShoppingCart size={22} />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gold-500 px-1 text-xs font-bold text-charcoal-900">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-white/60">
                  {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
                </p>
                <p className="font-serif text-lg font-bold text-white">
                  {formatNaira(totalAmount)}
                </p>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-charcoal-900 shadow-lg transition-all duration-300 hover:bg-gold-400 active:scale-95"
            >
              Checkout
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
