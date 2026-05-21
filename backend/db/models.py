import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


def new_id() -> str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_shop_owner: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    shop: Mapped["Shop | None"] = relationship(back_populates="owner", uselist=False)


class Shop(Base):
    __tablename__ = "shops"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    owner_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), unique=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    owner: Mapped["User"] = relationship(back_populates="shop")
    products: Mapped[list["Product"]] = relationship(back_populates="shop", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    shop_id: Mapped[str] = mapped_column(String(36), ForeignKey("shops.id"), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    original_price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    expiry_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    front_image_url: Mapped[str] = mapped_column(Text, nullable=False)
    expiry_image_url: Mapped[str] = mapped_column(Text, nullable=False)
    voice_note_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    shop: Mapped["Shop"] = relationship(back_populates="products")
