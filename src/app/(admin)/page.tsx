import StatsCards from '@/components/dashboard/StatsCards';
import LatestArticles from '@/components/dashboard/LatestArticles';
import { fetchArticles, fetchCategories } from '@/lib/api';

export default async function AdminDashboardPage() {
  const [articles, categories] = await Promise.all([
    fetchArticles(),
    fetchCategories(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <StatsCards articleCount={articles.length} categoryCount={categories.length} />
      <LatestArticles articles={articles} />
    </div>
  );
}
