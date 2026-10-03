# Plant images

One image per plant, named by its lowercase image key (see `core.js`).

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
