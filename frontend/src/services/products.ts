import { apiRequest } from "@/api/client";
import type { ApiProduct, ApiProductCreate, ProductCategory, ApiFavorite } from "@/types/product";

export type GetProductsParams = {
  skip?: number;
  limit?: number;
  hideExpired?: boolean;
  shopId?: string;
  q?: string;
  category?: ProductCategory;
  lat?: number;
  lng?: number;
  radius_km?: number;
};

export async function getProducts(params: GetProductsParams = {}): Promise<ApiProduct[]> {
  const search = new URLSearchParams();
  if (params.skip != null) search.set("skip", String(params.skip));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.shopId) search.set("shop_id", params.shopId);
  if (params.hideExpired === false) {
    search.set("hide_expired", "false");
  }
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.lat != null) search.set("lat", String(params.lat));
  if (params.lng != null) search.set("lng", String(params.lng));
  if (params.radius_km != null) search.set("radius_km", String(params.radius_km));
  
  const qs = search.toString();
  const path = qs ? `/products/?${qs}` : "/products/";
  return apiRequest<ApiProduct[]>(path);
}

export type ApiProductOptimizeRequest = {
  name: string;
  mfg_date: string;
  expiry_date: string;
  original_price: number;
  quantity: number;
};

export type ApiProductOptimizeResponse = {
  suggested_description: string;
  suggested_discount_tier: string;
  suggested_discount_percent: number;
  confidence_score: number;
};

export async function optimizeProductDetails(
  payload: ApiProductOptimizeRequest
): Promise<ApiProductOptimizeResponse> {
  return apiRequest<ApiProductOptimizeResponse>("/products/optimize", {
    method: "POST",
    json: payload,
  });
}

export async function createProduct(product: ApiProductCreate): Promise<ApiProduct> {
  return apiRequest<ApiProduct>("/products/", {
    method: "POST",
    json: product,
  });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<{ url: string }>("/upload/image", {
    method: "POST",
    body: formData,
    // Note: Don't set Content-Type header when using FormData, fetch does it automatically with boundary
  });
  return response.url;
}

export async function updateProduct(
  productId: string,
  product: ApiProductCreate
): Promise<ApiProduct> {
  return apiRequest<ApiProduct>(`/products/${productId}`, {
    method: "PUT",
    json: product,
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await apiRequest(`/products/${productId}`, {
    method: "DELETE",
  });
}

// Favorites
export async function addFavorite(productId: string): Promise<ApiFavorite> {
  return apiRequest<ApiFavorite>("/favorites/", {
    method: "POST",
    json: { product_id: productId },
  });
}

export async function removeFavorite(productId: string): Promise<void> {
  await apiRequest(`/favorites/${productId}`, {
    method: "DELETE",
  });
}

export async function getFavorites(): Promise<ApiFavorite[]> {
  return apiRequest<ApiFavorite[]>("/favorites/me");
}

export async function getRecommendedProducts(): Promise<ApiProduct[]> {
  return apiRequest<ApiProduct[]>("/products/recommended");
}

export async function getProductForecast(productId: string): Promise<{
  rescue_probability: number;
  sellout_hours: number;
  optimal_discount_percent: number;
  optimal_price: number;
  model_confidence: number;
}> {
  return apiRequest<any>(`/products/${productId}/forecast`);
}

export async function scanProductDates(file: File): Promise<{
  manufacturing_date: string | null;
  expiry_date: string | null;
  confidence_score: number;
  detected_text: string;
}> {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<any>("/products/scan-dates", {
    method: "POST",
    body: formData,
  });
}

