"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  businessName: string;
  businessSlug: string;
  whatsapp: string;
}

export default function ProductGrid({ products }: { products: ProductProps[] }) {
  return (
    /* Perbaikan Poin 8: 
       Menggunakan grid-cols-2 pada layar kecil agar efisien di HP.
       Gap disesuaikan (gap-3 di HP, gap-8 di Desktop).
    */
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-zinc-100 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 flex flex-col"
        >
          {/* Link ke Detail UMKM dengan aspek rasio yang menyesuaikan perangkat */}
          <Link 
            href={`/umkm/${product.businessSlug}`} 
            className="block aspect-square md:aspect-[4/3] relative overflow-hidden bg-zinc-100"
          >
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Label Harga: Lebih kecil di mobile agar tidak menutupi gambar */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-sm text-[10px] md:text-xs font-bold text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </div>
          </Link>
          
          <div className="p-3 md:p-6 flex flex-col flex-1 justify-between">
            <div className="space-y-1 md:space-y-3">
              <Link href={`/umkm/${product.businessSlug}`}>
                <h3 className="text-sm md:text-xl font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-[10px] md:text-sm text-zinc-500 line-clamp-1 md:line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              
              {/* Identitas UMKM: Penting agar pembeli tahu siapa penjualnya */}
              <p className="text-[9px] md:text-xs font-medium text-zinc-400 uppercase tracking-wider truncate">
                {product.businessName}
              </p>
            </div>
            
            <div className="pt-3 md:pt-4">
               <Button 
                className="w-full bg-primary hover:bg-primary text-white rounded-xl md:rounded-2xl h-8 md:h-12 gap-1 md:gap-2 transition-all cursor-pointer text-[10px] md:text-sm font-bold shadow-sm"
                onClick={() => {
                  /* Perbaikan Poin 3 & 5: 
                     1. Membersihkan nomor WA dari karakter non-angka agar link tidak rusak.
                     2. Pesan otomatis dinamis mengambil data unik dari database.
                  */
                  const cleanPhone = product.whatsapp.replace(/[^0-9]/g, "");
                  const msg = encodeURIComponent(
                    `Halo ${product.businessName}, saya ingin pesan *${product.name}* yang saya lihat di Sulawesi Rasa.`
                  );
                  window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
                }}
              >
                <ShoppingBag className="size-3 md:size-4" />
                <span>Pesan</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}