# AI Idea DNA

> **Enterprise-Grade Semantic RAG Pipeline for Project Novelty Evaluation & Mutagenesis**

AI Idea DNA is a local, high-performance Retrieval-Augmented Generation (RAG) system built to evaluate, score, and mutate technical project ideas in real time. Instead of relying on slow, costly, and non-deterministic third-party LLM API wrappers, AI Idea DNA executes local PyTorch vector embeddings and FAISS spatial distance calculations to deliver sub-millisecond, mathematically verifiable novelty scoring.

---

## 🌟 Key Features

* **Zero-Latency Local Inference:** Employs a local PyTorch `SentenceTransformer` (`all-MiniLM-L6-v2`) to generate 384-dimensional dense vector embeddings with zero API costs and no network bottlenecks.
* **Deterministic FAISS Vector Search:** Calculates spatial distances (L2 / Cosine Similarity) against indexed project databases using Facebook AI Similarity Search (FAISS).
* **Multi-Layered Pre-Processing Gatekeeper:** Intercepts junk, short (< 5 words), or off-domain inputs before vector math runs, preventing false high scores.
* **Hackathon Cliché Detection:** Identifies overused concepts (e.g., basic resume builders, to-do lists, simple weather apps) and applies strict novelty caps with actionable advice.
* **On-Demand Concept Mutagenesis:** Mutates project concepts across three distinct pillars: **Technical**, **Social Impact**, and **Product Monetization**.
* **Monochrome Engineering Dashboard:** Designed with a stark black/silver/white aesthetic, Framer Motion scroll animations, and interactive pipeline status visualizers.

---

## 🏗️ System Architecture

```text
┌────────────────┐     POST /api/analyze     ┌────────────────────────┐
│  Next.js UI    │ ────────────────────────> │    FastAPI Backend     │
└────────────────┘                           └───────────┬────────────┘
│
┌────────────────┴────────────────┐
│ Multi-Layer Gatekeeper Filter   │
│ (Length & Cliché Keyword Check) │
└────────────────┬────────────────┘
│
┌────────────────┴────────────────┐
│ PyTorch SentenceTransformer     │
│ (Text ──> 384D Vector)          │
└────────────────┬────────────────┘
│
┌────────────────┴────────────────┐
│ FAISS Vector Database Search    │
│ (Top-K Spatial L2 Distance)     │
└────────────────┬────────────────┘
│
┌────────────────┐     JSON Response Payload │ Deterministic Scoring Engine    │
│ Dashboard View │ <─────────────────────────┤ (Sigmoid Curve & Novelty Score)│
└────────────────┘                           └────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend & Machine Learning
* **Framework:** Python 3.10+, FastAPI, Uvicorn
* **ML Engine:** PyTorch, `sentence-transformers` (`all-MiniLM-L6-v2`)
* **Vector Index:** FAISS (`faiss-cpu`)
* **Data Validation:** Pydantic v2

### Frontend
* **Framework:** Next.js (App Router), React
* **Styling:** Tailwind CSS, Custom Glassmorphism System
* **Animations:** Framer Motion

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.10 or higher
* Node.js 18.x or higher
* `npm` or `yarn`

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server with auto-reload
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The backend server will spin up at `http://127.0.0.1:8000`. Interactive OpenAPI documentation will be accessible at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install node modules
npm install

# Run the development server
npm run dev
```

The application dashboard will be live at `http://localhost:3000`.

---

## 📊 API Endpoint Overview

### `POST /api/analyze`

Analyzes a submitted project description, runs filtering checks, computes vector embeddings, queries the FAISS index, and returns deterministic metrics.

#### Example Request Payload:

```json
{
  "idea": "A decentralized compute brokering platform that dynamically routes batch processing jobs to idle data centers running on solar energy."
}
```

#### Example Response Payload:

```json
{
  "novelty_score": 98.0,
  "verdict": "Groundbreaking",
  "domain": "Distributed Systems",
  "technology": "Container Orchestration & Energy Routing",
  "problem": "Infrastructure Efficiency",
  "similar_projects": [
    {
      "title": "Smart Attendance System using Face Recognition",
      "similarity_score": 0.08
    }
  ],
  "recommendation": null
}
```

---

## 🔒 Security & Data Privacy

* **Local Inference:** No text prompts or project details are transmitted to external cloud APIs.
* **Secrets Management:** Environment variables and local cache dependencies are strictly excluded via `.gitignore`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
