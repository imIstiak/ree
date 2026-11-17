"use client";

import { useActionState } from "react";
import { login } from "../../app/backroom/actions";
import { fieldLabel, input, primaryButton } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-5">
      <label className="block">
        <span className={fieldLabel}>Email</span>
        {/* React resets the form after the action; a failed attempt hands the email back. */}
        <input key={state?.email} name="email" type="email" required autoComplete="username" autoFocus={!state?.email} defaultValue={state?.email} className={input} />
      </label>
      <label className="block">
        <span className={fieldLabel}>Password</span>
        <input name="password" type="password" required autoComplete="current-password" autoFocus={Boolean(state?.email)} className={input} />
      </label>
      {state?.error && (
        <p role="alert" className="text-[12px] text-lp-value-delivery">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
