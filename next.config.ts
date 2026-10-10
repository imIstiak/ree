import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The landing page and the product pages hotlink photographs from other labels' stores
    // (placeholders chosen by the user; sources in docs/product-image-credits.md). next/image only
    // optimises remote files from hosts listed here.
    remotePatterns: [
      { protocol: "https", hostname: "ymvykcvbtnxwszfliaov.supabase.co", pathname: "/storage/v1/object/public/product-images/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
      { protocol: "https", hostname: "vylaxclothing.com", pathname: "/wp/wp-content/uploads/**" },
    ],
  },
};

export default nextConfig;
