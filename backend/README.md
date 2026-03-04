# TopInvestment Backend

FastAPI backend for stock screening — CANSLIM, Value Investing & Dividend filters.

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env
# Edit .env with your Supabase credentials

# 4. Run development server
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/v1/filters/canslim` | Run CANSLIM filter |
| `POST` | `/api/v1/filters/value` | Run Value filter |
| `POST` | `/api/v1/filters/dividend` | Run Dividend filter |
| `GET` | `/api/v1/stocks` | List all stocks (paginated) |
| `GET` | `/api/v1/stocks/{symbol}` | Get stock detail |

## Swagger UI

After starting the server, open [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API docs.

## Project Structure

```
backend/
├── app/
│   ├── main.py              # App entry point
│   ├── config.py            # Settings (from .env)
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   ├── repositories/        # Data access (Supabase)
│   ├── schemas/             # Pydantic models
│   └── middleware/          # Logging, etc.
├── .env.example
├── requirements.txt
└── README.md
```
