import { Caveat, Pinyon_Script } from "next/font/google";

// Handwriting for the order letter (checkout-page.tsx) only, so no other page loads it: a copperplate
// script for the greeting and the signature, and a quick hand for the P.S. and the photo's caption.
export const script = Pinyon_Script({ subsets: ["latin"], weight: "400", display: "swap" });
export const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
