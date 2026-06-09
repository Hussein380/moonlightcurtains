"use client";

import { Plus, Loader2, CheckCircle, Edit, Trash2, X, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import useSWR, { mutate } from "swr";
import Image from "next/image";
import { getAuthToken } from "@/lib/auth";
import { API_BASE } from "@/lib/api";

const COMMON_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Off-White", hex: "#F8F8FF" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Grey", hex: "#808080" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Black", hex: "#000000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Navy", hex: "#000080" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Green", hex: "#008000" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Red", hex: "#FF0000" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Brown", hex: "#964B00" },
  { name: "Purple", hex: "#800080" },
  { name: "Multi", hex: "conic-gradient(red, yellow, green, blue, purple)" },
  { name: "Various", hex: "linear-gradient(45deg, #ccc, #888)" }
];

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
};

export default function AdminProductsPage() {
  const { data: rawProducts, error, isLoading } = useSWR(`${API_BASE}/products`, fetcher);
  const products: any[] = Array.isArray(rawProducts)
    ? [...rawProducts].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    : typeof rawProducts === 'string'
    ? [...JSON.parse(rawProducts)].sort((a: any, b: any) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    : [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [room, setRoom] = useState("All Rooms");
  const [headerStyle, setHeaderStyle] = useState("");
  const [lightControl, setLightControl] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [retailPrice, setRetailPrice] = useState("");
  const [highDemand, setHighDemand] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isPasting, setIsPasting] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (!file) continue;
          
          setIsPasting(true);
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "moonlight_preset");
            
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
              method: "POST",
              body: formData
            });
            
            const data = await res.json();
            if (data.secure_url) {
              setImages((prev) => [...prev, data.secure_url]);
            }
          } catch (error) {
            console.error("Paste upload failed", error);
            alert("Failed to upload pasted image. Please try again.");
          } finally {
            setIsPasting(false);
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [isModalOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(price);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setRoom("All Rooms");
    setHeaderStyle("");
    setLightControl("");
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
    setName(product.name || "");
    setPrice(product.pricePerMeter?.toString() || "");
    setRoom(product.roomType || "All Rooms");
    setHeaderStyle(product.headerStyles?.[0] || "");
    setLightControl(product.lightControl || "");
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
    if (!price || !retailPrice || images.length === 0) {
      alert("Please provide a price, original price, and at least one image.");
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
          <>
            {/* Mobile/Tablet Card View (hidden on desktop) */}
            <div className="md:hidden divide-y divide-zinc-100">
              {products?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product: any) => (
                <div key={product.id} className="p-4 flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100">
                      {product.images?.[0]?.url ? (
                        <Image src={product.images[0].url} alt={product.name} fill sizes="50px" className="object-cover animate-fade-in" />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900 text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
                          {product.roomType || "Living Room"}
                        </span>
                        <span className="text-xs font-bold text-[#D4AF37]">
                          {formatPrice(product.pricePerMeter)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button 
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
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
                  {products?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product: any) => (
                    <tr key={product.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="p-4 flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-zinc-100 flex-shrink-0">
                          {product.images?.[0]?.url ? (
                            <Image src={product.images[0].url} alt={product.name} fill sizes="50px" className="object-cover" />
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

            {/* Pagination Controls */}
            {Math.ceil((products?.length || 0) / ITEMS_PER_PAGE) > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-zinc-200 bg-zinc-50 gap-4">
                <p className="text-sm text-zinc-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, products.length)} of {products.length} products
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-zinc-300 rounded-md text-sm disabled:opacity-50 hover:bg-white transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(products.length / ITEMS_PER_PAGE) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-[#D4AF37] text-white shadow-sm' : 'text-zinc-600 hover:bg-white border border-transparent hover:border-zinc-300'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage === Math.ceil(products.length / ITEMS_PER_PAGE)}
                    className="px-3 py-1 border border-zinc-300 rounded-md text-sm disabled:opacity-50 hover:bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Product Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-zinc-300 rounded-md p-2.5 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                    placeholder="e.g. Turkish Luxury Velvet (Optional)" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Price Per Meter (KES) *</label>
                  <input 
                    type="number" 
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
                    className="w-full border border-zinc-300 rounded-md p-2.5 focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                    placeholder="e.g. 950" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Market Retail Price (KES) *</label>
                  <input 
                    type="number" 
                    required
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(e.target.value)}
                    onWheel={(e) => (e.target as HTMLElement).blur()}
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
                    <option>All Rooms</option>
                    <option>Living Room</option>
                    <option>Bedroom</option>
                    <option>Office</option>
                    <option>Dining Room</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Header Style</label>
                  <select value={headerStyle} onChange={(e) => setHeaderStyle(e.target.value)} className="w-full border border-zinc-300 rounded-md p-2.5 bg-white focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                    <option value="">None</option>
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
                    <option value="">None</option>
                    <option>Sheer</option>
                    <option>Light-Filtering</option>
                    <option>Blackout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-3">Available Colors (Tick all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_COLORS.map((color) => (
                    <label 
                      key={color.name} 
                      className={`cursor-pointer px-3 py-1.5 border rounded-full text-sm font-medium transition-colors select-none flex items-center gap-2
                        ${colors.includes(color.name) 
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-white' 
                          : 'bg-white border-zinc-300 text-zinc-700 hover:border-[#D4AF37]'}`}
                    >
                      <div 
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-sm flex-shrink-0" 
                        style={{ background: color.hex }}
                      />
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={colors.includes(color.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setColors([...colors, color.name]);
                          } else {
                            setColors(colors.filter(c => c !== color.name));
                          }
                        }}
                      />
                      {color.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-zinc-700">Product Images *</label>
                  <div className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded border border-zinc-200 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    You can paste images (Ctrl+V) directly anywhere here
                  </div>
                </div>
                {isPasting && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-[#D4AF37] font-medium bg-yellow-50 p-3 rounded-md border border-yellow-100 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading pasted image...
                  </div>
                )}
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
