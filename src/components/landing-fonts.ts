import { Alfa_Slab_One, IBM_Plex_Mono } from "next/font/google";

// The shop's type: slab display and mono body. The variables are read by globals.css
// (`--font-lp-display`, `--font-lp-mono`) and by the hero's CSS module, so put both
// `.variable` classes on a page's root element (the landing page and the product pages do).
export const display = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
