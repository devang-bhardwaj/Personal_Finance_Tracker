from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from datetime import datetime, date
from ..database import get_db, Transaction, Category, Budget, User
from .auth import get_current_user

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard analytics data"""
    
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    # Monthly totals
    monthly_income = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == current_user.id,
            Transaction.type == "income",
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        )
    ).scalar() or 0
    
    monthly_expenses = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        )
    ).scalar() or 0
    
    # All-time totals
    total_income = db.query(func.sum(Transaction.amount)).filter(
        and_(Transaction.user_id == current_user.id, Transaction.type == "income")
    ).scalar() or 0
    
    total_expenses = db.query(func.sum(Transaction.amount)).filter(
        and_(Transaction.user_id == current_user.id, Transaction.type == "expense")
    ).scalar() or 0
    
    # Recent transactions (last 5)
    recent_transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.date.desc()).limit(5).all()
    
    # Category breakdown for current month
    category_expenses = db.query(
        Category.name,
        Category.icon,
        Category.color,
        func.sum(Transaction.amount).label("total")
    ).join(
        Transaction, Category.id == Transaction.category_id
    ).filter(
        and_(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            extract('year', Transaction.date) == current_year,
            extract('month', Transaction.date) == current_month
        )
    ).group_by(Category.id, Category.name, Category.icon, Category.color).all()
    
    return {
        "monthly_summary": {
            "income": float(monthly_income),
            "expenses": float(monthly_expenses),
            "savings": float(monthly_income - monthly_expenses),
            "savings_rate": float((monthly_income - monthly_expenses) / monthly_income * 100) if monthly_income > 0 else 0
        },
        "total_summary": {
            "income": float(total_income),
            "expenses": float(total_expenses),
            "net_worth": float(total_income - total_expenses)
        },
        "recent_transactions": [
            {
                "id": t.id,
                "amount": t.amount,
                "description": t.description,
                "type": t.type,
                "date": t.date.isoformat()
            } for t in recent_transactions
        ],
        "category_breakdown": [
            {
                "name": cat.name,
                "icon": cat.icon,
                "color": cat.color,
                "amount": float(cat.total)
            } for cat in category_expenses
        ]
    }

@router.get("/trends")
async def get_trends(
    months: int = 6,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get spending trends over time"""
    
    # Get monthly data for the last N months
    monthly_data = db.query(
        extract('year', Transaction.date).label('year'),
        extract('month', Transaction.date).label('month'),
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user.id
    ).group_by(
        extract('year', Transaction.date),
        extract('month', Transaction.date),
        Transaction.type
    ).order_by(
        extract('year', Transaction.date).desc(),
        extract('month', Transaction.date).desc()
    ).limit(months * 2).all()  # *2 for income and expense
    
    # Format the data
    trends = {}
    for data in monthly_data:
        month_key = f"{int(data.year)}-{int(data.month):02d}"
        if month_key not in trends:
            trends[month_key] = {"income": 0, "expenses": 0}
        trends[month_key][data.type if data.type != "expense" else "expenses"] = float(data.total)
    
    return {
        "monthly_trends": trends,
        "period_months": months
    }
