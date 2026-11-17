import { fieldLabel, input } from "./ui";

// Small pieces the backroom's forms share. Hook-free.

export function StatusSelect({ value, noun }: { value: string; noun: string }) {
  return (
    <label className="block">
      <span className={fieldLabel}>Status</span>
      <select name="status" defaultValue={value} className={input}>
        <option value="draft">Draft · hidden while you work on it</option>
        <option value="published">Published · on the shop</option>
        <option value="archived">Archived · hidden, kept for the record</option>
      </select>
      <span className="mt-1 block text-[11px] text-lp-muted">Only a published {noun} appears on the shop.</span>
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="lp-patch bg-lp-patch-madder/12 px-4 py-3 text-[12px] text-lp-value-delivery [--lp-stitch-inset:3px]">
      {message}
    </p>
  );
}
