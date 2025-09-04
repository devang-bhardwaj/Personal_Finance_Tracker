# Personal Finance Tracker

A modern, full-stack personal finance management application built with FastAPI, Next.js, and PostgreSQL. Track your income, expenses, budgets, and gain AI-powered insights into your financial health.

## 🚀 Features

### Current Features
- **User Authentication**: Secure JWT-based authentication system
- **Transaction Management**: Add, edit, delete, and categorize transactions
- **Budget Tracking**: Set monthly budgets and monitor spending
- **Dashboard Analytics**: Visual insights with charts and summaries
- **Category Management**: Organize transactions with custom categories
- **Responsive Design**: Works seamlessly on desktop and mobile

### Planned Features
- **AI-Powered Insights**: Smart spending recommendations and alerts
- **Bank Integration**: Connect bank accounts via Plaid API
- **Investment Tracking**: Monitor portfolio performance
- **Bill Reminders**: Automated payment notifications
- **Export/Import**: CSV/Excel data management
- **Multi-Currency**: Support for international currencies

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: Python SQL toolkit and ORM
- **JWT**: Secure authentication tokens
- **Pydantic**: Data validation and settings management

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Beautiful and responsive charts
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API requests

### DevOps & Deployment
- **Docker**: Containerized development and deployment
- **Vercel**: Frontend hosting (free tier)
- **Railway**: Backend hosting (free tier)
- **Supabase**: Managed PostgreSQL (free tier)

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose (recommended)

### Option 1: Docker Development (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Personal_Finance_Tracker/project
   ```

2. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Development Setup

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up database**
   ```bash
   # Install PostgreSQL locally or use Docker
   docker run --name finance-db -e POSTGRES_PASSWORD=finance_password -e POSTGRES_USER=finance_user -e POSTGRES_DB=finance_tracker -p 5432:5432 -d postgres:15
   ```

5. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

6. **Start the backend**
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local if needed
   ```

4. **Start the frontend**
   ```bash
   npm run dev
   ```

## 📊 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation powered by Swagger UI.

### Key Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user profile
- `GET /transactions/` - List transactions with filters
- `POST /transactions/` - Create new transaction
- `GET /budgets/` - List user budgets
- `GET /analytics/dashboard` - Dashboard analytics data

## 🗂️ Project Structure

```
project/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # Application entry point
│   │   ├── database.py        # Database models and connection
│   │   └── routers/           # API route handlers
│   │       ├── auth.py        # Authentication endpoints
│   │       ├── transactions.py # Transaction management
│   │       ├── budgets.py     # Budget management
│   │       ├── categories.py  # Category management
│   │       └── analytics.py   # Analytics and reporting
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend containerization
│   └── .env.example          # Environment variables template
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   ├── components/       # Reusable React components
│   │   └── stores/           # Zustand state management
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   ├── Dockerfile           # Frontend containerization
│   └── .env.example         # Environment variables template
├── docker-compose.yml        # Multi-container orchestration
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/finance_tracker
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Database Migrations

The application automatically creates database tables on startup. For production, consider using Alembic for proper database migrations.

## 🚀 Deployment

### Free Hosting Options (Student Budget Friendly)

#### Frontend (Vercel)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

#### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Connect to Railway PostgreSQL addon
4. Deploy automatically on push

#### Database (Supabase)
1. Create Supabase project
2. Use provided PostgreSQL connection string
3. Enable row-level security for production

### Production Considerations
- Use strong SECRET_KEY (32+ characters)
- Enable HTTPS for all endpoints
- Set up proper CORS origins
- Configure database backups
- Set up monitoring and logging
- Use environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication
- [x] Transaction management
- [x] Basic analytics dashboard
- [x] Budget tracking
- [x] Category management

### Phase 2: Enhanced Features 🚧
- [ ] AI-powered insights
- [ ] Bank account integration
- [ ] Advanced reporting
- [ ] Mobile app (React Native)
- [ ] Bill reminders

### Phase 3: Enterprise Features 📋
- [ ] Multi-user support
- [ ] Advanced security
- [ ] API rate limiting
- [ ] Comprehensive testing
- [ ] Performance optimization

## 💡 Tips for Students

### Free Resources Used
- **GitHub Student Pack**: Free hosting credits
- **Vercel**: Free frontend hosting
- **Railway**: Free backend hosting (500 hours/month)
- **Supabase**: Free PostgreSQL database (500MB)
- **Heroicons**: Free icon library
- **Tailwind CSS**: Free styling framework

### Learning Opportunities
- **FastAPI**: Modern Python web development
- **Next.js**: React-based full-stack framework
- **PostgreSQL**: Industry-standard database
- **Docker**: Containerization best practices
- **TypeScript**: Type-safe development
- **JWT**: Secure authentication patterns

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
docker ps

# Restart the database container
docker-compose restart postgres
```

**Frontend Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Backend Import Errors**
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### Getting Help
- Check the [GitHub Issues](link-to-issues) for known problems
- Review the API documentation at http://localhost:8000/docs
- Join our [Discord community](link-to-discord) for real-time help

---

**Happy coding! 🎉** Build something amazing and take control of your financial future!
