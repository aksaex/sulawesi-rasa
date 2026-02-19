// src/components/admin/DeleteCategoryButton.tsx
"use client";

import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/lib/actions";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

export default function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const handleDelete = async () => {
    // Fungsi confirm() aman digunakan di sini karena ini adalah Client Component
    if (window.confirm(`Hapus kategori "${name}"? Bisnis di dalamnya akan otomatis pindah ke "Umum".`)) {
      await deleteCategory(id);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
      title="Hapus Kategori"
    >
      <Trash2 className="size-4" />
    </button>
  );
}