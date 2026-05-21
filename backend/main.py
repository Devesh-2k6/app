"""
FreshSave API — SQLite database + JWT authentication.
"""

from contextlib import asynccontextmanager
from datetime import UTC, datetime
from typing import Annotated, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

import schemas
from auth_service import (
    create_access_token,
    get_current_shop_owner,
    get_current_user,
    hash_password,
    user_to_dict,
    verify_password,
)
from db.models import Product, Shop, User
from db.session import get_db, init_db

def _serialize_shop(shop: Shop) -> dict:
    return {
        "id": shop.id,
        "name": shop.name,
        "address": shop.address,
        "latitude": shop.latitude,
        "longitude": shop.longitude,
        "description": shop.description,
        "owner_uid": shop.owner_id,
    }


def _serialize_product(product: Product, shop: Optional[Shop] = None) -> dict:
    out = {
        "id": product.id,
        "shop_id": product.shop_id,
        "name": product.name,
        "original_price": product.original_price,
        "discount_price": product.discount_price,
        "quantity": product.quantity,
        "expiry_date": product.expiry_date,
        "front_image_url": product.front_image_url,
        "expiry_image_url": product.expiry_image_url,
        "voice_note_url": product.voice_note_url,
        "is_active": product.is_active,
        "created_at": product.created_at,
    }
    if shop:
        out["shop"] = {
            "id": shop.id,
            "name": shop.name,
            "address": shop.address,
            "latitude": shop.latitude,
            "longitude": shop.longitude,
        }
    else:
        out["shop"] = None
    return out


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(title="FreshSave API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# AUTH
# =========================


@app.post("/auth/register", response_model=schemas.AuthResponse)
def register(body: schemas.RegisterRequest, db: Annotated[Session, Depends(get_db)]):
    email = body.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=email,
        hashed_password=hash_password(body.password),
        name=body.name.strip(),
        is_shop_owner=body.is_shop_owner,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return schemas.AuthResponse(access_token=token, user=user_to_dict(user))


@app.post("/auth/login", response_model=schemas.AuthResponse)
def login(body: schemas.LoginRequest, db: Annotated[Session, Depends(get_db)]):
    email = body.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return schemas.AuthResponse(access_token=token, user=user_to_dict(user))


@app.get("/users/me")
def read_current_user(user: Annotated[User, Depends(get_current_user)]):
    return user_to_dict(user)


@app.get("/health")
def health_check(db: Annotated[Session, Depends(get_db)]):
    shops = db.query(func.count(Shop.id)).scalar() or 0
    products = db.query(func.count(Product.id)).scalar() or 0
    return {
        "status": "ok",
        "storage": "sqlite",
        "shops": shops,
        "products": products,
    }


# =========================
# SHOPS
# =========================


@app.get("/shops/")
def list_shops(db: Annotated[Session, Depends(get_db)]):
    now = datetime.now(UTC).replace(tzinfo=None)
    result: list[dict] = []
    for shop in db.query(Shop).all():
        row = _serialize_shop(shop)
        deal_count = (
            db.query(func.count(Product.id))
            .filter(Product.shop_id == shop.id, Product.expiry_date > now)
            .scalar()
            or 0
        )
        row["deal_count"] = deal_count
        result.append(row)
    return result


@app.post("/shops/")
def create_shop(
    shop_in: schemas.ShopBase,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    if db.query(Shop).filter(Shop.owner_id == user.id).first():
        raise HTTPException(status_code=400, detail="You already have a shop. Edit it in settings.")

    shop = Shop(
        owner_id=user.id,
        name=shop_in.name,
        address=shop_in.address,
        latitude=shop_in.latitude,
        longitude=shop_in.longitude,
        description=shop_in.description,
    )
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return _serialize_shop(shop)


@app.get("/shops/me")
def read_my_shop(
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = db.query(Shop).filter(Shop.owner_id == user.id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="No shop found")
    return _serialize_shop(shop)


@app.get("/shops/{shop_id}")
def read_shop(shop_id: str, db: Annotated[Session, Depends(get_db)]):
    shop = db.get(Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return _serialize_shop(shop)


@app.put("/shops/{shop_id}")
def update_shop(
    shop_id: str,
    shop_in: schemas.ShopBase,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = db.get(Shop, shop_id)
    if not shop or shop.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Shop not found")

    shop.name = shop_in.name
    shop.address = shop_in.address
    shop.latitude = shop_in.latitude
    shop.longitude = shop_in.longitude
    shop.description = shop_in.description
    db.commit()
    db.refresh(shop)
    return _serialize_shop(shop)


# =========================
# PRODUCTS
# =========================


@app.get("/products/")
def read_products(
    db: Annotated[Session, Depends(get_db)],
    shop_id: Optional[str] = None,
    hide_expired: bool = True,
):
    now = datetime.now(UTC).replace(tzinfo=None)
    query = db.query(Product)
    if shop_id:
        query = query.filter(Product.shop_id == shop_id)
    if hide_expired:
        query = query.filter(Product.expiry_date > now)
    products = query.order_by(Product.expiry_date.asc()).limit(100).all()

    out: list[dict] = []
    for p in products:
        shop = db.get(Shop, p.shop_id)
        out.append(_serialize_product(p, shop))
    return out


def _get_owner_shop(user: User, db: Session) -> Shop:
    shop = db.query(Shop).filter(Shop.owner_id == user.id).first()
    if not shop:
        raise HTTPException(status_code=400, detail="Create your shop before adding products.")
    return shop


@app.post("/products/")
def create_product(
    product_in: schemas.ProductCreate,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = _get_owner_shop(user, db)
    product = Product(
        shop_id=shop.id,
        name=product_in.name,
        original_price=product_in.original_price,
        discount_price=product_in.discount_price,
        quantity=product_in.quantity,
        expiry_date=product_in.expiry_date,
        front_image_url=product_in.front_image_url,
        expiry_image_url=product_in.expiry_image_url,
        voice_note_url=product_in.voice_note_url,
        is_active=product_in.is_active,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return _serialize_product(product, shop)


@app.put("/products/{product_id}")
def update_product(
    product_id: str,
    product_in: schemas.ProductCreate,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    shop = db.get(Shop, product.shop_id)
    if not shop or shop.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = product_in.name
    product.original_price = product_in.original_price
    product.discount_price = product_in.discount_price
    product.quantity = product_in.quantity
    product.expiry_date = product_in.expiry_date
    product.front_image_url = product_in.front_image_url
    product.expiry_image_url = product_in.expiry_image_url
    product.voice_note_url = product_in.voice_note_url
    product.is_active = product_in.is_active
    db.commit()
    db.refresh(product)
    return _serialize_product(product, shop)


@app.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    shop = db.get(Shop, product.shop_id)
    if not shop or shop.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted"}
