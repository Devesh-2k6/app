import json
import httpx
import base64
from datetime import datetime, timedelta
from config import settings

GEMINI_API_KEY = settings.GEMINI_API_KEY or ""

def get_smart_fallback_description(name: str) -> str:
    """Generates a high-quality copy template based on product keywords."""
    name_lower = name.lower()
    
    if any(k in name_lower for k in ["bread", "cake", "cookie", "pastry", "croissant", "bun", "bakery"]):
        return f"Freshly baked {name}! Deliciously soft, perfect for breakfast or a sweet snack. Save it today!"
    elif any(k in name_lower for k in ["milk", "cheese", "yogurt", "butter", "paneer", "cream", "dairy"]):
        return f"Rich, high-quality {name}. Keep it chilled and enjoy it fresh. Great deal, save it from going to waste!"
    elif any(k in name_lower for k in ["apple", "banana", "berry", "tomato", "salad", "vegetable", "fruit", "produce"]):
        return f"Fresh organic {name}, packed with vitamins. Perfect for smoothies, salads, or cooking today!"
    elif any(k in name_lower for k in ["chicken", "meat", "beef", "pork", "fish", "egg"]):
        return f"Premium quality {name}. Perfect for preparing a delicious and protein-packed meal tonight!"
    elif any(k in name_lower for k in ["juice", "soda", "coffee", "tea", "drink", "beverage"]):
        return f"Refreshing {name}! Keep it cold and enjoy a delicious drink at an unbeatable price."
    elif any(k in name_lower for k in ["rice", "pasta", "flour", "oil", "sauce", "pantry"]):
        return f"Stock up on {name}! High-quality pantry essential, ready to use for your next meal prep."
    
    return f"Delicious {name}, in perfect condition and ready for consumption. Save food, save money!"

async def optimize_product_details(
    name: str, 
    mfg_date_str: str, 
    expiry_date_str: str, 
    original_price: float, 
    quantity: int
) -> dict:
    """
    Optimizes product copy and discount recommendation using Gemini API, 
    falling back to local heuristics if the API key is not present or calls fail.
    """
    # Calculate expiry days left
    try:
        expiry_date = datetime.fromisoformat(expiry_date_str.replace("Z", "+00:00")).replace(tzinfo=None)
    except Exception:
        try:
            expiry_date = datetime.strptime(expiry_date_str, "%Y-%m-%d")
        except Exception:
            expiry_date = datetime.now()
            
    days_left = (expiry_date - datetime.now()).days
    
    # Determine discount tier & percent
    if days_left <= 3:
        suggested_tier = "high"
        suggested_percent = 50
    elif days_left <= 7:
        suggested_tier = "medium"
        suggested_percent = 25
    else:
        suggested_tier = "low"
        suggested_percent = 10
        
    # Attempt to use Gemini API if key is present
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = (
                f"You are an expert food copywriter and deal optimizer for 'ExpiryGo', a food rescue app.\n"
                f"Generate an appetizing, short food description (strictly under 100 characters) for:\n"
                f"- Product: {name}\n"
                f"- Expiry Date: {expiry_date_str}\n"
                f"- Original Price: {original_price}\n"
                f"- Available Quantity: {quantity}\n\n"
                f"Return ONLY a raw JSON object matching this structure (no markdown wrapper, no other text):\n"
                f"{{\n"
                f'  "suggested_description": "Enticing 100-character description of the product"\n'
                f"}}"
            )
            
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=payload, timeout=8.0)
                if response.status_code == 200:
                    res_data = response.json()
                    text_out = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    
                    # Clean up markdown if model wrapped it in ```json ... ```
                    if text_out.startswith("```"):
                        lines = text_out.splitlines()
                        # remove first and last lines
                        text_out = "\n".join(lines[1:-1]) if lines[-1].startswith("```") else "\n".join(lines[1:])
                        
                    parsed = json.loads(text_out)
                    if "suggested_description" in parsed:
                        return {
                            "suggested_description": parsed["suggested_description"],
                            "suggested_discount_tier": suggested_tier,
                            "suggested_discount_percent": suggested_percent,
                            "confidence_score": 0.95
                        }
        except Exception as e:
            print(f"⚠️ Gemini API optimization failed, falling back to heuristics: {e}")

    # Fallback response
    description = get_smart_fallback_description(name)
    return {
        "suggested_description": description,
        "suggested_discount_tier": suggested_tier,
        "suggested_discount_percent": suggested_percent,
        "confidence_score": 0.80
    }

OPENAI_API_KEY = settings.OPENAI_API_KEY or ""

