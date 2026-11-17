import { redirect } from "next/navigation";
import { LoginForm } from "../../../components/backroom/login-form";
import { Notice, panel } from "../../../components/backroom/ui";
import { BrandLogo } from "../../../components/brand-logo";
import { backroomSetup, currentAdmin } from "../../../lib/backroom-session";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/backroom/orders");
  const setup = backroomSetup();
  const ready = setup.supabase && setup.secret;
  return (
    <div className="grid min-h-full place-items-center px-4 py-16">
      <div className={`${panel} w-full max-w-sm -rotate-[.6deg] px-8 py-10`}>
        <BrandLogo variant="mark" className="w-12" decorative />
        <p className="mt-6 text-[10px] tracking-[.16em] text-lp-muted uppercase">ঋ - Reé</p>
        <h1 className="mt-1 font-lp-display text-3xl leading-none uppercase">Backroom</h1>
        {ready ? (
          <LoginForm />
        ) : (
          <div className="mt-6">
            <Notice tone="warn">
              Not set up yet. Add {setup.supabase ? "" : <><code>SUPABASE_URL</code> and <code>SUPABASE_SECRET_KEY</code>{setup.secret ? "" : " and "}</>}
              {setup.secret ? "" : <>an <code>AUTH_SECRET</code> of at least 32 characters</>} to <code>.env</code>, then restart the server.
            </Notice>
          </div>
        )}
      </div>
    </div>
  );
}
