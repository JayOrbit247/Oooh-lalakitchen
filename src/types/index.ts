export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  gallery: string[];
  ingredients: string[];
  nutrition_info: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  prep_time: string;
  rating: number;
  review_count: number;
  is_popular: boolean;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  category?: Category;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  quantity: number;
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'cooking'
  | 'packaging'
  | 'ready'
  | 'dispatch'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'paystack' | 'flutterwave' | 'bank_transfer' | 'cash_on_delivery';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  items_total: number;
  delivery_fee: number;
  discount: number;
  grand_total: number;
  payment_method: PaymentMethod;
  payment_status: string;
  full_name: string;
  phone: string;
  email: string;
  delivery_address: string;
  landmark: string;
  delivery_notes: string;
  delivery_area: string;
  assigned_rider: string;
  placed_at: string;
  delivered_at: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address: string;
  landmark: string;
  area: string;
  is_default: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_discount: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  photo_url: string;
  rating: number;
  review_text: string;
  location: string;
  is_featured: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface Favorite {
  id: string;
  user_id: string;
  menu_item_id: string;
  created_at: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Order Received',
  preparing: 'Preparing Order',
  cooking: 'Cooking',
  packaging: 'Packaging',
  ready: 'Ready For Dispatch',
  dispatch: 'Dispatch Started',
  on_the_way: 'On The Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'received',
  'preparing',
  'cooking',
  'packaging',
  'ready',
  'dispatch',
  'on_the_way',
  'delivered',
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
  bank_transfer: 'Bank Transfer',
  cash_on_delivery: 'Cash On Delivery',
};

export const DELIVERY_AREAS = [
  'Agbelekale',
  'Ekoro Road',
  'Ayobo',
  'White-House',
  'Megida',
];

export const DELIVERY_FEE = 1000;
