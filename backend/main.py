"""
FreshSave API — Supabase PostgreSQL + JWT authentication + Mega-Features.
"""

from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta
from typing import Annotated, Optional

from fastapi import Depends, FastAPI, HTTPException, UploadFile, File
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
from db.models import Product, Shop, User, Reservation, ReservationStatus, PaymentStatus, Review, Notification, Favorite, Follower, ProductCategory
from db.session import get_db, init_db
from storage import upload_product_image

def _calculate_dynamic_price(p: Product, now: datetime) -> float:
    if not p.auto_discount_enabled or not p.auto_discount_min_price:
        return p.discount_price
    
    # Simple linear drop over the last 24 hours before expiry
    time_left = (p.expiry_date - now).total_seconds()
    if time_left <= 0:
        return p.auto_discount_min_price
    
    hours_left = time_left / 3600
    if hours_left > 24:
        return p.discount_price
    
    # It drops from discount_price to min_price over 24 hours
    drop_range = p.discount_price - p.auto_discount_min_price
    fraction = (24 - hours_left) / 24.0 # 0 at 24 hours, 1 at 0 hours
    
    current = p.discount_price - (drop_range * fraction)
    return round(current, 2)

def _serialize_shop(shop: Shop) -> dict:
    return {
        "id": shop.id,
        "name": shop.name,
        "address": shop.address,
        "latitude": shop.latitude,
        "longitude": shop.longitude,
        "description": shop.description,
        "owner_uid": shop.owner_id,
        "average_rating": shop.average_rating,
        "rating_count": shop.rating_count,
    }

def _serialize_product(product: Product, shop: Optional[Shop] = None) -> dict:
    now = datetime.now(UTC).replace(tzinfo=None)
    current_price = _calculate_dynamic_price(product, now)

    out = {
        "id": product.id,
        "shop_id": product.shop_id,
        "name": product.name,
        "original_price": product.original_price,
        "discount_price": product.discount_price,
        "current_price": current_price,
        "quantity": product.quantity,
        "expiry_date": product.expiry_date,
        "category": product.category,
        "front_image_url": product.front_image_url,
        "expiry_image_url": product.expiry_image_url,
        "voice_note_url": product.voice_note_url,
        "is_active": product.is_active,
        "created_at": product.created_at,
        "is_surprise_bag": product.is_surprise_bag,
        "auto_discount_enabled": product.auto_discount_enabled,
        "auto_discount_min_price": product.auto_discount_min_price,
    }
    if shop:
        out["shop"] = _serialize_shop(shop)
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
# AUTH & USERS
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

@app.get("/users/me", response_model=schemas.User)
def read_current_user(user: Annotated[User, Depends(get_current_user)]):
    return user

