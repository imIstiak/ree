"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { FormState } from "../../lib/backroom-forms";

// Submits a backroom form through a transition rather than the form's `action`: React 19 resets a
// form after an action, and a validation error from the server would wipe the edits.
export function useBackroomForm(action: (state: FormState, form: FormData) => Promise<FormState>, readOnly = false) {
  const [state, formAction, pending] = useActionState(action, undefined);
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly || pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }
  return { state, pending, onSubmit };
}
