import { apiRequest } from "@/api/client";
import type { ApiShopSummary } from "@/types/product";

export type ShopWithDescription = ApiShopSummary & {
  description?: string | null;
  deal_count?: number;
};

export type ShopUpdatePayload = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
};

export async function listShops(): Promise<ShopWithDescription[]> {
  return apiRequest<ShopWithDescription[]>("/shops/");
}

export async function getMyShop(): Promise<ShopWithDescription> {
  return apiRequest<ShopWithDescription>("/shops/me");
}

export async function getShop(shopId: string): Promise<ShopWithDescription> {
  return apiRequest<ShopWithDescription>(`/shops/${shopId}`);
}

export async function updateShop(
  shopId: string,
  data: ShopUpdatePayload
): Promise<ShopWithDescription> {
  return apiRequest<ShopWithDescription>(`/shops/${shopId}`, {
    method: "PUT",
    json: data,
  });
}

export async function createShop(data: ShopUpdatePayload): Promise<ShopWithDescription> {
  return apiRequest<ShopWithDescription>("/shops/", {
    method: "POST",
    json: data,
  });
}
