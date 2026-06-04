"use client";

import useSWR, { mutate } from "swr";
import { Loader2, PhoneCall, MapPin, Package, Trash2 } from "lucide-react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
};

const STATUS_OPTIONS = [
  { value: "New", label: "🔴 New", color: "bg-red-100 text-red-700" },
  { value: "Contacted", label: "🔵 Contacted", color: "bg-blue-100 text-blue-700" },
  { value: "Processing", label: "🟡 Processing", color: "bg-yellow-100 text-yellow-700" },
  { value: "Completed", label: "🟢 Completed", color: "bg-green-100 text-green-700" },
  { value: "Cancelled", label: "⚫ Cancelled", color: "bg-zinc-100 text-zinc-600" },
];

function getStatusStyle(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status)?.color ?? "bg-zinc-100 text-zinc-600";
}

export default function AdminOrdersPage() {
  const API = "http://localhost:5000/api/orders";
  const { data: rawOrders, error, isLoading } = useSWR(API, fetcher);
  const orders: any[] = Array.isArray(rawOrders) ? rawOrders : [];

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(p);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic update
    mutate(API, orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o), false);
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      alert("Failed to update status. Please try again.");
    }
    mutate(API);
    mutate("http://localhost:5000/api/orders/stats");
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to permanently delete this order?")) return;
    
    // Optimistic update
    mutate(API, orders.filter(o => o.id !== orderId), false);
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "DELETE",
      });
      mutate(API);
      mutate("http://localhost:5000/api/orders/stats");
    } catch {
      alert("Failed to delete order. Please try again.");
      mutate(API);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Orders</h1>
          <p className="text-zinc-500 mt-1">
            {isLoading ? "Loading..." : `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
          <p>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">
          Failed to load orders. Please check your backend server is running.
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-xl font-medium text-zinc-500">No orders yet</p>
          <p className="text-zinc-400 mt-1">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const items: any[] = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-zinc-50 border-b border-zinc-100">
                  <div>
                    <span className="font-bold text-[#D4AF37] text-sm">{order.orderNumber}</span>
                    <span className="text-zinc-400 text-sm ml-3">{new Date(order.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer */}
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Customer</p>
                    <p className="font-bold text-zinc-900 text-lg">{order.customerName}</p>
                    <a href={`tel:${order.phoneNumber}`} className="flex items-center gap-1 text-[#D4AF37] font-medium mt-1 hover:underline">
                      <PhoneCall className="w-4 h-4" /> {order.phoneNumber}
                    </a>
                    {order.email && <p className="text-zinc-500 text-sm mt-1">{order.email}</p>}
                  </div>

                  {/* Delivery */}
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Delivery Address</p>
                    <div className="flex items-start gap-1 text-zinc-700">
                      <MapPin className="w-4 h-4 mt-0.5 text-zinc-400 flex-shrink-0" />
                      <span>{order.address}, {order.town}, {order.county}</span>
                    </div>
                    {order.notes && (
                      <p className="text-zinc-500 text-sm mt-2 italic">"{order.notes}"</p>
                    )}
                  </div>

                  {/* Amount & Status Control */}
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Order Total</p>
                    <p className="text-2xl font-bold text-zinc-900 mb-1">{formatPrice(order.subtotal)}</p>
                    <p className="text-zinc-500 text-sm mb-4">{items.length} item{items.length !== 1 ? "s" : ""}</p>

                    <label className="block text-xs text-zinc-400 uppercase tracking-wider mb-1">Update Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="w-full p-2 rounded-lg border border-zinc-300 text-sm font-medium focus:outline-none focus:border-[#D4AF37] bg-white"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items breakdown */}
                {items.length > 0 && (
                  <div className="px-6 pb-4 border-t border-zinc-100 pt-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Items Ordered</p>
                    <div className="space-y-1">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm text-zinc-700">
                          <span>{item.name} — {item.color} × {item.meters}m</span>
                          <span className="font-medium">{formatPrice(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
