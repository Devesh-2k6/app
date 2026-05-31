"""
Seed script to populate the database with sample shops and products for demo
Run: python seed_data.py
"""

from dotenv import load_dotenv
load_dotenv()

import sys
from pathlib import Path

# Add backend to path
root_dir = Path(__file__).resolve().parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from datetime import datetime, timedelta
from db.session import SessionLocal
from db.models import User, Shop, Product
from auth_service import hash_password

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data (optional)
        print("[INFO] Clearing old data...")
        db.query(Product).delete()
        db.query(Shop).delete()
        db.query(User).delete()
        db.commit()
        
        # Create sample shopkeepers
        print("[INFO] Creating sample shopkeepers...")
        
        shops_data = [
            {
                "name": "Green Valley Supermarket",
                "email": "shop1@test.com",
                "password": "password123",
                "owner_name": "Rajesh Patel",
                "address": "123 Main Street, Downtown",
                "latitude": 40.7128,
                "longitude": -74.0060,
            },
            {
                "name": "Fresh Mart Express",
                "email": "shop2@test.com",
                "password": "password123",
                "owner_name": "Priya Sharma",
                "address": "456 Oak Avenue, Midtown",
                "latitude": 40.7580,
                "longitude": -73.9855,
            },
            {
                "name": "Daily Bazaar",
                "email": "shop3@test.com",
                "password": "password123",
                "owner_name": "Amit Singh",
                "address": "789 Elm Road, Uptown",
                "latitude": 40.7489,
                "longitude": -73.9680,
            },
        ]
        
        shops_list = []
        for shop_info in shops_data:
            # Create user (shop owner)
            owner = User(
                email=shop_info["email"],
                hashed_password=hash_password(shop_info["password"]),
                name=shop_info["owner_name"],
                is_shop_owner=True,
            )
            db.add(owner)
            db.flush()
            
            # Create shop
            shop = Shop(
                name=shop_info["name"],
                owner_id=owner.id,
                address=shop_info["address"],
                latitude=shop_info["latitude"],
                longitude=shop_info["longitude"],
            )
            db.add(shop)
            db.flush()
            shops_list.append((shop, owner))
            print(f"  [OK] {shop_info['name']} (login: {shop_info['email']})")
        
        db.commit()
        
        # Create sample products with discounts
        print("\n[INFO] Creating sample products with automatic discounts...")
        
        products_data = [
            # Shop 1 products
            {
                "shop_idx": 0,
                "name": "Organic Milk 1L",
                "category": "DAIRY",
                "original_price": 45.00,
                "quantity": 20,
                "days_left": 2,  # 60% discount
                "mfg_date": -7,
            },
            {
                "shop_idx": 0,
                "name": "Whole Wheat Bread",
                "category": "BAKERY",
                "original_price": 35.00,
                "quantity": 15,
                "days_left": 1,  # 60% discount
                "mfg_date": -3,
            },
            {
                "shop_idx": 0,
                "name": "Fresh Yogurt 500g",
                "category": "DAIRY",
                "original_price": 50.00,
                "quantity": 12,
                "days_left": 4,  # 35% discount
                "mfg_date": -8,
            },
            # Shop 2 products
            {
                "shop_idx": 1,
                "name": "Bananas (1 dozen)",
                "category": "PRODUCE",
                "original_price": 40.00,
                "quantity": 30,
                "days_left": 1,  # 60% discount
                "mfg_date": -4,
            },
            {
                "shop_idx": 1,
                "name": "Orange Juice 1L",
                "category": "OTHER",
                "original_price": 60.00,
                "quantity": 8,
                "days_left": 3,  # 35% discount
                "mfg_date": -10,
            },
            {
                "shop_idx": 1,
                "name": "Cheese Slice Pack",
                "category": "DAIRY",
                "original_price": 120.00,
                "quantity": 5,
                "days_left": 5,  # 20% discount
                "mfg_date": -15,
            },
            # Shop 3 products
            {
                "shop_idx": 2,
                "name": "Croissants (pack of 4)",
                "category": "BAKERY",
                "original_price": 80.00,
                "quantity": 10,
                "days_left": 1,  # 60% discount (expires today or tomorrow)
                "mfg_date": -2,
            },
            {
                "shop_idx": 2,
                "name": "Mixed Nuts 500g",
                "category": "PANTRY",
                "original_price": 150.00,
                "quantity": 6,
                "days_left": 8,  # 10% discount
                "mfg_date": -30,
            },
            {
                "shop_idx": 2,
                "name": "Butter 200g",
                "category": "DAIRY",
                "original_price": 110.00,
                "quantity": 8,
                "days_left": 6,  # 20% discount
                "mfg_date": -20,
            },
        ]
        
        def calculate_discount(original_price, days_left):
            """Match backend discount logic"""
            if days_left <= 2:
                return original_price * 0.70  # 70% off
            elif days_left <= 5:
                return original_price * 0.50  # 50% off
            elif days_left <= 10:
                return original_price * 0.30  # 30% off
            else:
                return original_price * 0.10  # 10% off
        
        for prod_info in products_data:
            shop, owner = shops_list[prod_info["shop_idx"]]
            
            # Calculate dates
            manufacturing_date = datetime.now() + timedelta(days=prod_info["mfg_date"])
            expiry_date = datetime.now() + timedelta(days=prod_info["days_left"])
            
            discount_amount = calculate_discount(
                prod_info["original_price"],
                prod_info["days_left"]
            )
            discount_price = prod_info["original_price"] - discount_amount
            
            product = Product(
                shop_id=shop.id,
                name=prod_info["name"],
                category=prod_info["category"],
                original_price=prod_info["original_price"],
                discount_price=discount_price,
                quantity=prod_info["quantity"],
                manufacturing_date=manufacturing_date,
                expiry_date=expiry_date,
                front_image_url="https://via.placeholder.com/300x300?text=" + prod_info["name"].replace(" ", "+"),
                expiry_image_url="https://via.placeholder.com/300x300?text=Expiry",
                description=f"High quality, fresh {prod_info['name']}. Available in stock for a limited time.",
                is_active=True,
            )
            db.add(product)
            
            discount_pct = round((discount_amount / prod_info["original_price"]) * 100)
            print(f"  [OK] {prod_info['name']} - {shop.name} ({discount_pct}% off, {prod_info['days_left']} days)")
        
        db.commit()
        
        # Create a sample customer
        print("\n[INFO] Creating sample customer...")
        customer = User(
            email="customer@test.com",
            hashed_password=hash_password("password123"),
            name="John Doe",
            is_shop_owner=False,
        )
        db.add(customer)
        db.commit()
        print(f"  [OK] Customer created (login: customer@test.com / password123)")
        
        print("\n" + "="*60)
        print("SUCCESS: SAMPLE DATA SEEDED SUCCESSFULLY!")
        print("="*60)
        print("\n[INFO] Sample Logins:")
        print("  Shop Owners:")
        for shop_info in shops_data:
            print(f"    - {shop_info['email']} / password123")
        print("  Customer:")
        print("    - customer@test.com / password123")
        print("\n[OK] You can now test the complete flow!")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
