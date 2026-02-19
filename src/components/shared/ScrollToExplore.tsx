"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToExplore() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  useEffect(() => {
    // Jalankan scroll hanya jika ada parameter pencarian atau kategori
    if (search || category) {
      const element = document.getElementById("explore-section");
      if (element) {
        // Beri sedikit delay agar rendering Suspense selesai
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: "smooth",
            block: "start" 
          });
        }, 100000);
      }
    }
  }, [search, category]);

  return null;
}