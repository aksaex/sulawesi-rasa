import { PrismaClient, PriceRange } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Bersihkan database (Opsional, agar tidak duplikat)
  await prisma.product.deleteMany()
  await prisma.business.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // 2. Buat User (Owner)
  const owner = await prisma.user.create({
    data: {
      name: "Andi Sultan",
      email: "owner@sulawesirasa.com",
      password: "password123", // Dalam realita harus di-hash
    }
  })

  // 3. Buat Kategori
  const catDaging = await prisma.category.create({ data: { name: "Olahan Daging", slug: "olahan-daging" } })
  const catMinuman = await prisma.category.create({ data: { name: "Minuman Tradisional", slug: "minuman-tradisional" } })

  // 4. Buat Bisnis (UMKM)
  const business = await prisma.business.create({
    data: {
      name: "Coto Makassar Premium Nusantara",
      slug: "coto-makassar-premium",
      description: "Resep turun temurun sejak 1970 dengan kuah rempah rahasia dan daging pilihan.",
      address: "Jl. Boulevard No. 12, Makassar",
      whatsapp: "628123456789",
      isHalal: true,
      priceRange: PriceRange.MID_RANGE,
      imageMain: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
      ownerId: owner.id,
      categoryId: catDaging.id,
      operatingHours: {
        monday: "08:00-22:00",
        tuesday: "08:00-22:00",
        wednesday: "08:00-22:00",
        thursday: "08:00-22:00",
        friday: "13:00-22:00",
        saturday: "08:00-23:00",
        sunday: "07:00-21:00"
      }
    }
  })

  // 5. Buat Produk untuk Bisnis tersebut
  await prisma.product.createMany({
    data: [
      {
        name: "Coto Daging Spesial",
        description: "Daging sapi pilihan dengan kuah kental kacang.",
        price: 35000,
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80",
        businessId: business.id
      },
      {
        name: "Ketupat Daun Pandan",
        description: "Lembut dan harum pandan.",
        price: 5000,
        image: "https://images.unsplash.com/photo-1585854467758-e21517af1aa0?auto=format&fit=crop&w=400&q=80",
        businessId: business.id
      }
    ]
  })

  console.log("✅ Seed Berhasil: Data UMKM Sulawesi telah masuk ke Database!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })