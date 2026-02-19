// src/app/page.tsx
import { Suspense } from "react";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import CategoryBar from "@/components/shared/CategoryBar";
import ProductGrid from "@/components/business/ProductGrid";
import Footer from "@/components/shared/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import ScrollToExplore from "@/components/shared/ScrollToExplore"; // Komponen Client Baru

/**
 * BusinessList (Server Component)
 * Mengambil data produk berdasarkan parameter pencarian dan kategori secara real-time.
 */
async function BusinessList({ search, category }: { search?: string; category?: string }) {
  const products = await prisma.product.findMany({
    where: {
      business: {
        isApproved: true,
        ...(category && { category: { slug: category } }),
      },
      OR: search ? [
        { name: { contains: search, mode: "insensitive" } },
        { business: { name: { contains: search, mode: "insensitive" } } }
      ] : undefined
    },
    include: { 
      business: { include: { category: true } } 
    },
    orderBy: { 
      createdAt: 'desc' 
    }
  });

  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    image: p.image,
    businessName: p.business.name,
    businessSlug: p.business.slug,
    whatsapp: p.business.whatsapp, 
  }));

  if (formattedProducts.length === 0) {
    return (
      <div className="text-center py-24 px-6 border-4 border-dashed rounded-[3rem] border-[oklch(0.85_0.05_75)] bg-[oklch(0.95_0.03_75)]/50">
        <p className="text-[oklch(0.45_0.08_35)] font-serif italic text-xl">
          {search ? `Menu "${search}" tidak ditemukan...` : "Belum ada menu di kategori ini."}
        </p>
        <p className="text-[oklch(0.25_0.06_35)]/60 text-sm mt-2 font-medium uppercase tracking-widest">
          Coba kata kunci lain atau pilih semua menu
        </p>
      </div>
    );
  }

  return <ProductGrid products={formattedProducts} />;
}

/**
 * PAGE UTAMA
 */
export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string; category?: string }> 
}) {
  const { search, category } = await searchParams;

  const categories = await prisma.category.findMany({ 
    orderBy: { name: 'asc' } 
  });

  return (
    <main className="min-h-screen bg-[oklch(0.92_0.04_75)] overflow-x-hidden">
      {/* Logic Scroll Client Side */}
      <Suspense>
        <ScrollToExplore />
      </Suspense>

      <Navbar />
      
      {/* SLIDE 1: Hero Section */}
      <Hero />
      
      {/* SLIDE 2: Explore Section */}
      <div id="explore-section" className="relative z-10 bg-[oklch(0.92_0.04_75)]">
        
        {/* Sticky Container */}
        <div className="sticky top-0 md:top-20 z-40 bg-[oklch(0.92_0.04_75)]/90 backdrop-blur-xl border-b border-[oklch(0.85_0.05_75)] shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Suspense fallback={<div className="h-20 animate-pulse bg-[oklch(0.88_0.04_75)] rounded-3xl" />}>
              <CategoryBar categories={categories} />
            </Suspense>
          </div>
        </div>
        
        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 min-h-screen">
          {(search || category) && (
            <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
              <span className="text-[oklch(0.58_0.18_45)] font-bold tracking-[0.3em] text-[10px] uppercase">
                Menampilkan Hasil
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-[oklch(0.25_0.06_35)] mt-2 capitalize">
                {search ? `“${search}”` : category ? `${category.replace(/-/g, ' ')}` : ""}
              </h2>
            </div>
          )}

          <Suspense key={search || category} fallback={<GridSkeleton />}>
            <BusinessList search={search} category={category} />
          </Suspense>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="aspect-[4/5] md:aspect-square w-full rounded-[2.5rem] bg-[oklch(0.88_0.04_75)]" />
      ))}
    </div>
  );
}