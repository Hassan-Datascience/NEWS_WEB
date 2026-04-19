export interface Article {
  raw_id: string;
  title: string;
  source: string;
  category?: string;
  sentiment: string;
  keywords: string[];
  score?: number;
  trend_score?: number;
  published_at?: string;
  summary?: string;
  url?: string;
}

export interface Trend {
  keyword: string;
  count: number;
  trend_score: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface Summary {
  total_articles: number;
  positive_count: number;
  negative_count: number;
  neutral_count: number;
  avg_score: number;
  daily_ingestion?: DailyCount[];
}
