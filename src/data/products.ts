// The shop's catalogue. There is no backend: every product page is generated from this file.
// `kind` picks the template. "classic" is the conventional details page (description, price,
// sizes, add to cart); "story" is the premium chapter-by-chapter page with a header film and
// drawn illustrations. Copy, prices and quotes are sample content, like the landing page's.

export type ProductImage = { src: string; alt: string; position?: string };

export type IllustrationName = "hourglass" | "cotton" | "cut" | "print" | "stitch" | "day";

export type StoryChapter = {
  kicker: string;
  title: string;
  body: string;
  pull?: string;
  // Short specifics under the copy, and a maker's or wearer's voice.
  facts?: string[];
  voice?: { text: string; who: string };
  illustration: IllustrationName;
  // Index into `images`: the photograph pinned to the chapter's illustration.
  photo: number;
};

export type Product = {
  slug: string;
  kind: "classic" | "story";
  name: string;
  tagline: string;
  category: string;
  price: number;
  wasPrice?: number;
  colour: string;
  sizes: string[];
  description: string;
  details: string[];
  care: string[];
  images: ProductImage[];
  // The story page shows no price: the story carries the page and the bag shows the number.
  story?: {
    headline: string;
    intro: string;
    prologue: string;
    facts: { value: string; label: string }[];
    journey: string[];
    epilogue: string;
    film: { src: string; poster: string; caption: string };
    chapters: StoryChapter[];
    quotes: { text: string; who: string }[];
  };
};

const tee = (n: number, alt: string, position?: string): ProductImage => ({ src: `/products/life-is-short-tee-${String(n).padStart(2, "0")}.jpg`, alt, position });

