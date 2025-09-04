# Personal Finance Tracker - Quick Start Setup

## 🎯 **Your Optimized Free Stack**

**Frontend**: Next.js + TypeScript + Tailwind CSS
**Backend**: FastAPI + Python + SQLAlchemy
**Database**: Supabase (PostgreSQL + Auth + Storage)
**Deployment**: Vercel (frontend) + Railway (backend)
**Cost**: 100% FREE with GitHub Student Pack

---

## 📁 **Project Structure**

```
personal-finance-tracker/
├── frontend/                 # Next.js app
│   ├── app/                 # App router pages
│   ├── components/          # UI components
│   ├── lib/                 # Utilities
│   └── package.json
├── backend/                 # FastAPI Python app
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── models/         # Database models
│   │   ├── routers/        # API endpoints
│   │   └── services/       # Business logic
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml      # Local development
└── README.md
```

---

## 🚀 **Step 1: Create Project Structure**

I'll create all the files you need right now. Just run these commands:

```bash
# Create main project
mkdir personal-finance-tracker
cd personal-finance-tracker

# Frontend setup
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"
cd frontend
npm install lucide-react @radix-ui/react-icons
cd ..

# Backend setup
mkdir backend
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv pydantic-settings
cd ..
```

---

## 📊 **Step 2: Database Setup (Supabase - FREE)**

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (free)
3. Create new project
4. Get your connection details:
   - Database URL
   - API URL
   - API Key (anon)

---

## 🔑 **Step 3: Environment Variables**

Create these files:

**backend/.env**
```
DATABASE_URL=postgresql://username:password@host:port/database
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SECRET_KEY=your_secret_key_here
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ⚡ **Step 4: Run Locally**

```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Visit: http://localhost:3000

---

## 🚀 **Step 5: Deploy (100% FREE)**

### Frontend to Vercel:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Connect GitHub repo
4. Deploy automatically

### Backend to Railway:
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Deploy backend folder
4. Add environment variables

---

## 🎯 **Core Features to Build First**

### Week 1: MVP
- [ ] User authentication (Supabase Auth)
- [ ] Add/view transactions
- [ ] Basic dashboard

### Week 2: Core Features
- [ ] Categories and budgets
- [ ] Simple charts
- [ ] Data export

### Week 3: AI Features
- [ ] Auto-categorization
- [ ] Spending insights
- [ ] Basic ML predictions

---

## 📋 **What I'll Create for You Next**

1. **Complete FastAPI backend** with all endpoints
2. **Next.js frontend** with all pages
3. **Database models** and migrations
4. **Docker setup** for easy development
5. **Deployment configs** for Vercel and Railway

Ready to start? I'll create all the actual code files now!
