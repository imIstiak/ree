// Model photography shared by landing cards and product galleries. The pictures are the reference
// stores' own product photographs (Rakh, Samaajik, AZRAK, Vylax), hotlinked from their sites exactly as
// published, as placeholders chosen by the user; nothing is stored in the repo. Hosts are allowed in
// next.config.ts; sources and the rights note are in docs/product-image-credits.md. The stores sell
// tees, hoodies and knitwear only, so the blouse, dress, kurti, suit, jacket, tote and footwear slots
// show the nearest look. The generated originals stay unchanged in public/campaign/.
// A tee cut out of its photograph, for the story page's chapter cards (the user asked for the tee
// without the models): `mask` is the tee's silhouette as an alpha PNG covering the whole photo, laid
// over the same hotlinked photograph, so only the store's own image is ever shown and nothing of it
// is copied into the repo. `box` is the tee's crop (x, y, width, height as fractions of the photo)
// and `aspect` that crop's width / height. Masks were made with a point-prompted segmentation model
// (SAM); see docs/product-image-credits.md.
export type Cutout = { mask: string; box: [number, number, number, number]; aspect: number };
type CampaignPhoto = { src: string; alt: string; position: string; cutout?: Cutout; swatch?: string };

function photo(src: string, alt: string, position = "50% 0%", cutout?: Cutout): CampaignPhoto {
  return { src, alt, position, cutout };
}

// Shopify serves a resized copy for ?width=, which keeps the image optimizer off 6000px originals.
// `format=pjpg` asks for a progressive JPEG: the stores upload some photographs as PNG, which Shopify
// otherwise returns at 2-6 MB even resized, and the optimizer timed out fetching them (blank frames).
const shopify = (store: string) => (file: string) => `https://cdn.shopify.com/s/files/${store}/files/${file}?width=1800&format=pjpg`;
const rakh = shopify("1/0940/5576/0157");
const samaajik = shopify("1/0880/2448/2082");
const azrak = (path: string) => `https://ymvykcvbtnxwszfliaov.supabase.co/storage/v1/object/public/product-images/${path}`;
const vylax = (path: string) => `https://vylaxclothing.com/wp/wp-content/uploads/${path}`;

