// The landing hero's starter slides. The live ones are the `hero_slides` table (edited in
// /backroom/banners); these seed it and stand in until Supabase is configured. Each is one
// full-screen landscape photograph (about 1840 × 1090, the subject's head under the middle frame),
// in the order they take the middle frame. Provenance: docs/landing-hero-assets.md.
export type HeroSlide = { src: string; alt: string; href: string; label: string; hidden?: boolean };

export const starterHeroSlides: HeroSlide[] = [
  {
    src: "/landing/campaign-stage.webp",
    alt: "A model in a tailored herringbone suit and leather gloves, seated in a burgundy lounge chair under a warm spotlight.",
    href: "/collections",
    label: "Shop the curated collections",
  },
  {
    // The user's own photograph (assets/hero/ahnaf-2-original.png), scaled and cropped to the
    // hero's canvas with the subject under the frame; see docs/landing-hero-assets.md.
    src: "/landing/campaign-ahnaf-wide.webp",
    alt: "A man in a mustard graphic tee, flat cap and sunglasses, seated on old stone steps under sunlit trees.",
    href: "/shop",
    label: "Shop the everyday tees",
    hidden: true, // held back for now; the mustard tee is not announced yet
  },
  {
    src: "/landing/campaign-lounge-wide.webp",
    alt: "A model in a textured trench coat and burgundy boots on a green velvet bench.",
    href: "/shop",
    label: "Discover the new season edit",
  },
  {
    src: "/landing/campaign-stairs-wide.webp",
    alt: "A model in a beige suit walking down sunlit terracotta stairs.",
    href: "/collections/formal-wear",
    label: "Explore tailored essentials",
  },
];
