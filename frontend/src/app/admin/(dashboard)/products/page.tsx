"use client";

import { Plus, Loader2, CheckCircle, Edit, Trash2, X } from "lucide-react";
import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { getAuthToken } from "@/lib/auth";
import { API_BASE } from "@/lib/api";

const COMMON_COLORS = [
  "White", "Off-White", "Beige", "Cream", "Grey", "Charcoal", "Black", 
  "Blue", "Navy", "Gold", "Yellow", "Green", "Pink", "Red", "Burgundy", 
  "Brown", "Purple", "Multi", "Various"
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

export default function AdminProductsPage() {
  const { data: rawProducts, error, isLoading } = useSWR(`${API_BASE}/products`, fetcher);
  const products: any[] = Array.isArray(rawProducts)
    ? rawProducts
    : typeof rawProducts === 'string'
    ? JSON.parse(rawProducts)
    : [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [room, setRoom] = useState("Living Room");
  const [headerStyle, setHeaderStyle] = useState("Grommet (Eyelet)");
  const [lightControl, setLightControl] = useState("Sheer");
  const [colors, setColors] = useState<string[]>([]);
  const [retailPrice, setRetailPrice] = useState("");
  const [highDemand, setHighDemand] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(price);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setRoom("Living Room");
    setHeaderStyle("Grommet (Eyelet)");
    setLightControl("Sheer");
    setColors([]);
    setRetailPrice("");
    setHighDemand(false);
    setDescription("");
    setImages([]);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setName(product.name);
    setPrice(product.pricePerMeter.toString());
    setRoom(product.roomType || "Living Room");
    setHeaderStyle(product.headerStyles?.[0] || "Grommet (Eyelet)");
    setLightControl(product.lightControl || "Sheer");
    setColors(product.colors || []);
    setRetailPrice(product.retailPrice ? product.retailPrice.toString() : "");
    setHighDemand(product.highDemand || false);
    setDescription(product.description || "");
    setImages(product.images?.map((img: any) => img.url) || []);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      mutate(`${API_BASE}/products`, products.filter((p: any) => p.id !== id), false);
      
      const response = await fetch(`${API_BASE}/products/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getAuthToken()}` }
      });
      if (!response.ok) throw new Error("Failed to delete product");
      
      // Revalidate
      mutate(`${API_BASE}/products`);
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
      mutate(`${API_BASE}/products`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || images.length === 0) {
      alert("Please provide a name, price, and at least one image.");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingId 
        ? `${API_BASE}/products/${editingId}` 
        : `${API_BASE}/products`;
      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          name,
          pricePerMeter: price,
          roomType: room,
          headerStyle,
          lightControl,
          retailPrice: retailPrice ? retailPrice : undefined,
          highDemand,
          colors,
          description,
          images,
        })
      });

      if (!response.ok) throw new Error("Failed to save product");

      await mutate(`${API_BASE}/products`);
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      alert(error.message || "An error occurred");
      await mutate(`${API_BASE}/products`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-zinc-900">Products Management</h1>
          <p className="text-zinc-500">Add, edit, and categorize your curtain fabrics</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-[#D4AF37] hover:bg-[#C5A059] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Fabric
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-4" />
            Loading products...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">Failed to load products.</div>
        ) : products?.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No products found. Click "Add New Fabric" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600 border-b border-zinc-200">
                <tr>
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category / Room</th>
                  <th className="p-4 font-medium">Price/Meter</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products?.map((product: any) => (
                  <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-100 flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                        ) : null}
                      </div>
                      <span className="font-medium text-zinc-900">{product.name}</span>
                    </td>
                    <td className="p-4 text-zinc-600">
                      {product.roomType || "Living Room"}
                    </td>
                    <td className="p-4 font-medium text-[#D4AF37]">
                      {formatPrice(product.pricePerMeter)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold font-serif text-zinc-900">
                {editingId ? "Edit Curtain Fabric" : "Add New Curtain Fabric"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Product Name *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-zinc-300 rounded-md p-2.5 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                    placeholder="e.g. Turkish Luxury Velvet" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Price Per Meter (KES) *</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-zinc-300 rounded-md p-2.5 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                    placeholder="e.g. 950" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Market Retail Price (Optional)</label>
                  <input 
                    type="number" 
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    className="w-full border border-zinc-300 rounded-md p-2.5 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                    placeholder="e.g. 1500" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-red-50 text-red-900 p-4 rounded-md border border-red-100">
                <input 
                  type="checkbox" 
                  id="highDemand"
                  checked={highDemand}
                  onChange={(e) => setHighDemand(e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded border-red-300 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="highDemand" className="text-sm font-bold cursor-pointer">
                  🔥 Mark as High Demand (Displays "High Demand" badge on product)
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Room Category</label>
                  <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full border border-zinc-300 rounded-md p-2.5 bg-white focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                    <option>Living Room</option>
                    <option>Bedroom</option>
                    <option>Office</option>
                    <option>Dining Room</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Header Style</label>
                  <select value={headerStyle} onChange={(e) => setHeaderStyle(e.target.value)} className="w-full border border-zinc-300 rounded-md p-2.5 bg-white focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                    <option>Grommet (Eyelet)</option>
                    <option>Rod Pocket</option>
                    <option>Pinch Pleat</option>
                    <option>Pencil Pleat</option>
                    <option>Tab Top</option>
                    <option>Wave Fold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Light Control</label>
                  <select value={lightControl} onChange={(e) => setLightControl(e.target.value)} className="w-full border border-zinc-300 rounded-md p-2.5 bg-white focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                    <option>Sheer</option>
                    <option>Light-Filtering</option>
                    <option>Blackout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-3">Available Colors (Tick all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_COLORS.map((colorName) => (
                    <label 
                      key={colorName} 
                      className={`cursor-pointer px-3 py-1.5 border rounded-full text-sm font-medium transition-colors select-none flex items-center gap-2
                        ${colors.includes(colorName) 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-white' 
                          : 'bg-white border-zinc-300 text-zinc-700 hover:border-[#D4AF37]'}`}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={colors.includes(colorName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setColors([...colors, colorName]);
                          } else {
                            setColors(colors.filter(c => c !== colorName));
                          }
                        }}
                      />
                      {colorName}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Product Images *</label>
                <ImageUpload 
                  value={images} 
                  onAdd={(url) => setImages((prev) => [...prev, url])} 
                  onRemove={(url) => setImages((prev) => prev.filter((img) => img !== url))} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                <textarea 
                  rows={4} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-zinc-300 rounded-md p-2.5 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                  placeholder="Enter fabric details..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 border-t pt-6 sticky bottom-0 bg-white py-4 -mb-6 -mx-6 px-6 border-zinc-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
