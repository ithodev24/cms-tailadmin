"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ComponentCard from '../common/ComponentCard'
import Label from '../category/Label'
import Input from '../category/InputField'

interface CategoryFormProps {
  editMode?: boolean
  id?: number
}

export default function DefaultInputs({ editMode = false, id }: CategoryFormProps) {
  const router = useRouter()

  const [nama, setNama] = useState('')
  const [slug, setSlug] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([])

  useEffect(() => {
  if (editMode && id) {
    fetch(`http://localhost:3333/category/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data kategori:", data)
        setNama(data.nama || '')
        setSlug(data.slug || '')
      })

      .catch((err) => {
        console.error("Gagal memuat data kategori:", err)
      })
  }
}, [editMode, id])


  const handleSubmit = async () => {
    try {
      const url = editMode
        ? `http://localhost:3333/category/${id}`
        : 'http://localhost:3333/category'
      const method = editMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama, slug }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors(data.errors || [])
        setMessage('')
      } else {
        router.push(`/category?success=${encodeURIComponent(data.message)}`)
      }
    } catch (error) {
      setMessage('Terjadi kesalahan saat mengirim data.')
      console.error(error)
    }
  }

  const handleCancel = () => {
    router.push('/category')
  }

  return (
    <ComponentCard title="">
      <div className="space-y-6 -mt-12">
        <div>
          <Label>Nama Kategori</Label>
          <Input
            type="text"
            placeholder="Masukkan Nama Kategori"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          {errors.find((e) => e.field === 'nama') && (
            <p className="text-red-500 text-sm">
              {errors.find((e) => e.field === 'nama')?.message}
            </p>
          )}
        </div>
        <div>
          <Label>Slug</Label>
          <Input
            type="text"
            placeholder="Masukkan Slug Kategori"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          {errors.find((e) => e.field === 'slug') && (
            <p className="text-red-500 text-sm">
              {errors.find((e) => e.field === 'slug')?.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {editMode ? 'Perbarui' : 'Simpan'}
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
  )
}
