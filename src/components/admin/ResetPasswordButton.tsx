"use client";

import { useState } from "react";
import { resetUserPassword } from "@/lib/actions";
import { Loader2, KeyRound, CheckCircle } from "lucide-react";

export default function ResetPasswordButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleReset() {
    if (!confirm("Reset password user ini menjadi 'sulawesi123'?")) return;
    
    setLoading(true);
    const res = await resetUserPassword(userId);
    setLoading(false);
    
    if (res.success) {
      setDone(true);
      setTimeout(() => setDone(false), 3000); // Reset status icon setelah 3 detik
    }
  }

  return (
    <button 
      onClick={handleReset}
      disabled={loading}
      className={`p-2 rounded-xl transition-all flex items-center gap-1 text-xs font-bold ${
        done ? "text-emerald-600 bg-emerald-50" : "text-blue-500 hover:bg-blue-50"
      }`}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : done ? (
        <>
          <CheckCircle className="size-4" /> Reset Berhasil
        </>
      ) : (
        <>
          <KeyRound className="size-4" /> Reset Pass
        </>
      )}
    </button>
  );
}