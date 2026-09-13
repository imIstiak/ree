import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Spectral } from "next/font/google";
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

export const metadata: Metadata = {
  title: "ঋ - Ree | Coming Soon",
  description:
    "Not everything old belongs in the past. ঋ - Ree brings stories, symbols, and heritage forward into something made for now.",
  icons: {
    icon: "/ree-mark.svg",
    shortcut: "/ree-mark.svg",
    apple: "/ree-mark.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
