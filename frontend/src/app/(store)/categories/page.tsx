import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { name: "Living Room Curtains", img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2080&auto=format&fit=crop" },
    { name: "Bedroom Curtains", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2080&auto=format&fit=crop" },
    { name: "Dining Room Curtains", img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop" },
    { name: "Office Curtains", img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2080&auto=format&fit=crop" },
    { name: "Kids Room Curtains", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-serif font-bold text-zinc-900 mb-8">Shop by Room Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <Link href={`/?roomType=${cat.name.replace(' Curtains', '')}`} key={i} className="group relative h-80 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${cat.img})` }} />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <h3 className="text-2xl font-serif text-white font-bold tracking-wide">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