export const campaignPhotos = {
  riverTee: photo(azrak("charcoal-urdu-tee/0.jpg"), "A man with curly hair in a washed charcoal tee with an Urdu script patch, sitting on dark rocks under a blue sky", "50% 22%"),
  deltaTee: photo(azrak("green-shapatar-tee/0.jpg"), "A man in a green drop-shoulder tee printed with a motorcycle rider, crouching on dark rocks", "50% 20%"),
  basicTee: photo(samaajik("IMG_0478.jpg"), "A man in a black oversized tee with a small embroidered Panjab wordmark and light shorts, against a grey wall", "50% 15%"),
  teeFront: photo(rakh("DSC02015.jpg"), "A woman in a black tee with white Urdu calligraphy on the chest, one hand in her hair, in a leafy courtyard", "50% 20%", { mask: "/products/cutouts/tee-front-mask.png", box: [0.1401, 0.478, 0.8599, 0.522], aspect: 1.0985 }),
  teeBack: photo(rakh("1_b8a053f2-6a27-4c70-b402-f4b0ad91966c.jpg"), "The back of a black tee with a large Urdu calligraphy and painted portrait print, worn by a woman glancing aside", "50% 30%", { mask: "/products/cutouts/tee-back-mask.png", box: [0.2001, 0.244, 0.5901, 0.7151], aspect: 0.8252 }),
  teeSeated: photo(rakh("5_56415a48-1dd2-4039-a930-cf2209a25e15.jpg"), "Two models in black tees and blue jeans, one facing forward and one turned to show the back print", "50% 15%", { mask: "/products/cutouts/tee-pair-mask.png", box: [0.0577, 0.1888, 0.7954, 0.4027], aspect: 1.3168 }),
  teePortrait: photo(rakh("DSC01856_99ad0143-3617-40d8-b7e4-07d7ec50cdd0.png"), "A woman in a black tee standing on a dirt road between dry bushes", "50% 50%", { mask: "/products/cutouts/tee-portrait-mask.png", box: [0.3047, 0.4029, 0.3661, 0.5971], aspect: 0.9121 }),
  hoodie: photo(rakh("IMG_5374.jpg"), "A woman in an oatmeal hoodie with RAKH lettering across the chest and a navy hood", "50% 18%"),
  suit: photo(vylax("2025/04/DSC_0674_1_11zon-1-scaled.jpg"), "A man in a black knitted short-sleeve polo with one hand in his pocket, against a warm studio backdrop", "50% 15%"),
  leatherJacket: photo(rakh("5_6ae37051-6cf6-4e74-9bd1-23188c285c20.jpg"), "A man in a black hoodie sitting in a dim brick courtyard, lit warmly from the side", "50% 25%"),
  tote: photo(vylax("2025/12/WhatsApp-Image-2025-12-25-at-6.22.08-PM-1.jpeg"), "A woman in a black tee and wide cream trousers holding a bunch of yellow flowers", "50% 15%"),
  toteWide: photo(rakh("DSC02571.jpg"), "A man in a sage tee lounging in a chair beside cardboard boxes, under an exit sign", "50% 20%"),
  satinBlouse: photo(rakh("DSC08700_Large_5b8723f8-e1bb-4b39-8d00-cf0506ea8193.jpg"), "A woman in a red oversized tee with a hand behind her head, beside a colonnade at dusk", "50% 20%"),
  satinBlouseSide: photo(rakh("DSC08705_Large_d299c4f6-4f6f-46d3-83de-0aecfa72321a.jpg"), "A woman in a red oversized tee with a gold print, standing in a dark doorway", "50% 20%"),
  wrapBlouse: photo(rakh("ChatGPT_Image_May_11_2026_at_12_23_18_PM.png"), "A woman in a dip-dyed tee fading from ivory to charcoal, hands in her pockets", "50% 20%"),
  wrapBlouseSide: photo(rakh("ChatGPT_Image_May_5_2026_at_03_44_47_PM.png"), "Two models in ivory-to-charcoal dip-dyed tees, one facing the camera and one turned away", "50% 20%"),
  puffTop: photo(rakh("12_ab95e158-5913-4b53-bbd9-9d6d5c210642.png"), "A woman in an ivory tee with a small Urdu logo, looking at the camera, with another model in a painted tee behind her", "50% 40%"),
  puffTopSeated: photo(rakh("9_658c774e-fe4a-4d54-81d9-84f0016873b6.png"), "A woman crouching in an ivory tee in front of a model whose tee is painted with a blue house and Urdu script", "50% 45%"),
  satinDress: photo(rakh("IMG_5396.jpg"), "A woman in a bottle-green crewneck sweatshirt with her hands at the collar, against a grey wall", "50% 15%"),
  satinDressSide: photo(rakh("IMG_5382.jpg"), "A woman in a bottle-green sweatshirt, cream trousers and black sneakers, standing against a grey wall", "50% 30%"),
  kurti: photo(vylax("2026/07/WhatsApp-Image-2026-07-04-at-7.02.08-PM.jpeg"), "A woman in a red-and-black patchwork tee with embroidered patches, bangles and jeans", "50% 12%"),
  footwear: photo(rakh("2_d2fd2347-c825-4a59-b204-7cafc730e60c.jpg"), "A man in a pale blue tee, cream trousers and white sneakers, standing against a tan backdrop", "50% 50%"),
};

// The colour of the garment in each photograph (`swatch`): "More from the collection" cuts each
// card's cloth frame from it (the user asked for the frame in the colour of the subject's tee).
// Measured from the photos: the clothes segmented (u2net_cloth_seg), shadows and highlights trimmed,
// the rest averaged. Two are set by hand: the puff-sleeve card takes the sky blue of the second
// model's painted tee (the user asked for it), and its seated shot the ivory of the front tee.
// Re-measure if a photo changes.
const swatches = {
  basicTee: "#171517",
  deltaTee: "#214e5c",
  footwear: "#c4d2d7",
  hoodie: "#d0d1cc",
  kurti: "#9c2031",
  leatherJacket: "#2e1f16",
  // The sky blue of the painted tee behind her (the user picked it over the ivory), sampled from the photo.
  puffTop: "#148dba",
  puffTopSeated: "#e8e3da",
  riverTee: "#31414e",
  satinBlouse: "#b11b28",
  satinBlouseSide: "#c82332",
  satinDress: "#2c3b36",
  satinDressSide: "#30403b",
  suit: "#090909",
  teeBack: "#201d19",
  teeFront: "#111018",
  teePortrait: "#0f0806",
  teeSeated: "#23221e",
  tote: "#181815",
  toteWide: "#776d55",
  wrapBlouse: "#8e7f75",
  wrapBlouseSide: "#978b81",
} satisfies Record<keyof typeof campaignPhotos, string>;
for (const [name, swatch] of Object.entries(swatches)) campaignPhotos[name as keyof typeof campaignPhotos].swatch = swatch;
