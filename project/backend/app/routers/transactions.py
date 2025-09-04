from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, extract
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, date
from ..database import get_db, Transaction, Category, User
from .auth import get_current_user

router = APIRouter()

# Pydantic models
class TransactionCreate(BaseModel):
    amount: float
    description: str = None
    type: str  # 'income', 'expense', 'transfer'
    category_id: str = None
    account_id: str = None
    date: datetime = None

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    type: Optional[str] = None
    category_id: Optional[str] = None
    account_id: Optional[str] = None
    date: Optional[datetime] = None

class TransactionResponse(BaseModel):
    id: str
    amount: float
    description: str
    type: str
    date: datetime
    category_id: str
    account_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Routes
@router.post("/", response_model=TransactionResponse)
async def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new transaction"""
    db_transaction = Transaction(
        amount=transaction.amount,
        description=transaction.description,
        type=transaction.type,
        category_id=transaction.category_id,
        account_id=transaction.account_id,
        date=transaction.date or datetime.utcnow(),
        user_id=current_user.id
    )
    
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    
    return db_transaction

@router.get("/", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    type: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's transactions with optional filtering"""
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    if type:
        query = query.filter(Transaction.type == type)
    if category_id:
        query = query.filter(Transaction.category_id == category_id)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific transaction"""
    transaction = db.query(Transaction).filter(
        and_(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return transaction

@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    transaction = db.query(Transaction).filter(
        and_(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    update_data = transaction_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(transaction, field, value)
    
    transaction.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(transaction)
    
    return transaction

@router.delete("/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction"""
    transaction = db.query(Transaction).filter(
        and_(Transaction.id == transaction_id, Transaction.user_id == current_user.id)
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(transaction)
    db.commit()
    
    return {"message": "Transaction deleted successfully"}

@router.get("/summary/monthly")
async def get_monthly_summary(
    year: int = Query(datetime.now().year),
    month: int = Query(datetime.now().month),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get monthly transaction summary"""
    
    # Total income and expenses for the month
    income_total = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == current_user.id,
            Transaction.type == "income",
            extract('year', Transaction.date) == year,
            extract('month', Transaction.date) == month
        )
    ).scalar() or 0
    
    expense_total = db.query(func.sum(Transaction.amount)).filter(
        and_(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            extract('year', Transaction.date) == year,
            extract('month', Transaction.date) == month
        )
    ).scalar() or 0
    
    # Transaction count
    transaction_count = db.query(func.count(Transaction.id)).filter(
        and_(
            Transaction.user_id == current_user.id,
            extract('year', Transaction.date) == year,
            extract('month', Transaction.date) == month
        )
    ).scalar() or 0
    
    return {
        "year": year,
        "month": month,
        "total_income": float(income_total),
        "total_expenses": float(expense_total),
        "net_savings": float(income_total - expense_total),
        "transaction_count": transaction_count
    }
