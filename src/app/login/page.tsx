"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password tidak terdaftar di sistem kami.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan pada sistem. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4 md:px-6 relative overflow-hidden">
      {/* BACKGROUND IMAGE - Opacity 80% sesuai permintaan */}
      <Image 
        src="/image/hero.png" 
        alt="Rempah Sulawesi"
        priority
        fill
        className="object-cover object-center opacity-80"
      />

      {/* OVERLAY: Membantu keterbacaan teks di atas gambar yang terang */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[oklch(0.92_0.04_75)]/50 -z-10" />

      <div className="w-full max-w-[440px] z-10">
        {/* CARD: Radius disesuaikan agar tidak terlalu bulat di HP (rounded-3xl) */}
        <div className="bg-white/85 backdrop-blur-2xl border border-white/50 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
          
          {/* Header Card */}
          <div className="p-8 md:p-10 pb-4 md:pb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-serif text-[oklch(0.25_0.06_35)] leading-tight">
              Akses <span className="italic opacity-60">Dashboard</span>
            </h1>
            <p className="text-[oklch(0.45_0.08_35)] text-xs md:text-sm mt-3 font-medium">
              Masuk untuk mengelola gerai UMKM Anda
            </p>
          </div>

          <div className="px-7 md:px-10 pb-8 md:pb-10 space-y-5 md:space-y-6">
            {error && (
              <div className="p-3 md:p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl md:rounded-2xl flex items-center gap-3 text-[10px] md:text-xs font-medium animate-in fade-in zoom-in-95 duration-300">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="space-y-1.5 md:space-y-2">
                {/* LABEL: Tracking dan ukuran disesuaikan agar rapi di HP */}
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[oklch(0.45_0.08_35)] ml-1">
                  Email Bisnis
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[oklch(0.45_0.08_35)] group-focus-within:text-[oklch(0.32_0.10_25)] transition-colors" />
                  <Input 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="nama@warung.com" 
                    className="rounded-xl md:rounded-2xl h-12 md:h-14 pl-12 bg-white/50 border-[oklch(0.85_0.05_75)] focus:bg-white focus:ring-4 focus:ring-[oklch(0.32_0.10_25)]/5 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[oklch(0.45_0.08_35)] ml-1">
                  Kata Sandi
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[oklch(0.45_0.08_35)] group-focus-within:text-[oklch(0.32_0.10_25)] transition-colors" />
                  <Input 
                    name="password" 
                    type="password" 
                    required 
                    placeholder="sulawesi123" 
                    className="rounded-xl md:rounded-2xl h-12 md:h-14 pl-12 bg-white/50 border-[oklch(0.85_0.05_75)] focus:bg-white focus:ring-4 focus:ring-[oklch(0.32_0.10_25)]/5 transition-all text-sm"
                  />
                </div>
              </div>

              <Button 
                disabled={loading} 
                className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl bg-[oklch(0.32_0.10_25)] hover:bg-[oklch(0.25_0.06_35)] text-[oklch(0.92_0.04_75)] font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Menyinkronkan..." : "Masuk Sekarang"}
              </Button>
            </form>

            <div className="pt-4 border-t border-[oklch(0.85_0.05_75)] text-center">
              <p className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-[oklch(0.45_0.08_35)]">
                Belum Tergabung?{" "}
                <Link href="/register" className="text-[oklch(0.58_0.18_45)] hover:underline ml-1">
                  Daftar UMKM Baru
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}