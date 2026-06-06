"use client";

import { DollarSign, ShoppingBag, Clock } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { API_BASE } from "@/lib/api";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboardPage() {
  const { data: stats, error } = useSWR(`${API_BASE}/orders/stats`, fetcher);

  if (error) return <div className="p-10 text-red-500">Failed to load dashboard</div>;
  if (!stats) return <div className="p-10 text-zinc-500">Loading dashboard data...</div>;

  // Handle aggressive SWR caching where stats might still be a string from previous sessions
  const parsedStats = typeof stats === 'string' ? JSON.parse(stats) : stats;
  const safeStats = parsedStats || {};

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-2">Welcome Back</h1>
        <p className="text-lg text-zinc-500">Here is a quick overview of your business today.</p>
      </div>

      {/* Simple Big Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Link href="/admin/orders" className="block bg-[#D4AF37] hover:bg-[#C5A059] transition-all hover:-translate-y-1 text-white p-8 rounded-xl shadow-md cursor-pointer">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <DollarSign className="w-8 h-8" />
            <h3 className="text-xl font-medium">Total Sales</h3>
          </div>
          <p className="text-4xl font-bold">KSh {(safeStats.totalRevenue || 0).toLocaleString()}</p>
        </Link>

        <Link href="/admin/orders" className="block bg-white hover:bg-zinc-50 transition-all hover:-translate-y-1 p-8 rounded-xl border-2 border-zinc-200 shadow-sm cursor-pointer group">
          <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-zinc-700 transition-colors">
            <ShoppingBag className="w-8 h-8" />
            <h3 className="text-xl font-medium">Total Orders</h3>
          </div>
          <p className="text-4xl font-bold text-zinc-900">{safeStats.totalOrders || 0} Orders</p>
          <span className="text-[#D4AF37] font-bold mt-4 inline-block group-hover:underline">
            View all orders →
          </span>
        </Link>

        <Link href="/admin/custom-requests" className="block bg-white hover:bg-zinc-50 transition-all hover:-translate-y-1 p-8 rounded-xl border-2 border-zinc-200 shadow-sm cursor-pointer group">
          <div className="flex items-center gap-3 mb-4 text-zinc-500 group-hover:text-zinc-700 transition-colors">
            <Clock className="w-8 h-8 text-orange-500" />
            <h3 className="text-xl font-medium text-orange-500">Custom Requests</h3>
          </div>
          <p className="text-4xl font-bold text-zinc-900">{safeStats.pendingRequests || 0} Pending</p>
          <span className="text-orange-500 font-bold mt-4 inline-block group-hover:underline">
            Review requests →
          </span>
        </Link>
      </div>

      {/* Very Simple Recent Activity */}
      <div className="bg-white rounded-xl border-2 border-zinc-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-zinc-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-6">
          {(!safeStats.recentActivity || safeStats.recentActivity.length === 0) ? (
            <p className="text-zinc-500">No recent activity yet.</p>
          ) : (
            safeStats.recentActivity.map((activity: any, i: number) => (
              <Link href="/admin/orders" key={i} className="flex items-center gap-4 border-b border-zinc-100 pb-6 last:border-0 last:pb-0 hover:bg-zinc-50 p-4 -mx-4 rounded-xl transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-900">New order from {activity.customerName}</p>
                  <p className="text-zinc-500">KSh {(activity.subtotal || 0).toLocaleString()} • {new Date(activity.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
