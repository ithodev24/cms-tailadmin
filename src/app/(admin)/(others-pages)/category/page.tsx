"use client";

import CategoryTable from "@/components/category/CategoryTable";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Category() {
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const message = searchParams.get("success");
    if (message) {
      setSuccessMessage(message);
      setVisible(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.toString());

      // Mulai animasi hilang setelah 4 detik
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 1000);

      // Hapus pesan setelah animasi selesai
      const cleanup = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(cleanup);
      };
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 p-6">
      <ComponentCard title="">
        <div className="space-y-4 -mt-12">
          {/* Alert Success dengan animasi */}
          {successMessage && (
            <div
              className={`transition-all duration-700 ease-in-out transform ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              } bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm shadow`}
            >
              {successMessage}
            </div>
          )}

          {/* Tombol */}
          <div className="flex justify-start">
            <Link href="/category/create">
              <div className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition">
                + Tambah Kategori
              </div>
            </Link>
          </div>

          {/* Tabel */}
          <CategoryTable />
        </div>
      </ComponentCard>
    </div>
  );
}
