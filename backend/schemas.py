"""
Pydantic schemas for request/response validation
"""

from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from db.models import ReservationStatus, PaymentStatus, ProductCategory


# =========================
# USERS
# =========================

class UserBase(BaseModel):
    email: str
    name: str
    is_shop_owner: bool = False

class User(UserBase):
    id: Optional[str] = None
    total_money_saved: float = 0.0
    total_items_saved: int = 0
    co2_saved_kg: float = 0.0

    model_config = ConfigDict(from_attributes=True)

# =========================
# AUTH
# =========================

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    is_shop_owner: bool = False

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# =========================
# SHOPS
# =========================

class ShopBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    description: Optional[str] = None

class ShopCreate(ShopBase):
    pass

class ShopSummary(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    average_rating: float = 0.0
    rating_count: int = 0

    model_config = ConfigDict(from_attributes=True)

# =========================
# PRODUCTS
# =========================

class ProductBase(BaseModel):
    name: str
    category: ProductCategory = ProductCategory.OTHER
    original_price: float
    discount_price: float
    quantity: int
    expiry_date: datetime
    front_image_url: str
    expiry_image_url: str
    voice_note_url: Optional[str] = None
    is_active: bool = True
    
    is_surprise_bag: bool = False
    auto_discount_enabled: bool = False
    auto_discount_min_price: Optional[float] = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: str
    shop_id: str
    created_at: datetime
    current_price: Optional[float] = None # Calculated on the fly

    model_config = ConfigDict(from_attributes=True)


class ProductWithShop(Product):
    shop: Optional[ShopSummary] = None
    model_config = ConfigDict(from_attributes=True)

class Shop(ShopBase):
    id: str
    owner_uid: str
    products: List[Product] = []
    average_rating: float = 0.0
    rating_count: int = 0

    model_config = ConfigDict(from_attributes=True)

class AnalyticsResponse(BaseModel):
    total_revenue: float
    total_items_saved: int
    active_reservations: int
    average_rating: float
    recent_reviews: List["ReviewResponse"] = []

# =========================
# RESERVATIONS
# =========================

class ReservationCreate(BaseModel):
    product_id: str
    quantity: int

class ReservationVerify(BaseModel):
    pickup_code: str

class ReservationResponse(BaseModel):
    id: str
    user_id: str
    shop_id: str
    product_id: str
    quantity: int
    total_price: float
    status: ReservationStatus
    payment_status: PaymentStatus
    pickup_code: str
    created_at: datetime
    
    product: ProductWithShop

    model_config = ConfigDict(from_attributes=True)


# =========================
# FAVORITES
# =========================

class FavoriteCreate(BaseModel):
    product_id: str

class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    created_at: datetime
    product: ProductWithShop

    model_config = ConfigDict(from_attributes=True)

# =========================
# FOLLOWERS
# =========================

class FollowerResponse(BaseModel):
    id: str
    shop_id: str
    user_id: str
    created_at: datetime
    shop: ShopSummary

    model_config = ConfigDict(from_attributes=True)

# =========================
# REVIEWS
# =========================

class ReviewCreate(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    user_id: str
    shop_id: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# =========================
# NOTIFICATIONS
# =========================

class NotificationResponse(BaseModel):
    id: str
    title: str
    message: str
    is_read: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
