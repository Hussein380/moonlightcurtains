"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

interface MeterCalculatorProps {
  productId: string;
  productName: string;
  productImage: string;
  pricePerMeter: number;
  selectedColor: string;
  selectedQuality?: string;
}

export function MeterCalculator({
  productId,
  productName,
  productImage,
  pricePerMeter,
  selectedColor,
  selectedQuality,
}: MeterCalculatorProps) {
  const [meters, setMeters] = useState(5);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const total = meters * pricePerMeter;

  const handleDecrease = () => setMeters(Math.max(1, meters - 1));
  const handleIncrease = () => setMeters(meters + 1);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(p);

  const handleAddToCart = () => {
    const cartId = `${productId}-${selectedColor}-${selectedQuality ?? "default"}`;
    addItem({
      id: cartId,
      productId,
      name: productName,
      image: productImage,
      pricePerMeter,
      meters,
      color: selectedColor,
      quality: selectedQuality,
      totalPrice: meters * pricePerMeter,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <span className="text-zinc-600 font-medium">Price Per Meter</span>
        <span className="text-lg font-bold text-[#D4AF37]">{formatPrice(pricePerMeter)}</span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-700 mb-2">Required Meters</label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleDecrease}
            className="w-12 h-12 flex items-center justify-center border border-zinc-300 rounded-l-md bg-white hover:bg-zinc-100 transition-colors"
          >
            <Minus className="w-5 h-5 text-zinc-600" />
          </button>
          <div className="flex-1 h-12 border-y border-zinc-300 bg-white flex items-center justify-center font-bold text-lg">
            {meters}m
          </div>
          <button
            type="button"
            onClick={handleIncrease}
            className="w-12 h-12 flex items-center justify-center border border-zinc-300 rounded-r-md bg-white hover:bg-zinc-100 transition-colors"
          >
            <Plus className="w-5 h-5 text-zinc-600" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 pt-6 border-t border-zinc-200">
        <span className="text-zinc-900 font-semibold text-lg">Total Price</span>
        <span className="text-2xl font-bold text-[#D4AF37]">{formatPrice(total)}</span>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full font-bold h-14 rounded-md flex items-center justify-center gap-2 transition-all ${
            added
              ? "bg-green-600 text-white"
              : "bg-zinc-900 hover:bg-zinc-800 text-white"
          }`}
        >
          {added ? (
            <><Check className="w-5 h-5" /> Added to Cart!</>
          ) : (
            <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
          )}
        </button>
        {added && (
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="w-full h-12 rounded-md border-2 border-zinc-900 text-zinc-900 font-bold hover:bg-zinc-900 hover:text-white transition-colors text-sm"
          >
            View Cart & Checkout →
          </button>
        )}

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="flex-shrink-0 mx-4 text-zinc-400 text-xs font-medium uppercase">Or</span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        <a
          href={`https://wa.me/254704626085?text=${encodeURIComponent(`*Quick Order Inquiry* 🛍️\n\nI am interested in ordering:\n• ${productName} (${selectedColor})\n  ${meters}m @ KSh ${pricePerMeter} = KSh ${total}\n  Image: ${productImage}\n\nPlease confirm availability and delivery.`)}`}
          target="_blank"
          rel="noreferrer"
          className="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold h-14 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
