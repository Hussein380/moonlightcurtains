"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { MeterCalculator } from "@/components/MeterCalculator";
import { MessageCircle, Check, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

export default function ProductClient({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${resolvedParams.slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.slug]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(p);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Fabric Not Found</h1>
        <Link href="/shop" className="text-[#D4AF37] hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[80vh]">
      <Link href="/shop" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-zinc-100 rounded-xl overflow-hidden shadow-lg border border-zinc-200">
            {imageUrl ? (
              <Image src={imageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">No Image</div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-sm font-medium">
              {product.roomType || "Living Room"}
            </span>
            {product.highDemand && (
              <span className="text-xs font-bold text-red-600 animate-pulse bg-red-50 px-3 py-1 rounded-full border border-red-100 flex items-center gap-1">
                🔥 High Demand
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">{product.name}</h1>
          
          <div className="flex flex-col gap-1 mb-6 border-b border-zinc-100 pb-6">
            {product.retailPrice && product.retailPrice > product.pricePerMeter && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-zinc-400 line-through">Market Retail: {formatPrice(product.retailPrice)}</p>
                <span className="text-xs font-bold text-white bg-[#D4AF37] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Wholesale Deal (Save {Math.round(((product.retailPrice - product.pricePerMeter) / product.retailPrice) * 100)}%)
                </span>
              </div>
            )}
            <p className="text-3xl text-zinc-900 font-bold">
              {formatPrice(product.pricePerMeter)} <span className="text-lg text-zinc-500 font-normal">/ meter</span>
            </p>
          </div>

          <div className="prose prose-zinc mb-8 text-zinc-600 leading-relaxed">
            <p>{product.description}</p>
            <ul className="mt-6 space-y-3 list-none pl-0">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#D4AF37]" /> <strong>Fabric:</strong> {product.fabricType || "Premium Blend"}</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#D4AF37]" /> <strong>Header:</strong> {product.headerStyles?.[0] || "Eyelet"}</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#D4AF37]" /> <strong>Light:</strong> {product.lightControl || "Room Darkening"}</li>
            </ul>
          </div>

          <div className="mb-8 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2">
              Available Colors
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.colors && product.colors.length > 0 ? (
                product.colors.map((c: string) => (
                  <button 
                    key={c} 
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 border rounded-md text-sm font-bold transition-all shadow-sm
                      ${selectedColor === c 
                        ? "bg-[#D4AF37] border-[#D4AF37] text-white ring-2 ring-[#D4AF37]/30" 
                        : "bg-white border-zinc-300 text-zinc-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      }`}
                  >
                    {c}
                  </button>
                ))
              ) : (
                <span className="text-zinc-500 text-sm">Various colors available</span>
              )}
            </div>
          </div>

          <MeterCalculator 
            productId={product.id}
            productName={product.name}
            productImage={imageUrl || ""}
            pricePerMeter={product.pricePerMeter} 
            selectedColor={selectedColor || "Various"}
          />
        </div>
      </div>
    </div>
  );
}
