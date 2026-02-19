"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; // Tambahkan useSearchParams

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryBar({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  
  // Ambil parameter kategori aktif dari URL
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`, { scroll: false });
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Visual tetap sama */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <span className="text-[oklch(0.58_0.18_45)] font-bold tracking-[0.4em] text-[10px] uppercase block animate-in fade-in slide-in-from-left-4 duration-1000">
            Rekomendasi Terkurasi
          </span>
          <h2 className="text-5xl md:text-7xl font-serif text-[oklch(0.25_0.06_35)] tracking-tight leading-none">
            Pilihan <span className="italic opacity-60">Terbaik</span> <br className="md:hidden" /> Hari Ini
          </h2>
        </div>
      </div>

      <div className="pt-10 border-t border-[oklch(0.85_0.05_75)] flex flex-col gap-8">
        {/* Form Pencarian tetap sama */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-[oklch(0.45_0.08_35)] group-focus-within:text-[oklch(0.32_0.10_25)] transition-colors" />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari menu favorit..."
            className="w-full h-14 pl-14 pr-6 rounded-2xl bg-[oklch(0.88_0.04_75)]/50 border border-[oklch(0.85_0.05_75)] text-sm text-[oklch(0.25_0.06_35)] focus:bg-[oklch(0.95_0.03_75)] focus:ring-4 focus:ring-[oklch(0.32_0.10_25)]/5 outline-none transition-all"
          />
        </form>

        {/* Scroll Kategori dengan LOGIKA ACTIVE STATE */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x scroll-px-6">
          <Link 
            href="/" 
            scroll={false}
            className={`snap-start px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 shadow-md ${
              !activeCategory 
                ? "bg-[oklch(0.32_0.10_25)] text-[oklch(0.92_0.04_75)]" // Coklat jika Aktif
                : "bg-[oklch(0.95_0.03_75)] text-[oklch(0.25_0.06_35)] border border-[oklch(0.85_0.05_75)]" // Krem jika Tidak
            }`}
          >
            Semua Menu
          </Link>
          
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug; // Cek apakah slug di URL sama dengan slug tombol
            return (
              <Link 
                key={cat.id} 
                href={`/?category=${cat.slug}`} 
                scroll={false}
                className={`snap-start px-7 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? "bg-[oklch(0.32_0.10_25)] text-[oklch(0.92_0.04_75)] shadow-lg" // Coklat Aktif
                    : "bg-[oklch(0.95_0.03_75)] border border-[oklch(0.85_0.05_75)] text-[oklch(0.25_0.06_35)] hover:border-[oklch(0.58_0.18_45)]"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}