from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db, Budget, User
from .auth import get_current_user

router = APIRouter()

# Pydantic models
class BudgetCreate(BaseModel):
    name: str
    amount: float
    period: str = "monthly"  # 'weekly', 'monthly', 'yearly'
    category_id: str = None

class BudgetResponse(BaseModel):
    id: str
    name: str
    amount: float
    spent: float
    period: str
    category_id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Routes
@router.post("/", response_model=BudgetResponse)
async def create_budget(
    budget: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new budget"""
    db_budget = Budget(
        name=budget.name,
        amount=budget.amount,
        period=budget.period,
        category_id=budget.category_id,
        user_id=current_user.id
    )
    
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    
    return db_budget

@router.get("/", response_model=List[BudgetResponse])
async def get_budgets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's budgets"""
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    return budgets
