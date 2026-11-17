import type { ReactNode } from "react";
import { PageTransition } from "../../../components/page-transition";

// Remounts when the collection's season changes, so the page transition plays between seasons too.
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
