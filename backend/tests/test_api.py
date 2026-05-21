"""API tests with in-memory SQLite."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from db.base import Base
from db.models import Product, Shop, User  # noqa: F401
from db.session import engine


@pytest.fixture(autouse=True)
def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client() -> TestClient:
    from main import app

    with TestClient(app) as test_client:
        yield test_client


def test_register_login_and_me(client: TestClient):
    reg = client.post(
        "/auth/register",
        json={
            "email": "owner@test.com",
            "password": "secret123",
            "name": "Test Owner",
            "is_shop_owner": True,
        },
    )
    assert reg.status_code == 200, reg.text
    token = reg.json()["access_token"]
    assert reg.json()["user"]["is_shop_owner"] is True

    me = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "owner@test.com"

    login = client.post(
        "/auth/login",
        json={"email": "owner@test.com", "password": "secret123"},
    )
    assert login.status_code == 200
    assert login.json()["access_token"]


def test_shop_and_product_flow(client: TestClient):
    reg = client.post(
        "/auth/register",
        json={
            "email": "shop@test.com",
            "password": "pass1234",
            "name": "Shop User",
            "is_shop_owner": True,
        },
    )
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    shop = client.post(
        "/shops/",
        headers=headers,
        json={
            "name": "Test Market",
            "address": "1 High St",
            "latitude": 12.97,
            "longitude": 77.59,
            "description": "Demo",
        },
    )
    assert shop.status_code == 200, shop.text
    shop_id = shop.json()["id"]

    product = client.post(
        "/products/",
        headers=headers,
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

    public = client.get("/products/")
    assert public.status_code == 200
    assert len(public.json()) >= 1


def test_products_require_auth_to_create(client: TestClient):
    res = client.post(
        "/products/",
        json={
            "name": "X",
            "original_price": 1,
            "discount_price": 1,
            "quantity": 1,
            "expiry_date": "2030-01-01T12:00:00",
            "front_image_url": "a",
            "expiry_image_url": "b",
        },
    )
    assert res.status_code == 401
