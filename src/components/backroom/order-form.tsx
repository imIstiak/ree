"use client";

import { useActionState } from "react";
import { updateOrder } from "../../app/backroom/actions";
import { orderStatuses, paymentStatuses, type OrderStatus, type PaymentStatus } from "../../lib/order-states";
import { fieldLabel, input, panel, primaryButton } from "./ui";

// Moves an order along: status, payment and a private note. Cancelling puts tracked stock back
// and cannot be undone, so the option says so.
export function OrderForm({ id, status, paymentStatus, adminNote }: { id: string; status: OrderStatus; paymentStatus: PaymentStatus; adminNote: string }) {
  const [state, action, pending] = useActionState(updateOrder, undefined);
  const cancelled = status === "cancelled";
  return (
    <form action={action} className={`${panel} space-y-5 px-6 py-5 xl:sticky xl:top-8`}>
      <input type="hidden" name="id" value={id} />
      <h2 className="font-lp-display text-lg uppercase">Update</h2>
      <label className="block">
        <span className={fieldLabel}>Status</span>
        <select name="status" defaultValue={status} disabled={cancelled} className={input}>
          {orderStatuses.map((value) => (
            <option key={value} value={value}>
              {value === "cancelled" ? "cancelled (puts stock back, final)" : value}
            </option>
          ))}
        </select>
        {cancelled && <input type="hidden" name="status" value="cancelled" />}
      </label>
      <label className="block">
        <span className={fieldLabel}>Payment</span>
        <select name="payment_status" defaultValue={paymentStatus} className={input}>
          {paymentStatuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={fieldLabel}>Private note</span>
        <textarea name="admin_note" defaultValue={adminNote} rows={4} placeholder="Called at 3 pm, asked for delivery after 6…" className={input} />
      </label>
      {state?.error && (
        <p role="alert" className="text-[12px] text-lp-value-delivery">
          {state.error}
        </p>
      )}
      {state?.notice && (
        <p role="status" className="text-[12px] text-lp-brand">
          {state.notice}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
