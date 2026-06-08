import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-lg font-serif font-bold mb-4 text-[#D4AF37]">MOONLIGHT STAR FASHION</h3>
          <p className="text-sm">Premium curtain fabrics and custom window treatments located in Eastleigh, Nairobi. Quality, elegance, and luxury for every home.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-[#D4AF37] transition-colors">Shop Fabrics</Link></li>
            <li><Link href="/categories" className="hover:text-[#D4AF37] transition-colors">Room Categories</Link></li>
            <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact Info</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="https://maps.google.com/?q=Emirates+Shopping+Mall,+9th+Street,+Eastleigh,+Nairobi" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors block leading-relaxed">
                Emirates Shopping Mall, Shop No. 1<br />
                9th Street, Eastleigh, Nairobi
              </a>
            </li>
            <li>Phone: <a href="tel:+254704626085" className="hover:text-[#D4AF37] transition-colors">0704626085</a></li>
            <li>WhatsApp: <a href="https://wa.me/254704626085" target="_blank" rel="noreferrer" className="hover:text-[#D4AF37] transition-colors">0704626085</a></li>
            <li>Email: <a href="mailto:moonlightcurtainshop@gmail.com" className="hover:text-[#D4AF37] transition-colors">moonlightcurtainshop@gmail.com</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Store Hours</h4>
          <ul className="space-y-2 text-sm">
            <li>Mon - Sat: 8:00 AM - 6:00 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} Moonlight Star Fashion. All rights reserved.</p>
      </div>
    </footer>
  )
}
