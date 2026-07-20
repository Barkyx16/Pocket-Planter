// Maps each pest name (from PEST_WATCH_DATA) to its bundled image.
const pestImageMap = {
  "Aphids": require("../assets/pests/aphids.png"),
  "Tomato Hornworms": require("../assets/pests/tomato-hornworms.png"),
  "Squash Bugs": require("../assets/pests/squash-bugs.png"),
  "Cabbage Worms": require("../assets/pests/cabbage-worms.png"),
  "Slugs & Snails": require("../assets/pests/slugs-snails.png"),
  "Spider Mites": require("../assets/pests/spider-mites.png"),
  "Whiteflies": require("../assets/pests/whiteflies.png"),
  "Flea Beetles": require("../assets/pests/flea-beetles.png"),
  "Japanese Beetles": require("../assets/pests/japanese-beetles.png"),
  "Cucumber Beetles": require("../assets/pests/cucumber-beetles.png"),
  "Cutworms": require("../assets/pests/cutworms.png"),
  "Thrips": require("../assets/pests/thrips.png"),
  "Colorado Potato Beetle": require("../assets/pests/colorado-potato-beetle.png"),
  "Squash Vine Borers": require("../assets/pests/squash-vine-borers.png"),
  "Leaf Miners": require("../assets/pests/leaf-miners.png"),
  "Scale Insects": require("../assets/pests/scale-insects.png"),
  "Mealybugs": require("../assets/pests/mealybugs.png"),
  "Earwigs": require("../assets/pests/earwigs.png"),
  "Grasshoppers": require("../assets/pests/grasshoppers.png"),
  "Cabbage Loopers": require("../assets/pests/cabbage-loopers.png"),
  "Corn Earworms": require("../assets/pests/corn-earworms.png"),
};

export function getPestImage(name) {
  return pestImageMap[name] || null;
}

export default pestImageMap;
