import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Format the slug back to a readable name
  const formattedName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <Link href="/categories" className="text-zinc-500 hover:text-[#D4AF37] inline-flex items-center gap-2 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </Link>
      
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-4">{formattedName} Curtains</h1>
        <p className="text-lg text-zinc-600 max-w-2xl">
          Browse our exclusive collection of luxury fabrics tailored specifically for your {formattedName.toLowerCase()}.
        </p>
      </div>

      {/* Placeholder for fetching products from backend via API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="group flex flex-col bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64 bg-zinc-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-sm text-zinc-500 mb-1">{formattedName} Fabric</p>
              <h3 className="font-semibold text-lg mb-2">Premium Elegance Collection</h3>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-[#D4AF37] font-bold">KSh 950 <span className="text-sm text-zinc-500 font-normal">/ meter</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
