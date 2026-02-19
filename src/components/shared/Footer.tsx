// src/components/shared/Footer.tsx

export default function Footer() {
  return (
    // Menggunakan warna oklch background yang sedikit lebih gelap untuk kedalaman visual
    <footer className="bg-[oklch(0.88_0.04_75)] border-t border-[oklch(0.85_0.05_75)] py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">

        {/* Teks Copyright dengan warna Coklat Muted agar menyatu */}
        <p className="text-[oklch(0.45_0.08_35)] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} <span className="mx-2 opacity-20">|</span> 
          Explore Celebes <span className="text-[oklch(0.32_0.10_25)] ml-1">@aksaex</span>
        </p>

      </div>
    </footer>
  );
}