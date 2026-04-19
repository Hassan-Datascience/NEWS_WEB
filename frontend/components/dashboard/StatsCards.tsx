import { Summary } from "@/lib/types";

export default function StatsCards({ summary }: { summary: Summary | null }) {
  const total = summary?.total_articles || 0;
  
  const positivePercentage = total > 0 
    ? ((summary!.positive_count / total) * 100).toFixed(1) 
    : "0.0";
  const negativePercentage = total > 0 
    ? ((summary!.negative_count / total) * 100).toFixed(1) 
    : "0.0";
  const neutralPercentage = total > 0 
    ? ((summary!.neutral_count / total) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card 1: Total Articles */}
      <div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-colors duration-300 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start">
          <span className="text-label-sm uppercase tracking-widest text-on-surface-variant/60 font-bold text-[0.6875rem]">
            Total Articles
          </span>
          <span className="bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-full text-[0.625rem] font-bold">
            Live
          </span>
        </div>
        <div className="text-3xl font-headline font-bold text-on-surface tracking-tight">
          {summary?.total_articles?.toLocaleString() ?? '—'}
        </div>
        <div className="h-1 w-full bg-surface-container-highest rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-tertiary w-full shadow-[0_0_8px_#adc6ff]"></div>
        </div>
      </div>

      {/* Card 2: Positive Sentiment */}
      <div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-colors duration-300 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start">
          <span className="text-label-sm uppercase tracking-widest text-on-surface-variant/60 font-bold text-[0.6875rem]">
            Positive
          </span>
          <span className="material-symbols-outlined text-tertiary text-lg">
            trending_up
          </span>
        </div>
        <div className="text-3xl font-headline font-bold text-tertiary tracking-tight">
          {positivePercentage}%
        </div>
        <p className="text-[0.625rem] text-on-surface-variant/50 mt-2 font-medium">
          Based on recent ingestion
        </p>
      </div>

      {/* Card 3: Negative Sentiment */}
      <div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-colors duration-300 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start">
          <span className="text-label-sm uppercase tracking-widest text-on-surface-variant/60 font-bold text-[0.6875rem]">
            Negative
          </span>
          <span className="material-symbols-outlined text-error text-lg">
            trending_down
          </span>
        </div>
        <div className="text-3xl font-headline font-bold text-error tracking-tight">
          {negativePercentage}%
        </div>
        <p className="text-[0.625rem] text-on-surface-variant/50 mt-2 font-medium">
          From latest news
        </p>
      </div>

      {/* Card 4: Neutral Sentiment */}
      <div className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container-high transition-colors duration-300 flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start">
          <span className="text-label-sm uppercase tracking-widest text-on-surface-variant/60 font-bold text-[0.6875rem]">
            Neutral
          </span>
          <span className="material-symbols-outlined text-on-secondary-container text-lg">
            remove
          </span>
        </div>
        <div className="text-3xl font-headline font-bold text-on-secondary-container tracking-tight">
          {neutralPercentage}%
        </div>
        <p className="text-[0.625rem] text-on-surface-variant/50 mt-2 font-medium">
          From latest news
        </p>
      </div>
    </div>
  );
}
