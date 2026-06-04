"use client";

import useSWR, { mutate } from "swr";
import { Loader2, MessageCircle, Ruler, ClipboardList } from "lucide-react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
};

const STATUS_OPTIONS = [
  { value: "New", label: "🔴 Needs Reply", color: "bg-red-100 text-red-700" },
  { value: "Quoted", label: "🔵 Quoted", color: "bg-blue-100 text-blue-700" },
  { value: "Accepted", label: "🟡 Accepted", color: "bg-yellow-100 text-yellow-700" },
  { value: "Completed", label: "🟢 Completed", color: "bg-green-100 text-green-700" },
  { value: "Rejected", label: "⚫ Rejected", color: "bg-zinc-100 text-zinc-600" },
];

function getStatusStyle(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status)?.color ?? "bg-zinc-100 text-zinc-600";
}

export default function AdminCustomRequestsPage() {
  const API = "http://localhost:5000/api/requests";
  const { data: rawRequests, error, isLoading } = useSWR(API, fetcher);
  const requests: any[] = Array.isArray(rawRequests) ? rawRequests : [];

  const handleStatusChange = async (id: string, newStatus: string) => {
    mutate(API, requests.map(r => r.id === id ? { ...r, status: newStatus } : r), false);
    try {
      await fetch(`http://localhost:5000/api/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      alert("Failed to update status. Please try again.");
    }
    mutate(API);
  };

  const formatWhatsApp = (phone: string) => {
    const clean = phone.replace(/\D/g, "");
    return clean.startsWith("254") ? clean : clean.replace(/^0/, "254");
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Custom Requests</h1>
          <p className="text-zinc-500 mt-1">
            {isLoading ? "Loading..." : `${requests.length} request${requests.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
          <p>Loading requests...</p>
        </div>
      ) : error ? (
        <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">
          Failed to load requests. Please check your backend server is running.
        </div>
      ) : requests.length === 0 ? (
        <div className="p-16 text-center bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200">
          <ClipboardList className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-xl font-medium text-zinc-500">No custom requests yet</p>
          <p className="text-zinc-400 mt-1">Customer quote requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => {
            const photos: string[] = Array.isArray(req.photos) ? req.photos : [];
            return (
              <div key={req.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-zinc-50 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(req.status)}`}>
                      {STATUS_OPTIONS.find(s => s.value === req.status)?.label ?? req.status}
                    </span>
                    <span className="text-zinc-400 text-sm">
                      {new Date(req.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    className="p-2 rounded-lg border border-zinc-300 text-sm font-medium focus:outline-none focus:border-[#D4AF37] bg-white"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer */}
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Customer</p>
                    <p className="font-bold text-zinc-900 text-lg">{req.customerName}</p>
                    <a href={`tel:${req.phoneNumber}`} className="flex items-center gap-1 text-[#D4AF37] font-medium mt-1 hover:underline">
                      📞 {req.phoneNumber}
                    </a>
                    {req.email && <p className="text-zinc-500 text-sm mt-1">{req.email}</p>}
                  </div>

                  {/* Measurements */}
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Measurements</p>
                    <div className="flex items-center gap-2 text-zinc-700 mb-1">
                      <Ruler className="w-4 h-4 text-zinc-400" />
                      <span>Room: <strong>{req.roomType}</strong></span>
                    </div>
                    <p className="text-zinc-600 text-sm">Width: <strong>{req.windowWidth}m</strong></p>
                    <p className="text-zinc-600 text-sm">Height: <strong>{req.windowHeight}m</strong></p>
                    {req.notes && (
                      <p className="text-zinc-500 text-sm mt-3 italic border-l-2 border-zinc-200 pl-3">"{req.notes}"</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 justify-start">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Actions</p>
                    <a
                      href={`https://wa.me/${formatWhatsApp(req.phoneNumber)}?text=Hello ${req.customerName}, thank you for your custom curtain request. I'd like to discuss your requirements for ${req.roomType} (${req.windowWidth}m × ${req.windowHeight}m).`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4" /> Reply on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Photos */}
                {photos.length > 0 && (
                  <div className="px-6 pb-6 border-t border-zinc-100 pt-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-3">Room Photos</p>
                    <div className="flex flex-wrap gap-3">
                      {photos.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200 hover:border-[#D4AF37] transition-colors block">
                          <img src={url} alt={`Room photo ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
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
