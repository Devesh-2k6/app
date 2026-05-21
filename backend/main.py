"""
FreshSave API — in-memory storage (no database). Auth UI deferred.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import schemas
from store import DEV_OWNER_UID, store

app = FastAPI(title="FreshSave API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _serialize_shop(doc: dict) -> dict:
    return {
        "id": doc["id"],
        "name": doc["name"],
        "address": doc["address"],
        "latitude": doc["latitude"],
        "longitude": doc["longitude"],
        "description": doc.get("description"),
        "owner_uid": doc.get("owner_uid", DEV_OWNER_UID),
    }


def _serialize_product(doc: dict, shop: Optional[dict] = None) -> dict:
    out = {
        "id": doc["id"],
        "shop_id": doc.get("shop_id", ""),
        "name": doc["name"],
        "original_price": doc["original_price"],
        "discount_price": doc["discount_price"],
        "quantity": doc["quantity"],
        "expiry_date": doc["expiry_date"],
        "front_image_url": doc["front_image_url"],
        "expiry_image_url": doc["expiry_image_url"],
        "voice_note_url": doc.get("voice_note_url"),
        "is_active": doc.get("is_active", True),
        "created_at": doc.get("created_at", datetime.utcnow()),
    }
    if shop:
        out["shop"] = {
            "id": shop["id"],
            "name": shop["name"],
            "address": shop["address"],
            "latitude": shop["latitude"],
            "longitude": shop["longitude"],
        }
    else:
        out["shop"] = None
    return out


def _seed_demo_if_empty() -> None:
    """So the customer /deals page has sample data on a fresh server."""
    if store.shops:
        return
    shop = store.create_shop(
        {
            "name": "Green Valley Market",
            "address": "123 Main Street",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "description": "Local grocery with daily discounts",
        }
    )
    expiry = datetime.utcnow() + timedelta(days=2)
    for name, orig, disc in [
        ("Organic Bananas", 89.0, 45.0),
        ("Whole Milk 1L", 65.0, 40.0),
    ]:
        store.create_product(
            {
                "shop_id": shop["id"],
                "name": name,
                "original_price": orig,
                "discount_price": disc,
                "quantity": 10,
                "expiry_date": expiry,
                "front_image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11fe08?w=400&q=80",
                "expiry_image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11fe08?w=400&q=80",
                "voice_note_url": None,
                "is_active": True,
                "created_at": datetime.utcnow(),
            }
        )


@app.on_event("startup")
def on_startup():
    _seed_demo_if_empty()


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "storage": "in-memory",
        "shops": len(store.shops),
        "products": len(store.products),
    }


@app.get("/users/me")
async def read_current_user():
    return {
        "id": DEV_OWNER_UID,
        "email": "dev@freshsave.local",
        "name": "Dev User",
        "is_shop_owner": True,
    }


@app.get("/shops/")
async def list_shops():
    result: list[dict] = []
    for shop in store.list_shops():
        row = _serialize_shop(shop)
        row["deal_count"] = store.count_active_deals(shop["id"])
        result.append(row)
    return result


@app.post("/shops/")
async def create_shop(shop: schemas.ShopBase):
    created = store.create_shop(shop.model_dump())
    return _serialize_shop(created)


@app.get("/shops/me")
async def read_my_shop():
    shop = store.get_first_shop()
    if not shop:
        raise HTTPException(status_code=404, detail="No shop found")
    return _serialize_shop(shop)


@app.get("/shops/{shop_id}")
async def read_shop(shop_id: str):
    shop = store.get_shop(shop_id)
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return _serialize_shop(shop)


@app.put("/shops/{shop_id}")
async def update_shop(shop_id: str, shop: schemas.ShopBase):
    updated = store.update_shop(shop_id, shop.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Shop not found")
    return _serialize_shop(updated)


@app.get("/products/")
async def read_products(
    shop_id: Optional[str] = None,
    hide_expired: bool = True,
):
    products = store.list_products(shop_id=shop_id, hide_expired=hide_expired)
    out: list[dict] = []
    for p in products:
        shop_doc = store.get_shop(p["shop_id"]) if p.get("shop_id") else None
        out.append(_serialize_product(p, shop_doc))
    return out


@app.post("/products/")
async def create_product(product: schemas.ProductCreate):
    shop = store.get_first_shop()
    if not shop:
        raise HTTPException(
            status_code=400,
            detail="No shop found. Create a shop first via POST /shops/",
        )

    new_product = product.model_dump()
    new_product["shop_id"] = shop["id"]
    new_product["created_at"] = datetime.utcnow()
    created = store.create_product(new_product)
    return _serialize_product(created, shop)


@app.put("/products/{product_id}")
async def update_product(product_id: str, product: schemas.ProductCreate):
    update = product.model_dump()
    updated = store.update_product(product_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    shop_doc = store.get_shop(updated["shop_id"]) if updated.get("shop_id") else None
    return _serialize_product(updated, shop_doc)


@app.delete("/products/{product_id}")
async def delete_product(product_id: str):
    if not store.delete_product(product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}
