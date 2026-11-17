import { BACKROOM_ROOT_ID, ThemeToggle } from "../theme-controls";
import { Breadcrumbs } from "./crumbs";
import { ProfileMenu } from "./profile-menu";

// The backroom's header: an emerald cloth bar that sticks to the top of the page column (sticky in
// the backroom's scroll container, so it is always exactly the column's width), carrying where you
// are, the theme switch and your account. The band behind it is the page colour, so content
// scrolling up disappears under it rather than showing through the gap above.
export function BackroomHeader({ name, email }: { name: string; email: string }) {
  return (
    <div className="sticky top-0 z-30 bg-lp-bg pt-3 pb-4 lg:pt-5 lg:pb-6">
      <header className="lp-patch flex h-16 items-center justify-between gap-4 bg-lp-brand px-4 text-lp-brand-base shadow-[0_10px_24px_rgb(0_0_0/.18)] [--lp-stitch-inset:6px] sm:px-6">
        <Breadcrumbs />
        <div className="flex flex-none items-center gap-4">
          <ThemeToggle rootId={BACKROOM_ROOT_ID} className="size-9 -rotate-3" />
          <span aria-hidden="true" className="h-7 border-l border-dashed border-lp-brand-base/40" />
          <ProfileMenu name={name} email={email} />
        </div>
      </header>
    </div>
  );
}
