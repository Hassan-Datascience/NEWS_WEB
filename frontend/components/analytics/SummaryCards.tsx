import { Summary } from "@/lib/types";

export default function SummaryCards({ summary }: { summary: Summary }) {
  if (!summary) return null;
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {/* Total Articles */}
      <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <span className="font-label text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface-variant font-bold">
              Total Articles Ingested
            </span>
            <div className="flex items-center gap-1 text-tertiary">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <span className="text-xs font-bold">12.4%</span>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
              {(summary.total_articles / 1000).toFixed(1)}K
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Cross-platform synthesis active
            </p>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="material-symbols-outlined text-9xl">article</span>
        </div>
      </div>

      {/* Average Sentiment */}
      <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <span className="font-label text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface-variant font-bold">
              Average Sentiment Score
            </span>
            <div className="flex items-center gap-1 text-tertiary">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <span className="text-xs font-bold">2.1%</span>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
              {summary.avg_score.toFixed(2)}
            </h2>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-tertiary neon-glow"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="material-symbols-outlined text-9xl">psychology</span>
        </div>
      </div>

      {/* Trend Score */}
      <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <span className="font-label text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface-variant font-bold">
              Average Trend Score
            </span>
            <div className="flex items-center gap-1 text-error">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              <span className="text-xs font-bold">0.8%</span>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">
              88.4
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Market velocity: Sustained
            </p>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <span className="material-symbols-outlined text-9xl">bolt</span>
        </div>
      </div>
    </section>
  );
}
