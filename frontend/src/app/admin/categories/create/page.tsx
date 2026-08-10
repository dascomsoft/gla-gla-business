'use client'

import CategoryForm from '@/components/admin/CategoryForm'

export default function CreateCategory() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter une catégorie</h1>
      <CategoryForm />
    </div>
  )
}