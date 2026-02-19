// src/components/shared/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    // h-screen memastikan Slide 1 memenuhi seluruh layar laptop & hp secara presisi
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#031a1b]">
      
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        {/* Overlay Gradient disesuaikan: 
            - Gelap di atas (from-black/70) agar Navbar transparan terbaca.
            - Netral di tengah (via-transparent) agar rempah-rempah asli terlihat jelas.
            - Gelap tipis di bawah (to-black/20) hanya untuk kedalaman, tanpa cahaya putih yang menutupi gambar.
        */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/20 z-10" />
        
        <Image 
          src="/image/hero.png" 
          alt="Rempah Sulawesi"
          priority
          fill
          // object-cover memastikan gambar 1344x768 menutupi layar tanpa distorsi
          // animate-slow-zoom dihapus agar gambar tidak bergoyang sesuai permintaan
          className="object-cover object-center opacity-80" 
        />
      </div>

      {/* Konten Utama: Murni Visual & Tipografi */}
      <div className="container relative z-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-none">
            PLATFROM UMKM<br /> 
            <span className="text-secondary">SULAWESI</span>
          </h1>
          
          <p className="text-white leading-none">
            Jelajahi kelezatan kuliner warisan leluhur <br className="hidden md:block" /> 
            dari penjuru Sulawesi dalam satu genggaman.
          </p>
        </motion.div>
      </div>
    </section>
  );
}