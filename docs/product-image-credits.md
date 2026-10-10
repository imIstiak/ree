# Product page assets

## Current campaign photography

The product galleries and the landing page's model photographs (Find your story, the collection wall, the About
portrait and the journal) show **other labels' product photographs, hotlinked from their own sites** exactly as
published: Rakh, Samaajik, AZRAK and Vylax, the reference stores the user sent on 10 Oct 2026, when they asked for
"the same to same images" from those sites in place of the generated ones. Nothing is downloaded into the repo. Like
the featured story's pictures below, **they are not open-source images**: each belongs to the store that published
it, so replace them with the brand's own photographs (or clear the rights) before launch.

The slots live in `src/data/campaign-images.ts`; `src/data/products.ts` and `src/components/landing-main.tsx` read
them from there. Rakh and Samaajik images are requested with Shopify's `?width=1800` resize, which serves the same
photograph smaller. The stores sell tees, hoodies, knitwear and trousers only, so the sample products without a
match (satin blouse, wrap blouse, puff-sleeve top, wrap dress, kurti, suit, leather jacket, tote, footwear) show the
nearest look rather than the garment their copy describes.

| Slot | Shown on | Image | From |
| --- | --- | --- | --- |
| `riverTee` | Find your story "T-shirt" tile, journal | `…/product-images/charcoal-urdu-tee/0.jpg` | AZRAK, "Urdu Script Tee / Charcoal", https://www.azrakstreetwear.com/products/charcoal-urdu-tee |
| `deltaTee` | "Drop-shoulder" tile, About portrait | `…/product-images/green-shapatar-tee/0.jpg` | AZRAK, "Shapatar Tee / Green", https://www.azrakstreetwear.com/products/green-shapatar-tee |
| `basicTee` | Story tile, Basic tee brick and page | `…/2082/files/IMG_0478.jpg` | Samaajik, "Panjab Est. 1570's T-shirt", https://www.samaajik.store/products/punjab-est-1570-s-embroidered-t-shirt |
| `teeFront` | Story tile, Life is short gallery | `…/0157/files/DSC02015.jpg` | Rakh, "Kon Hoon Mein", https://rakh.pk/products/kon-hoon-mein-کون-ہوں-میں |
| `teeBack` | Life is short brick, gallery, epilogue | `…/0157/files/1_b8a053f2-6a27-4c70-b402-f4b0ad91966c.jpg` | Rakh, "Kon Hoon Mein" (as above) |
| `teeSeated` | Life is short gallery | `…/0157/files/5_56415a48-1dd2-4039-a930-cf2209a25e15.jpg` | Rakh, "Kon Hoon Mein" (as above) |
| `teePortrait` | Life is short gallery, film poster | `…/0157/files/DSC01856_99ad0143-3617-40d8-b7e4-07d7ec50cdd0.png` | Rakh, "Kon Hoon Mein" (as above) |
| `hoodie` | Crop hoodie brick and page | `…/0157/files/IMG_5374.jpg` | Rakh, "The Rakh Essential", https://rakh.pk/products/the-rakh-essential |
| `suit` | Pinstripe suit brick and page | `…/uploads/2025/04/DSC_0674_1_11zon-1-scaled.jpg` | Vylax, "Black Knitted Polo", https://vylaxclothing.com/product/3084 |
| `leatherJacket` | Leather jacket brick and page, journal | `…/0157/files/5_6ae37051-6cf6-4e74-9bd1-23188c285c20.jpg` | Rakh, "Kaun Hun Mai Hoodie", https://rakh.pk/products/kaun-hun-mai-hoodie |
| `tote` | Canvas tote page | `…/uploads/2025/12/WhatsApp-Image-2025-12-25-at-6.22.08-PM-1.jpeg` | Vylax, "White Oversize Fleece Bottom", https://vylaxclothing.com/product/3935 |
| `toteWide` | Canvas tote brick | `…/0157/files/DSC02571.jpg` | Rakh, "Falasteen", https://rakh.pk/products/falasteen-فلسطین |
| `satinBlouse`, `satinBlouseSide` | Cowl-neck satin blouse page | `…/0157/files/DSC08700_Large_….jpg`, `DSC08705_Large_….jpg` | Rakh, "Alfaaz", https://rakh.pk/products/parwaaz-پرواز-copy |
| `wrapBlouse`, `wrapBlouseSide` | Printed wrap blouse page | `…/0157/files/ChatGPT_Image_May_11_2026_at_12_23_18_PM.png`, `ChatGPT_Image_May_5_2026_at_03_44_47_PM.png` | Rakh, "Fade — Spray Wash", https://rakh.pk/products/fade-spray-wash |
| `puffTop`, `puffTopSeated` | Puff-sleeve top page | `…/0157/files/12_ab95e158-….png`, `9_658c774e-….png` | Rakh, "Waqt — The Wait", https://rakh.pk/products/waqt-the-wait |
| `satinDress`, `satinDressSide` | Satin wrap dress page, journal | `…/0157/files/IMG_5396.jpg`, `IMG_5382.jpg` | Rakh, "Echo Crewneck", https://rakh.pk/products/khoobsurat-crewneck |
| `kurti` | Block-print kurti page, journal | `…/uploads/2026/07/WhatsApp-Image-2026-07-04-at-7.02.08-PM.jpeg` | Vylax, "TAMASHAI", https://vylaxclothing.com/product/4148 |
| `footwear` | "Footwear" story tile | `…/0157/files/2_d2fd2347-c825-4a59-b204-7cafc730e60c.jpg` | Rakh, "Asmaan", https://rakh.pk/products/asmaan-آسمان |

