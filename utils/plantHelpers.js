export function normalizeZip(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 5);
}

export function zoneNumber(zone) {
  const parsed = parseFloat(String(zone || "").replace(/[^\d.]/g, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

export function getClimateBucket(zone) {
  const value = zoneNumber(zone);

  if (value === null) return "moderate";
  if (value <= 5) return "cold";
  if (value <= 8) return "moderate";

  return "hot";
}

export function normalizeType(type, name = "") {
  const value = String(type || "").trim();

  if (value === "Vegetable") return "Vegetables";
  if (value === "Fruit Tree") return "Tree Fruits";
  if (value === "Berry") return "Berries";
  if (value === "Herb") return "Herbs";
  if (value === "Fruit") return "Tropical Fruits";

  const lower = String(name).toLowerCase();

  if (
    [
      "apple",
      "pear",
      "peach",
      "plum",
      "cherry",
      "fig",
      "orange",
      "lemon",
      "lime",
      "mandarin",
      "grapefruit",
      "pomegranate",
    ].some((word) => lower.includes(word))
  ) {
    return "Tree Fruits";
  }

  if (
    ["banana", "avocado", "honeydew", "watermelon"].some((word) =>
      lower.includes(word)
    )
  ) {
    return "Tropical Fruits";
  }

  if (
    ["berry", "strawberry", "blueberry", "currant", "grape"].some((word) =>
      lower.includes(word)
    )
  ) {
    return "Berries";
  }

  if (
    ["basil", "mint", "cilantro", "parsley", "oregano", "thyme", "rosemary"].some(
      (word) => lower.includes(word)
    )
  ) {
    return "Herbs";
  }

  return "Vegetables";
}

export function matchesType(item, selectedType) {
  if (selectedType === "All") return true;
  return normalizeType(item.type, item.name) === selectedType;
}

export function zoneMatch(zone, minZone, maxZone) {
  const current = zoneNumber(zone);
  const min = zoneNumber(minZone);
  const max = zoneNumber(maxZone);

  if (current === null || min === null || max === null) return false;

  return current >= min && current <= max;
}