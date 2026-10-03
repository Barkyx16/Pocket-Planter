# Badge Images

Drop one image per achievement badge here. **The filename must exactly match the badge `id`** (from `getAchievementBadges` in `core.js`) with a `.jpg` extension — that's how the app will look each one up.

- Recommended: square, ~512×512 px.
- Format: `.jpg` (see below).
- Locked badges will render the same image dimmed/greyed by the app — you only need one image per id.

## Filenames to generate (53)

| Filename | Badge |
|---|---|
| first_plant_saved.jpg | First Plant Saved |
| save_5_plants.jpg | Green Thumb |
| save_10_plants.jpg | Garden Collector |
| save_15_plants.jpg | Zone Master |
| save_25_plants.jpg | Plant Library Master |
| save_50_plants.jpg | Plant Encyclopedia |
| water_one_today.jpg | Daily Water Check |
| water_three_today.jpg | Water Watcher |
| water_25_total.jpg | Consistent Gardener |
| water_50_total.jpg | Watering Legend |
| water_100_total.jpg | Water Master |
| streak_3.jpg | Getting Started |
| streak_7.jpg | 7-Day Streak |
| streak_14.jpg | Dedicated Grower |
| streak_30.jpg | Garden Obsessed |
| streak_60.jpg | Garden Master |
| first_journal_photo.jpg | First Garden Photo |
| photo_5.jpg | Snapshot Garden |
| photo_logger.jpg | Photo Logger |
| garden_album.jpg | Garden Historian |
| photo_50.jpg | Garden Documentarian |
| first_plot.jpg | First Plot Filled |
| plot_builder.jpg | Plot Builder |
| full_garden.jpg | Full Garden |
| first_care_log.jpg | First Care Entry |
| care_log_5.jpg | Soil Scientist |
| care_log_10.jpg | Care Expert |
| care_log_25.jpg | Garden Scientist |
| first_harvest.jpg | First Harvest Tracked |
| harvest_3.jpg | Harvest King |
| harvest_5.jpg | Harvest Legend |
| harvest_ready.jpg | Harvest Day! |
| level_5.jpg | Backyard Grower |
| level_10.jpg | Green Thumb |
| level_15.jpg | Harvest Keeper |
| level_20.jpg | Garden Sage |
| level_25.jpg | Plant Whisperer |
| level_30.jpg | Soil Scientist |
| level_35.jpg | Garden Architect |
| level_40.jpg | Zone Master |
| level_45.jpg | Harvest Legend |
| level_50.jpg | Master Botanist |
| level_55.jpg | Garden Oracle |
| level_60.jpg | Legendary Grower |
| level_65.jpg | Elite Cultivator |
| level_70.jpg | Grand Gardener |
| level_75.jpg | Garden Mythkeeper |
| level_80.jpg | Ancient Cultivator |
| level_85.jpg | Garden Immortal |
| level_90.jpg | Celestial Grower |
| level_95.jpg | Garden Transcendent |
| level_100.jpg | Garden Gnome |
| garden_gnome_ultimate.jpg | The Garden Gnome (secret legend) |

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
