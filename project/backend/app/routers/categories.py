from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db, Category, User
from .auth import get_current_user

router = APIRouter()

# Pydantic models
class CategoryCreate(BaseModel):
    name: str
    type: str  # 'income' or 'expense'
    color: str = "#3B82F6"
    icon: str = "💰"

class CategoryResponse(BaseModel):
    id: str
    name: str
    type: str
    color: str
    icon: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Default categories data
DEFAULT_CATEGORIES = {
    "expense": [
        {"name": "Food & Dining", "icon": "🍽️", "color": "#EF4444"},
        {"name": "Transportation", "icon": "🚗", "color": "#F97316"},
        {"name": "Shopping", "icon": "🛍️", "color": "#EC4899"},
        {"name": "Entertainment", "icon": "🎬", "color": "#8B5CF6"},
        {"name": "Bills & Utilities", "icon": "💡", "color": "#06B6D4"},
        {"name": "Healthcare", "icon": "⚕️", "color": "#10B981"},
        {"name": "Education", "icon": "📚", "color": "#3B82F6"},
        {"name": "Personal Care", "icon": "💄", "color": "#F59E0B"},
        {"name": "Travel", "icon": "✈️", "color": "#84CC16"},
        {"name": "Other", "icon": "📦", "color": "#6B7280"}
    ],
    "income": [
        {"name": "Salary", "icon": "💼", "color": "#10B981"},
        {"name": "Freelance", "icon": "💻", "color": "#3B82F6"},
        {"name": "Business", "icon": "🏢", "color": "#F59E0B"},
        {"name": "Investments", "icon": "📈", "color": "#8B5CF6"},
        {"name": "Other", "icon": "💰", "color": "#6B7280"}
    ]
}

# Routes
@router.post("/", response_model=CategoryResponse)
async def create_category(
    category: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new category"""
    db_category = Category(
        name=category.name,
        type=category.type,
        color=category.color,
        icon=category.icon,
        user_id=current_user.id
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.get("/", response_model=List[CategoryResponse])
async def get_categories(
    type: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's categories"""
    query = db.query(Category).filter(Category.user_id == current_user.id)
    
    if type:
        query = query.filter(Category.type == type)
    
    categories = query.all()
    return categories

@router.post("/setup-defaults")
async def setup_default_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Set up default categories for new users"""
    
    # Check if user already has categories
    existing_categories = db.query(Category).filter(Category.user_id == current_user.id).first()
    if existing_categories:
        raise HTTPException(status_code=400, detail="Categories already exist for this user")
    
    created_categories = []
    
    # Create default expense categories
    for cat_data in DEFAULT_CATEGORIES["expense"]:
        category = Category(
            name=cat_data["name"],
            type="expense",
            color=cat_data["color"],
            icon=cat_data["icon"],
            user_id=current_user.id
        )
        db.add(category)
        created_categories.append(category)
    
    # Create default income categories
    for cat_data in DEFAULT_CATEGORIES["income"]:
        category = Category(
            name=cat_data["name"],
            type="income",
            color=cat_data["color"],
            icon=cat_data["icon"],
            user_id=current_user.id
        )
        db.add(category)
        created_categories.append(category)
    
    db.commit()
    
    return {
        "message": f"Created {len(created_categories)} default categories",
        "categories_created": len(created_categories)
    }

@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific category"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return category

@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a category"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    
    return {"message": "Category deleted successfully"}
