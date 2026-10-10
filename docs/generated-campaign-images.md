# Generated campaign photography

> **Not shown on the site.** On 10 Oct 2026 the user asked to keep these files as they are and replace their
> links with the reference stores' own photographs; `src/data/campaign-images.ts` now hotlinks those (sources in
> [product-image-credits.md](product-image-credits.md)). The files below are kept unreferenced on purpose.

Generated 10 October 2026 with the built-in image_gen tool (no API/CLI fallback).

The brief was to replace the photographs in the supplied landing-page sections and the product
pages with original model photography, showing faces and original T-shirt designs. The public
[Vylax site](https://vylaxclothing.com/) and its public campaign photograph were reviewed for the
heritage-location/editorial direction. No reference-site image was copied for this campaign or
passed into generation. The first photographs were generated from text; subsequent gallery
views used only our generated photographs as references.

## Saved assets and integration

The 22 final WebP assets live in `public/campaign/`. The portrait footwear draft was superseded by
`footwear-wide.webp`; its prompt is recorded below as the source for that edit. The draft is not
served by the application. Original supplied photographs remain in their existing directories.

`src/data/campaign-images.ts` holds the descriptions and crop positions. It is consumed by the
landing page and product catalogue, so related products, shopping-bag thumbnails, and metadata
pick up the same new imagery. Portraits use top-aligned crops to retain the entire face; the tote
and footwear cards have separately generated landscape compositions to show face and product
together. The Life is short story uses four distinct views, with chapter indices updated to match.

Generated masters were converted to WebP with Sharp (quality 86, effort 6, maximum width 1200 px,
without enlargement); image contents were not altered during conversion. Existing layouts,
product names, prices, purchase behavior, and videos are retained.

| Final file | Reference for generation/edit |
| --- | --- |
| `river-ivory-tee.webp` | Text only |
| `delta-olive-tee.webp` | Text only |
| `basic-tee.webp` | Text only |
| `life-is-short-front.webp` | Text only |
| `crop-hoodie.webp` | Text only |
| `pinstripe-suit.webp` | Text only |
| `leather-jacket.webp` | Text only |
| `canvas-tote.webp` | Text only |
| `life-is-short-back.webp` | `life-is-short-front` |
| `life-is-short-seated.webp` | `life-is-short-front` |
| `life-is-short-portrait.webp` | `life-is-short-front` |
| `satin-cowl-blouse.webp` | Text only |
| `printed-wrap-blouse.webp` | Text only |
| `puff-sleeve-top.webp` | Text only |
| `satin-wrap-dress.webp` | Text only |
| `block-print-kurti.webp` | Text only |
| `satin-cowl-blouse-side.webp` | `satin-cowl-blouse` |
| `printed-wrap-blouse-side.webp` | `printed-wrap-blouse` |
| `puff-sleeve-top-seated.webp` | `puff-sleeve-top` |
| `satin-wrap-dress-side.webp` | `satin-wrap-dress` |
| `footwear-wide.webp` | `footwear` |
| `canvas-tote-wide.webp` | `canvas-tote` |

## Verification

- Production build, TypeScript and targeted ESLint checks passed.
- All 22 local assets resolve; the final library is approximately 4.1 MB.
- Browser checks covered all 11 product routes, gallery next/previous navigation, and add to cart.
- Landing sections were checked at 1440 px and 390 px, with no broken campaign images or horizontal overflow.
- Standard-motion browser checks produced no runtime errors. With reduced motion enabled, the
  existing `FilmEmbed` condition on the Life is short page produces a hydration warning (server
  iframe versus client still). This behavior is present in the original source and was left
  outside the requested image replacement.

## Exact prompt set

### river-ivory-tee

```text
Use case: photorealistic-natural
Asset type: fashion ecommerce campaign photograph, portrait 3:4, single photograph.
Create an original premium South Asian streetwear campaign for Ree. An adult Bangladeshi male model with short wavy black hair and a clearly visible expressive face wears a washed ivory oversized drop-shoulder cotton T-shirt and dark loose denim. Invent an original artwork on the FRONT of the shirt: a small deep-indigo line-drawn river winding through a rust-orange circular sun, with three small abstract stitch marks, placed centrally at the chest. No writing. Authentic heavyweight cotton, wide sleeve and relaxed fit. Model stands in an old Dhaka courtyard of weathered terracotta brick and faded turquoise wooden shutters; background softly blurred. Warm late afternoon natural light, subtle film grain, realistic skin pores, editorial fashion photography, confident relaxed pose, face toward camera.
Composition: entire head including hair visible, head near upper center with generous 12 percent top margin, frame to upper thighs, shirt clearly readable and face unobscured; keep face and garment within central 70 percent for responsive crops. No borders, layouts, watermarks, logos or brand names. No copying any existing fashion print.
```

### delta-olive-tee

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
A beautiful adult Bangladeshi woman with long loosely tied black hair wears a faded olive oversized drop-shoulder T-shirt with an original cream and muted terracotta abstract woodcut graphic of three herons flying above curved river lines, and loose ecru trousers. No writing on the shirt. Standing relaxed in an old brick courtyard near a deep green wooden door, one hand in pocket, subtle candid smile. High quality independent fashion label campaign.
```

### basic-tee

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi man, warm brown skin, close cropped hair, wears a completely plain black crew-neck cotton T-shirt, no graphic, regular relaxed fit, paired with ecru trousers. Standing against a warm limestone wall with faded indigo door to one side. Natural quiet confident pose, visible cotton knit and rib neck. Frame head to upper thighs and show the entire shirt.
```

### life-is-short-front

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with warm brown skin, shoulder length wavy dark hair and center part, wears an ink-black heavyweight boxy drop-shoulder T-shirt with a TINY ivory embroidered sun emblem on the left chest, otherwise blank FRONT. Original design, not a replica of any reference clothing. Dark loose jeans. Posed relaxed against a weathered terracotta wall beside a teal shutter, facing camera, hand in pocket. Late afternoon light. The shirt's back is not visible.
```

### crop-hoodie

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with warm brown skin and a chin-length dark bob wears a peach cropped hoodie with roomy hood, drawstrings, kangaroo pocket and ribbed hem, and high waisted cream trousers. Facing camera with hands in the pocket, in a shaded courtyard of warm plaster and old brick. No glasses. The crop is modest, hem meets trousers, product photo shows entire garment.
```

### pinstripe-suit

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with dark hair neatly tied back wears a charcoal fine-pinstripe two-piece suit, softly structured notch lapel blazer over an ivory crewneck, straight matching trousers. Hands relaxed at waist, confident gaze at camera. Architectural old Dhaka arcade background, warm cream plaster and dark wood softly out of focus. Clearly show fine pinstripe tailoring and face. Frame whole head down to mid thighs.
```

### leather-jacket

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi man with thick slightly wavy dark hair and light stubble wears a black supple nappa leather biker jacket with asymmetric silver zipper and snap collar over a cream crewneck. Dark jeans. Standing in front of worn brick and a dark green painted door, confident relaxed face toward camera. Do not use sunglasses. Editorial leather highlights and tactile wrinkles, entire head and jacket visible.
```

### canvas-tote

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with long dark hair tied in a low loose braid wears a neutral sand linen shirt with cream trousers and carries a large PLAIN natural ivory heavy cotton canvas tote on her shoulder. Long plain handles, visible boxed flat base, no text or graphic. One hand lightly holds strap, the bag at hip faces camera. Weathered turquoise shutters and cream plaster background, entire face, head and the FULL bag with generous side clearance visible. Frame to mid thighs, tasteful natural streetwear photograph.
```

### life-is-short-back

Input: generated `life-is-short-front` photograph.

```text
Create a second campaign photograph with the SAME adult woman, same natural face, hair, black heavyweight drop shoulder tee and dark jeans. Change the pose to a three-quarter BACK view, with her head turned over her shoulder so her face is clearly visible in profile to the camera. On the back invent an original modest ivory woodcut print: one irregular sun above three gently curving river lines, and the exact words "LIFE IS SHORT" set on a single simple small sans serif line beneath it. Keep the design approximately 18 cm wide between shoulder blades. Show the entire back print unobstructed by hair. Terracotta courtyard and old turquoise shutter in soft afternoon light. Frame full head to hips, no cropping the hair. Portrait 3:4, no frame or watermark, photorealistic campaign photo.
```

### life-is-short-seated

Input: generated `life-is-short-front` photograph.

```text
Create another campaign photograph of this SAME adult woman wearing exactly the same ink-black oversized drop-shoulder T-shirt with the tiny ivory sun emblem on the LEFT CHEST and same dark loose jeans. Keep her facial identity, shoulder length wavy dark hair, garment color and cut consistent. Change pose and setting: sitting relaxed facing camera on a weathered wooden bench in a softly lit old brick courtyard, forearms resting naturally on thighs, a subtle candid smile, old teal shutters behind her. Full head and upper thighs in frame, generous top margin, natural skin texture, warm but realistic color, original editorial fashion photo portrait 3:4. Face and complete front of shirt clearly visible, no text or large front print, no sunglasses, no collage.
```

### life-is-short-portrait

Input: generated `life-is-short-front` photograph.

```text
Create another campaign photograph of this SAME adult woman wearing exactly the same black boxy dropped-shoulder cotton T-shirt with tiny ivory embroidered sun on the left chest and dark denim. Keep her natural face and shoulder length dark wavy hair consistent. New pose: standing at a warm plastered courtyard corner, turned slightly toward the late afternoon window light, head facing camera, arms loosely folded LOW near the waist so the chest emblem stays visible. Frame full head down to hips with top breathing space. Soft dappled light and softly blurred plants, muted terracotta walls. Portrait 3:4 original photorealistic editorial, no sunglasses, no text or logos, no montage.
```

### satin-cowl-blouse

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with long straight black hair wears a rich mulberry wine-purple satin blouse with an elegant draped cowl neckline, long sleeves and matching delicate marabou feather cuffs; dark straight trousers. She stands facing camera in an old Dhaka courtyard of warm aged lime plaster and dark wood, one hand relaxed at hip and the other resting by side. Clear satin sheen, full neckline and both cuffs in view, natural refined beauty. Entire head and hips visible.
```

### printed-wrap-blouse

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with dark softly waved shoulder length hair wears a black and ivory abstract brushstroke print crepe WRAP blouse, true wrap V neck, fabric tie visibly knotted at the waist, elbow-length sleeves, with dark straight denim. Original loose gestural brushstroke pattern, no logos. Leaning very lightly against a sunlit weathered limestone wall by a painted indigo door, looking warmly at camera. Entire face, sleeves and waist tie visible.
```

### puff-sleeve-top

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with warm brown skin and thick dark hair in a low ponytail wears a rose-pink textured boucle tweed top with rounded puff sleeves, boxy body and straight hem, white tailored trousers. No pattern or logos, authentic tiny boucle threads. Standing by an aged terracotta courtyard wall with soft greenery, looking at camera, one hand in trouser pocket. Full head and complete top visible.
```

### satin-wrap-dress

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with dark wavy hair wears a bottle-green satin midi wrap dress with softly puffed sleeves, surplice V neckline and removable delicate beaded belt at waist. Original understated dress. Poised on shallow weathered stone steps of a Dhaka heritage courtyard, sun reflected off warm plaster. Face fully visible and looking at camera, natural hands, elegant relaxed stance. Frame whole head to below midi hem, generous top margin, full dress readable. No sunglasses.
```

### block-print-kurti

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi woman with warm brown skin and long dark braid over one shoulder wears a terracotta cotton voile kurti with an original small cream paisley block-print repeat, three-quarter sleeves, straight loose cut and side slits over ivory trousers. In a warm terracotta and weathered teal heritage courtyard. Relaxed front-facing pose, calm smile at camera, hand at side, full head and entire knee-length kurti visible. Cloth airy and matte, irregular hand printed pattern.
```

### footwear (superseded portrait draft)

```text
Use case: photorealistic-natural. Asset: original fashion ecommerce photograph for Ree, single portrait 3:4 photo, no collage. Premium South Asian heritage streetwear editorial, authentic cotton and skin texture, understated natural warm light, subtle film grain. Adult model with face fully visible and eyes unobscured, whole head with generous top margin, framed head to mid-thigh. Position the head a little lower than usual (face center 25 percent from top), keep head and garment within central 70 percent for square and portrait responsive crops. No sunglasses, no logos, watermarks, borders, decorative layout, or copied fashion designs.
An adult Bangladeshi male model with short wavy dark hair wears a plain olive tee and loose cream trousers cuffed at ankles, and unbranded beige canvas low-top sneakers with simple gum soles and cream laces. Sitting on a low weathered stone step in an old brick courtyard, leaning slightly forward, looking directly into camera, face, both shoes and entire head completely visible. Knees comfortably bent, hands resting naturally on thighs, one sneaker slightly closer to the lens. Editorial footwear on model photo with realistic shoe proportions, not an extreme wide angle. Frame head to sole, portrait.
```

### satin-cowl-blouse-side

Input: generated `satin-cowl-blouse` photograph.

```text
Use case: identity-preserve. Asset: alternate ecommerce gallery photograph. Using the supplied image as identity and garment reference, create a second photorealistic editorial photograph of the SAME adult model wearing the EXACT SAME garment and accessories. Preserve face, hair, body, cloth, pattern, colors, details and the heritage courtyard setting. New three-quarter side pose, one hand lightly resting on the old wooden column beside her and other hand by her hip, looking back to the camera. Clearly show the draped cowl neckline, long sleeves, and matching mulberry feather cuffs. Head to upper thighs. Natural warm soft daylight, real skin and fabric texture, portrait 3:4. Keep entire head and face in frame with generous top margin, face unobscured, no sunglasses. No added text, no logos, watermark, montage, or frame.
```

### printed-wrap-blouse-side

Input: generated `printed-wrap-blouse` photograph.

```text
Use case: identity-preserve. Asset: alternate ecommerce gallery photograph. Using the supplied image as identity and garment reference, create a second photorealistic editorial photograph of the SAME adult model wearing the EXACT SAME garment and accessories. Preserve face, hair, body, cloth, pattern, colors, details and the heritage courtyard setting. New three-quarter side stance turned slightly to her left, with the face turned toward camera and a small natural smile. One hand lightly rests at the waist tie and the other in a jeans pocket. Preserve the black and ivory brushstroke pattern, V wrap neckline, elbow sleeves, knot and dark jeans. Head to upper thighs. Natural warm soft daylight, real skin and fabric texture, portrait 3:4. Keep entire head and face in frame with generous top margin, face unobscured, no sunglasses. No added text, no logos, watermark, montage, or frame.
```

### puff-sleeve-top-seated

Input: generated `puff-sleeve-top` photograph.

```text
Use case: identity-preserve. Asset: alternate ecommerce gallery photograph. Using the supplied image as identity and garment reference, create a second photorealistic editorial photograph of the SAME adult model wearing the EXACT SAME garment and accessories. Preserve face, hair, body, cloth, pattern, colors, details and the heritage courtyard setting. New seated pose on a wooden courtyard bench, looking directly at camera, hands resting naturally in lap. Preserve the rose-pink boucle tweed top, rounded puff sleeves, boxy straight hem, white tailored trousers. Frame whole head to knees and show fabric texture. Natural warm soft daylight, real skin and fabric texture, portrait 3:4. Keep entire head and face in frame with generous top margin, face unobscured, no sunglasses. No added text, no logos, watermark, montage, or frame.
```

### satin-wrap-dress-side

Input: generated `satin-wrap-dress` photograph.

```text
Use case: identity-preserve. Asset: alternate ecommerce gallery photograph. Using the supplied image as identity and garment reference, create a second photorealistic editorial photograph of the SAME adult model wearing the EXACT SAME garment and accessories. Preserve face, hair, body, cloth, pattern, colors, details and the heritage courtyard setting. New three-quarter side pose on the stone steps, head turned toward camera with an easy smile, one hand resting naturally at waist and the other along the skirt. Preserve the bottle-green satin midi wrap dress, puff sleeves, V neck, same black and gold beaded belt, nude sandals. Frame whole head to below skirt hem. Natural warm soft daylight, real skin and fabric texture, portrait 3:4. Keep entire head and face in frame with generous top margin, face unobscured, no sunglasses. No added text, no logos, watermark, montage, or frame.
```

### footwear-wide

Input: generated `footwear` photograph.

```text
Use case: identity-preserve. Recompose the supplied original fashion photograph as a LANDSCAPE 5:4 photograph for a footwear category card. Same adult man, face, hair, olive T-shirt, cream trousers, beige canvas sneakers, weathered brick courtyard and realistic warm light. Pull the camera BACK so his whole seated body including ENTIRE head and BOTH SHOES fits inside the central 75 percent of the frame height, with breathing room above hair and below soles. Keep him sitting naturally on the stone step, knees bent and a little spread, hands on thighs, looking at camera, both shoes flat on stone, a horizontal composition with courtyard visible on both sides. Face and shoes must both be clearly visible in the SAME frame. Do not crop his head, feet or any part of either shoe. Photorealistic editorial photograph, no logos, text, borders, or collage. Landscape 5:4 output.
```

### canvas-tote-wide

Input: generated `canvas-tote` photograph.

```text
Use case: identity-preserve. Recompose this original campaign image as a LANDSCAPE 5:4 photograph for an ecommerce collection card. Preserve the SAME adult woman's face, hair, low braid, sand linen shirt, ivory trousers and the EXACT SAME plain natural canvas tote with long shoulder handles and flat boxed base. Pull camera BACK and place the woman in a relaxed seated pose on a low stone bench beside the same weathered turquoise shutters; the bag rests upright beside her lap on the bench, with her hand lightly holding one handle. Show the ENTIRE HEAD with breathing room above and the ENTIRE canvas tote including its bottom and handles in the central 80 percent of the frame. Face looking toward camera, bag unobstructed, realistic anatomy and canvas texture. Warm natural light, heritage courtyard, portrait of a person in a landscape frame, no writing, logos, watermark, border or collage. Output 5:4 landscape.
```
