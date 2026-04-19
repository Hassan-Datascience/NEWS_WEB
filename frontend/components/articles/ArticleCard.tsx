import { Article } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ArticleCard({ article }: { article: Article }) {
  // Determine colors based on sentiment
  const isBullish = article.sentiment.toLowerCase() === "bullish" || article.sentiment.toLowerCase() === "positive";
  const isBearish = article.sentiment.toLowerCase() === "bearish" || article.sentiment.toLowerCase() === "negative";
  const isNeutral = !isBullish && !isBearish;

  const sentimentClass = cn(
    "font-bold px-3 py-1 rounded-full text-[0.625rem] uppercase tracking-wider",
    isBullish && "bg-tertiary-container text-on-tertiary",
    isBearish && "bg-error-container text-on-error-container",
    isNeutral && "bg-surface-container-highest text-on-surface"
  );

  const scoreClass = cn(
    "block font-headline text-2xl font-extrabold leading-none",
    isBullish && "text-primary",
    isBearish && "text-error",
    isNeutral && "text-secondary"
  );

  return (
    <article className="group bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm">
      <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden bg-surface-container-highest flex items-center justify-center">
        {/* Placeholder for image since we don't have real images in DB */}
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">
          article
        </span>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-2">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[0.625rem] font-bold uppercase tracking-wider">
                {article.category || "General"}
              </span>
              <span className={sentimentClass}>{article.sentiment || "Neutral"}</span>
            </div>
            <div className="text-right">
              <span className={scoreClass}>
                {article.trend_score ? article.trend_score.toFixed(0) : "N/A"}
              </span>
              <span className="block font-label text-[0.6rem] text-on-surface-variant uppercase font-bold tracking-tighter">
                Trend Score
              </span>
            </div>
          </div>
          <h2 className="font-headline text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h2>
          <p className="text-sm text-on-surface-variant line-clamp-2 font-light">
            {article.summary || "No summary provided for this insight."}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {article.keywords && article.keywords.map((kw) => (
              <span
                key={kw}
                className="text-[0.6875rem] font-medium px-2 py-1 bg-surface-container-highest text-on-surface rounded"
              >
                #{kw}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-6 text-[0.6875rem] font-label font-bold uppercase tracking-widest text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[1rem]">source</span>
              {article.source}
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[1rem]">calendar_today</span>
              {article.published_at || "Recent"}
            </div>
            <Link
              href={article.url || "#"}
              className="flex items-center gap-1 text-primary hover:underline"
              target="_blank"
            >
              Full Article
              <span className="material-symbols-outlined text-[1rem]">open_in_new</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
