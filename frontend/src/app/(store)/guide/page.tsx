"use client";

import { motion } from "framer-motion";
import { ArrowRight, Ruler, Sun, LayoutDashboard, Type, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function GuidePage() {
  return (
    <div className="bg-zinc-50 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 bg-zinc-900 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay z-0" />
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeInUp}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <LayoutDashboard className="w-4 h-4 text-[#D4AF37]" />
            Educational Guide
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">The Ultimate Curtain Guide</h1>
          <p className="text-lg md:text-xl text-zinc-300">Stop guessing. We've made it visually simple to understand exactly what you need for the perfect room.</p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">

        {/* Section 1: Header Styles */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-4">1. Choose Your Header Style</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">The top of the curtain defines how it hangs. This makes a massive difference in the final look and feel of your room.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Grommet (Eyelet)", desc: "Metal rings slide directly over the rod. Offers deep, clean, modern folds.", img: "/images/headers/grommet.png" },
              { title: "Pinch Pleat", desc: "Tightly pinched folds for an ornate, highly structured, and formal appearance.", img: "/images/headers/pinch-pleat.png" },
              { title: "Rod Pocket", desc: "A sewn-in tunnel slides directly onto a rod. Casual, gathered look.", img: "/images/headers/rod-pocket.png" },
              { title: "Pencil Pleat", desc: "Gathered into tight, narrow folds resembling pencils. Very traditional.", img: "/images/headers/pencil-pleat.png" },
              { title: "Wave Fold", desc: "Flat-panel attached to a track creating smooth 'S' curves. Ultra-premium.", img: "/images/headers/wave-fold.png" },
              { title: "Tab Top", desc: "Fabric loops sewn to the top. Best for rustic, informal spaces.", img: "/images/headers/tab-top.png" },
            ].map((style, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white rounded-xl overflow-hidden shadow-sm border border-zinc-100 group hover:shadow-xl transition-all duration-300">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={style.img} alt={style.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-zinc-900">{style.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{style.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 2: Light Control (Side by Side layout) */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
          className="mb-24 bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-[#D4AF37] font-bold mb-4">
                <Sun className="w-5 h-5" /> LIGHT CONTROL
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 mb-8">How much sun do you want?</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1.5 bg-zinc-200 rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Sheer Curtains</h3>
                    <p className="text-zinc-600">Lightweight and translucent. They let in maximum daylight while offering daytime privacy.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 bg-[#D4AF37] rounded-full flex-shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Light-Filtering</h3>
                    <p className="text-zinc-600">The sweet spot. Diffuses harsh sunlight and adds privacy without making the room pitch dark.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1.5 bg-zinc-950 rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-1">Blackout (Blockout)</h3>
                    <p className="text-zinc-600">Lined with heavy, opaque fabrics to block almost all incoming light. Ideal for bedrooms.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[400px] lg:h-auto relative">
              <img src="/images/light-control.png" alt="Blackout vs Sheer curtains" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </motion.section>

        {/* Section 3: Lengths & Measuring */}
        <motion.section 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24"
        >
          {/* Lengths */}
          <motion.div variants={fadeInUp} className="bg-zinc-950 text-white rounded-3xl p-10 lg:p-16">
            <Type className="w-8 h-8 text-[#D4AF37] mb-6" />
            <h2 className="text-3xl font-serif font-bold mb-8">Curtain Lengths</h2>
            
            <div className="space-y-8">
              <div className="group border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2 flex items-center justify-between">
                  Sill / Apron Length <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-zinc-400">Ends just below the window sill. Great for windows with furniture or radiators immediately underneath.</p>
              </div>
              <div className="group border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2 flex items-center justify-between">
                  Floor Length <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-zinc-400">Drapes perfectly to the floor. This gives a clean, elongated appearance to the room. The most popular choice.</p>
              </div>
              <div className="group">
                <h3 className="text-xl font-bold text-[#D4AF37] mb-2 flex items-center justify-between">
                  Puddle Length <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-zinc-400">Extends past the floor, leaving extra fabric to "puddle". Very formal, romantic, and dramatic.</p>
              </div>
            </div>
          </motion.div>

          {/* Measuring */}
          <motion.div variants={fadeInUp} className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-3xl p-10 lg:p-16 flex flex-col justify-center">
            <Ruler className="w-8 h-8 text-[#D4AF37] mb-6" />
            <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-8">Measuring Rules</h2>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm mb-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]" />
              <h3 className="text-xl font-bold mb-2 text-zinc-900">The Width Rule</h3>
              <p className="text-zinc-600">For a full, luxurious gathered look, your total curtain fabric width should be <strong>double (2x) the width</strong> of your curtain rod.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-zinc-900" />
              <h3 className="text-xl font-bold mb-2 text-zinc-900">The Height Rule</h3>
              <p className="text-zinc-600">Always hang your rod <strong>4 to 6 inches above</strong> the window frame (or right at the ceiling). This makes your ceilings look much taller!</p>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-zinc-900">Still not sure what you need?</h3>
          <p className="text-zinc-600 mb-8 max-w-xl mx-auto">Send us a photo of your window, and our design experts will tell you exactly what style and measurements to use.</p>
          <Link href="https://wa.me/254704626085" target="_blank" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-[#25D366]/30 hover:shadow-xl transition-all hover:scale-105">
            Chat on WhatsApp <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
