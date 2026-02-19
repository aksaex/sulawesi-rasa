// src/lib/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * 1. REGISTRASI & AUTO-BUSINESS
 * Mendaftarkan user sebagai OWNER dan otomatis membuatkan profil bisnis default.
 */
export async function registerOwner(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "Semua field wajib diisi" };

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "Email sudah terdaftar" };

    const hashedPassword = await bcrypt.hash(password, 10);

    // Memastikan ada kategori default di database agar registrasi tidak error
    let category = await prisma.category.findFirst({
      where: { slug: "umum" }
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Umum", slug: "umum" }
      });
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "OWNER",
        },
      });

      const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 1000);

      await tx.business.create({
        data: {
          name: `Warung ${name}`,
          slug,
          description: "Selamat datang di UMKM kami!",
          address: "Alamat belum diatur",
          whatsapp: "628", 
          ownerId: user.id,
          categoryId: category!.id,
          imageMain: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
          isApproved: false, 
          operatingHours: { display: "Setiap Hari, 09:00 - 21:00" }
        }
      });
    });
  } catch (err) {
    return { error: "Gagal mendaftar, silakan coba lagi" };
  }
  redirect("/login");
}

/**
 * 2. UPDATE PROFIL BISNIS
 * Mengelola informasi bisnis, nomor WA dinamis, status halal, kategori, dan jam operasional.
 */
export async function updateBusinessProfile(formData: FormData) {
  const businessId = formData.get("businessId") as string;
  const name = formData.get("name") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const address = formData.get("address") as string;
  const isHalal = formData.get("isHalal") === "on";
  const simpleHours = formData.get("simpleHours") as string;
  const categoryId = formData.get("categoryId") as string; 

  try {
    await prisma.business.update({
      where: { id: businessId },
      data: { 
        name, 
        whatsapp: whatsapp.replace(/[^0-9]/g, ""), // Membersihkan karakter non-angka
        address, 
        isHalal,
        // PERBAIKAN: Menggunakan connect agar Prisma menghubungkan ID relasi dengan benar
        category: categoryId ? { connect: { id: categoryId } } : undefined, 
        operatingHours: { display: simpleHours } 
      }
    });
    
    // Refresh halaman agar perubahan kategori dll langsung terlihat
    revalidatePath("/dashboard");
    revalidatePath(`/umkm/${businessId}`); 
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating business:", error);
    return { error: "Gagal memperbarui profil" };
  }
}

/**
 * 3. UPDATE FOTO PROFIL BISNIS
 */
export async function updateBusinessImage(businessId: string, imageUrl: string) {
  try {
    await prisma.business.update({
      where: { id: businessId },
      data: { imageMain: imageUrl }
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui foto utama" };
  }
}

/**
 * 4. CRUD PRODUK
 */
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  image: string;
  businessId: string;
}) {
  try {
    await prisma.product.create({
      data: { ...data },
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menambahkan menu" };
  }
}

export async function updateProduct(formData: FormData) {
  const productId = formData.get("productId") as string;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const description = formData.get("description") as string;

  if (!productId) return { error: "ID Produk tidak ditemukan" };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { name, price, description }
    });
    revalidatePath("/dashboard");
    revalidatePath("/"); 
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui menu" };
  }
}

export async function updateProductImage(productId: string, imageUrl: string) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { image: imageUrl }
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui foto produk" };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus produk" };
  }
}

/**
 * 5. MODERASI & MANAJEMEN ADMIN
 */
export async function createCategory(name: string) {
  const slug = name.toLowerCase().replace(/ /g, "-");
  try {
    await prisma.category.create({
      data: { name, slug }
    });
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Kategori sudah ada atau gagal dibuat" };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Cari kategori "Umum" atau buat jika belum ada sebagai penampung bisnis yang kategorinya dihapus
      let defaultCategory = await tx.category.findFirst({
        where: { slug: "umum" }
      });

      if (!defaultCategory) {
        defaultCategory = await tx.category.create({
          data: { name: "Umum", slug: "umum" }
        });
      }

      // 2. Alihkan semua bisnis yang menggunakan kategori yang akan dihapus ke kategori "Umum"
      await tx.business.updateMany({
        where: { categoryId: categoryId },
        data: { categoryId: defaultCategory.id }
      });

      // 3. Hapus kategori target
      await tx.category.delete({
        where: { id: categoryId }
      });
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus kategori" };
  }
}

export async function resetUserPassword(userId: string) {
  const hashedPassword = await bcrypt.hash("sulawesi123", 10); 
  
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Gagal mereset password" };
  }
}

export async function approveBusiness(businessId: string) {
  try {
    await prisma.business.update({
      where: { id: businessId },
      data: { isApproved: true }
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menyetujui UMKM" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      const business = await tx.business.findFirst({ where: { ownerId: userId } });
      if (business) {
        await tx.product.deleteMany({ where: { businessId: business.id } });
        await tx.business.delete({ where: { id: business.id } });
      }
      await tx.user.delete({ where: { id: userId } });
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus pengguna" };
  }
}