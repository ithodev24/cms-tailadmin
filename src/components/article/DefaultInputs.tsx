"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ComponentCard from '../common/ComponentCard'
import Label from '../article/Label'
import Input from '../article/InputField'
import FileInput from '../article/FileInput'

interface Category {
  id: number
  nama: string
}

export default function DefaultInputs() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [userId] = useState('1')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3333/category')
        const data = await res.json()
        setCategories(data)
      } catch (err) {
        console.error('Gagal mengambil kategori:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('content', content)
    formData.append('categoryId', categoryId)
    formData.append('userId', userId)

    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    try {
      const res = await fetch('http://localhost:3333/article', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors || [])
        setMessage('')
      } else {
        router.push(`/article?success=${encodeURIComponent(data.message)}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Terjadi kesalahan saat mengirim data.')
    }
  }

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
              <option key={cat.id} value={cat.id}>
                {cat.nama}
              </option>
            ))}
          </select>
          {errors.find((e) => e.field === 'categoryId') && (
            <p className="text-red-500 text-sm">{errors.find((e) => e.field === 'categoryId')?.message}</p>
          )}
        </div>

        <div>
          <Label>Judul Artikel</Label>
          <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" />
          {errors.find((e) => e.field === 'title') && (
            <p className="text-red-500 text-sm">{errors.find((e) => e.field === 'title')?.message}</p>
          )}
        </div>

        <div>
          <Label>Slug</Label>
          <Input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-otomatis" />
          {errors.find((e) => e.field === 'slug') && (
            <p className="text-red-500 text-sm">{errors.find((e) => e.field === 'slug')?.message}</p>
          )}
        </div>

        <div>
          <Label>Konten</Label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.find((e) => e.field === 'content') && (
            <p className="text-red-500 text-sm">{errors.find((e) => e.field === 'content')?.message}</p>
          )}
        </div>

        <div>
          <Label>Thumbnail</Label>
          <FileInput
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setThumbnail(file)
            }}
          />
          {errors.find((e) => e.field === 'thumbnail') && (
            <p className="text-red-500 text-sm">{errors.find((e) => e.field === 'thumbnail')?.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Simpan
          </button>
        </div>

        {message && <p className="text-green-600">{message}</p>}
      </div>
    </ComponentCard>
  )
}
