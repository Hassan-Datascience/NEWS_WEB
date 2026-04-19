# AI Market Intelligence & Trend Analytics Platform

> Production-grade FastAPI backend that ingests real-world news, performs sentiment & trend analysis, and exposes insights via a clean REST API — with a bonus live dashboard.

---

## Architecture

```
NewsAPI → POST /ingest (BackgroundTask)
              ↓
     MongoDB: raw_articles
              ↓
   Processor (keywords · sentiment · trend_score)
              ↓
  MongoDB: processed_articles
              ↓
┌────────────────────────────────────────┐
│          FastAPI REST API              │
│  /trends  /insights  /search          │
│  /analytics/summary  /ingest          │
└────────────────────────────────────────┘
              ↓
       Render / Railway Deployment
```

---

## Project Structure

```
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # pydantic-settings config
│   ├── database.py          # Motor async MongoDB client
│   ├── logger.py            # Rotating file + console logger
│   ├── models/
│   │   ├── raw_article.py
│   │   └── processed_article.py
│   ├── services/
│   │   ├── news_fetcher.py  # NewsAPI async client
│   │   ├── processor.py     # Keyword / sentiment / scoring
│   │   └── analytics.py     # MongoDB aggregation pipelines
│   └── routers/
│       ├── ingest.py
│       ├── trends.py
│       ├── insights.py
│       ├── search.py
│       └── analytics.py
├── frontend/
│   └── index.html           # Bonus: Live dashboard UI
├── .env.example
├── requirements.txt
├── Procfile
└── README.md
```

---

## Quick Start (Local)

### 1. Clone & install
```bash
git clone https://github.com/your-username/ai-market-intelligence
cd ai-market-intelligence
pip install -r requirements.txt
```

### 2. Set environment variables
```bash
cp .env.example .env
# Edit .env with your keys:
# NEWS_API_KEY=your_key_from_newsapi.org
# MONGODB_URL=mongodb+srv://...
```

### 3. Run
```bash
uvicorn app.main:app --reload
```

Visit:
- **Dashboard**: http://localhost:8000/
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ingest?categories=business,technology` | Trigger background ingestion |
| `GET`  | `/trends?days=7&limit=20` | Top trending keywords |
| `GET`  | `/insights?page=1&limit=10&sentiment=positive` | Paginated processed insights |
| `GET`  | `/search?q=bitcoin&page=1` | Full-text article search |
| `GET`  | `/analytics/summary` | Aggregated platform statistics |
| `GET`  | `/health` | Health check |

### Sample: POST /ingest
```bash
curl -X POST "http://localhost:8000/ingest?categories=business&categories=technology"
```
**Response (202 Accepted):**
```json
{
  "message": "Ingestion pipeline started in the background.",
  "task_id": "c3a1f2d4-...",
  "categories": ["business", "technology"],
  "status": "queued"
}
```

### Sample: GET /trends
```bash
curl "http://localhost:8000/trends?days=7&limit=10"
```
```json
{
  "days": 7,
  "keywords": [
    {"keyword": "artificial", "count": 42, "trend_score": 18.5},
    {"keyword": "market", "count": 38, "trend_score": 15.2}
  ],
  "generated_at": "2026-04-18T17:00:00Z"
}
```

### Sample: GET /analytics/summary
```json
{
  "total_raw_articles": 520,
  "total_processed_articles": 488,
  "sentiment_breakdown": {"positive": 210, "negative": 130, "neutral": 148, "total": 488},
  "top_categories": [{"category": "technology", "count": 180}],
  "daily_ingestion": [{"date": "2026-04-18", "count": 95}],
  "avg_sentiment_score": 0.0623
}
```

---

## Data Models

### Raw Article (MongoDB: `raw_articles`)
```json
{
  "title": "OpenAI launches new model",
  "source": "TechCrunch",
  "published_at": "2026-04-18T10:00:00Z",
  "content": "...",
  "category": "technology",
  "url": "https://...",
  "fetched_at": "2026-04-18T17:00:00Z"
}
```

### Processed Article (MongoDB: `processed_articles`)
```json
{
  "raw_id": "664abc...",
  "title": "OpenAI launches new model",
  "sentiment": "positive",
  "sentiment_score": 0.312,
  "keywords": ["openai", "model", "launch", "ai"],
  "score": 0.74,
  "trend_score": 22,
  "processed_at": "2026-04-18T17:00:05Z"
}
```

---

## Advanced Features Implemented

| # | Feature | Implementation |
|---|---------|---------------|
| 1 | **Background Tasks** | `POST /ingest` returns 202 immediately; pipeline runs via FastAPI `BackgroundTasks` |
| 2 | **Logging System** | Structured logs to console + rotating file (`logs/app.log`, 5MB × 3 backups) |

---

## Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set environment variables in Render dashboard:
   - `NEWS_API_KEY`
   - `MONGODB_URL`
   - `DB_NAME` (default: `market_intelligence`)
   - `ENVIRONMENT=production`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEWS_API_KEY` | NewsAPI key from newsapi.org | ✅ |
| `MONGODB_URL` | MongoDB Atlas connection string | ✅ |
| `DB_NAME` | Database name (default: `market_intelligence`) | ❌ |
| `ENVIRONMENT` | `development` or `production` | ❌ |
| `LOG_LEVEL` | `DEBUG`, `INFO`, `WARNING` | ❌ |

---

## Getting API Keys

- **NewsAPI** (free): https://newsapi.org/register — 100 req/day free tier
- **MongoDB Atlas** (free): https://www.mongodb.com/atlas — 512MB free cluster

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API Framework | FastAPI 0.111 |
| Database | MongoDB Atlas + Motor (async) |
| NLP | TextBlob (rule-based sentiment) |
| HTTP Client | HTTPX (async) |
| Config | pydantic-settings |
| Server | Uvicorn |
| Deployment | Render / Railway |

---

## Evaluation Checklist

- [x] Real API data (NewsAPI)
- [x] MongoDB raw + processed collections
- [x] Keyword extraction
- [x] Sentiment analysis (TextBlob polarity)
- [x] Trend detection (aggregation pipelines)
- [x] Time-series daily counts
- [x] All 5 required endpoints
- [x] Pydantic models
- [x] Pagination + query parameters
- [x] Error handling
- [x] Background tasks (Advanced Feature #1)
- [x] Logging system (Advanced Feature #2)
- [x] Deployment-ready (Procfile, .env.example)
- [x] Bonus: Frontend dashboard
