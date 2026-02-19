"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogOut, LayoutDashboard, Loader2, User } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      // Threshold 50px untuk transisi yang mulus
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoading = status === "loading";
  
  // LOGIKA WARNA: 
  // Jika di Home & belum scroll -> Transparan (Teks Putih)
  // Jika sudah scroll atau di halaman lain -> Warna Krem Bone (Teks Coklat Tua)
  const isSolid = !isHomePage || isScrolled;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isSolid 
          ? "bg-[oklch(0.92_0.04_75)]/90 backdrop-blur-xl py-3 md:py-4 shadow-sm border-b border-[oklch(0.85_0.05_75)]" 
          : "bg-transparent py-6 md:py-10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO: Menggunakan variabel foreground agar senada dengan teks lainnya */}
        <Link 
          href="/" 
          className={`text-xl md:text-2xl font-black tracking-tighter transition-colors duration-500 shrink-0 ${
            isSolid ? "text-[oklch(0.25_0.06_35)]" : "text-white"
          }`}
        >
          SULAWESI<span className="text-[oklch(0.58_0.18_45)] italic">RASA</span>
        </Link>

        {/* MENU TENGAH: Menggunakan font-bold dan tracking lebar khas web mewah */}
        <div className={`hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
          isSolid ? "text-[oklch(0.45_0.08_35)]" : "text-white/80"
        }`}>
          <Link href="/" className="hover:text-[oklch(0.58_0.18_45)] transition-colors">Home</Link>
          <Link href="/register" className="hover:text-[oklch(0.58_0.18_45)] transition-colors">Join UMKM</Link>
        </div>
        
        {/* ACTION AREA */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="animate-spin size-5 text-[oklch(0.85_0.05_75)]" />
          ) : !session ? (
            <Link href="/login">
              <Button 
                className={`rounded-full text-[10px] font-bold px-6 h-10 transition-all duration-500 shadow-xl ${
                  isSolid 
                    ? "bg-[oklch(0.32_0.10_25)] text-[oklch(0.92_0.04_75)] hover:bg-[oklch(0.25_0.06_35)]" 
                    : "bg-white text-[oklch(0.25_0.06_35)] hover:scale-105"
                }`}
              >
                Mulai Berjualan
              </Button>
            </Link>
          ) : (
            /* Area Dashboard & Keluar: Latar belakang mengikuti tema Heritage */
            <div className={`flex items-center gap-2 p-1 pr-4 rounded-full border transition-all duration-500 ${
              isSolid 
                ? "bg-[oklch(0.88_0.04_75)] border-[oklch(0.85_0.05_75)]" 
                : "bg-white/10 border-white/20 backdrop-blur-md"
            }`}>
              {/* Profile Icon / Dashboard Link */}
              <Link 
                href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"} 
                className={`flex items-center gap-2 text-[10px] font-bold ml-2 transition-colors uppercase tracking-widest ${
                  isSolid ? "text-[oklch(0.25_0.06_35)] hover:text-[oklch(0.58_0.18_45)]" : "text-white hover:text-[oklch(0.78_0.12_85)]"
                }`}
              >
                <div className={`size-7 rounded-full flex items-center justify-center border ${isSolid ? "bg-white border-zinc-200" : "bg-white/20 border-white/40"}`}>
                   <User className="size-3.5" />
                </div>
                <span className="hidden sm:inline">
                  {session.user.role === "ADMIN" ? "Admin" : "Dashboard"}
                </span>
              </Link>

              <div className={`h-4 w-[1px] mx-1 ${isSolid ? "bg-[oklch(0.85_0.05_75)]" : "bg-white/30"}`} />

              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className={`transition-colors flex items-center gap-2 group ${
                  isSolid ? "text-[oklch(0.45_0.08_35)] hover:text-rose-600" : "text-white/70 hover:text-rose-400"
                }`}
              >
                <LogOut className="size-3.5 group-hover:translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}