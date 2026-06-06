"use client";

import Link from "next/link";
import { CheckCircle, Home, MessageCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the generated WhatsApp URL we saved right before redirecting
    const url = localStorage.getItem("pendingWhatsAppOrder");
    if (url) {
      setWhatsappUrl(url);
    }
  }, []);

  const handleWhatsAppClick = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
      // Clean up after they click
      localStorage.removeItem("pendingWhatsAppOrder");
    }
  };

  return (
    <>
      {whatsappUrl && (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-sm font-bold py-1 animate-pulse">
          ACTION REQUIRED BELOW
        </div>
      )}

      <div className="flex justify-center mb-6 mt-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle className="w-10 h-10" />
        </div>
      </div>

      <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-2">Order Saved!</h1>
      <p className="text-zinc-500 mb-6 text-lg">
        Your order has been saved in our system.
      </p>

      {orderNumber && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-zinc-500 mb-1">Your Order Reference Number:</p>
          <p className="text-2xl font-bold tracking-wider text-zinc-900">{orderNumber}</p>
        </div>
      )}

      {whatsappUrl ? (
        <div className="border-t border-zinc-200 pt-8 mb-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-3">Final Step ⚠️</h2>
          <p className="text-zinc-600 text-sm mb-6">
            To complete your order and arrange delivery, please send your order details to our Admin on WhatsApp.
          </p>
          <button 
            onClick={handleWhatsAppClick}
            className="w-full px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/30 text-lg animate-bounce"
          >
            <MessageCircle className="w-7 h-7" /> Send to Admin Now
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-8 pt-8 border-t border-zinc-200">
          <Link 
            href="/"
            className="px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      )}
    </>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen pt-40 pb-20 bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-zinc-100 max-w-lg w-full text-center relative overflow-hidden">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-10 h-10 text-zinc-400 animate-spin mb-4" />
            <p className="text-zinc-500 font-medium">Loading your order details...</p>
          </div>
        }>
          <OrderSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
