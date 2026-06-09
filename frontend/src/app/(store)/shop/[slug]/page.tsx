"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { API_BASE } from "@/lib/api";

// Type matching our backend product structure
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerMeter: number;
  colors: string[];
  qualities: string[];
  images: { url: string; alt: string }[];
  category: { name: string; slug: string };
  available: boolean;
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [meters, setMeters] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Fetch product from Decoupled Express API
    fetch(`${API_BASE}/products/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        if (data.qualities?.length > 0) setSelectedQuality(data.qualities[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: `${product.id}-${selectedColor}-${selectedQuality}`,
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url || "",
      pricePerMeter: product.pricePerMeter,
      meters: meters,
      color: selectedColor || "Default",
      quality: selectedQuality,
      totalPrice: product.pricePerMeter * meters
    });
    
    alert(`Added ${meters}m of ${product.name} to your cart!`);
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-zinc-500">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-[#D4AF37] hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <Link href="/shop" className="text-zinc-500 hover:text-[#D4AF37] inline-flex items-center gap-2 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="relative h-[400px] md:h-[600px] bg-zinc-100 rounded-lg overflow-hidden mb-4">
            {product.images?.length > 0 ? (
              <Image 
                src={product.images[0].url} 
                alt={product.images[0].alt || product.name} 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center text-zinc-500">No Image Available</div>
            )}
          </div>
        </div>

        {/* Product Details & Calculator */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2">
            <Link href={`/categories/${product.category.slug}`} className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wider hover:underline">
              {product.category.name}
            </Link>
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-[#D4AF37]">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-sm text-zinc-500">(12 Reviews)</span>
          </div>

          <p className="text-3xl font-bold text-zinc-900 mb-6">
            KSh {product.pricePerMeter.toLocaleString()} <span className="text-sm text-zinc-500 font-normal">/ meter</span>
          </p>

          <div className="mb-8 space-y-3 text-zinc-600 leading-relaxed">
            {product.description?.split(',').map((line: string, i: number) => {
              const trimmed = line.trim();
              if (!trimmed) return null;
              return (
                <p key={i} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0"></span>
                  <span>{trimmed}</span>
                </p>
              );
            })}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-zinc-900 mb-3">Color: <span className="text-zinc-500 font-normal">{selectedColor}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md transition-colors ${selectedColor === color ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] font-medium' : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meter Estimator / Calculator */}
          <div className="mb-8 p-6 bg-zinc-50 border border-zinc-200 rounded-lg">
            <h3 className="font-bold text-lg mb-4 text-zinc-900">Calculate Fabric</h3>
            
            <div className="flex items-end gap-6 mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Meters Required</label>
                <div className="flex items-center border border-zinc-300 rounded bg-white overflow-hidden">
                  <button 
                    onClick={() => { if(meters > 1) setMeters(meters - 1) }}
                    className="px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors border-r border-zinc-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input 
                    type="number" 
                    min="1"
                    value={meters}
                    onChange={(e) => setMeters(Math.max(1, parseInt(e.target.value) || 1))}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                    className="w-full text-center font-bold text-lg focus:outline-none"
                  />
                  <button 
                    onClick={() => setMeters(meters + 1)}
                    className="px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors border-l border-zinc-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <p className="text-sm text-zinc-500 mb-1">Total Price</p>
                <p className="text-3xl font-bold text-[#D4AF37]">
                  KSh {(product.pricePerMeter * meters).toLocaleString()}
                </p>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            In Stock. Dispatched within 24 hours.
          </div>
        </div>
      </div>
    </div>
  );
}
