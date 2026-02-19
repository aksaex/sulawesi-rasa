"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Camera } from "lucide-react";
import { updateProduct, updateProductImage } from "@/lib/actions";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

export default function EditProductModal({ product }: { product: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.image);

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await updateProduct(formData);
    if (res.success) setIsOpen(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-zinc-400 hover:text-blue-500 flex items-center gap-1 text-xs font-medium transition-colors"
      >
        <Pencil className="size-3" /> Edit Menu
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-serif mb-6">Edit Menu</h3>
            
            {/* Bagian Ganti Foto Produk */}
            <div className="mb-6">
              <label className="text-sm font-bold block mb-2">Foto Produk</label>
              <CldUploadWidget 
                uploadPreset="sulawesi-rasa"
                onSuccess={async (result: any) => {
                  const newUrl = result.info.secure_url;
                  setCurrentImage(newUrl);
                  await updateProductImage(product.id, newUrl);
                }}
              >
                {({ open }) => (
                  <div 
                    onClick={() => open()}
                    className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group border-2 border-zinc-100"
                  >
                    <Image src={currentImage} alt="Preview" fill className="object-cover transition-opacity group-hover:opacity-75" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20">
                      <Camera className="text-white size-8" />
                    </div>
                  </div>
                )}
              </CldUploadWidget>
              <p className="text-[10px] text-zinc-400 mt-2 italic text-center">*Klik gambar di atas untuk ganti foto</p>
            </div>

            <form onSubmit={handleEdit} className="space-y-4">
              <input type="hidden" name="productId" value={product.id} />
              
              <div className="space-y-2">
                <label className="text-sm font-bold">Nama Menu</label>
                <Input name="name" defaultValue={product.name} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Harga (Rp)</label>
                <Input name="price" type="number" defaultValue={product.price} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Deskripsi</label>
                <textarea 
                  name="description" 
                  defaultValue={product.description}
                  className="w-full p-3 rounded-xl border text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 rounded-xl">
                  Batal
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-primary text-white">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}