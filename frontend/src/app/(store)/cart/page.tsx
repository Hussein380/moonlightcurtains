"use client";

import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartPage() {
  // Fix hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen pt-32 pb-20 bg-zinc-50" />;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Your Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-zinc-100">
            <p className="text-zinc-500 mb-6 text-lg">Your cart is completely empty.</p>
            <Link 
              href="/"
              className="inline-block bg-[#D4AF37] hover:bg-[#C5A059] text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-zinc-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400 text-center p-2 border border-dashed border-zinc-300 rounded-xl">No Image</div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-zinc-900">{item.name}</h3>
                        <p className="text-sm text-zinc-500">Color: {item.color} {item.quality && `| Quality: ${item.quality}`}</p>
                      </div>
                      <button 
                        onClick={() => cart.removeItem(item.id)}
                        className="text-red-400 hover:text-red-500 transition-colors p-2"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-3 border border-zinc-200 rounded-lg p-1 bg-zinc-50">
                        <button 
                          onClick={() => item.meters > 1 && cart.updateMeters(item.id, item.meters - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.meters}m</span>
                        <button 
                          onClick={() => cart.updateMeters(item.id, item.meters + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-zinc-200 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-zinc-500">{formatPrice(item.pricePerMeter)} / meter</p>
                        <p className="font-bold text-lg text-[#D4AF37]">{formatPrice(item.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 sticky top-32">
                <h2 className="text-xl font-bold font-serif mb-6 border-b pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-zinc-900">{formatPrice(cart.getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery</span>
                    <span className="text-zinc-500 text-xs">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-[#D4AF37]">{formatPrice(cart.getCartTotal())}</span>
                  </div>
                  <p className="text-xs text-zinc-500 text-right">Taxes included if applicable</p>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Link>
                
                <div className="mt-4 text-center">
                  <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
