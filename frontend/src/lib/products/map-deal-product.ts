import type { ApiProduct } from "@/types/product";
import type { DealProductCardProps } from "@/components/products/DealProductCard";

export function buildDealProductCardProps(
  product: ApiProduct,
  index: number,
  playingId: string | null,
  onTogglePlay: (id: string, e: React.MouseEvent) => void,
  onReserve?: (id: string) => void
): DealProductCardProps {
  const expiryDate = new Date(product.expiry_date);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let expiryLabel: string;
  let expiryIsExpired = false;

  if (diffMs <= 0) {
    expiryLabel = "Expired";
    expiryIsExpired = true;
  } else if (diffHours < 24) {
    expiryLabel = `${diffHours}h left`;
  } else {
    expiryLabel = `${diffDays}d left`;
  }

  const actualPrice = product.current_price !== null ? product.current_price : product.discount_price;

  const discountPercent =
    product.original_price > 0
      ? Math.round(
          ((product.original_price - actualPrice) / product.original_price) * 100
        )
      : 0;

  return {
    index,
    id: product.id,
    name: product.name,
    imageUrl: product.front_image_url,
    originalPrice: product.original_price,
    discountPrice: product.discount_price,
    currentPrice: actualPrice,
    isDynamicPricing: product.auto_discount_enabled && actualPrice < product.discount_price,
    isSurpriseBag: product.is_surprise_bag,
    discountPercent,
    expiryLabel,
    expiryIsExpired,
    shopId: product.shop_id,
    shopSubtitle: product.shop?.name ?? "Local Shop",
    quantity: product.quantity,
    hasVoiceNote: !!product.voice_note_url,
    playingId,
    onTogglePlay,
    onReserve,
  };
}
