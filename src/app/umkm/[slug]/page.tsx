// src/app/umkm/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/business/ProductGrid";
import { getBusinessStatus } from "@/lib/utils/business-hours";
import { Clock, MapPin, Sparkles } from "lucide-react"; // Tambahkan Sparkles untuk estetika
import ShareButton from "@/components/business/ShareButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const business = await prisma.business.findUnique({
    where: { slug: slug },
    include: { 
      products: { orderBy: { createdAt: 'desc' } }, 
      category: true 
    },
  });

  if (!business) notFound();

  const status = getBusinessStatus(business.operatingHours);

  return (
    // Menggunakan warna background Heritage Earth yang hangat
    <main className="min-h-screen bg-[oklch(0.92_0.04_75)] pt-20 md:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Section: Card Style dengan warna krem terang */}
        <div className="bg-[oklch(0.95_0.03_75)] rounded-[2.5rem] md:rounded-[3.5rem] border border-[oklch(0.85_0.05_75)] overflow-hidden shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Visual: Image Section */}
            <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[350px] md:min-h-[500px]">
              <Image 
                src={business.imageMain} 
                alt={business.name} 
                fill 
                className="object-cover"
                priority 
              />
              {/* Overlay halus agar gambar menyatu dengan card */}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
            </div>
            
            {/* Info Section: Padding besar untuk kemewahan */}
            <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Link href={`/?category=${business.category?.slug}`}>
                    <Badge className="bg-[oklch(0.32_0.10_25)] text-[oklch(0.92_0.04_75)] hover:bg-[oklch(0.58_0.18_45)] border-none px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all">
                      {business.category?.name || "Umum"}
                    </Badge>
                  </Link>
                  {business.isHalal && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      Halal
                    </Badge>
                  )}
                </div>
                {/* Tombol Bagikan dipindah ke samping kategori agar eye-catching */}
                <ShareButton businessName={business.name} />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-serif text-[oklch(0.25_0.06_35)] leading-[1.1]">
                  {business.name}
                </h1>
                <p className="text-[oklch(0.45_0.08_35)] text-lg italic font-serif leading-relaxed opacity-80">
                  "{business.description}"
                </p>
              </div>
              
              <div className="space-y-5 pt-8 border-t border-[oklch(0.85_0.05_75)]">
                <div className="flex items-start gap-4 text-[oklch(0.25_0.06_35)]">
                  <div className="size-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[oklch(0.85_0.05_75)]">
                    <MapPin className="w-5 h-5 text-[oklch(0.58_0.18_45)]" />
                  </div>
                  <span className="text-sm md:text-base font-medium pt-2">{business.address}</span>
                </div>

                <div className="flex items-center gap-4 text-[oklch(0.25_0.06_35)]">
                  <div className="size-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[oklch(0.85_0.05_75)]">
                    <Clock className="w-5 h-5 text-[oklch(0.58_0.18_45)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black uppercase tracking-widest ${status.isOpen ? "text-emerald-600" : "text-rose-600"}`}>
                      {status.message}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Zona Waktu WITA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section: Fokus pada produk */}
        <div className="space-y-12 pt-10">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-3 text-[oklch(0.58_0.18_45)]">
               <Sparkles className="size-5" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">Signature Menu</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-[oklch(0.25_0.06_35)]">Kelezatan Warisan</h2>
            <div className="h-1.5 w-20 bg-[oklch(0.32_0.10_25)] rounded-full" />
          </div>
          
          <div className="bg-transparent">
            {business.products.length > 0 ? (
              <ProductGrid 
                products={business.products.map(p => ({
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  description: p.description,
                  image: p.image,
                  businessName: business.name,
                  businessSlug: business.slug,
                  whatsapp: business.whatsapp
                }))} 
              />
            ) : (
              <div className="text-center py-32 rounded-[3rem] border-4 border-dashed border-[oklch(0.85_0.05_75)] text-[oklch(0.45_0.08_35)] font-serif italic text-xl bg-white/30 backdrop-blur-sm">
                Petualangan rasa baru akan segera dimulai di sini.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}