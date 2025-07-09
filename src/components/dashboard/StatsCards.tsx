'use client';
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface Props {
  articleCount: number;
  categoryCount: number;
}

const COLORS = ['#407BFF', '#34D399'];

export default function StatsCards({ articleCount, categoryCount }: Props) {
  const data = [
    { name: 'Artikel', value: articleCount },
    { name: 'Kategori', value: categoryCount },
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // run only in client
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Teks Statistik */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-sm text-gray-500">Jumlah Artikel</h4>
        <p className="text-3xl font-bold text-blue-600 mb-4">{articleCount}</p>

        <h4 className="text-sm text-gray-500">Jumlah Kategori</h4>
        <p className="text-3xl font-bold text-green-500">{categoryCount}</p>
      </div>

      {/* Diagram - hanya render di client */}
      <div className="bg-white p-6 rounded-lg shadow h-[300px]">
        {isClient && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
