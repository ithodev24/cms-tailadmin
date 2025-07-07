'use client';

interface Article {
  id: number;
  title: string;
  created_at?: string;
}

interface Props {
  articles: Article[];
}

export default function LatestArticles({ articles }: Props) {
  const latest = [...articles]
    .sort((a, b) =>
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h4 className="text-sm text-gray-500 mb-2">Artikel Terbaru</h4>
      <ul className="text-sm text-gray-700 space-y-1">
        {latest.length > 0 ? (
          latest.map((article) => <li key={article.id}>• {article.title}</li>)
        ) : (
          <li>Tidak ada artikel.</li>
        )}
      </ul>
    </div>
  );
}
    