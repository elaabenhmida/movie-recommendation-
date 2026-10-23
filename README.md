# Movie Explorer & Recommender

A full‑stack web application built with **Next.js** (TypeScript) for the frontend and **FastAPI / Python** for the backend. It allows users to browse movies, filter by category, take an interactive quiz, and receive personalized recommendations based on their preferences.

This repository demonstrates integration between a modern React-based UI and a machine learning‑powered service, complete with authentication, API routing, and a scalable project structure.

---

## Key Features

- **Movie browsing** with poster gallery and detail pages
- **Category filtering** via dashboard interface
- **Interactive quiz** that influences recommendations
- **User authentication** and session management
- **Content-based recommender system** implemented in Python
- RESTful API with FastAPI for movies and users
- Clean, modular code in both frontend and backend

---

## Technologies

| Frontend                            | Backend      | Database                           | Utilities                |
| ----------------------------------- | ------------ | ---------------------------------- | ------------------------ |
| Next.js 13 (App Router, TypeScript) | FastAPI      | SQLite / PostgreSQL (configurable) | Pydantic, SQLAlchemy     |
| React, Tailwind CSS                 | Python 3.11+ |                                    | OpenAI (if used), pytest |

---

## Repository Structure

```
/              # workspace root
├─ app/        # Next.js application (UI + pages)
│  ├─ components/
│  ├─ dashboard/
│  ├─ quiz/
│  └─ layout.tsx, page.tsx
├─ backend/    # FastAPI service
│  ├─ routers/ movies.py, users.py
│  ├─ models.py, schemas.py
│  ├─ recommender.py
│  └─ main.py, auth.py, database.py
├─ data/       # mock or seed data
└─ public/     # static assets (posters, etc.)
```

---

## Development Setup

### Prerequisites

- Node.js 18+ & npm (or yarn/pnpm)
- Python 3.11+ with virtual environment support
- Git

### 1. Clone the repo

```bash
git clone <repository-url>
cd movie
```

### 2. Backend setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate   # Windows
   source venv/bin/activate    # macOS/Linux
   ```
2. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. (Optional) Configure environment variables by copying `.env.example` to `.env`.
4. Initialize the database and ingest movies:
   ```bash
   python backend/ingest/ingest_movies.py
   ```
5. Start the API server:
   ```bash
   uvicorn backend.main:app --reload
   ```

The API will be available at `http://localhost:8000`.

### 3. Frontend setup

1. Install JavaScript dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file as needed (e.g. API_URL).
3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the UI.

---

## Testing

- Frontend: `npm test` (uses Jest/React Testing Library)
- Backend: `pytest` in the `backend` folder

---

## Production & Deployment

1. Build frontend:
   ```bash
   npm run build
   npm start    # or deploy via Vercel/Netlify
   ```
2. Backend: containerize with Docker or deploy to your cloud provider. Example `Dockerfile` in backend directory.

Refer to `next.config.ts` and `backend` configs for environment-specific settings.

---

## Contributing

1. Fork the repo and create a feature branch
2. Follow existing coding conventions (TypeScript, flake8)
3. Run tests and linters before submitting a pull request

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

_Happy coding & enjoy discovering movies!_
