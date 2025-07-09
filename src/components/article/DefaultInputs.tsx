"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "../common/ComponentCard";
import Label from "../article/Label";
import Input from "../article/InputField"; // Pastikan ini menggunakan Input yang sudah diperbaiki
import FileInput from "../article/FileInput";

interface Category {
  id: number;
  nama: string;
}

interface ErrorItem {
  field: string;
  message: string;
}

interface CategoryFormProps {
  editMode?: boolean;
  id?: number;
}

export default function DefaultInputs({ editMode = false, id }: CategoryFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId] = useState(1);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  useEffect(() => {
    if (editMode && id) {
      fetchArticle(id);
    }
    fetchCategories();
  }, [editMode, id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3333/category");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  const fetchArticle = async (articleId: number) => {
    try {
      const res = await fetch(`http://localhost:3333/article/${articleId}`);
      const data = await res.json();
      setTitle(data.title || "");
      setSlug(data.slug || "");
      setContent(data.content || "");
      setCategoryId(data.categoryId?.toString() || "");
      setOldThumbnailUrl(data.thumbnail ? `http://localhost:3333${data.thumbnail}` : "");
    } catch (err) {
      console.error("Gagal memuat data artikel:", err);
      setMessage("Gagal memuat data artikel.");
    }
  };

  const handleSubmit = async () => {
    setErrors([]);
    const url = editMode ? `http://localhost:3333/article/${id}` : "http://localhost:3333/article";
    const method = editMode ? "PUT" : "POST"; // Gunakan PUT untuk update

    try {
      let response;
      if (thumbnail || !editMode) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("slug", slug);
        formData.append("content", content);
        formData.append("categoryId", categoryId);
        formData.append("userId", userId.toString());
        formData.append("status", "1");
        formData.append("publishedAt", new Date().toISOString());
        if (thumbnail) formData.append("thumbnail", thumbnail);

        response = await fetch(url, {
          method,
          body: formData,
        });
      } else {
        response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            content,
            categoryId,
            userId,
            status: "1",
            publishedAt: new Date().toISOString(),
          }),
        });
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response from server (bukan JSON)");
      }

      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors || []);
        setMessage("");
      } else {
        router.push(`/article?success=${encodeURIComponent(data.message)}`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessage("Terjadi kesalahan saat mengirim data.");
    }
  };

  const handleCancel = () => {
    router.push("/article");
  };

  const getError = (field: string) => {
    return errors.find((e) => e.field === field)?.message;
  };

  return (
    <ComponentCard title="">
      <div className="space-y-6">
        <div>
          <Label>Kategori</Label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.nama}
              </option>
            ))}
          </select>
          {getError("categoryId") && (
            <p className="text-red-500 text-sm">{getError("categoryId")}</p>
          )}
        </div>
        <div>
          <Label>Judul Artikel</Label>
          <Input
            type="text"
            value={title} // Gunakan value untuk controlled input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul"
            error={!!getError("title")} // Tampilkan error jika ada
            hint={getError("title")} // Gunakan hint untuk menampilkan pesan error
          />
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-otomatis"
            error={!!getError("slug")}
            hint={getError("slug")}
          />
        </div>
        <div>
          <Label>Konten</Label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {getError("content") && (
            <p className="text-red-500 text-sm">{getError("content")}</p>
          )}
        </div>
        <div>
          <Label>Thumbnail</Label>
          {editMode && oldThumbnailUrl && !thumbnail && (
            <img
              src={oldThumbnailUrl}
              alt="Thumbnail lama"
              className="w-32 h-20 object-cover rounded mb-2"
            />
          )}
          <FileInput
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setThumbnail(file);
            }}
          />
          {getError("thumbnail") && (
            <p className="text-red-500 text-sm">{getError("thumbnail")}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editMode ? "Perbarui" : "Simpan"} {/* Pastikan tombol sesuai editMode */}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={handleCancel}
          >
            Batal
          </button>
        </div>
        {message && <p className="text-green-600">{message}</p>}
      </div>
    </ComponentCard>
  );
}