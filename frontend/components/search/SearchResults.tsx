import { Article } from "@/lib/types";
import NewsCard from "@/components/dashboard/NewsCard";

export default function SearchResults({ results, query }: { results: Article[], query: string }) {
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">
            search_off
          </span>
        </div>
        <h3 className="font-headline text-2xl font-bold mb-2">
          No results found for "{query}"
        </h3>
        <p className="font-body text-on-surface-variant max-w-sm">
          We couldn't find any news articles matching your search terms. Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((article) => (
        <NewsCard key={article.raw_id} article={article} />
      ))}
    </div>
  );
}
