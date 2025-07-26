"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "../common/ComponentCard";
import Label from "../article/Label";
import Input from "../article/InputField"; // Pastikan ini menggunakan Input yang sudah diperbaiki
import FileInput from "../article/FileInput";
import Select from './Select'
import RadioGroup from './Radio';

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
  const [entity, setEntity] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [oldThumbnailUrl, setOldThumbnailUrl] = useState("");
  const [userId] = useState(1);
  const [status, setStatus] = useState("0"); // Default ke Draft
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  useEffect(() => {
    if (editMode && id) {
      fetchArticle(id);
    }
  }, [editMode, id]);


  const fetchArticle = async (articleId: number) => {
    try {
      const res = await fetch(`http://localhost:3333/article/${articleId}`);
      const data = await res.json();
      setTitle(data.title || "");
      setEntity(data.entity || "");
      setContent(data.content || "");
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
        formData.append("entity", entity);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("userId", userId.toString());
        formData.append("status", status);
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
            content,
            userId,
            status: status,
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

  // const getError = (field: string) => {
  //   return errors.find((e) => e.field === field)?.message;
  // };

  return (
    <ComponentCard title="">
      <div className="space-y-6">
        {/* <div>
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
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Entity</Label>
          <Select
            options={[
              { value: 'RENTAL_MOTOR', label: 'Rental Motor' },
              { value: 'RENTAL_IPHONE', label: 'Rental Iphone' },
              { value: 'SEWA_APARTMENT', label: 'Sewa Apartment' },
            ]}
            placeholder="Pilih Entity"
            onChange={(value) => setEntity(value)}
            defaultValue={entity}
          />
          {/* {errors.find((e) => e.field === 'entity') && (
            <p className="text-red-500 text-sm">
              {errors.find((e) => e.field === 'entity')?.message}
            </p>
          )} */}
        </div>
        <div>
          <Label>Status</Label>
          <RadioGroup
            options={[
              { value: '1', label: 'Publish' },
              { value: '0', label: 'Draft' },
            ]}
            name="status"
            selectedValue={status}
            onChange={(value) => setStatus(value)}
          />
        </div>
        </div>
        <div>
          <Label>Judul Artikel</Label>
          <Input
            type="text"
            value={title} // Gunakan value untuk controlled input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul"
            // error={!!getError("title")} // Tampilkan error jika ada
            // hint={getError("title")} // Gunakan hint untuk menampilkan pesan error
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
          {/* {getError("content") && (
            <p className="text-red-500 text-sm">{getError("content")}</p>
          )} */}
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
          {/* {getError("thumbnail") && (
            <p className="text-red-500 text-sm">{getError("thumbnail")}</p>
          )} */}
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