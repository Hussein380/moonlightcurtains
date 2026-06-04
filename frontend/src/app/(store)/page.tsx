"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Truck, ShieldCheck, Ruler, Scissors, Home as HomeIcon } from "lucide-react";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
};

export default function Home() {
  const { data: rawProducts } = useSWR("http://localhost:5000/api/products", fetcher);
  const products: any[] = Array.isArray(rawProducts) ? rawProducts.slice(0, 4) : [];

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(p);

  return (
    <div className="flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="relative w-full h-[600px] md:h-[80vh] min-h-[600px] flex items-center justify-center bg-zinc-50 overflow-hidden">
        {/* Bright white gradient overlay instead of black */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/60 to-transparent z-10" />
        
        {/* Beautiful, bright, airy curtain background image */}
        <div className="absolute inset-0 bg-[url('/hero-curtains.png')] bg-cover bg-center opacity-100" />
        
        <div className="relative z-20 w-full px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="text-[#D4AF37] font-bold tracking-wider uppercase text-sm md:text-base mb-4">
              Welcome to Moonlight Star Fashion
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 mb-6 leading-tight max-w-3xl">
              High-Quality, Affordable Curtains from <span className="text-[#D4AF37]">Eastleigh.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-2xl leading-relaxed">
              Transform your home with premium Turkish fabrics, elegant sheers, and room-darkening blackouts. Sold by the meter at unbeatable Eastleigh prices, delivered straight to your door anywhere in Kenya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop" className="bg-[#D4AF37] hover:bg-[#C5A059] text-white px-8 py-4 rounded-md font-bold transition-all shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-2 hover:-translate-y-1">
                Explore Fabrics <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/custom-order" className="bg-transparent border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white px-8 py-4 rounded-md font-bold transition-all flex items-center justify-center">
                Need a Custom Quote?
              </Link>
            </div>
          </div>

          {/* Right Floating Card (Latest Arrival) */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
            {products.length > 0 && (
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white max-w-sm w-full animate-fade-in-up transform hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-center mb-3 px-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#D4AF37]" /> Latest Arrival
                  </span>
                </div>
                <Link href={`/products/${products[0].slug}`} className="block relative w-full h-64 rounded-xl overflow-hidden mb-4 bg-zinc-100">
                  {products[0].images?.[0]?.url ? (
                    <Image src={products[0].images[0].url} alt={products[0].name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">No Image</div>
                  )}
                </Link>
                <div className="px-2 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-zinc-900 line-clamp-1">{products[0].name}</h3>
                    {products[0].highDemand && (
                      <span className="text-[10px] font-bold text-red-600 animate-pulse bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex-shrink-0">
                        🔥 High Demand
                      </span>
                    )}
                  </div>
                  {products[0].retailPrice && products[0].retailPrice > products[0].pricePerMeter && (
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-zinc-400 line-through">Market: {formatPrice(products[0].retailPrice)}</p>
                      <span className="text-[10px] font-bold text-white bg-zinc-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Wholesale Deal
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-end">
                    <p className="text-[#D4AF37] font-bold text-lg">{formatPrice(products[0].pricePerMeter)} <span className="text-xs text-zinc-500 font-normal">/ m</span></p>
                    <Link href={`/products/${products[0].slug}`} className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center hover:bg-[#D4AF37] transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (NEW) */}
      <section className="w-full py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-4">How Ordering Works</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6" />
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              We make it incredibly easy to get the exact curtain measurements you need for your windows without leaving your house.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                <SearchIcon className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900">1. Pick Your Fabric</h3>
              <p className="text-zinc-600 leading-relaxed">
                Browse our collection of imported Turkish fabrics, sheers, and blackouts. Choose the color that perfectly matches your home decor.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                <Ruler className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900">2. Enter Measurements</h3>
              <p className="text-zinc-600 leading-relaxed">
                Use our built-in meter calculator. Just type in how many meters of fabric you need, and we instantly calculate the total price for you.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                <Scissors className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900">3. We Cut & Deliver</h3>
              <p className="text-zinc-600 leading-relaxed">
                Place your order securely via WhatsApp or Checkout. We cut your fabric fresh from the roll in Eastleigh and deliver it straight to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="w-full py-20 bg-zinc-50 border-y border-zinc-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-4">Find Inspiration By Room</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Living Room", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop" },
              { name: "Bedroom", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop" },
              { name: "Kids Room", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" }
            ].map((cat, i) => (
              <Link href={`/shop`} key={i} className="group relative h-80 md:h-96 overflow-hidden rounded-xl shadow-md">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors z-10" />
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${cat.img})` }} />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur px-8 py-4 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-xl font-bold text-zinc-900 tracking-wide">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — Live from DB */}
      <section className="w-full py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-4">Latest Arrivals</h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto md:mx-0" />
            </div>
            <Link href="/shop" className="flex items-center text-zinc-600 hover:text-[#D4AF37] font-medium border border-zinc-200 hover:border-[#D4AF37] px-6 py-3 rounded-full transition-colors">
              View All Collection <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-100">
              <p className="text-zinc-500 text-lg">Fabrics are currently loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product: any) => {
                const imageUrl = product.images?.[0]?.url;
                return (
                  <div key={product.id} className="group flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-zinc-200 transition-all duration-300">
                    <Link href={`/products/${product.slug}`} className="relative h-72 bg-zinc-100 overflow-hidden block">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-400 text-sm">No Image</div>
                      )}
                    </Link>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{product.roomType || "Curtain Fabric"}</p>
                        {product.highDemand && (
                          <span className="text-[10px] font-bold text-red-600 animate-pulse bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                            🔥 High Demand
                          </span>
                        )}
                      </div>
                      <Link href={`/products/${product.slug}`} className="font-bold text-xl mb-3 text-zinc-900 hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-zinc-100">
                        {product.retailPrice && product.retailPrice > product.pricePerMeter ? (
                          <>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-zinc-400 line-through">Market: {formatPrice(product.retailPrice)}</p>
                              <span className="text-[10px] font-bold text-white bg-zinc-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Wholesale Deal
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[#D4AF37] font-bold text-xl">{formatPrice(product.pricePerMeter)} <span className="text-xs text-zinc-500 font-normal">/ meter</span></p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-[#D4AF37] font-bold text-lg">{formatPrice(product.pricePerMeter)} <span className="text-xs text-zinc-500 font-normal">/ meter</span></p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="w-full py-20 bg-zinc-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Why Moonlight Star Fashion?</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 text-[#D4AF37] transform rotate-3 hover:rotate-0 transition-transform">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Authentic Quality</h3>
              <p className="text-zinc-400 leading-relaxed">We source beautiful, long-lasting Turkish fabrics that don't fade. Get the best quality for your money without the scary price tag.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 text-[#D4AF37] transform -rotate-3 hover:rotate-0 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nationwide Delivery</h3>
              <p className="text-zinc-400 leading-relaxed">Whether you are in Nairobi, Mombasa, or Kisumu, we process and deliver your cut fabric securely and on time.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 text-[#D4AF37] transform rotate-3 hover:rotate-0 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Trusted by Hundreds</h3>
              <p className="text-zinc-400 leading-relaxed">From new homeowners to interior designers, we've built a reputation for honesty, fast service, and stunning curtains.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Quick helper component for Search Icon
function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
