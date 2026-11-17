"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// The header's breadcrumbs. Fixed sections come from the path; a record's own name (an order's
// number, a product's name) is handed up by its page with <CrumbLabel>, so the trail reads
// "Orders › REE-1001" instead of an id.
//
// The setter has its own context and is stable (useCallback): CrumbLabel's effect depends on it,
// and a setter recreated on every render made the effect clear and re-set its label on every
// render, which re-rendered the provider again ("Maximum update depth exceeded").

type Labels = Record<string, string>;
type SetLabel = (id: string, label: string | null) => void;
const LabelsContext = createContext<Labels>({});
const SetLabelContext = createContext<SetLabel | null>(null);

export function CrumbsProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<Labels>({});
  const setLabel = useCallback<SetLabel>(
    (id, label) =>
      setLabels((current) => {
        if (label === null) {
          if (!(id in current)) return current;
          const next = { ...current };
          delete next[id];
          return next;
        }
        return current[id] === label ? current : { ...current, [id]: label };
      }),
    [],
  );
  return (
    <SetLabelContext value={setLabel}>
      <LabelsContext value={labels}>{children}</LabelsContext>
    </SetLabelContext>
  );
}

// Rendered by a record's page: names the path segment `id` in the trail. Draws nothing itself.
export function CrumbLabel({ id, label }: { id: string; label: string }) {
  const setLabel = useContext(SetLabelContext);
  useEffect(() => {
    setLabel?.(id, label);
    return () => setLabel?.(id, null);
  }, [id, label, setLabel]);
  return null;
}

const sections: Record<string, string> = { orders: "Orders", products: "Products", collections: "Collections", banners: "Banners" };
const newOf: Record<string, string> = { products: "New product", collections: "New collection", seasons: "New season" };

export function Breadcrumbs() {
  const pathname = usePathname();
  const labels = useContext(LabelsContext);
  const segments = pathname.split("/").filter(Boolean).slice(1); // after "backroom"
  const trail = [
    { href: "/backroom/orders", label: "Backroom" },
    ...segments.flatMap((segment, index) =>
      // "seasons" has no page of its own; its seasons are listed on the collection's page.
      segment === "seasons"
        ? []
        : [
            {
              href: `/backroom/${segments.slice(0, index + 1).join("/")}`,
              label: segment === "new" ? (newOf[segments[index - 1]] ?? "New") : (sections[segment] ?? labels[segment] ?? "…"),
            },
          ],
    ),
  ];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2 text-[11px] tracking-[.12em] uppercase">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.href + index} className={`flex min-w-0 items-center gap-2 ${last ? "" : "hidden sm:flex"}`}>
              {index > 0 && (
                <span aria-hidden="true" className="hidden opacity-50 sm:inline">
                  ›
                </span>
              )}
              {last ? (
                <span aria-current="page" className="truncate font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="truncate opacity-75 underline-offset-4 hover:underline hover:opacity-100">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
