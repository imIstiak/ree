import type { MetadataRoute } from "next";
import { indexablePaths } from "../data/site";
import { absoluteUrl } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // No fabricated lastModified dates: add them when real editorial dates are tracked.
  return indexablePaths.map((path) => ({ url: absoluteUrl(path) }));
}