export const products: Product[] = [
  {
    slug: "life-is-short-tee",
    kind: "story",
    name: "Life is short tee",
    tagline: "A drop-shoulder tee for the days you don't get back.",
    category: "Drop-shoulder",
    price: 1650,
    colour: "Ink black",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Our heaviest tee: combed Bengal cotton knit at 240 grams, garment-dyed ink black and hand-printed on the back with three words we keep forgetting. Cut with a dropped shoulder and a boxy body for hot afternoons.",
    details: [
      "240 GSM combed cotton jersey, garment-dyed",
      "Drop shoulder, boxy body, wide sleeve",
      "Ribbed crew neck, twin-needle hems",
      "Back print LIFE IS SHORT in water-based ink",
      "Unisex sizing; the model wears M",
    ],
    care: ["Cold machine wash, inside out", "Line dry in shade", "Iron on the reverse, never on the print"],
    images: [
      tee(1, "A woman in the black Life is short tee, arms crossed, by a window at dusk", "50% 30%"),
      tee(2, "The back of the Life is short tee under warm wall lights, the print half in shadow", "50% 30%"),
      tee(3, "A woman laughing on an orange sofa in the Life is short tee", "50% 30%"),
      tee(4, "A portrait in the Life is short tee against a dark wall", "50% 25%"),
      tee(5, "A woman resting her chin on her hand by a window, wearing the tee", "50% 30%"),
      tee(6, "Sitting with arms crossed on an orange sofa in the tee", "50% 30%"),
      tee(7, "Pointing at the camera between plants, in the tee", "50% 30%"),
      tee(8, "The back of the tee, printed LIFE IS SHORT, in a lounge with arched niches", "50% 35%"),
      tee(9, "A woman by a window with a hand in her hair, wearing the tee", "50% 30%"),
      tee(10, "Sitting back with a hand behind the head, in the tee", "50% 30%"),
    ],
    story: {
      headline: "Life is short.",
      intro: "The story of one tee, told in six chapters: three words, a bale of cotton, a dropped shoulder, a hand-pulled print, forty minutes of hands, and a long day.",
      film: { src: "/products/life-is-short-film.mp4", poster: "/products/life-is-short-film.jpg", caption: "Dhaka at night · 14 s loop" },
      prologue:
        "We started ঋ - Ree with one sentence: not everything old belongs in the past. This tee is that sentence made wearable. Heavy cotton the way tees used to be, a print pulled by hand the way posters used to be, and three words for a city that never sits still.",
      facts: [
        { value: "3", label: "words on the back" },
        { value: "240 g", label: "of cotton per square metre" },
        { value: "2 fingers", label: "the shoulder drop" },
        { value: "1 at a time", label: "screens pulled by hand" },
        { value: "40 min", label: "of sewing per tee" },
      ],
      journey: ["Cotton, picked and ginned", "Spun and knit heavy", "Garment-dyed ink black", "Screen pulled by hand", "Sewn, forty minutes", "Worn, for years"],
      epilogue: "We keep this page for the story, so there is no price on it. Choose a size and the bag takes it from here.",
      chapters: [
        {
          kicker: "Chapter 01 · The phrase",
          title: "Three words on the back",
          body: "We printed them where you cannot see them yourself: a reminder for the person walking behind you, and for the mirror at the end of the day. Life is short. Wear the thing you love.",
          pull: "A note to the person behind you.",
          facts: ["Set in a grotesque cut from an old Dhaka signboard", "Printed 18 cm wide, between the shoulder blades"],
          voice: { text: "People read it on the bus and smile at the back of your head.", who: "Mahir, who wears one" },
          illustration: "hourglass",
          photo: 2,
        },
        {
          kicker: "Chapter 02 · The cloth",
          title: "Cotton that has been somewhere",
          body: "Combed cotton from the delta, knit heavy at 240 grams so it falls instead of clings, then garment-dyed ink black. It fades the way good denim does: slowly, and only where you live in it.",
          facts: ["Combed, ring-spun cotton", "240 g per square metre, knit as a 24-gauge single jersey", "Garment-dyed, so the seams carry the colour too"],
          voice: { text: "Heavy jersey is honest. It shows every skipped step, so we skip none.", who: "Shanta, knitting master" },
          illustration: "cotton",
          photo: 4,
        },
        {
          kicker: "Chapter 03 · The cut",
          title: "The shoulder that dropped",
          body: "The seam sits two fingers down the arm. The body is boxy, the sleeve is wide, the hem stops at the hip. It is cut for a hot city and long afternoons, not for a mannequin.",
          pull: "Two fingers down the arm.",
          facts: ["Shoulder seam 4 cm past the natural shoulder", "Chest 56 cm and length 70 cm in size M", "Sleeve wide enough to roll once"],
          illustration: "cut",
          photo: 5,
        },
        {
          kicker: "Chapter 04 · The print",
          title: "Pulled by hand, one at a time",
          body: "Water-based ink pushed through a silk screen by hand in Old Dhaka. No two pulls are identical, and the letters soften after the first wash instead of cracking.",
          facts: ["Water-based ink, cured at 160 °C", "One pull per tee; the misprints become our shop rags"],
          voice: { text: "A good pull sounds like tearing paper. You learn it by ear.", who: "Rahim, printer, Old Dhaka" },
          illustration: "print",
          photo: 7,
        },
        {
          kicker: "Chapter 05 · The hands",
          title: "Forty minutes of hands",
          body: "Every tee is sewn in a twelve-machine unit in Keraniganj by people we know by name. Side seams first, then the rib collar, then the twin-needle hems. Forty minutes, give or take a tea break.",
          pull: "People we know by name.",
          facts: ["Side-seamed, not tubular", "Twin-needle hems; rib collar with a taped back neck", "Paid by the hour, not by the piece"],
          voice: { text: "The collar tells you who sewed it. Mine sit flat.", who: "Rina, sewing line two" },
          illustration: "stitch",
          photo: 1,
        },
        {
          kicker: "Chapter 06 · The wear",
          title: "From the morning tea to the last bus",
          body: "It is the shirt you reach for without thinking. Tea at seven, the office by nine, the rooftop at ten. We made it to be forgotten on you.",
          pull: "Made to be forgotten on you.",
          facts: ["Fades at the shoulders first, slowly", "Softens after the third wash", "Mended free for two years of wearing"],
          voice: { text: "I have washed mine forty times. The words are still there.", who: "Arif, Mirpur" },
          illustration: "day",
          photo: 9,
        },
      ],
      quotes: [
        { text: "I bought one for the print and kept it for the cotton.", who: "Nafisa, Dhanmondi" },
        { text: "Wore it three days straight on a trip to Sylhet. Still my favourite.", who: "Rafi, Uttara" },
        { text: "Soft in a way the price does not suggest.", who: "Tanha, Chattogram" },
      ],
    },
  },
  {
    slug: "satin-cowl-blouse",
    kind: "classic",
    name: "Cowl-neck satin blouse",
    tagline: "Liquid satin, feathered cuffs, a neckline that drapes itself.",
    category: "Evening",
    price: 3450,
    wasPrice: 3950,
    colour: "Mulberry",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Heavy stretch satin with a cowl that drapes itself, finished with detachable marabou-feather cuffs. Made for the evening and forgiving after dinner.",
    details: ["Heavy stretch satin with a matte reverse", "Cowl neckline, long sleeves", "Detachable feather cuffs", "Relaxed through the body; the model wears S"],
    care: ["Dry clean, or hand wash cold with the cuffs removed", "Hang to dry", "Cool iron on the reverse"],
    images: [
      { src: "/products/satin-cowl-blouse-01.jpg", alt: "A woman in a mulberry satin cowl-neck blouse with feathered cuffs, seen from the side", position: "50% 30%" },
      { src: "/products/satin-cowl-blouse-02.jpg", alt: "The satin blouse worn with a hand on the hip", position: "50% 30%" },
      { src: "/products/satin-cowl-blouse-03.jpg", alt: "Looking down at the feathered cuff of the satin blouse", position: "50% 30%" },
      { src: "/products/satin-cowl-blouse-04.jpg", alt: "The blouse from the side, showing the drape of the cowl", position: "50% 30%" },
    ],
  },
  {
    slug: "printed-wrap-blouse",
    kind: "classic",
    name: "Printed wrap blouse",
    tagline: "A brushstroke print on soft crepe, wrapped and tied at the waist.",
    category: "Casual wear",
    price: 2250,
    colour: "Ink and bone",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A brushstroke print on soft crepe, wrapped and tied at the waist. Wear it over a slip or with straight denim.",
    details: ["Soft polyester crepe, printed", "True wrap with a self tie", "Elbow-length sleeve", "The model wears S"],
    care: ["Cold machine wash, gentle", "Line dry", "Cool iron"],
    images: [
      { src: "/products/printed-wrap-blouse-01.jpg", alt: "A woman in a black-and-white brushstroke print blouse with a hand at her collar", position: "50% 25%" },
      { src: "/products/printed-wrap-blouse-02.jpg", alt: "The printed wrap blouse, looking to the side", position: "50% 25%" },
      { src: "/products/printed-wrap-blouse-03.jpg", alt: "The printed wrap blouse with a hand in the hair", position: "50% 25%" },
    ],
  },
  {
    slug: "puff-sleeve-top",
    kind: "classic",
    name: "Puff-sleeve tweed top",
    tagline: "Boxy tweed with big soft sleeves. Wear it with white trousers.",
    category: "Formal wear",
    price: 2650,
    wasPrice: 2950,
    colour: "Rose",
    sizes: ["XS", "S", "M", "L"],
    description: "Boxy bouclé tweed with softly puffed sleeves and a straight hem. Pairs with white trousers and needs nothing else.",
    details: ["Cotton-blend bouclé tweed", "Boxy body, gathered puff sleeve", "Fully lined", "The model wears S"],
    care: ["Dry clean", "Steam; do not press"],
    images: [
      { src: "/products/puff-sleeve-top-01.jpg", alt: "A woman in a rose tweed puff-sleeve top and white trousers, reading her phone in a garden", position: "50% 30%" },
      { src: "/products/puff-sleeve-top-02.jpg", alt: "Taking a selfie in the tweed top", position: "50% 30%" },
      { src: "/products/puff-sleeve-top-03.jpg", alt: "Sitting on a garden bench in the tweed top and white trousers", position: "50% 40%" },
    ],
  },
  {
    slug: "satin-wrap-dress",
    kind: "classic",
    name: "Satin wrap dress",
    tagline: "Puff sleeves, a beaded belt and a hem that moves when you do.",
    category: "Evening",
    price: 4200,
    colour: "Bottle green",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Bottle-green satin with puff sleeves, a beaded belt at the waist and a hem that moves when you do.",
    details: ["Heavy satin, lined bodice", "Surplice wrap front", "Removable beaded belt", "Midi length; the model is 165 cm and wears S"],
    care: ["Dry clean only", "Store the belt separately"],
    images: [
      { src: "/products/satin-wrap-dress-01.jpg", alt: "A woman in a bottle-green satin wrap dress, seen from the side", position: "50% 25%" },
      { src: "/products/satin-wrap-dress-02.jpg", alt: "The beaded belt and wrap front of the green satin dress", position: "50% 40%" },
    ],
  },
  {
    slug: "block-print-kurti",
    kind: "classic",
    name: "Block-print kurti",
    tagline: "Hand block print on cotton voile, made for the heat.",
    category: "Handloom",
    price: 1950,
    colour: "Terracotta",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Hand block-printed cotton voile in a paisley repeat. Cut straight and loose for the heat, with side slits.",
    details: ["Cotton voile, hand block print", "Straight cut, side slits", "Three-quarter sleeve", "Each print is slightly different"],
    care: ["Cold hand wash separately; colours may run at first", "Dry in shade"],
    images: [{ src: "/products/block-print-kurti-01.jpg", alt: "A woman in a terracotta block-print kurti, leaning on a plinth", position: "50% 30%" }],
  },
  {
    slug: "basic-tee",
    kind: "classic",
    name: "Basic tee",
    tagline: "The plain crew neck you buy three of.",
    category: "Casual wear",
    price: 1450,
    colour: "Black",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A plain crew-neck tee in mid-weight combed cotton, cut straight with a little room.",
    details: ["180 GSM combed cotton", "Regular fit, crew neck", "Ribbed collar, side-seamed"],
    care: ["Cold wash", "Tumble dry low"],
    images: [{ src: "/landing/collection-tees.jpg", alt: "Black crew-neck T-shirts on hangers", position: "50% 40%" }],
  },
  {
    slug: "crop-hoodie",
    kind: "classic",
    name: "Crop hoodie",
    tagline: "Brushed-back fleece, a roomy hood, a dropped shoulder.",
    category: "Loungewear",
    price: 3200,
    colour: "Peach",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "A cropped hoodie in brushed-back fleece with a roomy hood and a dropped shoulder.",
    details: ["320 GSM cotton fleece, brushed inside", "Cropped, boxy, dropped shoulder", "Kangaroo pocket, ribbed hem"],
    care: ["Cold wash inside out", "Line dry"],
    images: [{ src: "/landing/collection-hoodie.jpg", alt: "A woman in a peach hoodie and glasses", position: "50% 40%" }],
  },
  {
    slug: "pinstripe-suit",
    kind: "classic",
    name: "Pinstripe suit",
    tagline: "Softly structured, a little longer in the jacket.",
    category: "Formal wear",
    price: 3850,
    colour: "Charcoal",
    sizes: ["36", "38", "40", "42", "44"],
    description: "A two-piece pinstripe in a breathable wool blend, softly structured, with a slightly longer jacket.",
    details: ["Wool-blend pinstripe", "Half-canvas jacket, notch lapel", "Straight trouser, unfinished hem"],
    care: ["Dry clean"],
    images: [{ src: "/landing/collection-suit.jpg", alt: "A close-up of a pinstripe suit jacket and a ringed hand", position: "50% 50%" }],
  },
  {
    slug: "leather-jacket",
    kind: "classic",
    name: "Leather jacket",
    tagline: "A classic biker in supple nappa.",
    category: "Outerwear",
    price: 4600,
    colour: "Black",
    sizes: ["S", "M", "L", "XL"],
    description: "A classic biker in supple nappa leather with a slim collar and a quilted lining.",
    details: ["Nappa leather", "Asymmetric zip, snap collar", "Quilted viscose lining"],
    care: ["Specialist leather clean", "Condition twice a year"],
    images: [{ src: "/landing/collection-leather-jacket.jpg", alt: "A man in a black leather jacket and sunglasses", position: "50% 35%" }],
  },
  {
    slug: "canvas-tote",
    kind: "classic",
    name: "Canvas tote",
    tagline: "Heavy canvas, a flat base, handles for the shoulder.",
    category: "Street style",
    price: 1950,
    colour: "Natural",
    sizes: ["One size"],
    description: "A heavy canvas tote with a flat base and long handles, made to carry a week of groceries or a laptop.",
    details: ["16 oz cotton canvas", "Flat base, inner pocket", "Handles drop 28 cm"],
    care: ["Spot clean", "Cold hand wash if needed"],
    images: [{ src: "/landing/collection-tote.jpg", alt: "A canvas tote bag hanging beside a wooden door", position: "35% 50%" }],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

// Same category first, then the rest of the catalogue.
export function relatedTo(product: Product, count = 4) {
  const others = products.filter((candidate) => candidate.slug !== product.slug);
  return [...others.filter((c) => c.category === product.category), ...others.filter((c) => c.category !== product.category)].slice(0, count);
}

export function formatPrice(taka: number) {
  return `৳ ${String(taka).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
