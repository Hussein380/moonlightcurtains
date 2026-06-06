"use client";

import { useState } from "react";
import { MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import { API_BASE } from "@/lib/api";

export default function CustomOrderPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    windowWidth: "",
    windowHeight: "",
    roomType: "Living Room",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phoneNumber || !form.windowWidth || !form.windowHeight) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          windowWidth: parseFloat(form.windowWidth),
          windowHeight: parseFloat(form.windowHeight),
          photos,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
      setForm({ customerName: "", phoneNumber: "", email: "", windowWidth: "", windowHeight: "", roomType: "Living Room", notes: "" });
      setPhotos([]);
    } catch {
      alert("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappFallback = encodeURIComponent("Hello, I would like to request a custom curtain quote.");

  if (success) return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-zinc-100 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-2">Request Submitted!</h2>
        <p className="text-zinc-500">Thank you! We will review your request and get back to you shortly on WhatsApp or phone.</p>
        <button onClick={() => setSuccess(false)} className="mt-6 px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C5A059] transition-colors">
          Submit Another Request
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">Request a Custom Quote</h1>
        <p className="text-lg text-zinc-600">Need specific measurements or a complete window treatment setup? Fill out the form and we will get back to you with a personalized quotation.</p>
      </div>

      <div className="max-w-3xl mx-auto bg-zinc-50 p-8 rounded-xl border border-zinc-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input required name="customerName" value={form.customerName} onChange={handleChange} type="text" className="w-full border border-zinc-300 rounded-md h-12 px-4 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input required name="phoneNumber" value={form.phoneNumber} onChange={handleChange} type="tel" className="w-full border border-zinc-300 rounded-md h-12 px-4 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="07XX XXX XXX" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address (Optional)</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full border border-zinc-300 rounded-md h-12 px-4 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="jane@example.com" />
          </div>

          {/* Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-4 rounded-lg border border-zinc-100">
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select name="roomType" value={form.roomType} onChange={handleChange} className="w-full border border-zinc-300 rounded-md h-12 px-4 bg-white focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Office</option>
                <option>Dining Room</option>
                <option>Entire House</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Window Width (m) *</label>
              <input required name="windowWidth" value={form.windowWidth} onChange={handleChange} type="number" step="0.1" min="0.5" className="w-full border border-zinc-300 rounded-md h-12 px-4 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="e.g. 2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Window Height (m) *</label>
              <input required name="windowHeight" value={form.windowHeight} onChange={handleChange} type="number" step="0.1" min="0.5" className="w-full border border-zinc-300 rounded-md h-12 px-4 focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="e.g. 2.8" />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Room Photos (Optional)</label>
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-zinc-200">
                    <img src={url} alt={`Room ${i+1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-bl-md">✕</button>
                  </div>
                ))}
              </div>
            )}
            <CldUploadWidget
              uploadPreset="moonlight_preset"
              onSuccess={(result: any) => setPhotos((prev) => [...prev, result.info.secure_url])}
              options={{ multiple: true, maxFiles: 5, sources: ["local", "camera"], clientAllowedFormats: ["jpg", "png", "jpeg", "webp"] }}
            >
              {({ open }) => (
                <button type="button" onClick={() => open()} className="w-full border-2 border-dashed border-zinc-300 rounded-md p-6 text-center bg-white hover:bg-zinc-50 hover:border-[#D4AF37] transition-colors flex items-center justify-center gap-2 text-zinc-500 touch-manipulation">
                  <UploadCloud className="w-5 h-5" /> Tap to upload room photos
                </button>
              )}
            </CldUploadWidget>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border border-zinc-300 rounded-md p-4 min-h-[120px] focus:ring-[#D4AF37] focus:border-[#D4AF37]" placeholder="Tell us about your preferred fabric, color, or style..."></textarea>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-zinc-200">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-zinc-900 text-white h-14 rounded-md font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
            <a href={`https://wa.me/254704626085?text=${whatsappFallback}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white h-14 rounded-md font-bold transition-colors">
              <MessageCircle className="w-5 h-5" /> WhatsApp Instead
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
