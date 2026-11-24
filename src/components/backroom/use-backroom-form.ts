"use client";

import { unstable_rethrow } from "next/navigation";
import { startTransition, useActionState, useState, type FormEvent } from "react";
import type { FormState } from "../../lib/backroom-forms";
import { uploadPickedPhotos } from "./direct-upload";

// Submits a backroom form through a transition rather than the form's `action`: React 19 resets a
// form after an action, and a validation error from the server would wipe the edits. Picked photos
// are uploaded first, straight to the photo bucket (direct-upload.ts), so the save itself is small.
// `busy` says what is happening for the submit button: "Uploading photo 1 of 2…", "Saving…".
// A save that fails outright (the connection drops, the host refuses the request) comes back as
// the form's error instead of crashing the page to blank; Next's own redirect after a good save is
// passed through (unstable_rethrow).
export function useBackroomForm(action: (state: FormState, form: FormData) => Promise<FormState>, readOnly = false) {
  const [state, formAction, saving] = useActionState(async (previous: FormState, data: FormData): Promise<FormState> => {
    try {
      return await action(previous, data);
    } catch (error) {
      unstable_rethrow(error);
      const reason = error instanceof Error && error.message ? ` (${error.message})` : "";
      return { error: `The save didn't go through${reason}. Check the connection and try again.` };
    }
  }, undefined);
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly || saving || uploading !== null) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setUploadError(null);
    setUploading("");
    try {
      await uploadPickedPhotos(form, data, (step) => setUploading(step));
    } catch (error) {
      setUploadError((error as Error).message || "A photo could not be uploaded; please try again.");
      return;
    } finally {
      setUploading(null);
    }
    startTransition(() => formAction(data));
  }

  const pending = saving || uploading !== null;
  const busy = uploading !== null ? `Uploading photo${uploading ? ` ${uploading}` : ""}…` : saving ? "Saving…" : null;
  return { state: uploadError ? { error: uploadError } : state, pending, busy, onSubmit };
}
