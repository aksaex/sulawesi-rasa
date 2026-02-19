// src/app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import AddProductForm from "@/components/business/AddProductForm";
import UploadProfileImage from "@/components/business/UploadProfileImage";
import EditProductModal from "@/components/business/EditProductModal";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Clock, MapPin, Phone, CheckCircle } from "lucide-react";
import { 
  updateBusinessProfile, 
  deleteProduct 
} from "@/lib/actions";

export default async function DashboardPage() {
  const session = await auth();
  
  // Proteksi Dasar: Wajib Login & Bukan Admin
  if (!session?.user) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  // Ambil data bisnis milik owner yang sedang login beserta produk dan kategorinya
  const business = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
    include: { 
      products: { orderBy: { createdAt: 'desc' } },
      category: true
    }
  });

  // Ambil semua kategori untuk dropdown pemilihan kategori
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  if (!business) return redirect("/register");

  // Format jam operasional sederhana (mengambil field display dari JSON)
  const hours = business.operatingHours as any;

  return (
    <main className="min-h-screen bg-[#FCFAF7] pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32">
        
        {/* Header Dashboard Responsif */}
        <header className="mb-10 border-b pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex gap-6 items-center">
            <div className="relative size-20 md:size-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-zinc-100 shrink-0">
              <Image src={business.imageMain} alt={business.name} fill className="object-cover" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-foreground">{business.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-zinc-500 text-sm">
                <MapPin className="size-4" />
                <span className="truncate max-w-[200px] md:max-w-md">{business.address}</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border shadow-sm w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Status Verifikasi Admin</span>
            <div className="flex items-center gap-2">
              <div className={`size-2 rounded-full ${business.isApproved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              <span className={`text-sm font-bold ${business.isApproved ? "text-emerald-600" : "text-amber-600"}`}>
                {business.isApproved ? "Terverifikasi & Tayang" : "Menunggu Moderasi Admin"}
              </span>
            </div>
          </div>
        </header>

        <Tabs defaultValue="list" className="w-full">
          {/* Scrollable Tabs untuk Mobile */}
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <TabsList className="inline-flex w-auto md:w-full justify-start md:justify-center bg-transparent gap-2">
              <TabsTrigger value="list" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white border transition-all">Daftar Menu</TabsTrigger>
              <TabsTrigger value="add" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white border transition-all">Tambah Menu</TabsTrigger>
              <TabsTrigger value="profile" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-white border transition-all">Pengaturan Bisnis</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Daftar Menu dengan Fitur Edit & Hapus */}
          <TabsContent value="list" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {business.products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-3xl border flex gap-4 items-center shadow-sm group hover:border-primary transition-all">
                  <div className="relative size-24 rounded-2xl overflow-hidden shrink-0 bg-zinc-50">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                    <div>
                      <h3 className="font-bold truncate text-foreground text-lg">{p.name}</h3>
                      <p className="text-primary font-bold">Rp {p.price.toLocaleString("id-ID")}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Fitur Edit Menu melalui Modal */}
                      <EditProductModal product={p} />

                      {/* Fitur Hapus Menu */}
                      <form action={async () => {
                        "use server";
                        await deleteProduct(p.id);
                      }}>
                        <button className="text-zinc-400 hover:text-rose-500 flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer">
                          <Trash2 className="size-3" /> Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
              {business.products.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl text-zinc-400">
                  Anda belum memposting menu apa pun.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 2: Tambah Menu */}
          <TabsContent value="add" className="mt-8">
            <AddProductForm businessId={business.id} />
          </TabsContent>

          {/* Tab 3: Pengaturan Profil, Kategori, & Jam Operasional */}
          <TabsContent value="profile" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Foto Profil Dinamis melalui Cloudinary */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-8 rounded-[32px] border shadow-sm text-center">
                  <h3 className="font-serif text-xl mb-6 text-foreground">Foto Profil UMKM</h3>
                  <div className="relative size-40 mx-auto rounded-[2rem] overflow-hidden mb-6 border-4 border-zinc-50 shadow-inner">
                    <Image src={business.imageMain} alt="Profile" fill className="object-cover" />
                  </div>
                  {/* Komponen Client untuk Upload Image ke Cloudinary */}
                  <UploadProfileImage businessId={business.id} />
                </div>
              </div>

              {/* Form Data Bisnis */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 md:p-10 rounded-[32px] border shadow-sm">
                  <form action={updateBusinessProfile} className="space-y-8">
                    <input type="hidden" name="businessId" value={business.id} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700">Nama UMKM</label>
                        <Input name="name" defaultValue={business.name} className="h-12 rounded-xl" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2 text-zinc-700">
                          <Phone className="size-4" /> WhatsApp (628...)
                        </label>
                        <Input name="whatsapp" defaultValue={business.whatsapp} placeholder="628123456789" className="h-12 rounded-xl" required />
                      </div>
                    </div>

                    {/* Fitur Pemilihan Kategori yang Dinamis */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Kategori Jenis Kuliner</label>
                      <select 
                        name="categoryId" 
                        className="w-full h-12 rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 shadow-xs"
                        defaultValue={business.category?.id || ""}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-zinc-400 italic">*Ini akan menggantikan tulisan kategori di halaman profil Anda.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">Alamat Fisik</label>
                      <Input name="address" defaultValue={business.address} className="h-12 rounded-xl" required />
                    </div>

                    {/* Checkbox Status Halal */}
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <input 
                        type="checkbox" 
                        name="isHalal" 
                        id="isHalal" 
                        defaultChecked={business.isHalal}
                        className="size-5 accent-emerald-600 cursor-pointer" 
                      />
                      <label htmlFor="isHalal" className="text-sm font-bold text-emerald-800 flex items-center gap-2 cursor-pointer">
                        <CheckCircle className="size-4" /> Produk Kami Dijamin Halal
                      </label>
                    </div>

                    {/* Jam Operasional Sederhana */}
                    <div className="space-y-2 pt-4">
                      <label className="text-sm font-bold flex items-center gap-2 text-zinc-700">
                        <Clock className="size-4" /> Jam Pelayanan Chat (WITA)
                      </label>
                      <Input 
                        name="simpleHours" 
                        defaultValue={hours?.display || "Setiap Hari, 08:00 - 21:00"} 
                        placeholder="Contoh: Senin - Sabtu, 08:00 - 20:00"
                        className="h-12 rounded-xl" 
                      />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary text-white rounded-2xl h-14 text-lg font-bold mt-6 shadow-lg transition-all">
                      Simpan Seluruh Perubahan
                    </Button>
                  </form>
                </div>
              </div>

            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}