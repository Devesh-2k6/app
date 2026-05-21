"""
In-memory storage (no MongoDB / SQL). Data resets when the API process restarts.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Union

DateLike = Union[datetime, str]


def _as_datetime(value: DateLike) -> datetime:
    if isinstance(value, datetime):
        return value
    text = value.replace("Z", "").split("+")[0].split(".")[0]
    return datetime.fromisoformat(text)

DEV_OWNER_UID = "dev-user-id"


class InMemoryStore:
    def __init__(self) -> None:
        self.shops: dict[str, dict] = {}
        self.products: dict[str, dict] = {}

    @staticmethod
    def new_id() -> str:
        return str(uuid.uuid4())

    def list_shops(self) -> list[dict]:
        return list(self.shops.values())

    def get_shop(self, shop_id: str) -> Optional[dict]:
        return self.shops.get(shop_id)

    def get_first_shop(self) -> Optional[dict]:
        if not self.shops:
            return None
        return next(iter(self.shops.values()))

    def create_shop(self, data: dict) -> dict:
        shop_id = self.new_id()
        doc = {"id": shop_id, "owner_uid": DEV_OWNER_UID, **data}
        self.shops[shop_id] = doc
        return doc

    def update_shop(self, shop_id: str, data: dict) -> Optional[dict]:
        shop = self.shops.get(shop_id)
        if not shop:
            return None
        shop.update(data)
        return shop

    def list_products(
        self,
        shop_id: Optional[str] = None,
        hide_expired: bool = True,
    ) -> list[dict]:
        now = datetime.utcnow()
        items = list(self.products.values())
        if shop_id:
            items = [p for p in items if p.get("shop_id") == shop_id]
        if hide_expired:
            items = [p for p in items if _as_datetime(p["expiry_date"]) > now]
        items.sort(key=lambda p: _as_datetime(p["expiry_date"]))
        return items[:100]

    def count_active_deals(self, shop_id: str) -> int:
        now = datetime.utcnow()
        return sum(
            1
            for p in self.products.values()
            if p.get("shop_id") == shop_id and _as_datetime(p["expiry_date"]) > now
        )

    def create_product(self, data: dict) -> dict:
        product_id = self.new_id()
        doc = {"id": product_id, **data}
        self.products[product_id] = doc
        return doc

    def update_product(self, product_id: str, data: dict) -> Optional[dict]:
        product = self.products.get(product_id)
        if not product:
            return None
        product.update(data)
        return product

    def delete_product(self, product_id: str) -> bool:
        return self.products.pop(product_id, None) is not None


store = InMemoryStore()
