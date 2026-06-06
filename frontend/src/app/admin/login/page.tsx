"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { setAuthToken } from "@/lib/auth";
import { API_BASE } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.token);
        router.push("/admin");
      } else {
        setError(true);
        setTimeout(() => setError(false), 3000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setIsSubmitting(false);
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

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-zinc-300 rounded-md pl-10 pr-3 py-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                placeholder="admin@email.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
              placeholder="••••••••" 
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">Incorrect credentials. Please try again.</p>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-white p-3 rounded-md font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : <>Access Dashboard <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
