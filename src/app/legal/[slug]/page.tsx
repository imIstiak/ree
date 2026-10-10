import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalPages } from "../../../components/info-pages";

// /legal/privacy, /legal/terms and /legal/cookies, all prerendered; unknown slugs are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages.find((candidate) => candidate.slug === slug);
  return page ? { title: `ঋ - Ree | ${page.title}` } : {};
}

export default async function Page({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const page = legalPages.find((candidate) => candidate.slug === slug);
  if (!page) notFound();
  return <LegalPage page={page} />;
}
