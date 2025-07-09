'use client'
import { useParams } from 'next/navigation'
import DefaultInputs from '@/components/article/DefaultInputs'

export default function EditArticlePage() {
  const params = useParams()

  if (!params?.id) return <div>Memuat data artikel...</div>

  return <DefaultInputs editMode id={Number(params.id)} />
}
