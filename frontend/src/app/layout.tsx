import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Moonlight Star Fashion | Luxury Blackout & Sheer Curtains in Nairobi",
  description: "Add elegance with sheer drapes and premium blackout curtains. Quality, affordable designer curtains from Eastleigh, Nairobi. Free measurement & installation available. Order today!",
  keywords: [
    "curtains nairobi", "living room curtains nairobi", "luxury blackout floral plain curtains",
    "blackout and sheer curtains", "designer curtains nairobi", "premium fabrics nairobi",
    "free measurement installation nairobi", "quality curtains", "affordable curtains kenya",
    "turkish curtains", "buy curtains eastleigh", "light airy sheer curtains"
  ],
  openGraph: {
    title: "Moonlight Star Fashion | Premium Curtains in Nairobi",
    description: "Simplicity in curtains is timeless elegance. High-Quality, Affordable Curtains from Eastleigh. Free measurement & installation available.",
    url: "https://moonlightstarfashion.co.ke",
    siteName: "Moonlight Star Fashion",
    images: [
      {
        url: "/hero-curtains.png",
        width: 1200,
        height: 630,
        alt: "Moonlight Star Fashion Curtains",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moonlight Star Fashion | Premium Curtains in Nairobi",
    description: "High-Quality, Affordable Curtains from Eastleigh.",
    images: ["/hero-curtains.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="moonlight" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
