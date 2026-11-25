import type { Metadata } from "next";
import { Anek_Bangla, Noto_Serif_Bengali, Plus_Jakarta_Sans, Spectral } from "next/font/google";
import { SplashScreen } from "../components/splash-screen";
import { site } from "../data/site";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serif = Spectral({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

// Bangla (ঋ, ৳ and Bangla names) at the same weight as the English beside it. The Latin faces have
// no Bengali letters, so the browser takes those from the next font in each stack (globals.css):
// Anek Bangla beside the sans, the mono and the slab display (where it is set to 800, wide, to
// match Alfa Slab One's weight), Noto Serif Bengali beside Spectral. Both are variable, so the
// weight follows the text's. Anek is preloaded (ঋ and ৳ are on nearly every page); the serif loads
// only when a page uses it.
const bangla = Anek_Bangla({
  variable: "--font-bangla",
  subsets: ["bengali"],
  axes: ["wdth"],
  display: "swap",
});

const banglaSerif = Noto_Serif_Bengali({
  variable: "--font-bangla-serif",
  subsets: ["bengali"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  creator: site.name,
  publisher: site.name,
  category: "fashion",
  // New routes remain previews until they explicitly opt into the shared SEO policy.
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the splash's script sets data-splash-* on <html> before hydration.
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${bangla.variable} ${banglaSerif.variable}`}
      suppressHydrationWarning
    >
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
