const produceData = [
  {
    name: "Tomato",
    type: "Vegetable",
    image: "tomato",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Tomatoes thrive in warm sunny spots with rich soil and steady watering. Basil and marigolds grow especially well nearby. Support vines early with cages or stakes for healthier fruit and airflow. Harvest once fruits are fully colored and slightly soft.",
  },

  {
    name: "Pepper",
    type: "Vegetable",
    image: "pepper",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Peppers love heat and consistent moisture but dislike soggy roots. They grow best in nutrient-rich soil with plenty of sun. Harvest green for a sharper flavor or allow peppers to fully ripen for sweeter taste and deeper color.",
  },

  {
    name: "Carrot",
    type: "Vegetable",
    image: "carrot",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Carrots grow best in loose sandy soil free of rocks so roots stay straight and smooth. Keep soil moist during germination and thin seedlings early for larger harvests. Harvest once roots begin pushing above the soil surface.",
  },

  {
    name: "Lettuce",
    type: "Vegetable",
    image: "lettuce",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Lettuce grows quickly in cooler weather and benefits from afternoon shade in warm climates. Frequent harvesting encourages fresh tender leaves throughout the season. Heat may cause plants to bolt and turn bitter quickly.",
  },

  {
    name: "Spinach",
    type: "Vegetable",
    image: "spinach",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Spinach prefers cool temperatures with steady moisture and rich soil. Harvest outer leaves often to keep plants producing longer. Warm weather can trigger bolting and reduce leaf quality fast.",
  },

  {
    name: "Cucumber",
    type: "Vegetable",
    image: "cucumber",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Cucumbers grow rapidly in warm weather with steady watering and rich soil. Trellising improves airflow, saves space, and keeps fruit cleaner. Harvest frequently while fruits are firm and young for the best flavor.",
  },

  {
    name: "Zucchini",
    type: "Vegetable",
    image: "zucchini",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Zucchini produces heavily in warm sunny gardens with fertile soil and regular watering. Harvest fruits while still small and tender to encourage continued production. Good airflow helps prevent mildew and pest issues.",
  },

  {
    name: "Green Bean",
    type: "Vegetable",
    image: "greenbean",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [4, 5, 6, 7],
    notes:
      "Green beans grow fast in warm soil with full sun and moderate watering. Picking pods regularly keeps plants productive longer. Avoid planting near onions or garlic which may slow growth.",
  },

  {
    name: "Corn",
    type: "Vegetable",
    image: "corn",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Corn needs full sun, rich soil, and plenty of space for strong pollination. Planting in blocks instead of rows helps ears fill out properly. Harvest once kernels release a milky juice when pressed.",
  },

  {
    name: "Potato",
    type: "Vegetable",
    image: "potato",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 4],
    notes:
      "Potatoes grow best in loose soil with steady moisture and cool roots. Hill soil around stems as plants grow to protect forming tubers from sunlight. Harvest early for tender potatoes or later for storage crops.",
  },

  {
    name: "Broccoli",
    type: "Vegetable",
    image: "broccoli",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 8, 9],
    notes:
      "Broccoli thrives during cooler seasons with rich soil and consistent watering. Harvest the main head before flowers open to encourage side shoots later. Heat stress can cause loose heads and bolting.",
  },

  {
    name: "Cauliflower",
    type: "Vegetable",
    image: "cauliflower",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 8, 9],
    notes:
      "Cauliflower prefers cool weather and very steady growing conditions. Keep soil moist and fertile for dense healthy heads. Heat and uneven watering may cause small or loose growth.",
  },

  {
    name: "Cabbage",
    type: "Vegetable",
    image: "cabbage",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 8, 9],
    notes:
      "Cabbage grows best in sunny cool-weather gardens with fertile soil and steady moisture. Heads should feel dense and firm before harvest. Watch for cabbage worms and splitting during rapid growth.",
  },

  {
    name: "Kale",
    type: "Vegetable",
    image: "kale",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Kale handles cool temperatures extremely well and often tastes sweeter after frost. Harvest outer leaves regularly while the center continues producing. Warm weather may create tougher leaves and pest pressure.",
  },

  {
    name: "Beet",
    type: "Vegetable",
    image: "beet",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9],
    notes:
      "Beets grow quickly in loose fertile soil with regular watering. Both roots and leafy tops are edible and productive throughout the season. Thin seedlings early to allow roots enough room to size up.",
  },

  {
    name: "Radish",
    type: "Vegetable",
    image: "radish",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Radishes mature quickly in cool weather and loose moist soil. Harvest promptly once roots reach size to avoid woody texture or excessive spice. Crowded plants may struggle to form proper roots.",
  },

  {
    name: "Onion",
    type: "Vegetable",
    image: "onion",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [1, 2, 3],
    notes:
      "Onions need full sun and loose soil for healthy bulb development. Reduce watering as bulbs mature to improve storage quality. Harvest once tops naturally fall over and begin drying.",
  },

  {
    name: "Garlic",
    type: "Vegetable",
    image: "garlic",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [9, 10, 11],
    notes:
      "Garlic grows best when planted in fall and overwintered for larger bulbs. Use rich well-draining soil and avoid overly wet conditions. Harvest once lower leaves brown while upper leaves remain partly green.",
  },

  {
    name: "Pea",
    type: "Vegetable",
    image: "pea",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [1, 2, 3],
    notes:
      "Peas thrive in cool weather with steady moisture and support for climbing varieties. Harvest pods while still tender for the best flavor and texture. Heat can quickly reduce production.",
  },

  {
    name: "Pumpkin",
    type: "Vegetable",
    image: "pumpkin",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Pumpkins require warm temperatures, rich soil, and plenty of growing space. Consistent watering supports larger healthier fruit throughout the season. Harvest once rinds harden and develop deep mature color.",
  },
{
  name: "Strawberry",
  type: "Berry",
  image: "strawberry",
  minZone: "3a",
  maxZone: "10b",
  plantMonths: [2, 3, 4],
  notes:
    "Strawberries grow best in sunny areas with rich slightly acidic soil and steady moisture. Mulch helps protect fruit and keeps berries cleaner. Harvest once berries are fully red and fragrant for the sweetest flavor.",
},

