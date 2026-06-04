import { MapPin, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-[60vh]">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-12 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
              <MapPin className="text-[#D4AF37] w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Our Location</h3>
              <p className="text-zinc-600">Emirates Shopping Mall, Shop No. 1<br />9th Street, Eastleigh<br />Nairobi, Kenya</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
              <Phone className="text-[#D4AF37] w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-zinc-600">0704 626 085<br />0715 153 820<br />0726 585 787</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
              <MessageCircle className="text-[#25D366] w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-zinc-600 mb-2">For the fastest response, send us a message on WhatsApp.</p>
              <a href="https://wa.me/254704626085" target="_blank" rel="noreferrer" className="text-[#25D366] font-medium hover:underline">Message 0704 626 085</a>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 p-8 rounded-lg border border-zinc-200">
          <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" className="w-full border border-zinc-300 rounded-md h-12 px-4" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input type="tel" className="w-full border border-zinc-300 rounded-md h-12 px-4" placeholder="07XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea className="w-full border border-zinc-300 rounded-md p-4 min-h-[120px]" placeholder="How can we help you?"></textarea>
            </div>
            <button type="button" className="bg-zinc-900 text-white h-12 rounded-md font-medium hover:bg-zinc-800 transition-colors">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
