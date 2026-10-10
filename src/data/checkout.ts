// Delivery as the product pages promise it: free across Bangladesh from ৳ 3,000, otherwise a flat
// fee by area. The fees are sample figures, like the prices.
export const FREE_DELIVERY_FROM = 3000;

export const deliveryAreas = [
  { id: "dhaka", label: "Inside Dhaka", fee: 80, days: "1–2 days" },
  { id: "outside", label: "Outside Dhaka", fee: 150, days: "3–5 days" },
] as const;

export type DeliveryArea = (typeof deliveryAreas)[number]["id"];

export function deliveryFee(subtotal: number, area: DeliveryArea) {
  if (subtotal === 0 || subtotal >= FREE_DELIVERY_FROM) return 0;
  return deliveryAreas.find((option) => option.id === area)?.fee ?? 0;
}