{
  name: "Watermelon",
  type: "Fruit",
  image: "watermelon",
  minZone: "5a",
  maxZone: "10b",
  plantMonths: [4, 5, 6],
  notes:
    "Watermelons need long warm seasons, rich soil, and plenty of space to spread. Deep watering supports healthy vines and sweeter fruit. Harvest once the underside turns creamy yellow and nearby tendrils dry out.",
},

{
  name: "Apple",
  type: "Fruit Tree",
  image: "apple",
  minZone: "3a",
  maxZone: "8b",
  plantMonths: [1, 2],
  notes:
    "Apple trees thrive in full sun with strong airflow and well-draining soil. Many varieties need another nearby apple tree for pollination. Harvest once fruits color fully and release easily from branches.",
},

{
  name: "Orange",
  type: "Fruit Tree",
  image: "orange_tree_variant",
  minZone: "8b",
  maxZone: "10b",
  plantMonths: [2, 3],
  notes:
    "Orange trees prefer warm sunny climates with soil that drains well. Water deeply and allow roots to dry slightly between waterings. Protect young trees from frost and harvest once fruit becomes sweet and fully colored.",
},

{
  name: "Lemon",
  type: "Fruit Tree",
  image: "lemon_tree_variant",
  minZone: "8b",
  maxZone: "10b",
  plantMonths: [2, 3],
  notes:
    "Lemon trees grow best in warm sunny conditions with fast-draining soil. Regular feeding helps maintain healthy leaves and strong fruit production. Harvest lemons once bright yellow, fragrant, and slightly firm.",
},

{
  name: "Basil",
  type: "Herb",
  image: "basil",
  minZone: "4",
  maxZone: "11",
  plantMonths: [3, 4, 5, 6, 7, 8],
  notes:
    "Basil loves warm weather, rich soil, and steady moisture. Pinching stems often encourages fuller bushier growth throughout the season. Basil pairs especially well near tomatoes and peppers in garden beds.",
},

{
  name: "Marigold",
  type: "Flower",
  image: "marigold",
  minZone: "2",
  maxZone: "11",
  plantMonths: [3, 4, 5, 6, 7, 8, 9],
  notes:
    "Marigolds bloom heavily in sunny spots and are commonly planted beside vegetables. Their bright flowers attract pollinators and may help reduce pest activity nearby. Remove old blooms regularly for longer flowering.",
},

