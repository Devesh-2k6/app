"""API smoke tests."""

from fastapi.testclient import TestClient

import main
from store import store


def setup_function():
    store.shops.clear()
    store.products.clear()


def test_users_me_stub():
    client = TestClient(main.app)
    res = client.get("/users/me")
    assert res.status_code == 200
    assert res.json()["email"] == "dev@freshsave.local"


def test_health_in_memory():
    client = TestClient(main.app)
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["storage"] == "in-memory"


def test_shop_and_product_flow():
    client = TestClient(main.app)
    shop = client.post(
        "/shops/",
        json={
            "name": "Test Market",
            "address": "1 High St",
            "latitude": 12.97,
            "longitude": 77.59,
            "description": "Demo",
        },
    )
    assert shop.status_code == 200
    shop_id = shop.json()["id"]

    product = client.post(
        "/products/",
        json={
            "name": "Bananas",
            "original_price": 100,
            "discount_price": 50,
            "quantity": 5,
            "expiry_date": "2030-01-01T12:00:00",
            "front_image_url": "https://example.com/a.jpg",
            "expiry_image_url": "https://example.com/b.jpg",
        },
    )
    assert product.status_code == 200
    assert product.json()["shop_id"] == shop_id

    listed = client.get(f"/products/?shop_id={shop_id}")
    assert listed.status_code == 200
    assert len(listed.json()) == 1
