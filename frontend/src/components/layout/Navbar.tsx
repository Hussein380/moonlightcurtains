"use client";

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, Search, X, ShieldCheck } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const items = useCartStore((state) => state.items);

  // Prevent hydration mismatch by only rendering the cart count on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/80 text-zinc-100 shadow-sm">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-zinc-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Moonlight Star Fashion" width={200} height={80} className="h-16 w-auto object-contain" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/home" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
          <Link href="/categories" className="hover:text-[#D4AF37] transition-colors">Categories</Link>
          <Link href="/guide" className="hover:text-[#D4AF37] transition-colors">Curtain Guide</Link>
          <Link href="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link>
          <Link href="/admin/login" className="flex items-center gap-1 text-[#D4AF37] hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
            <ShieldCheck className="w-4 h-4" /> Admin
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-zinc-400 hover:text-zinc-100">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#D4AF37] text-[10px] font-bold text-white flex items-center justify-center">
              {isClient ? items.length : 0}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-800 shadow-xl py-4 px-4 flex flex-col gap-4 text-sm font-semibold">
          <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors block py-2 border-b border-zinc-900">Home</Link>
          <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors block py-2 border-b border-zinc-900">Shop</Link>
          <Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors block py-2 border-b border-zinc-900">Categories</Link>
          <Link href="/guide" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors block py-2 border-b border-zinc-900">Curtain Guide</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors block py-2 border-b border-zinc-900">About Us</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors block py-2 border-b border-zinc-900">Contact</Link>
          <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors py-2">
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </Link>
        </div>
      )}
    </header>
  )
}