{
  name: "Parsley",
  type: "Herb",
  minZone: "3",
  maxZone: "10",
  plantMonths: [3, 4, 5, 9, 10],
  image: "parsley",
  notes:
    "Parsley grows steadily in rich moist soil with full sun or partial shade. Harvest outer stems first so fresh growth continues from the center. Consistent watering helps leaves stay tender and flavorful.",
},

{
  name: "Fennel",
  type: "Vegetable",
  minZone: "6",
  maxZone: "10",
  plantMonths: [3, 4, 5, 9, 10],
  image: "fennel",
  notes:
    "Fennel prefers warm sunny gardens with loose fertile soil and even moisture. It grows best with extra space because nearby plants may struggle around it. Harvest bulbs once swollen but still tender.",
},

{
  name: "Cilantro",
  type: "Herb",
  minZone: "3",
  maxZone: "10",
  plantMonths: [3, 4, 5, 9, 10],
  image: "cilantro",
  notes:
    "Cilantro grows quickly during cooler weather with light consistent moisture. Harvest leaves often before flowering for the best flavor and longest harvest period. Heat can quickly trigger bolting.",
},

{
  name: "Mint",
  type: "Herb",
  minZone: "3",
  maxZone: "11",
  plantMonths: [3, 4, 5, 6, 7, 8],
  image: "mint",
  notes:
    "Mint grows aggressively in moist rich soil with partial sun or light shade. Containers help control spreading roots and runners. Frequent harvesting keeps plants full, fresh, and productive.",
},

{
  name: "Rosemary",
  type: "Herb",
  minZone: "7",
  maxZone: "10",
  plantMonths: [3, 4, 5],
  image: "rosemary",
  notes:
    "Rosemary thrives in sunny dry conditions with sandy fast-draining soil. Avoid overwatering because roots dislike staying wet. Trim sprigs regularly to encourage compact healthy growth.",
},

{
  name: "Thyme",
  type: "Herb",
  minZone: "4",
  maxZone: "9",
  plantMonths: [3, 4, 5],
  image: "thyme",
  notes:
    "Thyme prefers full sun and slightly dry soil with excellent drainage. Small regular harvests help plants stay compact and aromatic. Too much moisture may weaken flavor and cause root issues.",
},

{
  name: "Celery",
  type: "Vegetable",
  minZone: "4",
  maxZone: "9",
  plantMonths: [4, 5, 6],
  image: "celery",
  notes:
    "Celery needs rich soil, cool temperatures, and very steady moisture for crisp stalks. Dry conditions may cause bitterness or hollow stems. Harvest outer stalks first or remove the entire plant once mature.",
},

{
  name: "Leek",
  type: "Vegetable",
  minZone: "3",
  maxZone: "9",
  plantMonths: [3, 4, 5],
  image: "leek",
  notes:
    "Leeks grow best in fertile loose soil with consistent watering and full sun. Mounding soil around stems creates longer tender white shanks. Harvest once stalks reach usable thickness.",
},

{
  name: "Swiss Chard",
  type: "Vegetable",
  minZone: "3",
  maxZone: "10",
  plantMonths: [3, 4, 5, 6, 7, 8],
  image: "swiss_chard",
  notes:
    "Swiss chard handles heat better than many leafy greens and produces for long periods. Harvest outer leaves often while the center continues growing. Consistent watering keeps leaves tender and mild.",
},

{
  name: "Bok Choy",
  type: "Vegetable",
  minZone: "4",
  maxZone: "9",
  plantMonths: [3, 4, 5, 9, 10],
  image: "bok_choy",
  notes:
    "Bok choy grows quickly in cool weather with rich moist soil and steady watering. Harvest baby plants early or allow heads to fully mature. Warm temperatures may trigger bolting.",
},

{
  name: "Raspberry",
  type: "Fruit",
  minZone: "4",
  maxZone: "8",
  plantMonths: [4, 5, 6],
  image: "raspberry",
  notes:
    "Raspberries thrive in sunny areas with rich slightly acidic soil and strong airflow. Pruning old canes each year improves fruit production and plant health. Harvest berries once they pull free easily.",
},

{
  name: "Mango",
  type: "Fruit",
  minZone: "9",
  maxZone: "11",
  plantMonths: [3, 4, 5],
  image: "mango",
  notes:
    "Mango trees love warm frost-free climates with deep well-draining soil and full sun. Young trees benefit from protection against strong wind and cold. Harvest fruit once color deepens and aroma becomes sweet.",
},
];
export default produceData;