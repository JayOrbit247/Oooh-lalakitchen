import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Circle,
  Package,
  ChefHat,
  Flame,
  Box,
  PackageCheck,
  Bike,
  Home,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatNaira, formatDate } from '@/lib/utils';
import type { Order, OrderStatus, OrderItem } from '@/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS } from '@/types';

const statusIcons: Record<OrderStatus, typeof Package> = {
  received: Package,
  preparing: ChefHat,
  cooking: Flame,
  packaging: Box,
  ready: PackageCheck,
  dispatch: Bike,
  on_the_way: Bike,
  delivered: Home,
  cancelled: Package,
};

export default function OrderTrackingPage() {
  const { orderNumber } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderNumber || !user) {
      setLoading(false);
      return;
    }

    async function fetchOrder() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const orderData = data as Order;
      setOrder(orderData);

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderData.id);
      setOrderItems((items as OrderItem[]) ?? []);
      setLoading(false);
    }

    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderNumber, user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-charcoal-400">Loading order...</div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-2xl font-bold text-charcoal-900">Order Not Found</h2>
        <p className="mt-2 text-charcoal-600">We couldn't find this order. Please check the order number.</p>
        <Link to="/account" className="mt-6 btn-primary">View My Orders</Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="container-padding px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-primary-600"
        >
          <ArrowLeft size={18} />
          Back to Account
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Tracking Timeline */}
          <div>
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-charcoal-900">
                    Order Tracking
                  </h1>
                  <p className="mt-1 text-sm text-charcoal-500">Order #{order.order_number}</p>
                  <p className="mt-0.5 text-xs text-charcoal-400">
                    Placed on {formatDate(order.placed_at)}
                  </p>
                </div>
                <div className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isCancelled
                    ? 'bg-error-100 text-error-700'
                    : 'bg-success-100 text-success-700'
                }`}>
                  {isCancelled ? 'Order Cancelled' : ORDER_STATUS_LABELS[order.status]}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                {ORDER_STATUS_STEPS.map((status, index) => {
                  const Icon = statusIcons[status];
                  const isCompleted = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex && !isCancelled;
                  const isPending = index > currentStepIndex || isCancelled;

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                            isCompleted
                              ? 'bg-success-500 text-white'
                              : isCurrent
                              ? 'bg-primary-600 text-white ring-4 ring-primary-100 animate-pulse'
                              : 'bg-charcoal-100 text-charcoal-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={22} />
                          ) : (
                            <Icon size={20} />
                          )}
                        </div>
                        {index < ORDER_STATUS_STEPS.length - 1 && (
                          <div
                            className={`my-1 h-12 w-0.5 ${
                              isCompleted ? 'bg-success-500' : 'bg-charcoal-100'
                            }`}
                          />
                        )}
                      </div>

                      <div className="pb-2 pt-2.5">
                        <p
                          className={`text-sm font-semibold ${
                            isCompleted
                              ? 'text-charcoal-900'
                              : isCurrent
                              ? 'text-primary-700'
                              : 'text-charcoal-400'
                          }`}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </p>
                        {isCurrent && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-primary-600">
                            <Clock size={12} />
                            In progress...
                          </p>
                        )}
                        {isCompleted && (
                          <p className="mt-0.5 text-xs text-success-600">Completed</p>
                        )}
                        {isPending && (
                          <p className="mt-0.5 text-xs text-charcoal-400">Pending</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.assigned_rider && (
              <div className="card mt-4 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Bike size={24} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Delivery Rider</p>
                    <p className="text-sm text-charcoal-600">{order.assigned_rider}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="font-serif text-lg font-bold text-charcoal-900">Order Details</h2>

              <div className="mt-4 space-y-3">
                {orderItems.map((item) => (
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
                  <span className="font-semibold">{formatNaira(order.items_total)}</span>
                </div>
                <div className="flex justify-between text-charcoal-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{formatNaira(order.delivery_fee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatNaira(order.discount)}</span>
                  </div>
                )}
              </div>

              <hr className="my-4 border-charcoal-100" />

              <div className="flex justify-between">
                <span className="font-serif text-lg font-semibold">Total</span>
                <span className="font-serif text-xl font-bold text-primary-700">
                  {formatNaira(order.grand_total)}
                </span>
              </div>

              <hr className="my-4 border-charcoal-100" />

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase text-charcoal-400">Delivery Address</p>
                  <p className="mt-0.5 text-charcoal-700">{order.delivery_address}</p>
                  {order.delivery_area && (
                    <p className="text-charcoal-500">{order.delivery_area}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-charcoal-400">Payment Method</p>
                  <p className="mt-0.5 capitalize text-charcoal-700">
                    {order.payment_method.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
