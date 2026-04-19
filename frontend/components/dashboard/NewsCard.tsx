import { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function NewsCard({ article }: { article: Article }) {
  const publishedDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'Recent';

  const sentimentColors = {
    positive: "bg-tertiary/10 text-tertiary border-tertiary/20",
    negative: "bg-error/10 text-error border-error/20",
    neutral: "bg-surface-container-high text-on-surface-variant border-outline-variant/20",
  };

  const sentiment = (article.sentiment?.toLowerCase() || 'neutral') as keyof typeof sentimentColors;
  const badgeStyle = sentimentColors[sentiment] || sentimentColors.neutral;

  const isNew = article.published_at 
    ? (Date.now() - new Date(article.published_at).getTime() < 24 * 60 * 60 * 1000)
    : false;

  return (
    <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
            {article.source}
          </span>
          <span className="w-1 h-1 rounded-full bg-on-surface-variant/20"></span>
          <span className="text-[10px] text-on-surface-variant/60">
            {publishedDate}
          </span>
        </div>
        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", badgeStyle)}>
          {article.sentiment || 'Neutral'}
        </span>
      </div>
      
      <h3 className="text-lg font-headline font-bold text-on-surface mb-3 leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
        {article.title}
        {isNew && (
          <span className="bg-[#4d8eff]/20 text-[#adc6ff] text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-[#adc6ff]/20">
            NEW
          </span>
        )}
      </h3>
      
      <p className="text-sm text-on-surface-variant/80 line-clamp-3 mb-6 font-medium">
        {article.summary || "No summary available for this article. Click read more to view the full content on the source website."}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary text-xs font-bold uppercase tracking-widest flex items-center group/link"
        >
          Read More
          <span className="material-symbols-outlined text-sm ml-1 group-hover/link:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </a>
        
        {article.category && (
          <span className="text-[10px] bg-surface-container-high px-2 py-1 rounded text-on-surface-variant font-medium">
            {article.category}
          </span>
        )}
      </div>
    </div>
  );
}
