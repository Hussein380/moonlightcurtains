"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, Search, Filter } from "lucide-react";
import useSWR from "swr";
import { API_BASE } from "@/lib/api";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return []; }
};

function ProductCard({ product }: { product: any }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const images = product.images || [];
  const imageUrl = images[currentImgIdx]?.url;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(p);

  return (
    <div className="group flex flex-col bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
      <div className="relative h-64 bg-zinc-100 overflow-hidden block">
        {imageUrl ? (
          <>
            <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-zinc-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-zinc-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {images.map((_: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImgIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-0 flex items-center justify-center text-zinc-400 text-sm">
            No Image
          </Link>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-zinc-500">{product.roomType || "Curtain Fabric"}</p>
          {product.highDemand && (
            <span className="text-xs font-bold text-red-600 animate-pulse bg-red-50 px-2 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
              🔥 High Demand
            </span>
          )}
        </div>
        <Link href={`/products/${product.slug}`} className="font-semibold text-lg mb-2 hover:text-[#D4AF37] transition-colors line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-auto flex flex-col gap-1">
          {product.retailPrice && product.retailPrice > product.pricePerMeter ? (
            <>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-red-500 font-medium line-through">Market: {formatPrice(product.retailPrice)}</p>
                <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-1.5 py-0.5 rounded text-[10px] font-bold">
                  Save {Math.round(((product.retailPrice - product.pricePerMeter) / product.retailPrice) * 100)}%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#D4AF37] font-bold text-xl">
                  {formatPrice(product.pricePerMeter)} <span className="text-xs text-zinc-500 font-normal">/ meter</span>
                </p>
                <Link href={`/products/${product.slug}`} className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-bold bg-zinc-100 px-3 py-1.5 rounded-full">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <p className="text-[#D4AF37] font-bold text-xl">
                {formatPrice(product.pricePerMeter)} <span className="text-xs text-zinc-500 font-normal">/ meter</span>
              </p>
              <Link href={`/products/${product.slug}`} className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 font-bold bg-zinc-100 px-3 py-1.5 rounded-full">
                View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useSearchParams } from "next/navigation";

export default function ShopClient({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState(searchParams.get("roomType") || "All");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roomType]);

  // Build query string
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (roomType !== "All") queryParams.append("roomType", roomType);

  const queryString = queryParams.toString();
  const url = queryString ? `${API_BASE}/products?${queryString}` : `${API_BASE}/products`;

  const { data: rawProducts, error, isLoading } = useSWR(url, fetcher, { fallbackData: initialProducts });
  const products: any[] = Array.isArray(rawProducts) 
    ? [...rawProducts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    : [];

  const ROOMS = ["All", "Living Room", "Bedroom", "Office", "Dining Room"];

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-2">Our Collection</h1>
          <div className="w-24 h-1 bg-[#D4AF37]" />
        </div>
        <button 
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="md:hidden flex items-center gap-2 border border-zinc-300 px-4 py-2 rounded-md font-medium text-zinc-700"
        >
          <Filter className="w-5 h-5" /> {showFiltersMobile ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* FILTER SIDEBAR */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${showFiltersMobile ? "block" : "hidden md:block"}`}>
          <div className="sticky top-24 space-y-8 bg-zinc-50 p-6 rounded-xl border border-zinc-100">
            {/* Search */}
            <div>
              <h3 className="font-bold text-zinc-900 mb-3 flex items-center gap-2"><Search className="w-4 h-4"/> Search</h3>
              <input 
                type="text"
                placeholder="Search fabrics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-zinc-300 rounded-md p-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
              />
            </div>

            {/* Room Type */}
            <div>
              <h3 className="font-bold text-zinc-900 mb-3">Room Type</h3>
              <div className="space-y-2">
                {ROOMS.map(room => (
                  <label key={room} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="roomType" 
                      checked={roomType === room}
                      onChange={() => setRoomType(room)}
                      className="text-[#D4AF37] focus:ring-[#D4AF37] cursor-pointer"
                    />
                    <span className={`text-sm group-hover:text-[#D4AF37] transition-colors ${roomType === room ? 'text-[#D4AF37] font-semibold' : 'text-zinc-600'}`}>
                      {room}
                    </span>
                  </label>
                ))}
              </div>
            </div>


            
            <button 
              onClick={() => { setSearch(""); setRoomType("All"); }}
              className="w-full text-xs text-zinc-500 hover:text-zinc-900 underline mt-4"
            >
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#D4AF37]" />
              <p>Finding perfect fabrics...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl">Failed to load products. Please try again.</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-xl border border-zinc-100">
              <p className="text-lg text-zinc-600 font-medium">No fabrics found matching your filters.</p>
              <button 
                onClick={() => { setSearch(""); setRoomType("All"); }}
                className="mt-4 inline-block text-[#D4AF37] font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {Math.ceil(products.length / ITEMS_PER_PAGE) > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-200 pt-6 gap-4">
                  <p className="text-sm text-zinc-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, products.length)} of {products.length} fabrics
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-zinc-50 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: Math.ceil(products.length / ITEMS_PER_PAGE) }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-50 border border-transparent hover:border-zinc-300'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setCurrentPage(p => Math.min(Math.ceil(products.length / ITEMS_PER_PAGE), p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === Math.ceil(products.length / ITEMS_PER_PAGE)}
                      className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-zinc-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
