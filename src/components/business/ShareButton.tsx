"use client";

import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  businessName: string;
}

export default function ShareButton({ businessName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isMobileShare, setIsMobileShare] = useState(false);

  // Pastikan deteksi navigator hanya berjalan di Client setelah mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setIsMobileShare(true);
    }
  }, []);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: businessName,
      text: `Cek kuliner enak ini: *${businessName}* di Sulawesi Rasa`,
      url: url,
    };

    if (isMobileShare) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share dibatalkan:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("Gagal menyalin link");
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-sm ${
        copied ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
      }`}
    >
      {copied ? (
        <>
          <Check className="size-4" /> Link Tersalin!
        </>
      ) : (
        <>
          <Share2 className="size-4" /> 
          <span className="md:inline">
            {isMobileShare ? "Bagikan Menu" : "Salin Link"}
          </span>
        </>
      )}
    </button>
  );
}