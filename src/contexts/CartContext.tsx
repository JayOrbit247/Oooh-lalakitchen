import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, MenuItem } from '@/types';
import { DELIVERY_FEE } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  couponCode: string | null;
  applyCoupon: (code: string, discountAmount: number) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = 'olk_cart';
const COUPON_KEY = 'olk_coupon';

interface StoredCoupon {
  code: string;
  discountAmount: number;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<StoredCoupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(COUPON_KEY);
    }
  }, [coupon]);

  const addToCart = (item: MenuItem, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: Number(item.price),
          image_url: item.image_url,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code: string, discountAmount: number) => {
    setCoupon({ code, discountAmount });
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const discount = coupon ? Math.min(coupon.discountAmount, subtotal) : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        couponCode: coupon?.code ?? null,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
