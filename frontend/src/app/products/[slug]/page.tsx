import type { Metadata } from "next";
import ProductClient from "./ProductClient";
import { API_BASE } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const res = await fetch(`${API_BASE}/products/${resolvedParams.slug}`);
    if (!res.ok) return { title: "Product Not Found | Moonlight Star Fashion" };
    const product = await res.json();
    
    return {
      title: `${product.name} | Moonlight Star Fashion`,
      description: `Buy premium ${product.name} curtain fabric for ${product.pricePerMeter} KSh per meter. High-quality Turkish fabric delivered in Nairobi, Kenya.`,
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      }
    };
  } catch {
    return { title: "Moonlight Star Fashion Curtains" };
  }
}

export default function Page({ params }: Props) {
  return <ProductClient params={params} />;
}
