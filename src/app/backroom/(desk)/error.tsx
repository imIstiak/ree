"use client";

import Link from "next/link";
import { useEffect } from "react";
import { panel, primaryButton, quietButton } from "../../../components/backroom/ui";

// Anything that breaks a backroom page lands here, inside the sidebar and header, instead of a
// blank white screen (a production build shows nothing at all without a boundary).
export default function BackroomError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className={`${panel} max-w-2xl space-y-4 px-6 py-6`}>
      <h1 className="font-lp-display text-2xl uppercase">Something went wrong</h1>
      <p className="text-[13px] leading-relaxed">
        This page stopped before it finished. Nothing you saved before this was lost. Try again; if it keeps happening, send the line below to whoever looks after the site.
      </p>
      <p className="font-lp-mono text-[11px] break-all text-lp-muted">
        {error.message || "Unknown error"}
        {error.digest && ` · ${error.digest}`}
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={retry} className={primaryButton}>
          Try again
        </button>
        <Link href="/backroom/orders" className={quietButton}>
          Back to orders
        </Link>
      </div>
    </div>
  );
}
