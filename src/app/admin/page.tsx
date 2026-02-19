// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CheckCircle, User, Store, Tag, Plus, ShieldAlert, AlertCircle } from "lucide-react";
import { approveBusiness, createCategory } from "@/lib/actions";
import ResetPasswordButton from "@/components/admin/ResetPasswordButton";
import { DeleteUserButton, DeleteCategoryButton } from "@/components/admin/ClientButtons";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") redirect("/");

  try {
    const [pendingUMKM, allUsers, allCategories] = await Promise.all([
      prisma.business.findMany({ where: { isApproved: false }, include: { owner: true } }),
      prisma.user.findMany({ include: { businesses: true }, orderBy: { createdAt: 'desc' } }),
      prisma.category.findMany({ orderBy: { name: 'asc' } })
    ]);

    return (
      <main className="min-h-screen bg-[#FCFAF7] pt-32 px-4 md:px-6 pb-20">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground flex items-center justify-center md:justify-start gap-3">
              <ShieldAlert className="size-8 text-primary" /> Admin Central Panel
            </h1>
            <p className="text-zinc-500 mt-2 italic text-sm">Otoritas penuh untuk mengelola ekosistem Sulawesi Rasa.</p>
          </header>

          <Tabs defaultValue="moderation" className="w-full">
            <div className="overflow-x-auto no-scrollbar mb-8">
              <TabsList className="inline-flex w-auto md:w-full justify-start md:justify-center bg-zinc-100/50 p-1 rounded-2xl border">
                <TabsTrigger value="moderation" className="rounded-xl px-6 md:px-10 data-[state=active]:shadow-md">
                  Moderasi ({pendingUMKM.length})
                </TabsTrigger>
                <TabsTrigger value="users" className="rounded-xl px-6 md:px-10 data-[state=active]:shadow-md">
                  Daftar User ({allUsers.length})
                </TabsTrigger>
                <TabsTrigger value="categories" className="rounded-xl px-6 md:px-10 data-[state=active]:shadow-md">
                  Kelola Kategori
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: MODERASI UMKM */}
            <TabsContent value="moderation" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {pendingUMKM.map((umkm) => (
                <div key={umkm.id} className="bg-white p-6 rounded-[32px] border flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-xl flex items-center gap-2 text-foreground truncate">
                      <Store className="size-5 text-primary shrink-0" /> {umkm.name}
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">
                      Pemilik: <span className="font-medium text-zinc-700">{umkm.owner?.name}</span> ({umkm.owner?.email})
                    </p>
                  </div>
                  {/* PERBAIKAN ERROR BIND DI SINI */}
                  <form action={async () => {
                    "use server";
                    await approveBusiness(umkm.id);
                  }} className="w-full md:w-auto">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 h-12 gap-2 font-bold transition-all shadow-lg shadow-emerald-100">
                      <CheckCircle className="size-4" /> Setujui UMKM
                    </Button>
                  </form>
                </div>
              ))}
              {pendingUMKM.length === 0 && (
                <div className="py-24 text-center border-4 border-dashed rounded-[40px] text-zinc-400 bg-white/50">
                  <p className="font-serif italic text-lg">Semua UMKM sudah terverifikasi.</p>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: DAFTAR USER */}
            <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white rounded-[32px] border overflow-hidden shadow-sm">
                <div className="divide-y">
                  {allUsers.map((u) => (
                    <div key={u.id} className="p-6 hover:bg-zinc-50/50 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {u.name?.[0] || <User className="size-5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate">{u.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex md:block">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${u.role === 'ADMIN' ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-600'}`}>{u.role}</span>
                        </div>
                        <div className="text-sm text-zinc-600 flex items-center gap-2">
                          <Store className="size-4 md:hidden text-zinc-400" />
                          <span className="truncate">{u.businesses.length > 0 ? u.businesses[0].name : "Tidak Ada Bisnis"}</span>
                        </div>
                        <div className="flex justify-start md:justify-end items-center gap-2 pt-4 md:pt-0 border-t md:border-none">
                          {u.role !== 'ADMIN' ? (
                            <>
                              <ResetPasswordButton userId={u.id} />
                              <DeleteUserButton userId={u.id} /> {/* PERBAIKAN TOMBOL DELETE USER */}
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-zinc-300 italic px-2">Protected Account</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: KELOLA KATEGORI */}
            <TabsContent value="categories" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white p-8 md:p-10 rounded-[40px] border shadow-sm max-w-xl mx-auto">
                <h3 className="text-2xl font-serif mb-6 flex items-center gap-2">
                  <Plus className="size-6 text-primary" /> Kategori Baru
                </h3>
                <form action={async (formData) => {
                  "use server";
                  const name = formData.get("categoryName") as string;
                  await createCategory(name);
                }} className="space-y-4">
                  <Input name="categoryName" placeholder="Contoh: Snack, Minuman" required className="h-14 rounded-2xl bg-zinc-50/50" />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary text-white rounded-2xl h-14 font-bold transition-all shadow-lg">Tambah Kategori</Button>
                </form>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-[40px] border shadow-sm max-w-4xl mx-auto">
                <h3 className="text-2xl font-serif mb-8 flex items-center gap-2">
                  <Tag className="size-6 text-primary" /> Daftar Kategori Saat Ini
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border hover:border-primary/30 transition-all group">
                      <span className="font-bold text-zinc-700 truncate">{cat.name}</span>
                      {cat.slug !== "umum" && (
                        <DeleteCategoryButton catId={cat.id} catName={cat.name} /> /* PERBAIKAN DELETE KATEGORI */
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFAF7] p-6">
        <div className="text-center p-10 bg-white rounded-[40px] shadow-sm border max-w-md">
          <AlertCircle className="size-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Masalah Koneksi Database</h2>
          <p className="text-zinc-500 mb-6 text-sm italic">Database Neon sedang dalam mode sleep atau koneksi terputus.</p>
          {/* PERBAIKAN ONCLICK DI SINI */}
          <Link href="/admin" className="block w-full">
            <Button className="w-full rounded-2xl">Muat Ulang</Button>
          </Link>
        </div>
      </div>
    );
  }
}