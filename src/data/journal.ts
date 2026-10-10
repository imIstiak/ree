// Journal posts: the landing page's "Follow our style journey" patches and the /journal page read
// this list. There are no post pages yet; each landing patch links to its entry on /journal.
// Copy is sample content.
import { campaignPhotos } from "./campaign-images";

export type JournalPost = { slug: string; date: string; title: string; excerpt: string; photo: { src: string; alt: string; position: string } };

export const journalPosts: JournalPost[] = [
  {
    slug: "words-on-your-back",
    date: "12 Sep 2026",
    title: "Words on your back",
    excerpt: "Why our first drop starts with a single sentence, and how a hand-pulled print carries it from the workshop to the bus stop.",
    photo: campaignPhotos.riverTee,
  },
  {
    slug: "block-print-by-hand",
    date: "08 Sep 2026",
    title: "Block print, by hand",
    excerpt: "A morning with the printers who stamp every kurti, and why no two of them ever come out quite the same.",
    photo: campaignPhotos.kurti,
  },
  {
    slug: "the-layer-you-keep",
    date: "02 Sep 2026",
    title: "The layer you keep",
    excerpt: "Heavy cloth, dark colours and the pieces that get better the longer you wear them, from the first cold week to the last.",
    photo: campaignPhotos.leatherJacket,
  },
  {
    slug: "green-for-the-evening",
    date: "27 Aug 2026",
    title: "Green for the evening",
    excerpt: "Bottle green, soft knits and how we dress up for a Dhaka evening without dressing stiff.",
    photo: campaignPhotos.satinDress,
  },
];
