"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, MessageSquare, LogOut, Menu, X } from "lucide-react";
import { removeAuthToken } from "@/lib/auth";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    router.push("/admin/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Users },
    { name: "Custom Requests", href: "/admin/custom-requests", icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-zinc-950 text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#D4AF37]">Admin Panel</h2>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-400 hover:text-white">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:block mb-8 p-6">
          <h2 className="text-2xl font-serif font-bold text-[#D4AF37]">Admin Panel</h2>
          <p className="text-xs text-zinc-400 mt-1">Moonlight Star Fashion</p>
        </div>
        
        <nav className="flex-1 space-y-2 p-4 md:p-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname?.startsWith(link.href));
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-4 md:py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-zinc-800 text-[#D4AF37] font-bold" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 font-medium"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-lg md:text-base">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto p-4 border-t border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-base md:text-sm text-red-400 hover:text-red-300 transition-colors w-full p-3 md:p-2 rounded hover:bg-red-950/30 font-medium"
          >
            <LogOut className="w-5 h-5 md:w-4 md:h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
