import { Trend } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TrendingKeywords({ trends }: { trends: Trend[] }) {
  if (!trends || trends.length === 0) return null;

  // We can randomly assign visual styles to match the design's keyword cloud aesthetic
  const styles = [
    "px-6 py-3 bg-surface-container-high rounded-full border border-primary/20 text-xl font-headline font-black text-primary",
    "px-5 py-2.5 bg-surface-container-high rounded-full border border-outline-variant/10 text-lg font-headline font-bold text-on-surface",
    "px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/10 text-base font-headline text-on-surface-variant",
    "px-7 py-3.5 bg-surface-container-high rounded-full border border-tertiary/20 text-2xl font-headline font-black text-tertiary",
    "px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/10 text-sm font-headline text-on-surface-variant/70",
    "px-4 py-2 bg-surface-container-high rounded-full border border-error/20 text-base font-headline text-error",
    "px-6 py-3 bg-surface-container-high rounded-full border border-outline-variant/10 text-xl font-headline font-black text-on-surface",
  ];

  const safeTrends = Array.isArray(trends) ? trends : [];

  return (
    <div className="col-span-12 bg-surface-container-low p-8 rounded-xl overflow-hidden relative mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-headline font-bold text-on-surface">
            Top Trending Keywords
          </h2>
          <p className="text-sm text-on-surface-variant/60">
            Popular Keywords
          </p>
        </div>
        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
          Download Report
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {safeTrends.map((trend, i) => {
          const style = styles[i % styles.length];
          return (
            <span key={trend.keyword} className={style}>
              {trend.keyword}
            </span>
          );
        })}
      </div>

      {/* Decorative Background Graphic */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
    </div>
  );
}
