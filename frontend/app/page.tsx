import StatsCards from "@/components/dashboard/StatsCards";
import NewsFeed from "@/components/dashboard/NewsFeed";
import { getSummary, getInsights, searchArticles } from "@/lib/api";

export const revalidate = 60; // revalidate every minute

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // Fetch data concurrently
  const [summary, articlesData] = await Promise.all([
    getSummary().catch(() => null),
    q 
      ? searchArticles(q).then(items => ({ items, total: items.length }))
      : getInsights(1, 20).catch(() => ({ items: [], total: 0 })),
  ]);

  return (
    <main className="ml-64 pt-24 p-8 min-h-screen bg-surface">
      <StatsCards summary={summary} />

      <NewsFeed initialArticles={articlesData?.items || []} query={q} />
    </main>
  );
}
