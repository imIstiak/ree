import Link from "next/link";
import type { ReactNode } from "react";
import { BackroomHeader } from "../../../components/backroom/backroom-header";
import { BackroomNav } from "../../../components/backroom/backroom-nav";
import { CrumbsProvider } from "../../../components/backroom/crumbs";
import { Notice } from "../../../components/backroom/ui";
import { BrandLogo } from "../../../components/brand-logo";
import { requireAdmin } from "../../../lib/backroom-session";
import { supabaseConfigured } from "../../../lib/supabase";

// The signed-in backroom: an emerald cloth sidebar (the header tiles' colours) beside the page
// column, whose header sticks to the top (backroom-header.tsx: breadcrumbs, theme, account). The
// check here only decides what to draw; every page and action checks the session again.
export default async function DeskLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return (
    <CrumbsProvider>
      <div className="min-h-full lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="lp-patch bg-lp-brand-cloth text-lp-brand-base [--lp-stitch-inset:8px] group-data-[lp-theme=dark]/theme:bg-lp-brand-deep-cloth lg:sticky lg:top-0 lg:h-svh">
          <Link href="/backroom/orders" className="flex items-center gap-3 px-6 py-5 lg:block lg:py-8">
            <BrandLogo variant="mark" className="w-9 lg:w-12" decorative />
            <span className="block lg:mt-3">
              <span className="block font-lp-display text-lg leading-none uppercase">Backroom</span>
              <span className="block text-[10px] tracking-[.14em] uppercase opacity-70">ঋ - Reé</span>
            </span>
          </Link>
          <BackroomNav />
        </aside>
        <main className="min-w-0 px-4 pb-12 sm:px-6 lg:px-8">
          <BackroomHeader name={admin.name} email={admin.email} />
          {!supabaseConfigured() && (
            <div className="mb-8">
              <Notice tone="warn">
                <strong className="font-medium">Preview mode.</strong> Supabase isn&apos;t connected yet, so this shows the starter catalogue read-only and no orders. Add{" "}
                <code>SUPABASE_URL</code> and <code>SUPABASE_SECRET_KEY</code> to <code>.env</code>, run <code>npm run db:migrate</code>, and restart the server.
              </Notice>
            </div>
          )}
          {children}
        </main>
      </div>
    </CrumbsProvider>
  );
}