async def scan_date_label_vision(file_bytes: bytes) -> dict:
    """
    Scans the uploaded image bytes of a packaging label for Manufacturing and Expiry dates
    using OpenAI's gpt-4o-mini Vision API.
    """
    if not OPENAI_API_KEY:
        print("⚠️ OPENAI_API_KEY is missing. Falling back to default date mock.")
        return {
            "manufacturing_date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
            "expiry_date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
            "confidence_score": 0.50,
            "detected_text": "AI vision scanner simulated fallback (No API Key)"
        }
        
    try:
        # 1. Base64 encode the image bytes
        base64_image = base64.b64encode(file_bytes).decode("utf-8")
        
        # 2. Prepare payload for gpt-4o-mini
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        prompt = (
            "Analyze the uploaded packaging label image. Locate the Manufacturing Date (MFG/MFD) "
            "and the Expiry Date (EXP/Best Before). Extract and return them strictly in the following "
            "JSON structure (values must be strictly formatted as YYYY-MM-DD or null if not found):\n"
            "{\n"
            "  \"manufacturing_date\": \"YYYY-MM-DD\",\n"
            "  \"expiry_date\": \"YYYY-MM-DD\",\n"
            "  \"confidence_score\": 0.95,\n"
            "  \"detected_text\": \"raw label string text\"\n"
            "}\n"
            "Return ONLY the raw JSON object, no markdown wrapper, no other text."
        )
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "response_format": { "type": "json_object" }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=12.0)
            if response.status_code == 200:
                res_data = response.json()
                text_out = res_data["choices"][0]["message"]["content"].strip()
                parsed = json.loads(text_out)
                
                return {
                    "manufacturing_date": parsed.get("manufacturing_date"),
                    "expiry_date": parsed.get("expiry_date"),
                    "confidence_score": parsed.get("confidence_score", 0.90),
                    "detected_text": parsed.get("detected_text", "")
                }
            else:
                print(f"⚠️ OpenAI Vision API failed with status {response.status_code}: {response.text}")
    except Exception as e:
        print(f"⚠️ OpenAI Vision API exception occurred: {e}")
        
    return {
        "manufacturing_date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "expiry_date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "confidence_score": 0.60,
        "detected_text": "Heuristic fallback due to connection error"
    }

async def parse_semantic_search(q: str) -> dict:
    """
    Parses a natural language query using the Gemini API to extract search parameters,
    falling back to local heuristics if the API key is not configured or calls fail.
    """
    default_res = {
        "keywords": [q],
        "categories": [],
        "max_price": None,
        "min_discount_pct": None,
        "expiry_urgency": None
    }
    
    if not q:
        return default_res
        
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = (
                f"You are an expert NLP search engine for 'ExpiryGo', a near-expiry food rescue app.\n"
                f"Analyze the user's natural language search query and extract structured query parameters:\n"
                f"Query: '{q}'\n\n"
                f"The available product categories are strictly: BAKERY, DAIRY, PRODUCE, MEAT, PANTRY, PREPARED_FOOD, OTHER.\n"
                f"For the 'expiry_urgency' field, use 'today' (under 24h), 'tomorrow' (under 48h), or 'week' (under 7 days).\n\n"
                f"Return ONLY a raw JSON object matching this structure (no markdown wrapper, no other text):\n"
                f"{{\n"
                f'  "keywords": ["list", "of", "noun", "keywords", "to", "search", "like", "bread", "chicken"],\n'
                f'  "categories": ["list of matching Category strings if explicitly matched or implied, empty if not"],\n'
                f'  "max_price": null or float number budget limit,\n'
                f'  "min_discount_pct": null or float percentage (e.g. 50.0 for 50% off),\n'
                f'  "expiry_urgency": null or "today" or "tomorrow" or "week"\n'
                f"}}"
            )
            
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=payload, timeout=8.0)
                if response.status_code == 200:
                    res_data = response.json()
                    text_out = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    
                    if text_out.startswith("```"):
                        lines = text_out.splitlines()
                        text_out = "\n".join(lines[1:-1]) if lines[-1].startswith("```") else "\n".join(lines[1:])
                        
                    parsed = json.loads(text_out)
                    return {
                        "keywords": parsed.get("keywords") or [q],
                        "categories": parsed.get("categories") or [],
                        "max_price": parsed.get("max_price"),
                        "min_discount_pct": parsed.get("min_discount_pct"),
                        "expiry_urgency": parsed.get("expiry_urgency")
                    }
        except Exception as e:
            print(f"⚠️ Gemini semantic search parse failed: {e}")
            
    # Local heuristics fallback
    q_lower = q.lower()
    keywords = [w.strip() for w in q_lower.split() if len(w.strip()) > 2]
    if not keywords:
        keywords = [q_lower]
        
    categories = []
    if any(w in q_lower for w in ["bread", "cake", "cookie", "pastry", "bakery", "croissant"]):
        categories.append("BAKERY")
    if any(w in q_lower for w in ["milk", "cheese", "butter", "paneer", "yogurt", "dairy"]):
        categories.append("DAIRY")
    if any(w in q_lower for w in ["apple", "banana", "fruit", "salad", "vegetable", "tomato", "produce"]):
        categories.append("PRODUCE")
    if any(w in q_lower for w in ["chicken", "meat", "beef", "pork", "egg", "fish"]):
        categories.append("MEAT")
    if any(w in q_lower for w in ["rice", "pasta", "flour", "oil", "sauce", "pantry"]):
        categories.append("PANTRY")
    if any(w in q_lower for w in ["prepared", "ready", "meal", "cooked", "breakfast", "dinner", "lunch"]):
        categories.append("PREPARED_FOOD")
        
    # Extract max price (e.g. "under 150", "below 200", "budget 100")
    max_price = None
    import re
    price_match = re.search(r'(?:under|below|budget|less than|rs|inr|₹)\s*(\d+)', q_lower)
    if price_match:
        max_price = float(price_match.group(1))
        
    # Extract discount (e.g. "50% off", "30 percent discount")
    min_discount_pct = None
    discount_match = re.search(r'(\d+)\s*(?:%|percent)\s*(?:off|discount)?', q_lower)
    if discount_match:
        min_discount_pct = float(discount_match.group(1))
        
    expiry_urgency = None
    if any(w in q_lower for w in ["today", "tonight", "urgent", "now"]):
        expiry_urgency = "today"
    elif any(w in q_lower for w in ["tomorrow", "next day"]):
        expiry_urgency = "tomorrow"
    elif any(w in q_lower for w in ["week", "few days"]):
        expiry_urgency = "week"
        
    return {
        "keywords": keywords,
        "categories": categories,
        "max_price": max_price,
        "min_discount_pct": min_discount_pct,
        "expiry_urgency": expiry_urgency
    }

