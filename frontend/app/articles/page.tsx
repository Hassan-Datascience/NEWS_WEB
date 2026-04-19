import { getInsights } from "@/lib/api";
import FilterBar from "@/components/articles/FilterBar";
import ArticleCard from "@/components/articles/ArticleCard";
import Pagination from "@/components/articles/Pagination";

export const revalidate = 60;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; sentiment?: string; horizon?: string }>;
}) {
  const { page, category, sentiment, horizon } = await searchParams;
  
  const pageNum = parseInt(page || "1", 10);
  const limit = 10;
  
  // Mapping horizon to days 
  let days: number | undefined;
  if (horizon === "Last 24 Hours") days = 1;
  else if (horizon === "Last 7 Days") days = 7;
  else if (horizon === "Current Quarter") days = 90;
  else if (horizon === "YTD") days = 365;

  // Fetch articles
  const { items: articles, total } = await getInsights(
    pageNum,
    limit,
    category,
    sentiment,
    days
  ).catch(() => ({ items: [], total: 0 }));

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="ml-64 mt-20 p-8 min-h-screen">
      <FilterBar />

      <div className="grid grid-cols-1 gap-6">
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low rounded-xl">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
              No Articles Found
            </h3>
            <p className="text-on-surface-variant">
              Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.raw_id} article={article} />
          ))
        )}
      </div>

      {articles.length > 0 && (
        <Pagination currentPage={pageNum} totalPages={totalPages} />
      )}
    </main>
  );
}
