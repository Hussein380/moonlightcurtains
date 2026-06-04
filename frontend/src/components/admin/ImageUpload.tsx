"use client";

import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onAdd: (url: string) => void;
  onRemove: (url: string) => void;
}

export default function ImageUpload({ value, onAdd, onRemove }: ImageUploadProps) {
  const onUpload = (result: any) => {
    onAdd(result.info.secure_url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-zinc-200">
            <div className="absolute top-2 right-2 z-10">
              <button type="button" onClick={() => onRemove(url)} className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Image fill className="object-cover" alt="Uploaded Image" src={url} />
          </div>
        ))}
      </div>

      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset="moonlight_preset"
        options={{
          multiple: true,
          maxFiles: 10,
          sources: ["local", "camera"],
          clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
          maxFileSize: 10000000 // 10MB
        }}
      >
        {({ open }) => {
          return (
            <button 
              type="button" 
              onClick={() => open()}
              className="flex items-center gap-3 px-4 py-6 bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:border-[#D4AF37] active:bg-zinc-200 transition-colors w-full justify-center min-h-[80px] touch-manipulation"
            >
              <UploadCloud className="w-8 h-8 text-zinc-400 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-zinc-700">Tap to upload images</p>
                <p className="text-sm text-zinc-500">Camera or Gallery • JPG, PNG, WebP</p>
              </div>
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
