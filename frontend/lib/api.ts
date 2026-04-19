import { Summary, Trend, Article } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getSummary(): Promise<Summary | null> {
  try {
    const res = await fetch(`${API_BASE}/analytics/summary`, { 
      next: { revalidate: 60 },
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error("Failed to fetch summary");
    const data = await res.json();
    
    return {
      total_articles: data.total_processed_articles || 0,
      positive_count: data.sentiment_breakdown?.positive || 0,
      negative_count: data.sentiment_breakdown?.negative || 0,
      neutral_count: data.sentiment_breakdown?.neutral || 0,
      avg_score: data.avg_sentiment_score || 0,
      daily_ingestion: data.daily_ingestion || [],
    };
  } catch (error) {
    console.error("API Error (getSummary):", error);
    return null;
  }
}

export async function getTrends(days: number = 7): Promise<Trend[]> {
  try {
    const res = await fetch(`${API_BASE}/trends?days=${days}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch trends");
    const data = await res.json();
    return data.keywords || [];
  } catch (error) {
    console.error("API Error (getTrends):", error);
    return [];
  }
}

export async function getInsights(
  page: number = 1,
  limit: number = 10,
  category?: string,
  sentiment?: string,
  days?: number
): Promise<{ items: Article[]; total: number }> {
  try {
    let url = `${API_BASE}/insights?page=${page}&limit=${limit}`;
    if (category && category !== "All Sectors") url += `&category=${encodeURIComponent(category)}`;
    if (sentiment && sentiment !== "Any Sentiment") url += `&sentiment=${encodeURIComponent(sentiment)}`;
    if (days) url += `&days=${days}`;

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch insights");
    const data = await res.json();
    return {
      items: data.data || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error("API Error (getInsights):", error);
    return { items: [], total: 0 };
  }
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query) return [];
  const url = `${API_BASE}/search?q=${encodeURIComponent(query)}`;
  try {
    console.log(`Searching articles: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Search API error: ${res.status} ${res.statusText} at ${url}`);
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Fetch Exception (searchArticles):", error);
    return [];
  }
}

export async function triggerIngestion(categories?: string[]): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories: categories || [] }),
    });
    if (!res.ok) throw new Error("Failed to trigger ingestion");
    return res.json();
  } catch (error) {
    console.error("API Error (triggerIngestion):", error);
    return { success: false, error: "Backend unreachable" };
  }
}
