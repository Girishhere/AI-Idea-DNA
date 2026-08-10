# 🧬 AI Idea DNA

**Analyze, Score & Evolve Student Project Ideas**

A deep learning-powered platform that deconstructs project ideas into their DNA components (Domain, Technology, Problem), scores novelty using FAISS vector similarity search, and evolves concepts through AI-driven mutation strategies.

---

## 🏗️ Architecture

```
┌──────────────────────────────┐    ┌──────────────────────────────┐
│        Frontend              │    │         Backend               │
│  Next.js + React 18         │    │    FastAPI + Python           │
│  Tailwind CSS               │◄──►│    SQLAlchemy (PostgreSQL)    │
│  Framer Motion              │    │    FAISS (vector search)      │
│  React Three Fiber (3D)     │    │    Mock NLP Pipeline          │
└──────────────────────────────┘    └──────────────────────────────┘
```

## 🚀 Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` with interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Extract Idea DNA + compute novelty score |
| `POST` | `/api/evolve` | Generate evolved concept variants |
| `GET` | `/` | Health check |
| `GET` | `/api/health` | Service status |

## 🎨 Design System

- **Theme**: Dark mode with glassmorphism
- **Colors**: Obsidian (#0a0a0f), Neon Cyan (#00f0ff), Electric Purple (#a855f7)
- **3D**: DNA double helix (React Three Fiber)
- **Animations**: Framer Motion staggered entrances, animated gauge

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── config.py        # Environment settings
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── routers/         # API endpoint handlers
│   │   └── services/        # Business logic (NLP, FAISS, Evolution)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages & layout
│   │   ├── components/      # React components
│   │   └── lib/             # API client utilities
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 📝 License

MIT
