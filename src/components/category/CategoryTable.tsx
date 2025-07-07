"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table"
import Pagination from "../Pagination" // SESUAIKAN PATH

import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"

interface Category {
  id: number
  nama: string
  slug: string
}

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(categories.length / itemsPerPage)
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3333/category", {
        cache: "no-store",
      })
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return

    try {
      const res = await fetch(`http://localhost:3333/category/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Gagal menghapus kategori.")
      fetchCategories()
    } catch (err) {
      alert("Gagal menghapus data.")
      console.error(err)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full table-auto text-sm">
        <TableHeader className="bg-gray-300 text-xs uppercase">
          <TableRow>
            {["ID", "Nama", "Slug", "Aksi"].map((title) => (
              <TableCell key={title} className="text-center px-4 py-2">
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-200">
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                Memuat data...
              </TableCell>
            </TableRow>
          ) : paginatedCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                Tidak ada data kategori.
              </TableCell>
            </TableRow>
          ) : (
            paginatedCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-gray-50">
                <TableCell className="text-center px-4 py-2">{cat.id}</TableCell>
                <TableCell className="text-center px-4 py-2">{cat.nama}</TableCell>
                <TableCell className="text-center px-4 py-2">{cat.slug}</TableCell>
                <TableCell className="text-center px-4 py-2 space-x-2">
                  <Link href={`/category/edit/${cat.id}`} title="Edit">
                    <PencilSquareIcon className="w-5 h-5 inline-block text-blue-600 hover:text-blue-800 cursor-pointer" />
                  </Link>
                  <button onClick={() => handleDelete(cat.id)} title="Hapus">
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
  )
}
