# Product page assets

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
jacket, canvas tote) reuse their Unsplash photographs from `public/landing/`.

## The header film

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
