"use client";

import { Article } from "@/lib/types";
import NewsCard from "./NewsCard";
import { useEffect, useState } from "react";
import { getInsights, searchArticles } from "@/lib/api";

export default function NewsFeed({ 
  initialArticles, 
  query 
}: { 
  initialArticles: Article[];
  query?: string;
}) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeAgo, setTimeAgo] = useState<string>("just now");
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto-refresh mechanism
  useEffect(() => {
    const fetchNewArticles = async () => {
      try {
        setIsUpdating(true);
        let newArticles: Article[] = [];
        if (query) {
          newArticles = await searchArticles(query);
        } else {
          const res = await getInsights(1, 20);
          newArticles = res.items;
        }
        setArticles(newArticles);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to auto-refresh articles:", error);
      } finally {
        setIsUpdating(false);
      }
    };

    const interval = setInterval(() => {
      fetchNewArticles();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [query]);

  // Time ago string updater
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo("just now");
      } else {
        const mins = Math.floor(diffInSeconds / 60);
        setTimeAgo(`${mins} min${mins !== 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // update string every minute

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <>
      <div className={`col-span-12 space-y-6 mt-8 transition-opacity duration-500 ${isUpdating ? 'opacity-70' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-headline font-bold text-on-surface">
              {query ? `Showing results for: ${query}` : "Latest News"}
            </h2>
            <div className="px-2 py-1 bg-surface-container-high rounded-md text-xs text-on-surface-variant flex items-center space-x-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Updated {timeAgo}</span>
            </div>
          </div>
          <div className="text-xs text-on-surface-variant/60 font-medium">
            Showing {articles?.length || 0} recent articles
          </div>
        </div>
        
        {!articles || articles.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-on-surface-variant/40 italic">
            <span className="material-symbols-outlined text-4xl mb-2">article</span>
            {query ? `No results found for "${query}"` : "No articles found"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.raw_id} article={article} />
            ))}
          </div>
        )}
        
        {articles && articles.length > 0 && (
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold text-sm rounded-xl transition-all active:scale-95 border border-outline-variant/10">
              Load More Articles
            </button>
          </div>
        )}
      </div>

      {/* Contextual Information Overlay (Live Feed Active) */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="bg-surface-container-highest/60 backdrop-blur-md p-4 rounded-xl border border-outline-variant/10 shadow-2xl flex items-center space-x-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-surface-container-highest bg-primary-container flex items-center justify-center text-[10px] text-on-primary-container font-bold">
              AI
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-surface-container-highest bg-tertiary-container flex items-center justify-center text-[10px] text-on-tertiary-container font-bold">
              SYS
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                Live Feed Active
              </div>
            </div>
            <div className="text-[9px] text-on-surface-variant/70 font-medium pl-[18px] mt-0.5">
              Last updated: {timeAgo}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
