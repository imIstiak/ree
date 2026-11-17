// Order and payment states, shared by the server (supabase.ts, the actions) and the backroom's
// client forms; the database checks the same lists (supabase/migrations/…_backroom.sql).
export const orderStatuses = ["new", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
export const paymentStatuses = ["unpaid", "paid", "refunded"] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
