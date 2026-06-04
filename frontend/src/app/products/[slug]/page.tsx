import type { Metadata } from "next";
import ProductClient from "./ProductClient";

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${API_URL}/products/${resolvedParams.slug}`);
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
