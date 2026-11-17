import type { NextConfig } from "next";
import { site } from "./src/data/site";

// The shop's own product photos live in its Supabase project's public `ree-products` bucket
// (uploaded from /backroom); the host comes from SUPABASE_URL so the config needs no edit.
const supabaseHost = (() => {
  try {
    return process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    // The backroom's product form uploads photos through a server action: up to 8 files of 8 MB
    // are checked there, so allow a little over that here.
    serverActions: { bodySizeLimit: "70mb" },
  },
  redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.ree.bd" }],
      destination: `${site.url}/:path*`,
      permanent: true,
    }];
  },
  images: {
    // The landing page and the product pages hotlink photographs from other labels' stores
    // (placeholders chosen by the user; sources in docs/product-image-credits.md). next/image only
    // optimises remote files from hosts listed here.
    remotePatterns: [
      ...(supabaseHost ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/ree-products/**" }] : []),
      { protocol: "https", hostname: "ymvykcvbtnxwszfliaov.supabase.co", pathname: "/storage/v1/object/public/product-images/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
      { protocol: "https", hostname: "vylaxclothing.com", pathname: "/wp/wp-content/uploads/**" },
    ],
  },
};

export default nextConfig;
