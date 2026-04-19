import { Trend } from "@/lib/types";

export default function KeywordTrajectory({ trends }: { trends: Trend[] }) {
  if (!trends || trends.length === 0) {
    return (
      <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
        <h2 className="font-headline text-xl font-extrabold tracking-tight">
          Keyword Trajectory
        </h2>
        <p className="text-on-surface-variant mt-4">No trends available for this period.</p>
      </div>
    );
  }

  // Sort by trend_score descending for display
  const sortedTrends = [...trends].sort((a, b) => b.trend_score - a.trend_score);

  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-headline text-xl font-extrabold tracking-tight">
          Keyword Trajectory
        </h2>
        <span className="text-[0.6875rem] font-label font-medium text-on-surface-variant uppercase tracking-widest opacity-50">
          Top 10 High Intensity
        </span>
      </div>

      <div className="space-y-8">
        {sortedTrends.slice(0, 10).map((trend, i) => {
          // Calculate progress bar width based on score, ensuring max 100%
          const widthPct = Math.min(Math.max(trend.trend_score, 5), 100).toFixed(1);
          
          return (
            <div key={trend.keyword} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="font-headline text-xs font-black text-primary/40 group-hover:text-primary transition-colors">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <h4 className="font-headline text-sm font-bold text-on-surface tracking-wide">
                    {trend.keyword}
                  </h4>
                  {i === 0 && (
                    <span className="bg-surface-container-high px-2 py-0.5 rounded text-[0.625rem] font-bold text-on-surface-variant uppercase tracking-tighter">
                      New Entrant
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant/40">
                      Total Count
                    </span>
                    <span className="text-xs font-headline font-bold text-on-surface">
                      {trend.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right w-16">
                    <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-on-surface-variant/40">
                      Score
                    </span>
                    <span className="text-xs font-headline font-bold text-primary">
                      {trend.trend_score.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-tertiary"
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-12 w-full py-4 border border-outline-variant/10 rounded-xl font-headline text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
        Expand Full Data Repository
      </button>
    </div>
  );
}
