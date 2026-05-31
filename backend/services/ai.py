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