@app.get("/health")
def health_check(db: Annotated[Session, Depends(get_db)]):
    shops = db.query(func.count(Shop.id)).scalar() or 0
    products = db.query(func.count(Product.id)).scalar() or 0
    return {
        "status": "ok",
        "storage": "postgres",
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
            .filter(Product.shop_id == shop.id, Product.expiry_date > now, Product.quantity > 0)
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


# =========================
# PRODUCTS
# =========================

@app.get("/products/")
def read_products(
    db: Annotated[Session, Depends(get_db)],
    shop_id: Optional[str] = None,
    hide_expired: bool = True,
    q: Optional[str] = None,
    category: Optional[ProductCategory] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius_km: Optional[float] = 50.0,
):
    import math

    def haversine_distance(lat1, lon1, lat2, lon2):
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    now = datetime.now(UTC).replace(tzinfo=None)
    query = db.query(Product).filter(Product.quantity > 0)
    if shop_id:
        query = query.filter(Product.shop_id == shop_id)
    if hide_expired:
        query = query.filter(Product.expiry_date > now)
    if category:
        query = query.filter(Product.category == category)

    products = query.order_by(Product.expiry_date.asc()).all()

    out: list[dict] = []
    for p in products:
        # text filter
        if q and q.lower() not in p.name.lower():
            continue
        
        shop = db.get(Shop, p.shop_id)
        
        # geo filter
        if lat is not None and lng is not None and shop:
            dist = haversine_distance(lat, lng, shop.latitude, shop.longitude)
            if dist > radius_km:
                continue
            
        out.append(_serialize_product(p, shop))
    return out

@app.post("/upload/image")
def upload_image(
    file: UploadFile = File(...),
    user: User = Depends(get_current_shop_owner)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    url = upload_product_image(file)
    return {"url": url}

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
        category=product_in.category,
        original_price=product_in.original_price,
        discount_price=product_in.discount_price,
        quantity=product_in.quantity,
        expiry_date=product_in.expiry_date,
        front_image_url=product_in.front_image_url,
        expiry_image_url=product_in.expiry_image_url,
        voice_note_url=product_in.voice_note_url,
        is_active=product_in.is_active,
        is_surprise_bag=product_in.is_surprise_bag,
        auto_discount_enabled=product_in.auto_discount_enabled,
        auto_discount_min_price=product_in.auto_discount_min_price,
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
    shop = _get_owner_shop(user, db)
    product = db.get(Product, product_id)
    if not product or product.shop_id != shop.id:
        raise HTTPException(status_code=404, detail="Product not found or not yours")

    product.name = product_in.name
    product.category = product_in.category
    product.original_price = product_in.original_price
    product.discount_price = product_in.discount_price
    product.quantity = product_in.quantity
    product.expiry_date = product_in.expiry_date
    product.front_image_url = product_in.front_image_url
    product.expiry_image_url = product_in.expiry_image_url
    product.voice_note_url = product_in.voice_note_url
    product.is_active = product_in.is_active
    product.is_surprise_bag = product_in.is_surprise_bag
    product.auto_discount_enabled = product_in.auto_discount_enabled
    product.auto_discount_min_price = product_in.auto_discount_min_price

    db.commit()
    db.refresh(product)
    return _serialize_product(product, shop)

@app.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = _get_owner_shop(user, db)
    product = db.get(Product, product_id)
    if not product or product.shop_id != shop.id:
        raise HTTPException(status_code=404, detail="Product not found or not yours")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# =========================
# RESERVATIONS
# =========================

@app.post("/reservations/", response_model=schemas.ReservationResponse)
def create_reservation(
    res_in: schemas.ReservationCreate,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if user.is_shop_owner:
        raise HTTPException(status_code=403, detail="Shop owners cannot make reservations.")
        
    product = db.get(Product, res_in.product_id)
    if not product or product.quantity < res_in.quantity:
        raise HTTPException(status_code=400, detail="Product not available in requested quantity.")
        
    now = datetime.now(UTC).replace(tzinfo=None)
    if product.expiry_date < now:
        raise HTTPException(status_code=400, detail="Product is expired.")

    current_price = _calculate_dynamic_price(product, now)
    
    # Deduct quantity instantly
    product.quantity -= res_in.quantity
    
    reservation = Reservation(
        user_id=user.id,
        shop_id=product.shop_id,
        product_id=product.id,
        quantity=res_in.quantity,
        total_price=current_price * res_in.quantity,
        status=ReservationStatus.PENDING
    )
    
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation

@app.get("/reservations/me", response_model=list[schemas.ReservationResponse])
def get_my_reservations(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return db.query(Reservation).filter(Reservation.user_id == user.id).order_by(Reservation.created_at.desc()).all()

@app.get("/shops/reservations", response_model=list[schemas.ReservationResponse])
def get_shop_reservations(
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = _get_owner_shop(user, db)
    return db.query(Reservation).filter(Reservation.shop_id == shop.id).order_by(Reservation.created_at.desc()).all()

@app.post("/reservations/{reservation_id}/verify")
def verify_reservation(
    reservation_id: str,
    payload: schemas.ReservationVerify,
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = _get_owner_shop(user, db)
    reservation = db.get(Reservation, reservation_id)
    
    if not reservation or reservation.shop_id != shop.id:
        raise HTTPException(status_code=404, detail="Reservation not found")
        
    if reservation.status != ReservationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Reservation already processed")
        
    if reservation.pickup_code.upper() != payload.pickup_code.upper():
        raise HTTPException(status_code=400, detail="Invalid pickup code")
        
    # Mark as completed
    reservation.status = ReservationStatus.COMPLETED
    reservation.completed_at = datetime.now(UTC).replace(tzinfo=None)
    
    # Update Impact Stats
    customer = db.get(User, reservation.user_id)
    if customer:
        # Assuming CO2 saved = 0.5kg per item
        customer.total_items_saved += reservation.quantity
        customer.co2_saved_kg += (0.5 * reservation.quantity)
        
        # Money saved = (original - actual paid)
        original_total = reservation.product.original_price * reservation.quantity
        saved_amount = original_total - reservation.total_price
        if saved_amount > 0:
            customer.total_money_saved += saved_amount
            
    # Send notification to customer
    notif = Notification(
        user_id=customer.id,
        title="Reservation Completed!",
        message=f"You successfully picked up your items from {shop.name}."
    )
    db.add(notif)
            
    db.commit()
    db.refresh(reservation)
    return {"message": "Reservation verified successfully!", "status": reservation.status}

@app.post("/reservations/{reservation_id}/checkout")
def checkout_reservation(
    reservation_id: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if user.is_shop_owner:
        raise HTTPException(status_code=403, detail="Shop owners cannot checkout.")
        
    reservation = db.get(Reservation, reservation_id)
    if not reservation or reservation.user_id != user.id:
        raise HTTPException(status_code=404, detail="Reservation not found")
        
    if reservation.status != ReservationStatus.PENDING:
        raise HTTPException(status_code=400, detail="Reservation is not pending")
        
    if reservation.payment_status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Already paid")

    # Mock Stripe payment success
    reservation.payment_status = PaymentStatus.PAID
    db.commit()
    return {"message": "Payment successful!", "payment_status": reservation.payment_status}


# =========================
# REVIEWS & NOTIFICATIONS
# =========================

@app.post("/shops/{shop_id}/reviews", response_model=schemas.ReviewResponse)
def leave_review(
    shop_id: str,
    review_in: schemas.ReviewCreate,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    if user.is_shop_owner:
        raise HTTPException(status_code=403, detail="Shop owners cannot leave reviews.")
        
    shop = db.get(Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
        
    # Optional: verify they actually bought something here
    completed_res = db.query(Reservation).filter(
        Reservation.user_id == user.id,
        Reservation.shop_id == shop.id,
        Reservation.status == ReservationStatus.COMPLETED
    ).first()
    
    if not completed_res:
        raise HTTPException(status_code=400, detail="You must complete a reservation at this shop before reviewing.")
        
    review = Review(
        user_id=user.id,
        shop_id=shop.id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(review)
    
    # Update shop rating
    shop.rating_count += 1
    total_rating = (shop.average_rating * (shop.rating_count - 1)) + review.rating
    shop.average_rating = round(total_rating / shop.rating_count, 1)
    
    db.commit()
    db.refresh(review)
    return review

@app.get("/notifications", response_model=list[schemas.NotificationResponse])
def get_my_notifications(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).all()


# =========================
# FAVORITES
# =========================

@app.post("/favorites/", response_model=schemas.FavoriteResponse)
def add_favorite(
    fav_in: schemas.FavoriteCreate,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    product = db.get(Product, fav_in.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    existing = db.query(Favorite).filter(Favorite.user_id == user.id, Favorite.product_id == product.id).first()
    if existing:
        return existing
        
    favorite = Favorite(user_id=user.id, product_id=product.id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

@app.get("/favorites/me", response_model=list[schemas.FavoriteResponse])
def get_my_favorites(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return db.query(Favorite).filter(Favorite.user_id == user.id).order_by(Favorite.created_at.desc()).all()

@app.delete("/favorites/{product_id}")
def remove_favorite(
    product_id: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    fav = db.query(Favorite).filter(Favorite.user_id == user.id, Favorite.product_id == product_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
        
    db.delete(fav)
    db.commit()
    return {"message": "Favorite removed"}


# =========================
# FOLLOWERS / SUBSCRIPTIONS
# =========================

@app.post("/shops/{shop_id}/follow", response_model=schemas.FollowerResponse)
def follow_shop(
    shop_id: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = db.get(Shop, shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
        
    existing = db.query(Follower).filter(Follower.user_id == user.id, Follower.shop_id == shop.id).first()
    if existing:
        # Avoid crashing, just return existing
        return existing
        
    follower = Follower(user_id=user.id, shop_id=shop.id)
    db.add(follower)
    db.commit()
    db.refresh(follower)
    return follower

@app.delete("/shops/{shop_id}/follow")
def unfollow_shop(
    shop_id: str,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    follower = db.query(Follower).filter(Follower.user_id == user.id, Follower.shop_id == shop_id).first()
    if not follower:
        raise HTTPException(status_code=404, detail="Not following this shop")
        
    db.delete(follower)
    db.commit()
    return {"message": "Unfollowed successfully"}

@app.get("/users/me/following", response_model=list[schemas.FollowerResponse])
def get_my_following(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return db.query(Follower).filter(Follower.user_id == user.id).order_by(Follower.created_at.desc()).all()


# =========================
# SHOP ANALYTICS
# =========================

@app.get("/shops/me/analytics", response_model=schemas.AnalyticsResponse)
def get_shop_analytics(
    user: Annotated[User, Depends(get_current_shop_owner)],
    db: Annotated[Session, Depends(get_db)],
):
    shop = _get_owner_shop(user, db)
    
    # Total Revenue (Only completed reservations)
    completed_res = db.query(Reservation).filter(
        Reservation.shop_id == shop.id, 
        Reservation.status == ReservationStatus.COMPLETED
    ).all()
    
    total_revenue = sum(r.total_price for r in completed_res)
    total_items_saved = sum(r.quantity for r in completed_res)
    
    # Active pending reservations
    active_res = db.query(Reservation).filter(
        Reservation.shop_id == shop.id, 
        Reservation.status == ReservationStatus.PENDING
    ).count()
    
    # Recent Reviews
    recent_reviews = db.query(Review).filter(Review.shop_id == shop.id).order_by(Review.created_at.desc()).limit(5).all()
    
    return schemas.AnalyticsResponse(
        total_revenue=total_revenue,
        total_items_saved=total_items_saved,
        active_reservations=active_res,
        average_rating=shop.average_rating,
        recent_reviews=recent_reviews
    )
