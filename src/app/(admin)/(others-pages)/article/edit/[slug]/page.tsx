"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DefaultInputs from "@/components/article/DefaultInputs";
import { fetchArticleBySlug } from "@/lib/api";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const EditArticlePage = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  if (slug) {
    const getArticle = async () => {
      try {
        console.log("Mengambil artikel untuk slug:", slug); 
        const res = await fetchArticleBySlug(slug as string);
        console.log("Data artikel berhasil diambil oy:", res);
        setInitialData(res.data);

      } catch (err) {
        console.error("Gagal mengambil artikel:", err);
        setError("Gagal memuat data artikel.");
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }
}, [slug]);


  if (loading) return <div>Memuat data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Artikel" />
      {initialData && (
        <DefaultInputs editMode={true} initialData={initialData} />
      )}
    </>
  );
};

export default EditArticlePage;