async def get_recipe_ingredients(recipe_name: str) -> dict:
    """
    Retrieves required ingredients for a dish using Gemini,
    falling back to local recipe configurations if key is not configured or calls fail.
    """
    default_res = {
        "recipe_name": recipe_name,
        "ingredients": [recipe_name]
    }
    
    if not recipe_name:
        return default_res
        
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            prompt = (
                f"Identify the standard primary cooking ingredients needed for this recipe/dish: '{recipe_name}'\n"
                f"Return ONLY a raw JSON object matching this structure (no markdown wrapper, no other text):\n"
                f"{{\n"
                f'  "recipe_name": "Formatted Recipe Name",\n'
                f'  "ingredients": ["ingredient1", "ingredient2", "ingredient3", "ingredient4"]\n'
                f"}}"
            )
            
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=payload, timeout=8.0)
                if response.status_code == 200:
                    res_data = response.json()
                    text_out = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    
                    if text_out.startswith("```"):
                        lines = text_out.splitlines()
                        text_out = "\n".join(lines[1:-1]) if lines[-1].startswith("```") else "\n".join(lines[1:])
                        
                    parsed = json.loads(text_out)
                    return {
                        "recipe_name": parsed.get("recipe_name") or recipe_name,
                        "ingredients": parsed.get("ingredients") or [recipe_name]
                    }
        except Exception as e:
            print(f"⚠️ Gemini recipe ingredients failed: {e}")
            
    # Local recipe mappings
    recipe_map = {
        "pasta": ["pasta", "tomato", "sauce", "garlic", "cheese"],
        "pizza": ["cheese", "bread", "tomato", "sauce", "onion", "bell pepper"],
        "salad": ["salad", "tomato", "cucumber", "onion", "apple", "banana", "fruit", "lettuce"],
        "cake": ["cake", "egg", "flour", "sugar", "butter", "milk"],
        "sandwich": ["bread", "cheese", "tomato", "butter"],
        "curry": ["paneer", "chicken", "onion", "tomato", "oil", "cream"]
    }
    
    r_lower = recipe_name.lower()
    for key, ingredients in recipe_map.items():
        if key in r_lower:
            return {
                "recipe_name": recipe_name.title(),
                "ingredients": ingredients
            }
            
    return {
        "recipe_name": recipe_name.title(),
        "ingredients": [w.strip() for w in r_lower.split() if len(w.strip()) > 2]
    }
