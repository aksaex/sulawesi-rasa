// src/components/admin/ClientButtons.tsx
"use client";

import { Trash2 } from "lucide-react";
import { deleteUser, deleteCategory } from "@/lib/actions";

export function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <button 
      onClick={async () => {
        if (window.confirm("Hapus pengguna ini selamanya?")) {
          await deleteUser(userId);
        }
      }} 
      className="text-rose-400 hover:text-rose-600 p-2 transition-colors"
    >
      <Trash2 className="size-5" />
    </button>
  );
}

export function DeleteCategoryButton({ catId, catName }: { catId: string; catName: string }) {
  return (
    <button 
      onClick={async () => {
        if (window.confirm(`Hapus kategori "${catName}"? Bisnis di dalamnya akan pindah ke "Umum".`)) {
          await deleteCategory(catId);
        }
      }} 
      className="text-zinc-300 group-hover:text-rose-500 transition-colors"
    >
      <Trash2 className="size-4" />
    </button>
  );
}