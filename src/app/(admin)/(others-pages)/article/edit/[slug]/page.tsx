"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DefaultInputs from "@/components/article/DefaultInputs";
import { fetchArticleBySlug, updateArticle } from "@/lib/api";
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
          const data = await fetchArticleBySlug(slug as string);
          setInitialData(data);
        } catch (err) {
          setError("Gagal memuat data artikel.");
        } finally {
          setLoading(false);
        }
      };
      getArticle();
    }
  }, [slug]);

  const handleSubmit = async (formData: FormData) => {
    try {
      await updateArticle(slug as string, formData);
      router.push("/article");
    } catch (err) {
      setError("Gagal memperbarui artikel.");
      // Optionally, provide user feedback here
    }
  };

  if (loading) return <div>Memuat data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <PageBreadcrumb pageTitle="Edit Artikel" />
      <DefaultInputs />
    </>
  );
};

export default EditArticlePage;