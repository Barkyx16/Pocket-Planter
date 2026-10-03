# Pest images

Drop one image per pest here, matching the **exact filenames** below
(lowercase, hyphenated — same convention as `assets/plants/`).

Recommended: **square (1:1)**, JPEG, clean background.

| # | File name |
|---|-----------|
| 1 | `aphids.jpg` |
| 2 | `tomato-hornworms.jpg` |
| 3 | `squash-bugs.jpg` |
| 4 | `cabbage-worms.jpg` |
| 5 | `slugs-snails.jpg` |
| 6 | `spider-mites.jpg` |
| 7 | `whiteflies.jpg` |
| 8 | `flea-beetles.jpg` |
| 9 | `japanese-beetles.jpg` |
| 10 | `cucumber-beetles.jpg` |
| 11 | `cutworms.jpg` |
| 12 | `thrips.jpg` |
| 13 | `colorado-potato-beetle.jpg` |
| 14 | `squash-vine-borers.jpg` |
| 15 | `leaf-miners.jpg` |
| 16 | `scale-insects.jpg` |
| 17 | `mealybugs.jpg` |
| 18 | `earwigs.jpg` |
| 19 | `grasshoppers.jpg` |
| 20 | `cabbage-loopers.jpg` |
| 21 | `corn-earworms.jpg` |

Once the images are here, tell me and I'll create `data/pestImageMap.js`
and wire each image into its pest's detail screen (replacing the emoji hero).

## Format and size

Bundled images are stored as **JPEG** (quality ~90, 4:4:4 chroma, metadata
stripped). They are all opaque, so PNG bought nothing but size: the app shipped
about 600 MB of images, now about 110 MB. Resize before adding:

| Folder | Longest side | Shown at |
|---|---|---|
| plants | 600 px | up to 200 pt |
| badges | 512 px | up to 132 pt |
| pests | 600 px wide | up to 110 pt |
| banners | 1200 px wide | full width × 96 pt |

```bash
convert in.png -resize 600x600\> -strip -quality 90 -sampling-factor 4:4:4 out.jpg
```

A PNG still works if an image needs transparency; reference it with `.png` in
the image map.
