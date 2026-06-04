"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { setAuthToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We hardcode the email to keep the UI simple with just a "Master Password" field
        body: JSON.stringify({ 
          email: "moonlightcurtainshop@gmail.com", 
          password: password 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Save the secure JWT token
        setAuthToken(data.token);
        router.push("/admin/products");
      } else {
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
        ← Back to Storefront
      </Link>
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-zinc-900 mb-2">Admin Access</h1>
          <p className="text-zinc-500 text-sm">Please sign in to access the control panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Master Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
              placeholder="••••••••" 
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">Incorrect password. Please try again.</p>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-white p-3 rounded-md font-bold transition-colors flex items-center justify-center gap-2"
          >
            Access Dashboard <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
