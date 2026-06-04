"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);

  const numbers = [
    { label: "Sales & Inquiries", number: "254704626085", display: "0704 626 085" },
    { label: "Customer Support", number: "254715153820", display: "0715 153 820" },
    { label: "Custom Orders", number: "254726585787", display: "0726 585 787" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-4 w-72 bg-white rounded-lg shadow-xl border border-zinc-200 overflow-hidden">
          <div className="bg-zinc-950 text-white p-4">
            <h4 className="font-bold">Chat with us</h4>
            <p className="text-xs text-zinc-300">Choose a department to chat on WhatsApp</p>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {numbers.map((n, i) => (
              <a 
                key={i}
                href={`https://wa.me/${n.number}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-md transition-colors"
              >
                <div className="bg-[#25D366]/10 p-2 rounded-full text-[#25D366]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-zinc-900">{n.label}</p>
                  <p className="text-xs text-zinc-500">{n.display}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#1DA851] transition-transform hover:scale-105"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
}
