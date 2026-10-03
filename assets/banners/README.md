# Banner Images

Drop one image per profile banner here. **The filename must exactly match the banner `id`** (from `getProfileBanners` in `core.js`) with a `.jpg` extension — that's how the app will look each one up.

- Recommended: wide banner, full-bleed background, ~1200 px wide. This is the image shown above the profile in the Quests tab.
- Format: `.jpg` (see below).
- One image per id; locked banners are rendered dimmed/greyed by the app.

## Filenames to generate (21)

| Filename | Banner |
|---|---|
| seedling_banner.jpg | Seedling Starter |
| green_thumb_banner.jpg | Green Thumb |
| harvest_banner.jpg | Harvest Keeper |
| master_banner.jpg | Master Botanist |
| collector_banner.jpg | Plant Collector |
| journal_banner.jpg | Garden Historian |
| planner_banner.jpg | Garden Architect |
| streak_banner.jpg | Streak Keeper |
| obsessed_banner.jpg | Garden Obsessed |
| water_wizard_banner.jpg | Water Wizard |
| master_waterer_banner.jpg | Master Waterer |
| soil_scientist_banner.jpg | Soil Scientist |
| care_expert_banner.jpg | Care Expert |
| snapshot_banner.jpg | Snapshot Garden |
| garden_historian_banner.jpg | Garden Historian |
| zone_master_banner.jpg | Zone Master |
| legendary_grower_banner.jpg | Legendary Grower |
| full_garden_banner.jpg | Full Garden |
| harvest_king_banner.jpg | Harvest King |
| companion_pro_banner.jpg | Companion Pro |
| quest_crusher_banner.jpg | Quest Crusher |

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
