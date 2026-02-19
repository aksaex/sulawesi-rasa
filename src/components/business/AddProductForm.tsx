"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Package, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { createProduct } from "@/lib/actions"; // Import action yang baru dibuat

export default function AddProductForm({ businessId }: { businessId: string }) {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createProduct({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      image: imageUrl,
      businessId: businessId,
    });

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setImageUrl(""); // Reset form
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSuccess(false), 3000); // Hilangkan pesan sukses setelah 3 detik
    }
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-xl max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Package className="text-primary w-6 h-6" />
        <h2 className="text-2xl font-serif">Posting Dagangan Baru</h2>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 border border-emerald-100 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <p className="text-sm font-medium">Berhasil! Menu Anda sudah tayang di Micro-Website.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Foto Produk (Wajib)</label>
          <CldUploadWidget 
            uploadPreset="sulawesi-rasa"
            onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
          >
            {({ open }) => (
              <div 
                onClick={() => open()}
                className="relative aspect-video rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-all overflow-hidden bg-zinc-50/50"
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-zinc-300 mb-2" />
                    <span className="text-zinc-400 text-sm italic">Klik untuk upload foto dari galeri</span>
                  </>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Nama Menu</label>
            <Input name="name" required placeholder="Contoh: Coto Makassar" className="rounded-xl h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Harga (Rp)</label>
            <Input name="price" type="number" required placeholder="35000" className="rounded-xl h-12" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Deskripsi Kelezatan</label>
          <textarea 
            name="description"
            required
            className="w-full min-h-[100px] p-4 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
            placeholder="Jelaskan bahan-bahan atau rasa yang membuat menu ini spesial..."
          />
        </div>

        <Button 
          type="submit" 
          disabled={!imageUrl || loading}
          className="w-full h-14 bg-primary hover:bg-primary text-white rounded-2xl font-bold transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
        >
          {loading ? "Sedang Memproses..." : "Terbitkan Menu Sekarang"}
        </Button>
      </form>
    </div>
  );
}