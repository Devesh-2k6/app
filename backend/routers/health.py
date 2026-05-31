from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from db.models import Product, Shop
from db.session import get_db

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def health_check():
    return {"status": "ok", "message": "Service is running"}

@router.get("/db")
def db_health_check(db: Annotated[Session, Depends(get_db)]):
    shops = db.query(func.count(Shop.id)).scalar() or 0
    products = db.query(func.count(Product.id)).scalar() or 0
    return {
        "status": "ok",
        "storage": "postgres",
        "shops": shops,
        "products": products,
    }
