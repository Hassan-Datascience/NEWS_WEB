import SearchBar from "@/components/search/SearchBar";
import SearchResults from "@/components/search/SearchResults";
import { searchArticles } from "@/lib/api";

export const revalidate = 60;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchArticles(q).catch(() => []) : [];

  return (
    <main className="ml-64 pt-24 px-8 pb-12 min-h-screen">
      <SearchBar />

      {q && (
        <>
          <div className="flex justify-between items-end mb-8 border-b border-outline-variant/10 pb-4">
            <div>
              <h2 className="font-headline text-3xl font-extrabold tracking-tight">
                Intelligence Feed
              </h2>
              <p className="font-body text-on-surface-variant text-sm">
                Showing actionable insights for your query.
              </p>
            </div>
            <div className="flex gap-4">
              <select className="bg-surface-container-low border-none rounded-lg text-xs font-bold font-headline text-on-surface px-4 py-2 focus:ring-primary/50">
                <option>Relevance Score</option>
                <option>Latest</option>
                <option>Trend Velocity</option>
              </select>
              <button className="p-2 bg-surface-container-low rounded-lg hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          <SearchResults results={results} query={q} />
        </>
      )}
    </main>
  );
}
