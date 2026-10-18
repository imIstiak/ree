import type { ReactNode } from "react";
import { PageTransition } from "../components/page-transition";

// Remounts on every route change at this level, so the page transition plays (page-transition.tsx).
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
