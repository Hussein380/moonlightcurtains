import ShopClient from "./ShopClient";
import { API_BASE } from "@/lib/api";
import { Suspense } from "react";

// This is a Server Component. It fetches data on the server before sending HTML to the client!
export default async function ShopServerPage() {
  let initialProducts = [];
  try {
    const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
    if (res.ok) {
      initialProducts = await res.json();
    }
  } catch (e) {
    console.error("Failed to fetch initial products on server:", e);
  }
  
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading shop...</div>}>
      <ShopClient initialProducts={initialProducts} />
    </Suspense>
  );
}
