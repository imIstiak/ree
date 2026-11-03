export const site = {
  name: "ঋ - Reé",
  shortName: "Reé",
  url: "https://ree.bd",
  title: "Reé | Luxury Fashion in Bangladesh, Rooted in Heritage",
  description: "Discover Reé, a luxury fashion label in Bangladesh inspired by Bengali tradition, rural craft and history. Old is gold, reimagined for life today.",
  socialImage: "/seo/ree-social.png",
  socialImageAlt: "Reé — luxury fashion from Bangladesh, rooted in Bengali heritage and rural craft",
} as const;

export const socialProfiles = {
  facebook: "https://www.facebook.com/ree.threads",
  instagram: "https://www.instagram.com/ree.threads/",
  linkedin: "https://www.linkedin.com/company/ree-threads",
} as const;

// Prelaunch: only finished brand pages enter search. Catalog, journal and legal copy
// are still previews. Add a route here only when its content is ready for publication.
export const indexablePaths = ["/", "/about", "/contact"] as const;
