"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { updateBusinessImage } from "@/lib/actions";

export default function UploadProfileImage({ businessId }: { businessId: string }) {
  return (
    <CldUploadWidget 
      uploadPreset="sulawesi-rasa" // Pastikan preset ini ada di Cloudinary Anda
      onSuccess={async (result: any) => {
        await updateBusinessImage(businessId, result.info.secure_url);
      }}
    >
      {({ open }) => (
        <Button 
          variant="outline" 
          onClick={() => open()} 
          className="w-full rounded-2xl gap-2 h-12"
        >
          <Camera className="size-4" /> Ganti Foto Profil
        </Button>
      )}
    </CldUploadWidget>
  );
}