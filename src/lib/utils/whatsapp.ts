// src/lib/utils/whatsapp.ts

export const generateWAOrder = (phone: string, productName: string, businessName: string) => {
  const message = `Halo ${businessName}, saya tertarik memesan *${productName}* yang saya lihat di Sulawesi Rasa. Apakah tersedia?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};