Shopify paths are under `cdn.shopify.com/s/files/1/0940/5576/0157/` (Rakh) and `…/1/0880/2448/2082/` (Samaajik),
AZRAK's under `ymvykcvbtnxwszfliaov.supabase.co/storage/v1/object/public/`, Vylax's under
`vylaxclothing.com/wp/wp-content/uploads/`; the full URLs are in `campaign-images.ts`.

The swap went through two steps first: AI-generated photographs (still in `public/campaign/`, unchanged at the
user's request and no longer referenced; prompts in [generated-campaign-images.md](generated-campaign-images.md)),
then Pexels stock picked by an interrupted run, which was dropped when the user asked for the reference stores'
images instead. The original supplied photographs documented below are retained but no longer shown.

## Photographs

`public/products/*.jpg` are the brand's own campaign photographs, supplied by the user (copied from the
folder above the repo on 23 Sep 2026, auto-rotated and resized to 1600 px on the long edge at JPEG
quality 80 by a one-off sharp script). They are not stock and are not covered by the Unsplash notes in
[landing-image-credits.md](landing-image-credits.md).

| Files | Product |
| --- | --- |
| `life-is-short-tee-01..10.jpg` | Life is short tee (the story page) |
| `satin-cowl-blouse-01..04.jpg` | Cowl-neck satin blouse |
| `printed-wrap-blouse-01..03.jpg` | Printed wrap blouse |
| `puff-sleeve-top-01..03.jpg` | Puff-sleeve tweed top |
| `satin-wrap-dress-01..02.jpg` | Satin wrap dress |
| `block-print-kurti-01.jpg` | Block-print kurti |

The five products carried over from the landing page (basic tee, crop hoodie, pinstripe suit, leather
jacket, canvas tote) originally reused the Unsplash photographs from `public/landing/`; they now
use the linked photographs above.

### The first piece on the landing page

The landing page's featured story (`#featured`, "Naqshi Kantha ঋ-Vive") shows **other labels' product photographs,
hotlinked from their own sites**, as placeholders for the brand's own pictures of ঋ-Vive. The user sent the
sites as references on 10 Oct 2026 and asked for their images to be linked rather than copied; nothing is stored in
this repo. **They are not open-source images**: each belongs to the store that published it, so replace them
(or clear the rights) before launch. `next.config.ts` allows these hosts for `next/image`; the URLs are in
`viveTee` and `featuredStory.cards` in `src/components/landing-main.tsx`.

| Where | Image | From |
| --- | --- | --- |
| The tee (hero) | `…/product-images/olive-urdu-tee/3.jpg` on Supabase storage | AZRAK, "Urdu Script Tee / Olive", https://www.azrakstreetwear.com/products/olive-urdu-tee |
| "Stitched in" card | `cdn.shopify.com/s/files/1/0880/2448/2082/files/A3.jpg` | Samaajik, "5 Rivers of Punjab T-Shirt", https://www.samaajik.store/products/5-rivers-of-punjab-t-shirt |
| "Hand-stitching" card | `cdn.shopify.com/s/files/1/0940/5576/0157/files/DSC09831.jpg` | Rakh, "Manzil - The Lost Path", https://rakh.pk/products/manzil-the-lost-path |
| "Edition" card | `vylaxclothing.com/wp/wp-content/uploads/2026/09/WhatsApp-Image-2026-09-08-at-6.37.53-PM.jpeg` | Vylax Clothing, "inside-out faiz", https://vylaxclothing.com/product/4300 |

The Instagram post the user also sent (https://www.instagram.com/p/DbH4XgvDOey/) could not be used: Instagram
serves a login wall to anything but a signed-in browser, and its image links are signed and expire, so they cannot
be hotlinked.

An earlier version used the Vylax product 4177 photograph cut out of its background and stored in the repo; that
file was removed when the user asked for linked images instead.

## The header film

The story page currently plays **"Clothing commercial video | Jacferdi | Fujifilm X-T3" by kiransahu films**
(https://www.youtube.com/watch?v=flFETfq__p4), chosen by the brand owner, through YouTube's embedded player
(`film.youtube` in `src/data/products.ts`). It is embedded, not downloaded or re-hosted: the footage belongs to its
makers and shows another label's clothes, so it is a placeholder for the brand's own film, and the live site needs
either that film or the owner's permission. Removing `film.youtube` falls back to the self-hosted clip below.

### Self-hosted fallback

`life-is-short-film.mp4` (H.264, 1280 × 720, 25 fps, 14 s, about 2 MB) and its poster `life-is-short-film.jpg`
are real footage: **"Dhaka at night" by Ferdous Hasan on Pexels** (https://www.pexels.com/video/dhaka-at-night-26147899/),
used under the [Pexels License](https://www.pexels.com/license/) (free for commercial use, no attribution required).
It is a placeholder until the brand shoots its own film: drop a new file at the same path and the page picks it up.

The clip was cut from the 720p rendition with ffmpeg 6: 7.5 s from the 2 s mark, slowed to half speed on the 50 fps
source frames, and the last second cross-faded into the first so the loop is seamless:

```
ffmpeg -ss 2 -t 7.5 -i dhaka-at-night.mp4 \
  -filter_complex "[0:v]setpts=2*PTS,fps=25,split=2[a][b];[a]trim=start=1:end=15,setpts=PTS-STARTPTS[main];[b]trim=start=0:end=1,setpts=PTS-STARTPTS[head];[main][head]xfade=transition=fade:duration=1:offset=13,format=yuv420p[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 28 -movflags +faststart -an public/products/life-is-short-film.mp4
ffmpeg -i public/products/life-is-short-film.mp4 -frames:v 1 -q:v 4 -update 1 public/products/life-is-short-film.jpg
```

## Copy

Product descriptions, prices, sizes and the quotes on the story page are sample content written for the
mock-up, like the landing page's names and prices.
