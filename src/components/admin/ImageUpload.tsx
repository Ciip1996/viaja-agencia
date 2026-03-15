"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  bucket?: string;
}

export default function ImageUpload({
  value,
  onChange,
  bucket = "images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setUploading(true);

      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(path);

        onChange(publicUrl);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    },
    [bucket, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  if (value) {
    return (
      <div className="relative group w-full rounded-xl overflow-hidden border border-border bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Preview"
          className="w-full h-40 object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-error/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Eliminar imagen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 w-full h-40",
        "border-2 border-dashed rounded-xl cursor-pointer",
        "transition-colors duration-200",
        dragOver
          ? "border-secondary bg-secondary/5"
          : "border-border hover:border-secondary/50 bg-background"
      )}
    >
      {uploading ? (
        <>
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <span className="text-sm text-text-muted">Subiendo...</span>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-sm text-text-muted">
            Arrastra o haz clic para subir
          </span>
          <span className="text-xs text-text-light">
            PNG, JPG, WebP hasta 5MB
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
