import type { Metadata } from "next";
import { contact } from "../data/brand";
import { indexablePaths, site, socialProfiles } from "../data/site";

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}

type PageMetadata = {
  path: string;
  title?: string;
  description: string;
  image?: { url: string; alt: string };
};

export function createPageMetadata({ path, title, description, image }: PageMetadata): Metadata {
  const pageTitle = title ? `${title} | ${site.shortName}` : site.title;
  const index = indexablePaths.some((candidate) => candidate === path);
  const shareImage = image
    ? { ...image, url: absoluteUrl(image.url) }
    : { url: absoluteUrl(site.socialImage), width: 1200, height: 630, alt: site.socialImageAlt };

  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: {
      index,
      follow: true,
      googleBot: { index, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    openGraph: {
      type: "website",
      locale: "en_BD",
      siteName: site.name,
      title: pageTitle,
      description,
      url: absoluteUrl(path),
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title: pageTitle, description, images: [shareImage] },
  };
}

export const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: site.name,
      alternateName: ["Reé", "Reé Threads"],
      url: absoluteUrl("/"),
      description: site.description,
      slogan: "Not everything old belongs in the past.",
      logo: { "@type": "ImageObject", url: absoluteUrl("/seo/ree-logo.png"), width: 512, height: 512 },
      email: contact.email,
      telephone: "+8801789891616",
      address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
      sameAs: Object.values(socialProfiles),
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: site.name,
      alternateName: "Reé",
      description: site.description,
      inLanguage: "en-BD",
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ],
};

export function brandPageStructuredData(path: "/about" | "/contact", name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": path === "/about" ? "AboutPage" : "ContactPage",
        "@id": absoluteUrl(`${path}#webpage`),
        url: absoluteUrl(path),
        name,
        description,
        inLanguage: "en-BD",
        about: { "@id": absoluteUrl("/#organization") },
        isPartOf: { "@id": absoluteUrl("/#website") },
        breadcrumb: { "@id": absoluteUrl(`${path}#breadcrumb`) },
      },
      {
        "@type": "BreadcrumbList",
        "@id": absoluteUrl(`${path}#breadcrumb`),
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Reé", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name, item: absoluteUrl(path) },
        ],
      },
    ],
  };
}
