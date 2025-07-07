"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "../Pagination"; // SESUAIKAN PATH

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  publishedAt: string;
  status: number;
  category: {
    nama: string;
  };
  user: {
    name: string;
  };
}

export default function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:3333/article", {
        cache: "no-store",
      });
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Gagal mengambil data artikel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;

    try {
      const res = await fetch(`http://localhost:3333/article/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus artikel.");
      fetchArticles();
    } catch (err) {
      alert("Gagal menghapus data.");
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStatus = (status: number) =>
    status === 1 ? "Published" : "Draft";

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-auto text-sm">
        <TableHeader className="bg-gray-300 text-xs uppercase">
          <TableRow>
            {[
              "ID",
              "Kategori",
              "Judul",
              "Slug",
              "Konten",
              "Thumbnail",
              "Status",
              "Tanggal Publish",
              "Penulis",
              "Aksi",
            ].map((title) => (
              <TableCell key={title} className="text-center px-4 py-2">
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-200">
          {loading ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-4">
                Memuat data...
              </TableCell>
            </TableRow>
          ) : paginatedArticles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-gray-500 py-4">
                Tidak ada data artikel.
              </TableCell>
            </TableRow>
          ) : (
            paginatedArticles.map((article) => (
              <TableRow key={article.id} className="hover:bg-gray-50 align-top">
                <TableCell className="text-center px-4 py-2">{article.id}</TableCell>
                <TableCell className="text-center px-4 py-2">{article.category?.nama}</TableCell>
                <TableCell className="whitespace-pre-line break-words px-4 py-2 text-left">
                  {article.title}
                </TableCell>
                <TableCell className="whitespace-pre-line break-words px-4 py-2 text-left">
                  {article.slug}
                </TableCell>
                <TableCell className="whitespace-pre-line break-words px-4 py-2 text-left">
                  {article.content}
                </TableCell>
                <TableCell className="text-center px-4 py-2">
                  <img
                    src={article.thumbnail?.trim()
                      ? article.thumbnail
                      : "/images/logo/logo-icon.svg"}
                    alt="Thumbnail"
                    className="w-20 h-12 object-cover rounded mx-auto"
                  />
                </TableCell>
                <TableCell className="text-center px-4 py-2">
                  {renderStatus(article.status)}
                </TableCell>
                <TableCell className="text-center px-4 py-2">
                  {formatDate(article.publishedAt)}
                </TableCell>
                <TableCell className="text-center px-4 py-2">{article.user?.name}</TableCell>
                <TableCell className="text-center px-4 py-2 space-x-2">
                  <Link href={`/article/edit/${article.id}`} title="Edit">
                    <PencilSquareIcon className="w-5 h-5 inline-block text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </Link>
                  <button onClick={() => handleDelete(article.id)} title="Hapus">
                    <TrashIcon className="w-5 h-5 inline-block text-red-600 hover:text-red-800 cursor-pointer" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
