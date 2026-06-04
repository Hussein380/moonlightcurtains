"use client";

import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useCartStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    county: "Nairobi",
    town: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    setMounted(true);
    // Redirect if cart is empty
    if (useCartStore.getState().items.length === 0) {
      router.push("/cart");
    }
  }, [router]);

  if (!mounted || cart.items.length === 0) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save order to backend so Admin sees it in Dashboard
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart.items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const orderData = await response.json();
      
      // 2. Construct WhatsApp Message with all details including images
      const message = `*New Order Placed* 🛍️
Order No: ${orderData.orderNumber}

*Customer Details:*
Name: ${formData.customerName}
Phone: ${formData.phoneNumber}
Location: ${formData.town}, ${formData.county}
Address: ${formData.address}
${formData.notes ? `Notes: ${formData.notes}\n` : ''}
*Items:*
${cart.items.map(item => `• ${item.name} (${item.color})
  ${item.meters}m @ KSh ${item.pricePerMeter} = KSh ${item.totalPrice}
  Image: ${item.image}`).join('\n\n')}

*Total:* KSh ${cart.getCartTotal()}`;

      const whatsappUrl = `https://wa.me/254704626085?text=${encodeURIComponent(message)}`;

      // 3. Clear cart and save WhatsApp URL for the success page
      cart.clearCart();
      localStorage.setItem('pendingWhatsAppOrder', whatsappUrl);
      
      // 4. Redirect to success page
      router.push(`/checkout/success?order=${orderData.orderNumber}`);

    } catch (error) {
      console.error(error);
      alert("Something went wrong placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(price);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-2 mb-8 text-zinc-500 text-sm">
          <span>Cart</span>
          <span>/</span>
          <span className="text-zinc-900 font-medium">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Delivery Details</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Full Name *</label>
                  <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Phone Number *</label>
                  <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="0712 345 678" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="jane@example.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">County *</label>
                  <select name="county" value={formData.county} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white">
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Machakos">Machakos</option>
                    <option value="Other">Other (Specify in notes)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Town/City *</label>
                  <input required type="text" name="town" value={formData.town} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="e.g. Westlands" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Specific Address *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="Apartment, Studio, or Floor" />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Order Notes (Optional)</label>
                <textarea rows={3} name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-3 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="Specific delivery instructions or measurements..."></textarea>
              </div>

              <div className="pt-6 border-t border-zinc-100">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-white px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                  Place Order Now
                </button>
                <p className="text-center text-xs text-zinc-500 mt-4">Payment will be processed upon delivery confirmation.</p>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-zinc-900 text-white p-8 rounded-2xl sticky top-32">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">{item.meters}</span>
                      <span className="text-zinc-300">{item.name} <span className="text-zinc-500 text-xs">({item.color})</span></span>
                    </div>
                    <span className="font-medium text-[#D4AF37]">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(cart.getCartTotal())}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Delivery</span>
                  <span>To be communicated</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-[#D4AF37]">{formatPrice(cart.getCartTotal())}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
