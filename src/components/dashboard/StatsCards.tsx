'use client';
import React from 'react';

interface Props {
  articleCount: number;
  categoryCount: number;
}

export default function StatsCards({ articleCount, categoryCount }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Jumlah Artikel</h4>
        <p className="text-3xl font-bold text-blue-600">{articleCount}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Jumlah Kategori</h4>
        <p className="text-3xl font-bold text-blue-600">{categoryCount}</p>
      </div>
    </div>
  );
}
