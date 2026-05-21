import os
import uuid
from typing import Optional
from fastapi import UploadFile, HTTPException
from supabase import create_client, Client

def get_supabase_client() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")
    if not url or not key:
        return None
    return create_client(url, key)

def upload_product_image(file: UploadFile) -> str:
    supabase = get_supabase_client()
    if not supabase:
        # Fallback for local development if Supabase isn't configured yet
        return f"https://via.placeholder.com/400x300?text=Placeholder+{file.filename}"

    try:
        file_ext = file.filename.split(".")[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        
        # Read the file content
        file_content = file.file.read()
        
        # Upload to Supabase Storage in the 'products' bucket
        res = supabase.storage.from_("products").upload(
            file_name, 
            file_content, 
            {"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_("products").get_public_url(file_name)
        return public_url
    except Exception as e:
        print(f"Error uploading image to Supabase: {str(e)}")
        # Fallback to placeholder if bucket doesn't exist or RLS is blocking
        return f"https://placehold.co/400x300/e2e8f0/64748b?text=Image+Unavailable"
