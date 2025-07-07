'use client'
import { useParams } from 'next/navigation'
import DefaultInputs from '@/components/category/DefaultInputs'

export default function EditCategoryPage() {
  const params = useParams()

  if (!params?.id) return <div>Memuat data kategori...</div>

  return <DefaultInputs editMode id={Number(params.id)} />
}
