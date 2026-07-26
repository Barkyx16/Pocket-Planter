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
{
  name: "Peach",
  type: "Fruit Tree",
  image: "peach",
  minZone: "5a",
  maxZone: "9b",
  plantMonths: [1, 2, 3],
  notes:
    "Peach trees prefer full sun with well-draining soil and good air circulation. Thinning young fruit produces larger, sweeter peaches. Harvest once fruit softens slightly and releases a rich fragrance.",
},

{
  name: "Pear",
  type: "Fruit Tree",
  image: "pear",
  minZone: "4a",
  maxZone: "8b",
  plantMonths: [1, 2, 3],
  notes:
    "Pear trees prefer full sun with well-draining soil and good airflow. Many varieties fruit better with a second pear tree nearby for pollination. Harvest while still firm and let them ripen off the tree.",
},

{
  name: "Plum",
  type: "Fruit Tree",
  image: "plum",
  minZone: "4a",
  maxZone: "9b",
  plantMonths: [1, 2, 3],
  notes:
    "Plum trees grow best in full sun with fertile, well-draining soil. Thinning young fruit produces larger, sweeter plums. Harvest once fruit softens slightly and comes away with a gentle twist.",
},

{
  name: "Cherry",
  type: "Fruit Tree",
  image: "cherry",
  minZone: "4a",
  maxZone: "8b",
  plantMonths: [1, 2, 3],
  notes:
    "Cherry trees love full sun and deep, well-draining soil. Netting helps protect ripening fruit from hungry birds. Harvest once cherries are fully colored, firm, and sweet.",
},

{
  name: "Apricot",
  type: "Fruit Tree",
  image: "apricot",
  minZone: "5a",
  maxZone: "8b",
  plantMonths: [1, 2, 3],
  notes:
    "Apricot trees prefer full sun and thrive where late frosts are rare. Well-draining soil and good airflow keep trees healthy. Harvest once fruit is fragrant, softened, and easily released from the branch.",
},

{
  name: "Fig",
  type: "Fruit Tree",
  image: "fig",
  minZone: "7a",
  maxZone: "10b",
  plantMonths: [2, 3, 4],
  notes:
    "Fig trees love warm sunny spots with well-draining soil and tolerate some drought. Protect young trees from hard frost in cooler zones. Harvest figs once they soften and droop slightly on the branch.",
},

{
  name: "Pomegranate",
  type: "Fruit Tree",
  image: "pomegranate",
  minZone: "7a",
  maxZone: "10b",
  plantMonths: [2, 3, 4],
  notes:
    "Pomegranates love hot dry summers with full sun and well-draining soil. Established trees tolerate drought once their roots are deep. Harvest once fruit is deeply colored and makes a metallic sound when tapped.",
},

{
  name: "Avocado",
  type: "Fruit Tree",
  image: "avocado",
  minZone: "9b",
  maxZone: "11",
  plantMonths: [3, 4, 5],
  notes:
    "Avocado trees need warm frost-free climates with full sun and fast-draining soil. Protect young trees from wind and cold. Harvest while firm and let the fruit soften off the tree.",
},

{
  name: "Banana",
  type: "Fruit",
  image: "banana",
  minZone: "9b",
  maxZone: "11",
  plantMonths: [3, 4, 5],
  notes:
    "Banana plants need heat, humidity, and rich moist soil to thrive. Shelter from wind protects their large delicate leaves. Harvest once fruit plumps and rounds, then ripen the bunch off the plant.",
},
{
  name: "Grapefruit",
  type: "Fruit Tree",
  image: "grapefruit",
  minZone: "9a",
  maxZone: "11",
  plantMonths: [2, 3],
  notes:
    "Grapefruit trees need warm, frost-free climates with full sun and fast-draining soil. Deep, infrequent watering supports healthy roots. Harvest once fruit is fully colored, heavy, and slightly soft.",
},

{
  name: "Mandarin",
  type: "Fruit Tree",
  image: "mandarin",
  minZone: "9a",
  maxZone: "11",
  plantMonths: [2, 3],
  notes:
    "Mandarin trees thrive in warm sunny spots with well-draining soil. They tolerate container growing better than many citrus. Harvest once fruit is deeply colored and peels away easily.",
},

{
  name: "Lime",
  type: "Fruit Tree",
  image: "lime",
  minZone: "9a",
  maxZone: "11",
  plantMonths: [2, 3],
  notes:
    "Lime trees prefer warm frost-free climates with full sun and fast-draining soil. Protect from cold snaps to avoid dropping fruit. Harvest while green and firm for the brightest, most fragrant juice.",
},

{
  name: "Grapes",
  type: "Fruit",
  image: "grapes",
  minZone: "4a",
  maxZone: "10b",
  plantMonths: [3, 4],
  notes:
    "Grapes need full sun, sturdy support, and well-draining soil to thrive. Annual pruning is essential for strong vines and quality fruit. Harvest clusters once fully colored and sweet to the taste.",
},

{
  name: "Honeydew",
  type: "Fruit",
  image: "honeydew",
  minZone: "5a",
  maxZone: "10b",
  plantMonths: [4, 5, 6],
  notes:
    "Honeydew melons need long warm seasons, rich soil, and room to spread. Deep watering supports sweeter fruit and healthy vines. Harvest once the rind turns creamy and the blossom end gives slightly.",
},

{
  name: "Eggplant",
  type: "Vegetable",
  image: "eggplant",
  minZone: "5a",
  maxZone: "10b",
  plantMonths: [4, 5, 6],
  notes:
    "Eggplant loves long stretches of heat with rich soil and steady moisture. Full sun produces the healthiest plants and glossiest fruit. Harvest while skins are firm and shiny for the best texture and flavor.",
},

{
  name: "Okra",
  type: "Vegetable",
  image: "okra",
  minZone: "5a",
  maxZone: "11",
  plantMonths: [4, 5, 6],
  notes:
    "Okra thrives in hot weather with full sun and well-draining soil. Regular picking keeps pods tender and encourages continued production. Harvest pods while young and small before they turn woody.",
},

{
  name: "Sweet Potato",
  type: "Vegetable",
  image: "sweetpotato",
  minZone: "6a",
  maxZone: "11",
  plantMonths: [5, 6],
  notes:
    "Sweet potatoes thrive in warm loose soil with full sun and room for sprawling vines. They tolerate heat and drought better than most root crops. Harvest before the first frost once tubers reach full size.",
},
{
  name: "Blueberry",
  type: "Berry",
  image: "blueberry",
  minZone: "3a",
  maxZone: "8b",
  plantMonths: [3, 4],
  notes:
    "Blueberries need acidic well-draining soil and full sun to produce well. Mulching helps retain moisture and keep roots cool. Harvest once berries turn fully blue and detach with a gentle tug.",
},

{
  name: "Blackberry",
  type: "Berry",
  image: "blackberry",
  minZone: "5a",
  maxZone: "9b",
  plantMonths: [3, 4, 5],
  notes:
    "Blackberries grow vigorously in sunny spots with rich soil and good airflow. Pruning spent canes each year keeps plants healthy and productive. Harvest once berries turn deep black and pull away easily.",
},

{
  name: "Boysenberry",
  type: "Berry",
  image: "boysenberry",
  minZone: "5a",
  maxZone: "9b",
  plantMonths: [3, 4],
  notes:
    "Boysenberries thrive in full sun with rich soil and sturdy support for their trailing canes. Prune old canes yearly to keep plants vigorous. Harvest once berries turn deep purple and soften.",
},

{
  name: "Marionberry",
  type: "Berry",
  image: "marionberry",
  minZone: "6a",
  maxZone: "9b",
  plantMonths: [3, 4],
  notes:
    "Marionberries grow best in full sun with rich, well-draining soil and trellised canes. Regular pruning improves airflow and yield. Harvest once berries are glossy, deep black, and release with a light pull.",
},

{
  name: "Mulberry",
  type: "Berry",
  image: "mulberry",
  minZone: "4a",
  maxZone: "9b",
  plantMonths: [2, 3, 4],
  notes:
    "Mulberries grow vigorously in full sun with room to spread. They fruit heavily with little fuss once established. Harvest once berries turn deep and drop easily with a gentle shake.",
},

{
  name: "Gooseberry",
  type: "Berry",
  image: "gooseberry",
  minZone: "3a",
  maxZone: "8b",
  plantMonths: [3, 4],
  notes:
    "Gooseberries prefer cool climates with rich soil and partial to full sun. Good airflow reduces mildew on the dense branches. Harvest once berries soften and reach full color.",
},

{
  name: "Currant",
  type: "Berry",
  image: "currant",
  minZone: "3a",
  maxZone: "8b",
  plantMonths: [3, 4],
  notes:
    "Currants thrive in cooler climates with moist, fertile soil and partial shade. Annual pruning keeps plants productive and open. Harvest whole clusters once berries are firm and richly colored.",
},

{
  name: "Cranberry",
  type: "Berry",
  image: "cranberry",
  minZone: "2a",
  maxZone: "7b",
  plantMonths: [4, 5],
  notes:
    "Cranberries need acidic, consistently moist soil and full sun to thrive. They spread as low trailing vines over time. Harvest in fall once berries turn deep red and firm.",
},

{
  name: "Elderberry",
  type: "Berry",
  image: "elderberry",
  minZone: "3a",
  maxZone: "9b",
  plantMonths: [3, 4],
  notes:
    "Elderberries grow fast in full sun with moist, fertile soil. Planting two shrubs improves pollination and yields. Harvest entire clusters once berries turn dark and fully ripe.",
},
// ═══════════════════════════════════════════════════════════
  //  NEW PLANTS — v1.2 expansion (125 additions)
  //  Paste this block right before the closing  ];  of produceData.
  //  Image keys are lowercase; add matching PNGs to assets/plants/
  //  and register them in the plantImages map in App.js.
  // ═══════════════════════════════════════════════════════════

  // ─── HERBS (20) ───────────────────────────────────────────
  {
    name: "Oregano",
    type: "Herb",
    image: "oregano",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Oregano is a hardy perennial that loves full sun and well-drained soil. It tolerates dry conditions once established and develops stronger flavor with less water. Trim regularly to keep it bushy and prevent it from turning woody.",
  },

  {
    name: "Sage",
    type: "Herb",
    image: "sage",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Sage thrives in full sun with well-drained soil and needs little watering once established. Its silvery leaves are prone to rot in soggy conditions, so avoid overwatering. Prune in spring to encourage fresh growth.",
  },

  {
    name: "Dill",
    type: "Herb",
    image: "dill",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [4, 5, 6, 7],
    notes:
      "Dill grows quickly in full sun and prefers to be sown directly since it dislikes transplanting. It pairs well with cabbage and cucumbers but keep it away from carrots. Harvest leaves before flowering for the best flavor.",
  },

  {
    name: "Chives",
    type: "Herb",
    image: "chives",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Chives are an easy, low-maintenance perennial that grows in tidy clumps. They prefer full sun but tolerate partial shade and enjoy steady moisture. Snip leaves regularly, and the purple blossoms are edible too.",
  },

  {
    name: "Tarragon",
    type: "Herb",
    image: "tarragon",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [4, 5, 6],
    notes:
      "French tarragon prefers full sun to light shade and well-drained soil that isn't too rich. Let the soil dry between waterings to avoid root rot. Divide plants every few years to keep the flavor strong.",
  },

  {
    name: "Lavender",
    type: "Herb",
    image: "lavender",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Lavender loves full sun, sandy well-drained soil, and dry conditions once established. Overwatering is the most common way to lose it. Prune after flowering to keep the plant compact and encourage new blooms.",
  },

  {
    name: "Lemongrass",
    type: "Herb",
    image: "lemongrass",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Lemongrass loves heat, full sun, and consistently moist soil. It grows into tall grassy clumps and can be divided to make new plants. In cooler zones, grow it in a pot and bring it indoors before frost.",
  },

  {
    name: "Marjoram",
    type: "Herb",
    image: "marjoram",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Marjoram is a tender relative of oregano with a milder, sweeter flavor. It prefers full sun and well-drained soil and dislikes wet feet. Pinch back regularly to keep it bushy and delay flowering.",
  },

  {
    name: "Bay Laurel",
    type: "Herb",
    image: "baylaurel",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Bay laurel is a slow-growing evergreen shrub that supplies fresh and dried bay leaves. It likes full sun to partial shade and well-drained soil. In colder zones grow it in a container so it can overwinter indoors.",
  },

  {
    name: "Chamomile",
    type: "Herb",
    image: "chamomile",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Chamomile produces cheerful daisy-like flowers prized for tea. It thrives in full sun to light shade and tolerates poor soil. Harvest the flowers when petals are fully open, and it will often self-seed for next year.",
  },

  {
    name: "Catnip",
    type: "Herb",
    image: "catnip",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [4, 5, 6],
    notes:
      "Catnip is a vigorous member of the mint family that grows easily in full sun and average soil. It can spread aggressively, so a container helps keep it in check. Cats adore it, and its flowers attract pollinators.",
  },

  {
    name: "Stevia",
    type: "Herb",
    image: "stevia",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Stevia's leaves are naturally sweet and grow best in full sun with warm temperatures and steady moisture. It is frost-tender, so treat it as an annual in cooler zones. Harvest leaves before the plant flowers for peak sweetness.",
  },

  {
    name: "Sorrel",
    type: "Herb",
    image: "sorrel",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Sorrel is a hardy perennial with tangy, lemony leaves. It prefers full sun to partial shade and moist, rich soil. Harvest young leaves often for the mildest flavor and remove flower stalks to keep leaves coming.",
  },

  {
    name: "Summer Savory",
    type: "Herb",
    image: "summersavory",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Summer savory is a peppery annual herb that pairs classically with beans. It likes full sun and well-drained soil with moderate water. Harvest sprigs just before flowering when the flavor is strongest.",
  },

  {
    name: "Lovage",
    type: "Herb",
    image: "lovage",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Lovage is a tall perennial with a bold celery-like flavor. It thrives in full sun to partial shade and rich, moist soil. Give it plenty of room, as it can reach several feet, and harvest leaves and stems as needed.",
  },

  {
    name: "Turmeric",
    type: "Herb",
    image: "turmeric",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Turmeric is a tropical rhizome that needs warmth, humidity, and rich, moist soil. It takes many months to mature, so start it early or grow in a pot indoors. Harvest the roots once the leaves yellow and die back.",
  },

  {
    name: "Ginger",
    type: "Herb",
    image: "ginger",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Ginger grows from rhizomes in warm, humid conditions with rich, well-draining soil and partial shade. It dislikes direct harsh sun. Harvest after eight to ten months once the foliage begins to yellow.",
  },

  {
    name: "Anise",
    type: "Herb",
    image: "anise",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [4, 5, 6],
    notes:
      "Anise is an annual grown for its licorice-flavored seeds. It needs full sun, well-drained soil, and a long warm season to ripen seeds. Sow directly since it resents transplanting, and harvest seed heads once they brown.",
  },

  {
    name: "Borage",
    type: "Herb",
    image: "borage",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Borage is an easygoing annual with edible star-shaped blue flowers that pollinators love. It grows in full sun and average soil and self-seeds readily. It makes an excellent companion for tomatoes and strawberries.",
  },

  {
    name: "Chervil",
    type: "Herb",
    image: "chervil",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 9],
    notes:
      "Chervil is a delicate annual with a mild parsley-anise flavor that prefers cool weather and partial shade. It bolts quickly in heat, so grow it in spring and fall. Sow directly and harvest leaves young.",
  },

  // ─── VEGETABLES: Brassicas & Greens (15) ──────────────────
  {
    name: "Brussels Sprouts",
    type: "Vegetable",
    image: "brusselssprouts",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5, 6, 7],
    notes:
      "Brussels sprouts need a long cool growing season and taste sweeter after a light frost. Give them full sun, rich soil, and steady moisture. Harvest sprouts from the bottom of the stalk upward as they firm up.",
  },

  {
    name: "Collard Greens",
    type: "Vegetable",
    image: "collardgreens",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Collards are heat- and cold-tolerant leafy greens that grow in full sun and rich soil. They shrug off light frosts, which sweetens the leaves. Harvest outer leaves as needed and the plant keeps producing.",
  },

  {
    name: "Mustard Greens",
    type: "Vegetable",
    image: "mustardgreens",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Mustard greens grow fast in cool weather with full sun and steady moisture. Their peppery leaves turn bitter and bolt in heat, so grow them in spring and fall. Harvest young leaves for the mildest flavor.",
  },

  {
    name: "Arugula",
    type: "Vegetable",
    image: "arugula",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4, 9, 10],
    notes:
      "Arugula is a fast-growing peppery green that thrives in cool weather and partial shade in warm climates. It bolts quickly in heat, so sow small batches often. Harvest outer leaves young for a milder bite.",
  },

  {
    name: "Kohlrabi",
    type: "Vegetable",
    image: "kohlrabi",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Kohlrabi forms a crisp swollen stem best grown in cool weather with full sun and even moisture. Harvest when bulbs are two to three inches across, before they turn woody. Both spring and fall crops do well.",
  },

  {
    name: "Endive",
    type: "Vegetable",
    image: "endive",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Endive is a slightly bitter salad green that prefers cool weather and steady moisture. Blanch the centers by tying outer leaves together to reduce bitterness. Grow it in spring or fall to avoid bolting.",
  },

  {
    name: "Radicchio",
    type: "Vegetable",
    image: "radicchio",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [4, 5, 8],
    notes:
      "Radicchio forms tight ruby heads and develops its best color and flavor in cool fall weather. Give it full sun and consistent moisture. A light frost mellows the bitterness, so it is often grown as a fall crop.",
  },

  {
    name: "Watercress",
    type: "Vegetable",
    image: "watercress",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 9],
    notes:
      "Watercress craves constantly wet, cool conditions and grows well near water or in a tray kept flooded. It prefers partial shade in warm climates. Harvest tender stem tips often to keep new growth coming.",
  },

  {
    name: "Romaine",
    type: "Vegetable",
    image: "romaine",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Romaine is an upright crisp lettuce that grows best in cool weather with full sun and steady moisture. It tolerates a bit more heat than looseleaf types but still bolts if it gets too hot. Harvest whole heads or outer leaves.",
  },

  {
    name: "Napa Cabbage",
    type: "Vegetable",
    image: "napacabbage",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Napa cabbage forms elongated tender heads and grows best in cool weather with rich, moist soil. It is prone to bolting if started too late in spring, so fall crops are often more reliable. Harvest once heads feel firm.",
  },

  {
    name: "Turnip",
    type: "Vegetable",
    image: "turnip",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Turnips grow quickly in cool weather and provide both roots and edible greens. Sow directly in loose soil and thin seedlings for good root development. Harvest roots young, around two inches, for the sweetest flavor.",
  },

  {
    name: "Rutabaga",
    type: "Vegetable",
    image: "rutabaga",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5, 6, 7],
    notes:
      "Rutabaga is a hearty root that needs a long cool season to mature and sweetens after frost. Give it loose, rich soil and steady water. Sow in mid to late summer for a fall harvest and lift before hard freezes.",
  },

  {
    name: "Parsnip",
    type: "Vegetable",
    image: "parsnip",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Parsnips need deep, loose, stone-free soil and a long season to develop their sweet roots. Their flavor improves dramatically after a frost. Sow fresh seed directly, keep soil moist for germination, and be patient.",
  },

  {
    name: "Horseradish",
    type: "Vegetable",
    image: "horseradish",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Horseradish is a vigorous perennial grown for its pungent root. It thrives in full sun and deep, rich soil and can spread, so give it a dedicated bed. Harvest roots in late fall after the tops die back for the strongest bite.",
  },

  {
    name: "Escarole",
    type: "Vegetable",
    image: "escarole",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Escarole is a broad-leaved, mildly bitter green in the chicory family. It prefers cool weather, full sun, and even moisture. Blanch the center leaves for a milder taste and harvest before summer heat sets in.",
  },

  // ─── VEGETABLES: Roots, Alliums & Stalks (10) ─────────────
  {
    name: "Shallot",
    type: "Vegetable",
    image: "shallot",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 9, 10],
    notes:
      "Shallots grow in clusters from a single bulb and prefer full sun with loose, fertile soil. Plant sets in spring or fall and keep beds weed-free. Harvest when the tops flop over and yellow, then cure for storage.",
  },

  {
    name: "Scallion",
    type: "Vegetable",
    image: "scallion",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 8, 9],
    notes:
      "Scallions, or green onions, are quick and forgiving, growing in full sun with steady moisture. Sow in succession for a continuous supply. Harvest whenever the tops reach usable size, or leave them to thicken.",
  },

  {
    name: "Rhubarb",
    type: "Vegetable",
    image: "rhubarb",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Rhubarb is a cold-hardy perennial grown for its tart edible stalks; the leaves are toxic and should never be eaten. Give it full sun and rich soil. Avoid harvesting the first year so the crown can establish.",
  },

  {
    name: "Asparagus",
    type: "Vegetable",
    image: "asparagus",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Asparagus is a long-lived perennial that rewards patience, producing spears for decades once established. Plant crowns in a permanent sunny bed with rich soil. Wait two to three years before your first full harvest.",
  },

  {
    name: "Artichoke",
    type: "Vegetable",
    image: "artichoke",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Globe artichokes are tender perennials grown for their edible flower buds. They need full sun, rich soil, and room to spread. In mild zones they overwinter; in colder areas grow them as annuals or mulch heavily.",
  },

  {
    name: "Jerusalem Artichoke",
    type: "Vegetable",
    image: "jerusalemartichoke",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Also called sunchoke, this vigorous perennial produces knobby edible tubers and tall sunflower-like blooms. It grows almost anywhere in full sun and can spread aggressively. Harvest tubers after the first frost.",
  },

  {
    name: "Jicama",
    type: "Vegetable",
    image: "jicama",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Jicama is a warm-season vine grown for its crisp, sweet root. It needs a long hot season, full sun, and well-drained soil. Only the root is edible; the pods and seeds are toxic. Harvest before the first frost.",
  },

  {
    name: "Celeriac",
    type: "Vegetable",
    image: "celeriac",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Celeriac is grown for its knobby, celery-flavored root and needs a long, cool, moist season. Give it rich soil and consistent water to avoid toughness. Harvest in fall once roots are three to four inches across.",
  },

  {
    name: "Salsify",
    type: "Vegetable",
    image: "salsify",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Salsify produces a slender root with a delicate oyster-like flavor. It needs deep, loose soil and a long season much like parsnips. Its flavor sweetens after frost, so harvest roots in late fall.",
  },

  {
    name: "Daikon",
    type: "Vegetable",
    image: "daikon",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [4, 8, 9],
    notes:
      "Daikon is a large mild radish that grows quickly in cool weather and loose, deep soil. Sow directly in late summer for a fall harvest. It also makes an excellent cover crop that breaks up compacted ground.",
  },

  // ─── VEGETABLES: Legumes (8) ──────────────────────────────
  {
    name: "Edamame",
    type: "Vegetable",
    image: "edamame",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5, 6],
    notes:
      "Edamame are young soybeans harvested green and tender. They need warm soil, full sun, and a steady growing season. Sow directly after frost danger passes and harvest pods when plump but still bright green.",
  },

  {
    name: "Lima Bean",
    type: "Vegetable",
    image: "limabean",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Lima beans love heat and need warm soil to germinate well. Give them full sun and support if growing pole varieties. Harvest pods when they feel full and firm but before they dry on the vine.",
  },

  {
    name: "Fava Bean",
    type: "Vegetable",
    image: "favabean",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 9, 10],
    notes:
      "Fava beans are cool-season legumes that tolerate light frost and even fix nitrogen in the soil. Sow in early spring or fall in full sun. Harvest pods young for tender beans or let them mature for shelling.",
  },

  {
    name: "Chickpea",
    type: "Vegetable",
    image: "chickpea",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Chickpeas are drought-tolerant legumes that need a long, cool-to-warm season and full sun. Give them well-drained soil and avoid overwatering. Harvest once pods dry on the plant for storage, or young for fresh eating.",
  },

  {
    name: "Lentil",
    type: "Vegetable",
    image: "lentil",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Lentils are hardy, cool-season legumes that grow in full sun and well-drained soil with minimal fuss. They fix nitrogen and tolerate dry spells. Harvest when the lower pods turn brown and rattle when shaken.",
  },

  {
    name: "Black Bean",
    type: "Vegetable",
    image: "blackbean",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Black beans are warm-season bush legumes that need full sun and a long frost-free stretch to mature. Sow directly after the soil warms. Leave pods on the plant to dry fully before harvesting for storage.",
  },

  {
    name: "Pinto Bean",
    type: "Vegetable",
    image: "pintobean",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Pinto beans thrive in heat and full sun and are usually grown as a dry bean. Sow directly once soil is warm and keep watering moderate. Harvest when pods are dry and beans rattle inside for the best storage.",
  },

  {
    name: "Snap Pea",
    type: "Vegetable",
    image: "snappea",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 4, 9],
    notes:
      "Snap peas are sweet, cool-season climbers with edible pods. Sow early in full sun and give them a trellis to climb. Harvest when pods are plump but still crisp, and pick often to keep the vines producing.",
  },

  // ─── VEGETABLES: Peppers (8) ──────────────────────────────
  {
    name: "Jalapeño",
    type: "Vegetable",
    image: "jalapeno",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Jalapeños love heat, full sun, and steady moisture with well-drained soil. Harvest green for a sharper bite or let them ripen red for sweeter heat. Corking lines on the skin are a sign of a well-developed pepper.",
  },

  {
    name: "Habanero",
    type: "Vegetable",
    image: "habanero",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Habaneros are intensely hot peppers that demand a long, warm season, full sun, and consistent moisture. They are slow to ripen, so start early. Harvest once fruits reach their full orange or red color for maximum heat.",
  },

  {
    name: "Serrano",
    type: "Vegetable",
    image: "serrano",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Serrano peppers bring bright heat and grow well in full sun with warm soil and steady water. They produce heavily over a long season. Harvest green for crisp heat or let them turn red for a fuller flavor.",
  },

  {
    name: "Poblano",
    type: "Vegetable",
    image: "poblano",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Poblanos are mild, meaty peppers ideal for roasting and stuffing. They need full sun, warm soil, and even moisture. Harvest them dark green for classic flavor, or let them ripen red and dry into anchos.",
  },

  {
    name: "Bell Pepper",
    type: "Vegetable",
    image: "bellpepper",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Bell peppers are sweet, crisp, and heatless, thriving in full sun with rich soil and steady water. Support heavy plants as fruit sets. Harvest green for a firmer bite or wait for red, yellow, or orange ripeness and extra sweetness.",
  },

  {
    name: "Cayenne",
    type: "Vegetable",
    image: "cayenne",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Cayenne peppers are long, slender, and hot, perfect for drying into powder. They love full sun, warm soil, and moderate water. Harvest when fully red and firm, then dry them for storage or grind fresh.",
  },

  {
    name: "Ghost Pepper",
    type: "Vegetable",
    image: "ghostpepper",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Ghost peppers are among the world's hottest and need a long, hot season with full sun and patience. Germination and ripening are both slow, so start very early. Handle the ripe fruits with care and gloves.",
  },

  {
    name: "Banana Pepper",
    type: "Vegetable",
    image: "bananapepper",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Banana peppers are mild, tangy, and productive, thriving in full sun with warm soil and even moisture. They pickle beautifully. Harvest yellow for mild flavor or leave them to ripen orange-red for extra sweetness.",
  },

  // ─── VEGETABLES: Squash & Gourds (10) ─────────────────────
  {
    name: "Butternut Squash",
    type: "Vegetable",
    image: "butternutsquash",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Butternut squash is a sprawling winter squash that needs full sun, rich soil, and plenty of room. Give it a long warm season to mature. Harvest when the skin is hard and tan, then cure it for sweeter, longer-storing fruit.",
  },

  {
    name: "Acorn Squash",
    type: "Vegetable",
    image: "acornsquash",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Acorn squash produces compact ribbed fruits on vigorous vines in full sun and fertile soil. Keep it evenly watered while fruit develops. Harvest when the skin dulls and the stem dries, and cure briefly before storing.",
  },

  {
    name: "Spaghetti Squash",
    type: "Vegetable",
    image: "spaghettisquash",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Spaghetti squash forms stringy flesh that separates into strands when cooked. Give it full sun, room to vine, and consistent water. Harvest when the rind turns deep yellow and resists a fingernail, then cure before storing.",
  },

  {
    name: "Yellow Squash",
    type: "Vegetable",
    image: "yellowsquash",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [5, 6, 7],
    notes:
      "Yellow summer squash grows fast and heavy in full sun with rich, moist soil. Pick fruits young and often, around six inches, to keep the plant producing. Watch for squash bugs and powdery mildew in humid weather.",
  },

  {
    name: "Pattypan Squash",
    type: "Vegetable",
    image: "pattypansquash",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [5, 6, 7],
    notes:
      "Pattypan is a scalloped summer squash that is most tender when picked small. Grow it in full sun with steady moisture and rich soil. Harvest frequently at two to three inches across to encourage continuous fruiting.",
  },

  {
    name: "Delicata Squash",
    type: "Vegetable",
    image: "delicatasquash",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Delicata is a sweet winter squash with edible thin skin, grown on compact vines in full sun. It stores less long than thick-skinned types, so use it sooner. Harvest when the cream-and-green stripes deepen and the rind hardens.",
  },

  {
    name: "Kabocha Squash",
    type: "Vegetable",
    image: "kabochasquash",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Kabocha is a sweet Japanese winter squash with dense flesh. It needs full sun, rich soil, and a long warm season on sprawling vines. Harvest when the stem corks and the skin hardens, then cure to deepen the sweetness.",
  },

  {
    name: "Gourd",
    type: "Vegetable",
    image: "gourd",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Ornamental and hard-shell gourds grow on long vigorous vines in full sun and warm soil. Give them a trellis for cleaner, better-shaped fruit. Leave them on the vine until fully mature, then dry thoroughly for crafts.",
  },

  {
    name: "Luffa",
    type: "Vegetable",
    image: "luffa",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Luffa is a long-season vining gourd that becomes a natural sponge when mature. It needs full sun, warm soil, and a sturdy trellis. Eat fruits young like squash, or leave them to dry on the vine for sponges.",
  },

  {
    name: "Tomatillo",
    type: "Vegetable",
    image: "tomatillo",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Tomatillos grow inside papery husks and need full sun and warm weather like their tomato cousins. Plant at least two for good pollination. Harvest when the fruit fills and splits the husk for the best tangy flavor.",
  },

  // ─── FRUITS: Tree (14) ────────────────────────────────────
  {
    name: "Nectarine",
    type: "Fruit",
    image: "nectarine",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [2, 3, 4],
    notes:
      "Nectarines are smooth-skinned peaches that need full sun, well-drained soil, and winter chill to fruit well. Thin young fruit for larger, sweeter harvests. Prune yearly for airflow and to reduce disease pressure.",
  },

  {
    name: "Persimmon",
    type: "Fruit",
    image: "persimmon",
    minZone: "6a",
    maxZone: "10b",
    plantMonths: [2, 3, 4],
    notes:
      "Persimmons are hardy, low-maintenance trees producing bright fall fruit. They like full sun and well-drained soil. Astringent varieties must soften fully before eating, while non-astringent types can be eaten firm.",
  },

  {
    name: "Guava",
    type: "Fruit",
    image: "guava",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Guava is a fast-growing tropical tree that fruits young and loves full sun, warmth, and regular water. It is frost-sensitive, so protect it in cooler zones or grow in a pot. Harvest when fruits soften and turn fragrant.",
  },

  {
    name: "Papaya",
    type: "Fruit",
    image: "papaya",
    minZone: "9b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Papaya grows quickly into a tall, fast-fruiting tropical plant that needs full sun, warmth, and rich, well-drained soil. It is very frost-tender. Harvest when the skin shows mostly yellow for the sweetest fruit.",
  },

  {
    name: "Quince",
    type: "Fruit",
    image: "quince",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [2, 3, 4],
    notes:
      "Quince is a hardy small tree with fragrant, hard fruit best cooked rather than eaten raw. It likes full sun and well-drained soil. Harvest in late fall once fruits turn deep yellow and perfume the air.",
  },

  {
    name: "Date",
    type: "Fruit",
    image: "date",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Date palms thrive in hot, dry climates with full sun and deep occasional watering. They tolerate poor soil and heat that would stress other fruit. Fruiting takes years and usually needs both male and female trees.",
  },

  {
    name: "Olive",
    type: "Fruit",
    image: "olive",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Olive trees are drought-tolerant evergreens that love full sun and well-drained soil. They need a mild winter chill to fruit and dislike soggy roots. Harvest green for a firmer cure or black for a milder, riper flavor.",
  },

  {
    name: "Jackfruit",
    type: "Fruit",
    image: "jackfruit",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Jackfruit is a massive tropical fruit on a large fast-growing tree that needs heat, humidity, and rich soil. It is very frost-sensitive. Harvest when the fruit gives slightly and releases a strong sweet aroma.",
  },

  {
    name: "Lychee",
    type: "Fruit",
    image: "lychee",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Lychee is a subtropical tree producing sweet, fragrant fruit in summer. It needs full sun, humidity, and protection from frost and drying winds. Trees fruit best after several years and a brief cool, dry period.",
  },

  {
    name: "Loquat",
    type: "Fruit",
    image: "loquat",
    minZone: "8a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Loquat is an evergreen tree that flowers in fall and ripens sweet-tart fruit in spring. It likes full sun and well-drained soil and tolerates mild frost. Harvest when fruits turn deep yellow-orange and soften.",
  },

  {
    name: "Mulberry Tree",
    type: "Fruit",
    image: "mulberrytree",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3, 4],
    notes:
      "Mulberry trees are fast-growing and generous, dropping sweet berries over a long season. They handle full sun and a range of soils with little care. The fruit stains easily, so plant away from patios and walkways.",
  },

  {
    name: "Pluot",
    type: "Fruit",
    image: "pluot",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [2, 3, 4],
    notes:
      "Pluots are sweet plum-apricot hybrids that need full sun, well-drained soil, and winter chill. Thin the fruit for size and plant a compatible pollinizer nearby. Harvest when fruits soften slightly and reach full color.",
  },

  {
    name: "Kumquat Tree",
    type: "Fruit",
    image: "kumquattree",
    minZone: "8b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Kumquat trees are compact, cold-hardy citrus that produce small fruit eaten skin and all. They love full sun and well-drained soil and do well in containers. Harvest when fruits turn fully orange for the best balance of sweet and tart.",
  },

  {
    name: "Feijoa",
    type: "Fruit",
    image: "feijoa",
    minZone: "8a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Feijoa, or pineapple guava, is an evergreen shrub with edible flowers and aromatic fall fruit. It likes full sun and tolerates mild frost. Let fruit drop naturally when ripe rather than picking it from the branch.",
  },

  // ─── FRUITS: Citrus (7) ───────────────────────────────────
  {
    name: "Tangerine",
    type: "Fruit",
    image: "tangerine",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Tangerines are easy-peeling citrus that need full sun, well-drained soil, and protection from frost. They fruit well in containers in cooler zones. Harvest when fully colored and slightly soft, as citrus does not sweeten after picking.",
  },

  {
    name: "Clementine",
    type: "Fruit",
    image: "clementine",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Clementines are small, sweet, seedless citrus that love full sun and steady moisture with good drainage. They are frost-sensitive and thrive in pots where winters are cold. Harvest when deep orange and fully ripe.",
  },

  {
    name: "Kumquat",
    type: "Fruit",
    image: "kumquat",
    minZone: "8b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Kumquats are tiny citrus eaten whole, skin included, with a sweet rind and tart flesh. The plants are compact and among the most cold-hardy citrus. Give them full sun and harvest fruit when fully orange.",
  },

  {
    name: "Blood Orange",
    type: "Fruit",
    image: "bloodorange",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Blood oranges develop their crimson flesh best where days are warm and nights are cool. They need full sun, good drainage, and frost protection. Leave fruit on the tree to deepen color and flavor before harvesting.",
  },

  {
    name: "Yuzu",
    type: "Fruit",
    image: "yuzu",
    minZone: "8a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Yuzu is an aromatic, cold-hardy citrus prized for its fragrant zest and juice. It tolerates more frost than most citrus and likes full sun. Harvest when fruit turns yellow, using both the peel and juice in cooking.",
  },

  {
    name: "Bergamot",
    type: "Fruit",
    image: "bergamot",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Bergamot orange is grown mainly for its fragrant peel, famous for flavoring Earl Grey tea. It needs full sun, well-drained soil, and frost protection. Harvest when the fruit turns yellow and the rind is highly aromatic.",
  },

  {
    name: "Calamansi",
    type: "Fruit",
    image: "calamansi",
    minZone: "9b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Calamansi is a small, tart Philippine citrus that fruits heavily and grows well in containers. It loves full sun, warmth, and steady moisture with good drainage. Harvest green or ripe orange, both intensely flavorful.",
  },

  // ─── FRUITS: Tropical & Vine (10) ─────────────────────────
  {
    name: "Pineapple",
    type: "Fruit",
    image: "pineapple",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Pineapple grows from a leafy crown in full sun with warm temperatures and well-drained soil. It fruits after a year or more and does well in containers indoors in cold climates. Harvest when the fruit turns golden and fragrant.",
  },

  {
    name: "Kiwi",
    type: "Fruit",
    image: "kiwi",
    minZone: "7a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Kiwi vines are vigorous climbers that need a strong trellis, full sun, and usually both male and female plants to fruit. Give them rich, well-drained soil. Fruit ripens in fall and sweetens off the vine after picking.",
  },

  {
    name: "Passionfruit",
    type: "Fruit",
    image: "passionfruit",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Passionfruit is a fast tropical vine with striking flowers and tangy fruit. It needs full sun, a sturdy trellis, and steady water. In cooler zones grow it as an annual or in a container. Harvest fruit once it wrinkles and drops.",
  },

  {
    name: "Dragon Fruit",
    type: "Fruit",
    image: "dragonfruit",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Dragon fruit is a climbing cactus that produces vivid fruit and night-blooming flowers. It needs full sun, warmth, well-drained soil, and a sturdy support. Some varieties need hand-pollination for reliable fruit set.",
  },

  {
    name: "Starfruit",
    type: "Fruit",
    image: "starfruit",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Starfruit, or carambola, is a tropical tree with juicy ribbed fruit that slices into stars. It needs full sun, warmth, and consistent moisture, and is frost-sensitive. Harvest when the ribs turn golden and slightly brown-edged.",
  },

  {
    name: "Coconut",
    type: "Fruit",
    image: "coconut",
    minZone: "10b",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Coconut palms need constant heat, humidity, full sun, and sandy well-drained soil. They only thrive in truly tropical, frost-free climates. Grown mostly along coasts, they take years to bear fruit and reward patience.",
  },

  {
    name: "Cape Gooseberry",
    type: "Fruit",
    image: "capegooseberry",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Cape gooseberry, or ground cherry, produces sweet-tart fruit inside papery husks. It grows like a tomato in full sun with warm soil. Fruit is ripe when the husk browns and the berry drops to the ground.",
  },

  {
    name: "Rambutan",
    type: "Fruit",
    image: "rambutan",
    minZone: "10b",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Rambutan is a tropical tree bearing sweet, hairy-skinned fruit related to lychee. It demands high heat, humidity, and rich, moist soil, with no tolerance for frost. Harvest when the skin turns bright red and the spines soften.",
  },

  {
    name: "Longan",
    type: "Fruit",
    image: "longan",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Longan is a subtropical relative of lychee producing clusters of sweet, translucent fruit. It likes full sun, warmth, and well-drained soil and tolerates brief cool spells. Harvest when the tan skin is firm and full.",
  },

  {
    name: "Tamarind",
    type: "Fruit",
    image: "tamarind",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Tamarind is a large tropical tree yielding tangy-sweet pods used in cooking. It thrives in heat and full sun and tolerates drought once established. Pods are ready when brown and brittle and the pulp turns sticky.",
  },

  // ─── MELONS (6) ───────────────────────────────────────────
  {
    name: "Cantaloupe",
    type: "Fruit",
    image: "cantaloupe",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Cantaloupe needs full sun, warm soil, and a long hot season to develop sweet fruit. Give vines room to sprawl and water steadily until fruit sizes up, then ease off. Harvest when the stem slips easily and the netting turns tan.",
  },

  {
    name: "Casaba Melon",
    type: "Fruit",
    image: "casabamelon",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Casaba is a wrinkled, late-season melon with sweet pale flesh. It needs a long, hot, dry finish to ripen well in full sun. Harvest when the rind turns golden yellow, since casabas do not slip from the vine like cantaloupes.",
  },

  {
    name: "Crenshaw Melon",
    type: "Fruit",
    image: "crenshawmelon",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Crenshaw melons are large and fragrant with sweet salmon-colored flesh. They need full sun, heat, and a long season on sprawling vines. Harvest when the blossom end softens and the aroma turns rich and sweet.",
  },

  {
    name: "Bitter Melon",
    type: "Vegetable",
    image: "bittermelon",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Bitter melon is a warm-season climbing vine grown for its distinctive bitter fruit. It needs full sun, heat, and a trellis to climb. Harvest young and light green for milder flavor, before the fruit turns yellow and splits.",
  },

  {
    name: "Winter Melon",
    type: "Vegetable",
    image: "wintermelon",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Winter melon is a large vining gourd that stores for months thanks to its waxy skin. It needs full sun, heat, and plenty of space. Harvest mature fruit once the skin develops its powdery white coating.",
  },

  {
    name: "Galia Melon",
    type: "Fruit",
    image: "galiamelon",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Galia is an aromatic melon with netted skin and sweet green flesh. It thrives in full sun with warm soil and steady water while fruit develops. Harvest when the rind turns golden and the fruit slips easily from the vine.",
  },

  // ─── BERRIES (7) ──────────────────────────────────────────
  {
    name: "Huckleberry",
    type: "Fruit",
    image: "huckleberry",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Huckleberries are cousins of blueberries that favor acidic, well-drained soil and partial shade. They can be slow to establish but reward patience with tart-sweet fruit. Harvest when berries are deep blue-purple and come off easily.",
  },

  {
    name: "Lingonberry",
    type: "Fruit",
    image: "lingonberry",
    minZone: "2a",
    maxZone: "7b",
    plantMonths: [4, 5, 6],
    notes:
      "Lingonberry is a low, cold-hardy evergreen shrub that produces tart red berries. It needs acidic, moist, well-drained soil and full sun to partial shade. It makes an attractive groundcover and fruits twice a season in good conditions.",
  },

  {
    name: "Salmonberry",
    type: "Fruit",
    image: "salmonberry",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Salmonberry is a Pacific Northwest native producing golden to red berries in early summer. It likes moist soil and partial shade, mimicking its woodland home. It spreads by suckers, so give it space or contain the roots.",
  },

  {
    name: "Aronia",
    type: "Fruit",
    image: "aronia",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Aronia, or chokeberry, is a tough native shrub loaded with antioxidant-rich fruit. It tolerates a wide range of soils, full sun to part shade, and cold winters. Harvest the dark berries in late summer once fully ripe and softened.",
  },

  {
    name: "Goji Berry",
    type: "Fruit",
    image: "gojiberry",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Goji berry is a hardy, adaptable shrub that fruits heavily in full sun with well-drained soil. It tolerates poor soil and drought once established. Harvest bright red berries when fully colored, handling gently as they bruise easily.",
  },

  {
    name: "Barberry",
    type: "Fruit",
    image: "barberry",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Barberry is a thorny, drought-tolerant shrub whose tart red berries are used in cooking. It thrives in full sun and a range of soils and is very low maintenance. Harvest the berries in fall once they turn deep red.",
  },
  {
    name: "Ackee",
    type: "Fruit",
    image: "ackee",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Ackee is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Adzuki Bean",
    type: "Vegetable",
    image: "adzukibean",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Adzuki Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Agapanthus",
    type: "Flower",
    image: "agapanthus",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Agapanthus is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Agave",
    type: "Houseplant",
    image: "agave",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Agave is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Almond",
    type: "Nut",
    image: "almond",
    minZone: "7a",
    maxZone: "9b",
    plantMonths: [1, 2],
    notes:
      "Almond is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Alocasia",
    type: "Houseplant",
    image: "alocasia",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Alocasia is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Aloe Vera",
    type: "Houseplant",
    image: "aloevera",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Aloe Vera is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Amaranth",
    type: "Vegetable",
    image: "amaranth",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Amaranth grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 50 days.",
  },
  {
    name: "Amaryllis",
    type: "Flower",
    image: "amaryllis",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [10, 11],
    notes:
      "Amaryllis is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Anaheim Pepper",
    type: "Vegetable",
    image: "anaheimpepper",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Anaheim Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 80 days.",
  },
  {
    name: "Anemone",
    type: "Flower",
    image: "anemone",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [9, 10],
    notes:
      "Anemone is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Areca Palm",
    type: "Houseplant",
    image: "arecapalm",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Areca Palm is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Arrowroot",
    type: "Vegetable",
    image: "arrowroot",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Arrowroot grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 300 days.",
  },
  {
    name: "Ash Gourd",
    type: "Vegetable",
    image: "ashgourd",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Ash Gourd grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Aster",
    type: "Flower",
    image: "aster",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Aster is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Atemoya",
    type: "Fruit",
    image: "atemoya",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Atemoya is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Barley",
    type: "Grain",
    image: "barley",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4],
    notes:
      "Barley is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Bay Tree",
    type: "Herb",
    image: "baytree",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Bay Tree is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Bee Balm",
    type: "Flower",
    image: "beebalm",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Bee Balm is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Beefsteak Tomato",
    type: "Vegetable",
    image: "beefsteaktomato",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Beefsteak Tomato grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 85 days.",
  },
  {
    name: "Bilberry",
    type: "Berry",
    image: "bilberry",
    minZone: "3a",
    maxZone: "7b",
    plantMonths: [3, 4, 5],
    notes:
      "Bilberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Bird of Paradise",
    type: "Houseplant",
    image: "birdofparadise",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Bird of Paradise is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Bird's Nest Fern",
    type: "Houseplant",
    image: "birdsnestfern",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Bird's Nest Fern is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Black Currant",
    type: "Berry",
    image: "blackcurrant",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [2, 3],
    notes:
      "Black Currant is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Black-Eyed Pea",
    type: "Vegetable",
    image: "blackeyedpea",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Black-Eyed Pea grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Black-Eyed Susan",
    type: "Flower",
    image: "blackeyedsusan",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Black-Eyed Susan is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Black Sapote",
    type: "Fruit",
    image: "blacksapote",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Black Sapote is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Boston Fern",
    type: "Houseplant",
    image: "bostonfern",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Boston Fern is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Bottle Gourd",
    type: "Vegetable",
    image: "bottlegourd",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Bottle Gourd grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Thornless Boysenberry",
    type: "Berry",
    image: "boysenthorn",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Thornless Boysenberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Breadfruit",
    type: "Fruit",
    image: "breadfruit",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Breadfruit is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Buckwheat",
    type: "Grain",
    image: "buckwheat",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5, 6],
    notes:
      "Buckwheat is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Buddha's Hand",
    type: "Fruit Tree",
    image: "buddhashand",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Buddha's Hand is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Burro's Tail",
    type: "Houseplant",
    image: "burrostail",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Burro's Tail is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Calamondin",
    type: "Fruit Tree",
    image: "calamondin",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Calamondin is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Calathea",
    type: "Houseplant",
    image: "calathea",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Calathea is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Calendula",
    type: "Flower",
    image: "calendula",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Calendula is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Camellia",
    type: "Flower",
    image: "camellia",
    minZone: "7a",
    maxZone: "10b",
    plantMonths: [9, 10],
    notes:
      "Camellia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Canistel",
    type: "Fruit",
    image: "canistel",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Canistel is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Cannellini Bean",
    type: "Vegetable",
    image: "cannellinibean",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Cannellini Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Cardoon",
    type: "Vegetable",
    image: "cardoon",
    minZone: "7a",
    maxZone: "10b",
    plantMonths: [3, 4],
    notes:
      "Cardoon grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Cashew",
    type: "Nut",
    image: "cashew",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Cashew is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Cassava",
    type: "Vegetable",
    image: "cassava",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Cassava grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 300 days.",
  },
  {
    name: "Celtuce",
    type: "Vegetable",
    image: "celtuce",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Celtuce grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 80 days.",
  },
  {
    name: "Chayote",
    type: "Vegetable",
    image: "chayote",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Chayote grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Cherry Tomato",
    type: "Vegetable",
    image: "cherrytomato",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Cherry Tomato grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 65 days.",
  },
  {
    name: "Chestnut",
    type: "Nut",
    image: "chestnut",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [2, 3],
    notes:
      "Chestnut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Chinese Evergreen",
    type: "Houseplant",
    image: "chineseevergreen",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Chinese Evergreen is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Chinese Yam",
    type: "Vegetable",
    image: "chineseyam",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [4, 5],
    notes:
      "Chinese Yam grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 180 days.",
  },
  {
    name: "Christmas Cactus",
    type: "Houseplant",
    image: "christmascactus",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Christmas Cactus is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Cloudberry",
    type: "Berry",
    image: "cloudberry",
    minZone: "2a",
    maxZone: "6b",
    plantMonths: [3, 4, 5],
    notes:
      "Cloudberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Coleus",
    type: "Houseplant",
    image: "coleus",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Coleus is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Coneflower",
    type: "Flower",
    image: "coneflower",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Coneflower is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Coreopsis",
    type: "Flower",
    image: "coreopsis",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Coreopsis is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Cosmos",
    type: "Flower",
    image: "cosmos",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Cosmos is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Cowpea",
    type: "Vegetable",
    image: "cowpea",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Cowpea grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 80 days.",
  },
  {
    name: "Crocus",
    type: "Flower",
    image: "crocus",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Crocus is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Cubanelle Pepper",
    type: "Vegetable",
    image: "cubanellepepper",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Cubanelle Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 70 days.",
  },
  {
    name: "Culantro",
    type: "Herb",
    image: "culantro",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Culantro thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.",
  },
  {
    name: "Curry Leaf",
    type: "Herb",
    image: "curryleaf",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Curry Leaf is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Custard Apple",
    type: "Fruit",
    image: "custardapple",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Custard Apple is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Cyclamen",
    type: "Flower",
    image: "cyclamen",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [9, 10],
    notes:
      "Cyclamen is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Daffodil",
    type: "Flower",
    image: "daffodil",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [9, 10, 11],
    notes:
      "Daffodil is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Dahlia",
    type: "Flower",
    image: "dahlia",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4],
    notes:
      "Dahlia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Delphinium",
    type: "Flower",
    image: "delphinium",
    minZone: "3a",
    maxZone: "7b",
    plantMonths: [3, 4, 5],
    notes:
      "Delphinium is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Dewberry",
    type: "Berry",
    image: "dewberry",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Dewberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Dieffenbachia",
    type: "Houseplant",
    image: "dieffenbachia",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Dieffenbachia is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Durian",
    type: "Fruit",
    image: "durian",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Durian is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Echeveria",
    type: "Houseplant",
    image: "echeveria",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Echeveria is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Black Elderberry",
    type: "Berry",
    image: "elderberryblack",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Black Elderberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Elephant Ear",
    type: "Houseplant",
    image: "elephantear",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Elephant Ear is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Epazote",
    type: "Herb",
    image: "epazote",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Epazote thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.",
  },
  {
    name: "Fern",
    type: "Houseplant",
    image: "fern",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Fern is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Fiddle Leaf Fig",
    type: "Houseplant",
    image: "fiddleleaffig",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Fiddle Leaf Fig is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Finger Lime",
    type: "Fruit Tree",
    image: "fingerlime",
    minZone: "9b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Finger Lime is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Foxglove",
    type: "Flower",
    image: "foxglove",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5, 6],
    notes:
      "Foxglove is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Freesia",
    type: "Flower",
    image: "freesia",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [9, 10],
    notes:
      "Freesia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Fuchsia",
    type: "Flower",
    image: "fuchsia",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Fuchsia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Chinese Broccoli (Gai Lan)",
    type: "Vegetable",
    image: "gailan",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Chinese Broccoli (Gai Lan) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 60 days.",
  },
  {
    name: "Gaillardia",
    type: "Flower",
    image: "gaillardia",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Gaillardia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Gardenia",
    type: "Flower",
    image: "gardenia",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Gardenia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Geranium",
    type: "Flower",
    image: "geranium",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Geranium is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Gladiolus",
    type: "Flower",
    image: "gladiolus",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4],
    notes:
      "Gladiolus is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Honeyberry (Haskap)",
    type: "Berry",
    image: "haskap",
    minZone: "2a",
    maxZone: "7b",
    plantMonths: [3, 4, 5],
    notes:
      "Honeyberry (Haskap) is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Hazelnut",
    type: "Nut",
    image: "hazelnut",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [2, 3],
    notes:
      "Hazelnut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Heirloom Tomato",
    type: "Vegetable",
    image: "heirloomtomato",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Heirloom Tomato grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 80 days.",
  },
  {
    name: "Hellebore",
    type: "Flower",
    image: "hellebore",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [9, 10],
    notes:
      "Hellebore is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Hens and Chicks",
    type: "Houseplant",
    image: "hensandchicks",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Hens and Chicks is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Hibiscus",
    type: "Flower",
    image: "hibiscus",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Hibiscus is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Hollyhock",
    type: "Flower",
    image: "hollyhock",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [5, 6],
    notes:
      "Hollyhock is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Hosta",
    type: "Flower",
    image: "hosta",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Hosta is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Hyacinth",
    type: "Flower",
    image: "hyacinth",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [9, 10, 11],
    notes:
      "Hyacinth is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Hydrangea",
    type: "Flower",
    image: "hydrangea",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Hydrangea is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Impatiens",
    type: "Flower",
    image: "impatiens",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Impatiens is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Iris",
    type: "Flower",
    image: "iris",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [8, 9],
    notes:
      "Iris is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Jabuticaba",
    type: "Fruit",
    image: "jabuticaba",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Jabuticaba is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Jade Plant",
    type: "Houseplant",
    image: "jadeplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Jade Plant is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Jasmine",
    type: "Flower",
    image: "jasmine",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Jasmine is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "June Plum",
    type: "Fruit",
    image: "juneplum",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "June Plum is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Water Spinach (Kangkong)",
    type: "Vegetable",
    image: "kangkong",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Water Spinach (Kangkong) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 50 days.",
  },
  {
    name: "Kentia Palm",
    type: "Houseplant",
    image: "kentiapalm",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Kentia Palm is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Key Lime",
    type: "Fruit Tree",
    image: "keylime",
    minZone: "9b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Key Lime is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Kidney Bean",
    type: "Vegetable",
    image: "kidneybean",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Kidney Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Komatsuna",
    type: "Vegetable",
    image: "komatsuna",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Komatsuna grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 40 days.",
  },
  {
    name: "Larkspur",
    type: "Flower",
    image: "larkspur",
    minZone: "2a",
    maxZone: "9b",
    plantMonths: [9, 10, 3],
    notes:
      "Larkspur is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Lavatera",
    type: "Flower",
    image: "lavatera",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Lavatera is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Lemon Balm",
    type: "Herb",
    image: "lemonbalm",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Lemon Balm is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Lilac",
    type: "Flower",
    image: "lilac",
    minZone: "3a",
    maxZone: "7b",
    plantMonths: [9, 10],
    notes:
      "Lilac is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Lily",
    type: "Flower",
    image: "lily",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 10],
    notes:
      "Lily is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Lobelia",
    type: "Flower",
    image: "lobella",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Lobelia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Longkong (Langsat)",
    type: "Fruit",
    image: "longkong",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Longkong (Langsat) is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Lotus Root",
    type: "Vegetable",
    image: "lotusroot",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [4, 5],
    notes:
      "Lotus Root grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Lupini Bean",
    type: "Vegetable",
    image: "lupin",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [4, 5],
    notes:
      "Lupini Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Lupine",
    type: "Flower",
    image: "lupineflower",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Lupine is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Macadamia",
    type: "Nut",
    image: "macadamia",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4],
    notes:
      "Macadamia is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Maidenhair Fern",
    type: "Houseplant",
    image: "maidenhairfern",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Maidenhair Fern is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Malabar Spinach",
    type: "Vegetable",
    image: "malabarspinach",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Malabar Spinach grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 55 days.",
  },
  {
    name: "Mangosteen",
    type: "Fruit",
    image: "mangosteen",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Mangosteen is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Meyer Lemon",
    type: "Fruit Tree",
    image: "meyerlemon",
    minZone: "8b",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Meyer Lemon is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Millet",
    type: "Grain",
    image: "millet",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Millet is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Miracle Fruit",
    type: "Fruit",
    image: "miraclefruit",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Miracle Fruit is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Mizuna",
    type: "Vegetable",
    image: "mizuna",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Mizuna grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 40 days.",
  },
  {
    name: "Monstera",
    type: "Houseplant",
    image: "monstera",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Monstera is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Drumstick Tree (Moringa)",
    type: "Vegetable",
    image: "moringa",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Drumstick Tree (Moringa) is a productive perennial in frost-free climates, grown for its edible leaves, pods or roots. Give it full sun and harvest regularly once it establishes.",
  },
  {
    name: "Red Mulberry",
    type: "Berry",
    image: "mulberryred",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Red Mulberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "White Mulberry",
    type: "Berry",
    image: "mulberrywhite",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "White Mulberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Mung Bean",
    type: "Vegetable",
    image: "mungbean",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Mung Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Mustard Spinach",
    type: "Vegetable",
    image: "mustardspinach",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Mustard Spinach grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 40 days.",
  },
  {
    name: "Nasturtium",
    type: "Flower",
    image: "nasturtium",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Nasturtium is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Navy Bean",
    type: "Vegetable",
    image: "navybean",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Navy Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "New Zealand Spinach",
    type: "Vegetable",
    image: "newzealandspinach",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "New Zealand Spinach grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 55 days.",
  },
  {
    name: "Oats",
    type: "Grain",
    image: "oats",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4],
    notes:
      "Oats is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Red Okra",
    type: "Vegetable",
    image: "okrared",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Red Okra grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 55 days.",
  },
  {
    name: "Orchid",
    type: "Flower",
    image: "orchid",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [3, 4, 5],
    notes:
      "Orchid is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Pansy",
    type: "Flower",
    image: "pansy",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 9],
    notes:
      "Pansy is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Parlor Palm",
    type: "Houseplant",
    image: "parlorpalm",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Parlor Palm is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Pecan",
    type: "Nut",
    image: "pecan",
    minZone: "6a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Pecan is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Peony",
    type: "Flower",
    image: "peony",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Peony is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Peppermint",
    type: "Herb",
    image: "peppermint",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Peppermint is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Petunia",
    type: "Flower",
    image: "petunia",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Petunia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Philodendron",
    type: "Houseplant",
    image: "philodendron",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Philodendron is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Phlox",
    type: "Flower",
    image: "phlox",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Phlox is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Pigeon Pea",
    type: "Vegetable",
    image: "pigeonpea",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Pigeon Pea grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Pimento Pepper",
    type: "Vegetable",
    image: "pimentopepper",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Pimento Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 75 days.",
  },
  {
    name: "Pistachio",
    type: "Nut",
    image: "pistachio",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [2, 3],
    notes:
      "Pistachio is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Pomelo",
    type: "Fruit Tree",
    image: "pomelo",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Pomelo is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Pothos",
    type: "Houseplant",
    image: "pothos",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Pothos is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Prayer Plant",
    type: "Houseplant",
    image: "prayerplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Prayer Plant is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Purslane",
    type: "Vegetable",
    image: "purslane",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Purslane grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 40 days.",
  },
  {
    name: "Quinoa",
    type: "Grain",
    image: "quinoa",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [4, 5],
    notes:
      "Quinoa is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Ranunculus",
    type: "Flower",
    image: "ranunculus",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [9, 10],
    notes:
      "Ranunculus is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Red Currant",
    type: "Berry",
    image: "redcurrant",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [2, 3],
    notes:
      "Red Currant is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Rice",
    type: "Grain",
    image: "rice",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Rice is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Ridge Gourd",
    type: "Vegetable",
    image: "ridgegourd",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Ridge Gourd grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Romanesco",
    type: "Vegetable",
    image: "romanesco",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 7],
    notes:
      "Romanesco grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Roma Tomato",
    type: "Vegetable",
    image: "romatomato",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Roma Tomato grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 75 days.",
  },
  {
    name: "Rose",
    type: "Flower",
    image: "rose",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Rose is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Rose Apple",
    type: "Fruit",
    image: "roseapple",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Rose Apple is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Rye",
    type: "Grain",
    image: "rye",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Rye is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "San Marzano Tomato",
    type: "Vegetable",
    image: "sanmarzanotomato",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "San Marzano Tomato grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 80 days.",
  },
  {
    name: "Santol",
    type: "Fruit",
    image: "santol",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Santol is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Scabiosa",
    type: "Flower",
    image: "scabiosa",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Scabiosa is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Scotch Bonnet Pepper",
    type: "Vegetable",
    image: "scotchbonnetpepper",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Scotch Bonnet Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Sea Buckthorn",
    type: "Berry",
    image: "seabuckthorn",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Sea Buckthorn is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Sedum",
    type: "Flower",
    image: "sedum",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Sedum is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Shishito Pepper",
    type: "Vegetable",
    image: "shishitopepper",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Shishito Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 60 days.",
  },
  {
    name: "Shiso",
    type: "Herb",
    image: "shiso",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Shiso thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.",
  },
  {
    name: "Salak (Snake Fruit)",
    type: "Fruit",
    image: "snakefruit",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Salak (Snake Fruit) is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Snake Gourd",
    type: "Vegetable",
    image: "snakegourd",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Snake Gourd grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Snake Plant",
    type: "Houseplant",
    image: "snakeplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Snake Plant is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Snapdragon",
    type: "Flower",
    image: "snapdragon",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Snapdragon is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Sorghum",
    type: "Grain",
    image: "sorghum",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Sorghum is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Soursop",
    type: "Fruit",
    image: "soursop",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Soursop is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Spearmint",
    type: "Herb",
    image: "spearmint",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Spearmint is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Spider Plant",
    type: "Houseplant",
    image: "spiderplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Spider Plant is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Star Apple",
    type: "Fruit",
    image: "starapple",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Star Apple is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Stock",
    type: "Flower",
    image: "stock",
    minZone: "2a",
    maxZone: "8b",
    plantMonths: [3, 4, 9],
    notes:
      "Stock is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "String of Pearls",
    type: "Houseplant",
    image: "stringofpearls",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "String of Pearls is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Sudachi",
    type: "Fruit Tree",
    image: "sudachi",
    minZone: "8b",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Sudachi is an evergreen citrus that loves full sun and well-drained soil. Protect it from frost, water deeply and feed regularly, and harvest the fruit once it is fully colored.",
  },
  {
    name: "Sugar Apple",
    type: "Fruit",
    image: "sugarapple",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Sugar Apple is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Sunflower",
    type: "Flower",
    image: "sunflower",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Sunflower is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Sweet Alyssum",
    type: "Flower",
    image: "sweetalyssum",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Sweet Alyssum is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Sweet Pea",
    type: "Flower",
    image: "sweetpea",
    minZone: "2a",
    maxZone: "8b",
    plantMonths: [2, 3, 4],
    notes:
      "Sweet Pea is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Taro",
    type: "Vegetable",
    image: "taro",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Taro grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 200 days.",
  },
  {
    name: "Tatsoi",
    type: "Vegetable",
    image: "tatsoi",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Tatsoi grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 45 days.",
  },
  {
    name: "Thai Chili Pepper",
    type: "Vegetable",
    image: "thaichilipepper",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Thai Chili Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Tulip",
    type: "Flower",
    image: "tulip",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [9, 10, 11],
    notes:
      "Tulip is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Holy Basil (Tulsi)",
    type: "Herb",
    image: "tulsi",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Holy Basil (Tulsi) thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.",
  },
  {
    name: "Verbena",
    type: "Flower",
    image: "verbena",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Verbena is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Vietnamese Coriander",
    type: "Herb",
    image: "vietnamesecoriander",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Vietnamese Coriander is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Viola",
    type: "Flower",
    image: "viola",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 9],
    notes:
      "Viola is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Walnut",
    type: "Nut",
    image: "walnut",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Walnut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Wasabi",
    type: "Vegetable",
    image: "wasabi",
    minZone: "7a",
    maxZone: "10b",
    plantMonths: [4, 5],
    notes:
      "Wasabi grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 540 days.",
  },
  {
    name: "Water Chestnut",
    type: "Vegetable",
    image: "waterchestnut",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Water Chestnut grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 220 days.",
  },
  {
    name: "Wax Apple",
    type: "Fruit",
    image: "waxapple",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Wax Apple is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Wheat",
    type: "Grain",
    image: "wheat",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Wheat is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "White Currant",
    type: "Berry",
    image: "whitecurrant",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [2, 3],
    notes:
      "White Currant is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "White Sapote",
    type: "Fruit",
    image: "whitesapote",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "White Sapote is a tropical tree that needs heat, humidity and protection from any frost. Grow it in full sun and harvest the fruit as it softens and colors up.",
  },
  {
    name: "Wineberry",
    type: "Berry",
    image: "wineberry",
    minZone: "5a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Wineberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Winter Savory",
    type: "Herb",
    image: "wintersavory",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [4, 5],
    notes:
      "Winter Savory is a perennial herb for full sun and well-drained soil. Trim it regularly to keep it bushy and harvest the leaves as you need them.",
  },
  {
    name: "Yam",
    type: "Vegetable",
    image: "yam",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Yam grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 180 days.",
  },
  {
    name: "Yarrow",
    type: "Flower",
    image: "yarrow",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Yarrow is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Yucca",
    type: "Houseplant",
    image: "yucca",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Yucca is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Zinnia",
    type: "Flower",
    image: "zinnia",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Zinnia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "ZZ Plant",
    type: "Houseplant",
    image: "zzplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "ZZ Plant is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Snow Pea",
    type: "Vegetable",
    image: "snowpea",
    minZone: "2a",
    maxZone: "9b",
    plantMonths: [3, 4, 8],
    notes:
      "Snow Pea grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 60 days.",
  },
  {
    name: "Yardlong Bean",
    type: "Vegetable",
    image: "yardlongbean",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Yardlong Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 75 days.",
  },
  {
    name: "Winged Bean",
    type: "Vegetable",
    image: "wingedbean",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [5, 6],
    notes:
      "Winged Bean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Cluster Bean (Guar)",
    type: "Vegetable",
    image: "clusterbean",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Cluster Bean (Guar) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Ivy Gourd (Tindora)",
    type: "Vegetable",
    image: "ivygourd",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Ivy Gourd (Tindora) is a productive perennial in frost-free climates, grown for its edible leaves, pods or roots. Give it full sun and harvest regularly once it establishes.",
  },
  {
    name: "Pointed Gourd (Parwal)",
    type: "Vegetable",
    image: "pointedgourd",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Pointed Gourd (Parwal) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Broccoli Rabe (Rapini)",
    type: "Vegetable",
    image: "broccolirabe",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Broccoli Rabe (Rapini) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 45 days.",
  },
  {
    name: "Broccolini",
    type: "Vegetable",
    image: "broccolini",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 7],
    notes:
      "Broccolini grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 60 days.",
  },
  {
    name: "Choy Sum",
    type: "Vegetable",
    image: "choysum",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Choy Sum grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 45 days.",
  },
  {
    name: "Yu Choy",
    type: "Vegetable",
    image: "yuchoy",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Yu Choy grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 45 days.",
  },
  {
    name: "Molokhia (Jute Mallow)",
    type: "Vegetable",
    image: "molokhia",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Molokhia (Jute Mallow) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 60 days.",
  },
  {
    name: "Roselle",
    type: "Vegetable",
    image: "roselle",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Roselle grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 120 days.",
  },
  {
    name: "Chinese Celery",
    type: "Vegetable",
    image: "chinesecelery",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [3, 8],
    notes:
      "Chinese Celery grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 70 days.",
  },
  {
    name: "Garlic Chives",
    type: "Herb",
    image: "garlicchives",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Garlic Chives is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Bamboo Shoot",
    type: "Vegetable",
    image: "bambooshoot",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Bamboo Shoot is a productive perennial in frost-free climates, grown for its edible leaves, pods or roots. Give it full sun and harvest regularly once it establishes.",
  },
  {
    name: "Nopal (Cactus Pad)",
    type: "Vegetable",
    image: "nopal",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Nopal (Cactus Pad) is a productive perennial in frost-free climates, grown for its edible leaves, pods or roots. Give it full sun and harvest regularly once it establishes.",
  },
  {
    name: "Samphire (Sea Bean)",
    type: "Vegetable",
    image: "samphire",
    minZone: "6a",
    maxZone: "10b",
    plantMonths: [4, 5],
    notes:
      "Samphire (Sea Bean) grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 60 days.",
  },
  {
    name: "Dandelion Greens",
    type: "Vegetable",
    image: "dandeliongreens",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 9],
    notes:
      "Dandelion Greens grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 55 days.",
  },
  {
    name: "Plantain",
    type: "Fruit",
    image: "plantain",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Plantain is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Sugar Beet",
    type: "Vegetable",
    image: "sugarbeet",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Sugar Beet grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Carolina Reaper",
    type: "Vegetable",
    image: "carolinareaper",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Carolina Reaper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Bird's Eye Chili",
    type: "Vegetable",
    image: "birdseyechili",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Bird's Eye Chili grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 90 days.",
  },
  {
    name: "Padrón Pepper",
    type: "Vegetable",
    image: "padronpepper",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Padrón Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 75 days.",
  },
  {
    name: "Fresno Pepper",
    type: "Vegetable",
    image: "fresnopepper",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Fresno Pepper grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 80 days.",
  },
  {
    name: "Hungarian Wax",
    type: "Vegetable",
    image: "hungarianwax",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Hungarian Wax grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 70 days.",
  },
  {
    name: "Ají Amarillo",
    type: "Vegetable",
    image: "ajiamarillo",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 6],
    notes:
      "Ají Amarillo grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Cherimoya",
    type: "Fruit",
    image: "cherimoya",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Cherimoya is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Sapodilla (Chikoo)",
    type: "Fruit",
    image: "sapodilla",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Sapodilla (Chikoo) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Mamey Sapote",
    type: "Fruit",
    image: "mameysapote",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Mamey Sapote is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Jujube",
    type: "Fruit Tree",
    image: "jujube",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Jujube is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.",
  },
  {
    name: "Tamarillo (Tree Tomato)",
    type: "Fruit",
    image: "tamarillo",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Tamarillo (Tree Tomato) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Naranjilla (Lulo)",
    type: "Fruit",
    image: "naranjilla",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Naranjilla (Lulo) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Acerola",
    type: "Fruit",
    image: "acerola",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Acerola is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Surinam Cherry",
    type: "Fruit",
    image: "surinamcherry",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Surinam Cherry is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Bilimbi",
    type: "Fruit",
    image: "bilimbi",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Bilimbi is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Bael (Wood Apple)",
    type: "Fruit",
    image: "bael",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Bael (Wood Apple) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Jamun (Java Plum)",
    type: "Fruit",
    image: "jamun",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Jamun (Java Plum) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Mamoncillo (Genip)",
    type: "Fruit",
    image: "mamoncillo",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Mamoncillo (Genip) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Pawpaw (American)",
    type: "Fruit Tree",
    image: "pawpaw",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Pawpaw (American) is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.",
  },
  {
    name: "Serviceberry",
    type: "Berry",
    image: "serviceberry",
    minZone: "2a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Serviceberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Jostaberry",
    type: "Berry",
    image: "jostaberry",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [2, 3],
    notes:
      "Jostaberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Loganberry",
    type: "Berry",
    image: "loganberry",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Loganberry is a hardy perennial that fruits on established plants. Grow it in full sun to part shade in rich, well-drained soil and pick the berries when fully ripe.",
  },
  {
    name: "Hardy Kiwi (Kiwiberry)",
    type: "Fruit",
    image: "hardykiwi",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Hardy Kiwi (Kiwiberry) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Concord Grape",
    type: "Fruit",
    image: "concordgrape",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Concord Grape is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Cornelian Cherry",
    type: "Fruit Tree",
    image: "corneliancherry",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Cornelian Cherry is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.",
  },
  {
    name: "Medlar",
    type: "Fruit Tree",
    image: "medlar",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Medlar is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.",
  },
  {
    name: "Sweet Lime (Mosambi)",
    type: "Fruit Tree",
    image: "sweetlime",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Sweet Lime (Mosambi) is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.",
  },
  {
    name: "Ugli Fruit",
    type: "Fruit Tree",
    image: "uglifruit",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Ugli Fruit is a fruit tree that does best in full sun and well-drained soil. Plant it while dormant, water deeply, and harvest the fruit once it is fully colored and ripe.",
  },
  {
    name: "Sea Grape",
    type: "Fruit",
    image: "seagrape",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Sea Grape is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Gac Fruit",
    type: "Fruit",
    image: "gacfruit",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Gac Fruit is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Noni",
    type: "Fruit",
    image: "noni",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Noni is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Cupuaçu",
    type: "Fruit",
    image: "cupuacu",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Cupuaçu is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Abiu",
    type: "Fruit",
    image: "abiu",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Abiu is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Rollinia",
    type: "Fruit",
    image: "rollinia",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Rollinia is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Chempedak",
    type: "Fruit",
    image: "chempedak",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Chempedak is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Marang",
    type: "Fruit",
    image: "marang",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Marang is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Pulasan",
    type: "Fruit",
    image: "pulasan",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Pulasan is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Che (Melonberry)",
    type: "Fruit",
    image: "che",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Che (Melonberry) is grown for its fruit and loves full sun. Protect it from hard frost where needed, keep it well watered, and harvest when the fruit softens and colors up.",
  },
  {
    name: "Cardamom",
    type: "Herb",
    image: "cardamom",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Cardamom is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Vanilla",
    type: "Herb",
    image: "vanilla",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Vanilla is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Saffron",
    type: "Herb",
    image: "saffron",
    minZone: "6a",
    maxZone: "9b",
    plantMonths: [8, 9],
    notes:
      "Saffron is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Galangal",
    type: "Herb",
    image: "galangal",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Galangal is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Kaffir Lime",
    type: "Herb",
    image: "kaffirlime",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Kaffir Lime is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Lemon Verbena",
    type: "Herb",
    image: "lemonverbena",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Lemon Verbena is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Pandan",
    type: "Herb",
    image: "pandan",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Pandan is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Sichuan Pepper",
    type: "Herb",
    image: "sichuanpepper",
    minZone: "6a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Sichuan Pepper is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Cinnamon",
    type: "Herb",
    image: "cinnamon",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Cinnamon is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Clove",
    type: "Herb",
    image: "clove",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Clove is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Nutmeg",
    type: "Herb",
    image: "nutmeg",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Nutmeg is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Allspice",
    type: "Herb",
    image: "allspice",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Allspice is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Fenugreek (Methi)",
    type: "Herb",
    image: "fenugreek",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4],
    notes:
      "Fenugreek (Methi) thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.",
  },
  {
    name: "Comfrey",
    type: "Herb",
    image: "comfrey",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Comfrey is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Valerian",
    type: "Herb",
    image: "valerian",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Valerian is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Ashwagandha",
    type: "Herb",
    image: "ashwagandha",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Ashwagandha thrives in full sun with well-drained soil. Pinch it back regularly and harvest the leaves as you need them.",
  },
  {
    name: "Gotu Kola",
    type: "Herb",
    image: "gotukola",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Gotu Kola is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Rue",
    type: "Herb",
    image: "rue",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Rue is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Hyssop",
    type: "Herb",
    image: "hyssop",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Hyssop is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Angelica",
    type: "Herb",
    image: "angelica",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Angelica is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Feverfew",
    type: "Herb",
    image: "feverfew",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Feverfew is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Wormwood",
    type: "Herb",
    image: "wormwood",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Wormwood is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Curry Plant",
    type: "Herb",
    image: "curryplant",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Curry Plant is a perennial for full sun and well-drained soil. Trim it regularly and harvest the leaves, roots or spice as you need them.",
  },
  {
    name: "Spelt",
    type: "Grain",
    image: "spelt",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4],
    notes:
      "Spelt is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Teff",
    type: "Grain",
    image: "teff",
    minZone: "5a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Teff is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Farro (Emmer)",
    type: "Grain",
    image: "farro",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [3, 4],
    notes:
      "Farro (Emmer) is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Wild Rice",
    type: "Grain",
    image: "wildrice",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5],
    notes:
      "Wild Rice is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Triticale",
    type: "Grain",
    image: "triticale",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Triticale is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Job's Tears",
    type: "Grain",
    image: "jobstears",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [5, 6],
    notes:
      "Job's Tears is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Popcorn",
    type: "Grain",
    image: "popcorn",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [4, 5],
    notes:
      "Popcorn is a field grain for full sun. Sow into a prepared, weed-free bed and harvest once the seed heads dry and turn golden.",
  },
  {
    name: "Peanut",
    type: "Vegetable",
    image: "peanut",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Peanut grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 130 days.",
  },
  {
    name: "Soybean",
    type: "Vegetable",
    image: "soybean",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Soybean grows best in full sun with rich, well-drained soil and steady watering. Sow it in its season and harvest in roughly 100 days.",
  },
  {
    name: "Brazil Nut",
    type: "Nut",
    image: "brazilnut",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Brazil Nut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Pine Nut",
    type: "Nut",
    image: "pinenut",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Pine Nut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Ginkgo",
    type: "Nut",
    image: "ginkgo",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Ginkgo is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Carob",
    type: "Nut",
    image: "carob",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Carob is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Kola Nut",
    type: "Nut",
    image: "kolanut",
    minZone: "10a",
    maxZone: "12b",
    plantMonths: [4, 5],
    notes:
      "Kola Nut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Black Walnut",
    type: "Nut",
    image: "blackwalnut",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [2, 3],
    notes:
      "Black Walnut is a long-lived nut tree for full sun and deep, well-drained soil. Plant it while dormant, give it room to spread, and expect nuts once it establishes over several years.",
  },
  {
    name: "Chrysanthemum",
    type: "Flower",
    image: "chrysanthemum",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Chrysanthemum is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Carnation",
    type: "Flower",
    image: "carnation",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Carnation is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Gerbera Daisy",
    type: "Flower",
    image: "gerberadaisy",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Gerbera Daisy is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Shasta Daisy",
    type: "Flower",
    image: "shastadaisy",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Shasta Daisy is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Poppy",
    type: "Flower",
    image: "poppy",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 9],
    notes:
      "Poppy is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Begonia",
    type: "Flower",
    image: "begonia",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Begonia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Primrose",
    type: "Flower",
    image: "primrose",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [8, 9],
    notes:
      "Primrose is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Poinsettia",
    type: "Flower",
    image: "poinsettia",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Poinsettia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Bougainvillea",
    type: "Flower",
    image: "bougainvillea",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Bougainvillea is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Wisteria",
    type: "Flower",
    image: "wisteria",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Wisteria is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Clematis",
    type: "Flower",
    image: "clematis",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Clematis is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Morning Glory",
    type: "Flower",
    image: "morningglory",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Morning Glory is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Moonflower",
    type: "Flower",
    image: "moonflower",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Moonflower is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Nigella",
    type: "Flower",
    image: "nigella",
    minZone: "2a",
    maxZone: "9b",
    plantMonths: [3, 9],
    notes:
      "Nigella is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Statice",
    type: "Flower",
    image: "statice",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Statice is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Strawflower",
    type: "Flower",
    image: "strawflower",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Strawflower is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Gomphrena",
    type: "Flower",
    image: "gomphrena",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Gomphrena is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Celosia (Cockscomb)",
    type: "Flower",
    image: "celosia",
    minZone: "2a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Celosia (Cockscomb) is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Sweet William",
    type: "Flower",
    image: "sweetwilliam",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [5, 6],
    notes:
      "Sweet William is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Cornflower",
    type: "Flower",
    image: "cornflower",
    minZone: "2a",
    maxZone: "9b",
    plantMonths: [3, 9],
    notes:
      "Cornflower is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Baby's Breath",
    type: "Flower",
    image: "babysbreath",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Baby's Breath is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Calla Lily",
    type: "Flower",
    image: "callalily",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4],
    notes:
      "Calla Lily is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Canna Lily",
    type: "Flower",
    image: "cannalily",
    minZone: "7a",
    maxZone: "11b",
    plantMonths: [3, 4],
    notes:
      "Canna Lily is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Lily of the Valley",
    type: "Flower",
    image: "lilyofthevalley",
    minZone: "2a",
    maxZone: "7b",
    plantMonths: [9, 10],
    notes:
      "Lily of the Valley is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Forget-Me-Not",
    type: "Flower",
    image: "forgetmenot",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [8, 9],
    notes:
      "Forget-Me-Not is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Columbine",
    type: "Flower",
    image: "columbine",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Columbine is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Bleeding Heart",
    type: "Flower",
    image: "bleedingheart",
    minZone: "2a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Bleeding Heart is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Astilbe",
    type: "Flower",
    image: "astilbe",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4, 5],
    notes:
      "Astilbe is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Snowdrop",
    type: "Flower",
    image: "snowdrop",
    minZone: "3a",
    maxZone: "7b",
    plantMonths: [9, 10],
    notes:
      "Snowdrop is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Bluebell",
    type: "Flower",
    image: "bluebell",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Bluebell is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Portulaca (Moss Rose)",
    type: "Flower",
    image: "portulaca",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Portulaca (Moss Rose) is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Vinca (Periwinkle)",
    type: "Flower",
    image: "vinca",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Vinca (Periwinkle) is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Osteospermum",
    type: "Flower",
    image: "osteospermum",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Osteospermum is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Protea",
    type: "Flower",
    image: "protea",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Protea is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Passion Flower",
    type: "Flower",
    image: "passionflower",
    minZone: "6a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Passion Flower is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Buddleia (Butterfly Bush)",
    type: "Flower",
    image: "buddleia",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Buddleia (Butterfly Bush) is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Azalea",
    type: "Flower",
    image: "azalea",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [9, 10],
    notes:
      "Azalea is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Rhododendron",
    type: "Flower",
    image: "rhododendron",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [9, 10],
    notes:
      "Rhododendron is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Magnolia",
    type: "Flower",
    image: "magnolia",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Magnolia is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Plumeria (Frangipani)",
    type: "Flower",
    image: "plumeria",
    minZone: "9a",
    maxZone: "12b",
    plantMonths: [3, 4, 5],
    notes:
      "Plumeria (Frangipani) is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Cherry Blossom",
    type: "Flower",
    image: "cherryblossom",
    minZone: "5a",
    maxZone: "8b",
    plantMonths: [3, 4],
    notes:
      "Cherry Blossom is grown for its flowers. Give it full sun to part shade and well-drained soil, and deadhead spent blooms to keep the display going through the season.",
  },
  {
    name: "Rubber Plant",
    type: "Houseplant",
    image: "rubberplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Rubber Plant is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Peace Lily",
    type: "Houseplant",
    image: "peacelily",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Peace Lily is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Croton",
    type: "Houseplant",
    image: "croton",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Croton is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "English Ivy",
    type: "Houseplant",
    image: "englishivy",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "English Ivy is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Dracaena",
    type: "Houseplant",
    image: "dracaena",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Dracaena is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Cordyline",
    type: "Houseplant",
    image: "cordyline",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Cordyline is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Pilea (Chinese Money Plant)",
    type: "Houseplant",
    image: "pilea",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Pilea is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "String of Hearts",
    type: "Houseplant",
    image: "stringofhearts",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "String of Hearts is a trailing indoor plant grown for its cascading stems. Give it bright, indirect light, let the soil dry between waterings, and protect it from frost.",
  },
  {
    name: "Hoya (Wax Plant)",
    type: "Houseplant",
    image: "hoya",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Hoya is grown indoors as a foliage plant with thick, waxy leaves. Give it bright, indirect light and let the soil dry well between waterings; protect it from frost.",
  },
  {
    name: "Air Plant (Tillandsia)",
    type: "Houseplant",
    image: "airplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Air Plant needs no soil — mount it or set it in a dish. Give it bright, indirect light and soak or mist it regularly, letting it dry fully between waterings.",
  },
  {
    name: "Nerve Plant (Fittonia)",
    type: "Houseplant",
    image: "nerveplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Nerve Plant is grown indoors for its colorful foliage. Give it bright, indirect light, keep the soil lightly moist with steady humidity, and protect it from frost.",
  },
  {
    name: "Polka Dot Plant",
    type: "Houseplant",
    image: "polkadotplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Polka Dot Plant is grown indoors for its colorful foliage. Give it bright, indirect light, keep the soil lightly moist with steady humidity, and protect it from frost.",
  },
  {
    name: "Inch Plant (Tradescantia)",
    type: "Houseplant",
    image: "inchplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Inch Plant is a trailing indoor plant grown for its cascading stems. Give it bright, indirect light, let the soil dry between waterings, and protect it from frost.",
  },
  {
    name: "Rex Begonia",
    type: "Houseplant",
    image: "rexbegonia",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Rex Begonia is grown indoors for its colorful foliage. Give it bright, indirect light, keep the soil lightly moist with steady humidity, and protect it from frost.",
  },
  {
    name: "Begonia Maculata",
    type: "Houseplant",
    image: "begoniamaculata",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Begonia Maculata is grown indoors for its colorful foliage. Give it bright, indirect light, keep the soil lightly moist with steady humidity, and protect it from frost.",
  },
  {
    name: "Kalanchoe",
    type: "Houseplant",
    image: "kalanchoe",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Kalanchoe is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Haworthia",
    type: "Houseplant",
    image: "haworthia",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Haworthia is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Ponytail Palm",
    type: "Houseplant",
    image: "ponytailpalm",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Ponytail Palm is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Money Tree (Pachira)",
    type: "Houseplant",
    image: "moneytree",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Money Tree is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Norfolk Island Pine",
    type: "Houseplant",
    image: "norfolkpine",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Norfolk Island Pine is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Cast Iron Plant",
    type: "Houseplant",
    image: "castironplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Cast Iron Plant is an easygoing foliage plant that tolerates low light. Let the soil dry between waterings and keep it above freezing — a forgiving indoor grower.",
  },
  {
    name: "Staghorn Fern",
    type: "Houseplant",
    image: "staghornfern",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Staghorn Fern is grown indoors for its foliage. Give it bright, indirect light and steady humidity, keep the soil or mount lightly moist, and protect it from frost.",
  },
  {
    name: "Asparagus Fern",
    type: "Houseplant",
    image: "asparagusfern",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Asparagus Fern is grown indoors for its foliage. Give it bright, indirect light and steady humidity, keep the soil or mount lightly moist, and protect it from frost.",
  },
  {
    name: "Lucky Bamboo",
    type: "Houseplant",
    image: "luckybamboo",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Lucky Bamboo grows in water or soil in bright, indirect light. In water, keep the roots submerged and refresh it every couple of weeks; protect it from frost.",
  },
  {
    name: "Venus Flytrap",
    type: "Houseplant",
    image: "venusflytrap",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Venus Flytrap is a carnivorous bog plant. Give it bright light and nutrient-poor peat and sand, water only with rain or distilled water, and never fertilize it.",
  },
  {
    name: "Pitcher Plant",
    type: "Houseplant",
    image: "pitcherplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Pitcher Plant is a carnivorous bog plant. Give it bright light and nutrient-poor peat and sand, water only with rain or distilled water, and never fertilize it.",
  },
  {
    name: "African Violet",
    type: "Houseplant",
    image: "africanviolet",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "African Violet blooms indoors in bright, indirect light. Water from below to keep the crown dry, avoid wetting the fuzzy leaves, and protect it from frost.",
  },
  {
    name: "Bromeliad",
    type: "Houseplant",
    image: "bromeliad",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Bromeliad is grown for its colorful bracts. Give it bright, indirect light, keep a little water in its central cup, use fast-draining mix, and protect it from frost.",
  },
  {
    name: "Guzmania",
    type: "Houseplant",
    image: "guzmania",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Guzmania is grown for its colorful bracts. Give it bright, indirect light, keep a little water in its central cup, use fast-draining mix, and protect it from frost.",
  },
  {
    name: "Anthurium",
    type: "Houseplant",
    image: "anthurium",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Anthurium blooms indoors in bright, indirect light. Keep it in a chunky, airy mix that stays lightly moist, maintain humidity, and protect it from frost.",
  },
  {
    name: "Umbrella Plant (Schefflera)",
    type: "Houseplant",
    image: "umbrellaplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Umbrella Plant is grown mainly indoors as a foliage plant. Give it bright, indirect light and let the soil dry between waterings; move it outside only in warm, frost-free weather.",
  },
  {
    name: "Lithops (Living Stones)",
    type: "Houseplant",
    image: "lithops",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Lithops is a tiny, very low-water succulent. Give it strong light and gritty soil, water only during active growth, and keep it dry and above freezing.",
  },
  {
    name: "Aeonium",
    type: "Houseplant",
    image: "aeonium",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Aeonium is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Ghost Plant",
    type: "Houseplant",
    image: "ghostplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Ghost Plant is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "Panda Plant",
    type: "Houseplant",
    image: "pandaplant",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Panda Plant is a low-water succulent. Give it bright light and fast-draining soil, water sparingly, and keep it above freezing — grow it indoors in cold climates.",
  },
  {
    name: "String of Bananas",
    type: "Houseplant",
    image: "stringofbananas",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "String of Bananas is a trailing indoor plant grown for its cascading stems. Give it bright, indirect light, let the soil dry between waterings, and protect it from frost.",
  },
  {
    name: "Bunny Ear Cactus",
    type: "Houseplant",
    image: "bunnyearcactus",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Bunny Ear Cactus is a desert cactus. Give it strong light and gritty, fast-draining soil, water sparingly, and protect it from frost — grow it indoors in cold climates.",
  },
  {
    name: "Barrel Cactus",
    type: "Houseplant",
    image: "barrelcactus",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Barrel Cactus is a desert cactus. Give it strong light and gritty, fast-draining soil, water sparingly, and protect it from frost — grow it indoors in cold climates.",
  },
  {
    name: "Prickly Pear Cactus",
    type: "Houseplant",
    image: "pricklypearcactus",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Prickly Pear Cactus is a desert cactus. Give it strong light and gritty, fast-draining soil, water sparingly, and protect it from frost — grow it indoors in cold climates.",
  },
  {
    name: "Phalaenopsis Orchid",
    type: "Houseplant",
    image: "phalaenopsis",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Phalaenopsis Orchid is an indoor orchid. Grow it in bark mix in bright, indirect light, water when the roots turn silvery, and protect it from frost.",
  },
  {
    name: "Dendrobium Orchid",
    type: "Houseplant",
    image: "dendrobium",
    minZone: "1",
    maxZone: "13",
    plantMonths: [3, 4, 5],
    notes:
      "Dendrobium Orchid is an indoor orchid. Grow it in bark mix in bright, indirect light, water when the roots turn silvery, and protect it from frost.",
  },
  {
    name: "Iceberg Lettuce",
    type: "Vegetable",
    image: "iceberglettuce",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Iceberg Lettuce forms crisp heads in cool weather and rich, moist soil. Keep it well watered and harvest before summer heat makes it bolt or turn bitter.",
  },
  {
    name: "Butterhead Lettuce",
    type: "Vegetable",
    image: "butterheadlettuce",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Butterhead Lettuce grows soft, loose heads that love cool weather and steady moisture. Harvest outer leaves often, and give it afternoon shade in the heat.",
  },
  {
    name: "Oak Leaf Lettuce",
    type: "Vegetable",
    image: "oakleaflettuce",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Oak Leaf is a tender loose-leaf lettuce for cool seasons. Cut outer leaves as you need them and it will keep producing until heat triggers bolting.",
  },
  {
    name: "Red Cabbage",
    type: "Vegetable",
    image: "redcabbage",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 8, 9],
    notes:
      "Red Cabbage thrives in cool weather with rich soil and steady moisture. Give heads room to form and harvest before summer heat causes them to split.",
  },
  {
    name: "Savoy Cabbage",
    type: "Vegetable",
    image: "savoycabbage",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 8, 9],
    notes:
      "Savoy Cabbage forms crinkled, tender heads and takes light frost well. Grow it in fertile soil with steady water and harvest heads once firm.",
  },
  {
    name: "Lacinato Kale (Cavolo Nero)",
    type: "Vegetable",
    image: "lacinatokale",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4, 9, 10],
    notes:
      "Lacinato Kale grows dark, strappy leaves that sweeten after frost. Harvest from the bottom up and it will keep producing through cold weather.",
  },
  {
    name: "Elephant Garlic",
    type: "Vegetable",
    image: "elephantgarlic",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [9, 10, 11],
    notes:
      "Elephant Garlic makes huge, mild cloves. Plant cloves in fall in loose, fertile soil, mulch for winter, and harvest the following summer as the leaves brown.",
  },
  {
    name: "Pearl Onion",
    type: "Vegetable",
    image: "pearlonion",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [2, 3, 4],
    notes:
      "Pearl Onions are small onions grown close together for pickling and roasting. Give them full sun and loose soil, and harvest once the tops fall over.",
  },
  {
    name: "Scarlet Runner Bean",
    type: "Vegetable",
    image: "scarletrunnerbean",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Scarlet Runner Bean climbs fast and shows off scarlet flowers loved by pollinators. Sow after frost by a trellis, keep it watered, and pick pods young.",
  },
  {
    name: "Cranberry Bean (Borlotti)",
    type: "Vegetable",
    image: "cranberrybean",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Cranberry Bean is a speckled shelling bean for warm weather. Sow after frost in full sun and let pods dry on the plant for plump, creamy beans.",
  },
  {
    name: "Crookneck Squash",
    type: "Vegetable",
    image: "crooknecksquash",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Crookneck is a bright yellow summer squash that produces heavily. Give it full sun, rich soil, and steady water, and pick fruit small and tender.",
  },
  {
    name: "Hubbard Squash",
    type: "Vegetable",
    image: "hubbardsquash",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [5, 6],
    notes:
      "Hubbard is a large winter squash that stores for months. Give vines plenty of room and a long warm season, and cure the fruit before storing.",
  },
  {
    name: "Chicory",
    type: "Vegetable",
    image: "chicory",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [4, 5, 8],
    notes:
      "Chicory is grown for its slightly bitter leaves and roots. Give it full sun and steady moisture, and blanch or force the crowns for milder winter chicons.",
  },
  {
    name: "Marrow",
    type: "Vegetable",
    image: "marrow",
    minZone: "4a",
    maxZone: "10b",
    plantMonths: [4, 5, 6],
    notes:
      "Marrow is a summer squash left to grow large and firm. Give it rich soil, full sun, and plenty of water, and harvest once it reaches full size.",
  },
  {
    name: "Tabasco Pepper",
    type: "Vegetable",
    image: "tabascopepper",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Tabasco Pepper produces upright, fiery little peppers. It loves heat and full sun with even moisture, and fruit ripens from green to bright red.",
  },
  {
    name: "Peperoncini",
    type: "Vegetable",
    image: "peperoncini",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Peperoncini are mild, tangy peppers great for pickling. Give them full sun and steady moisture, and pick them green or let them ripen to red.",
  },
  {
    name: "Aleppo Pepper",
    type: "Vegetable",
    image: "aleppopepper",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Aleppo Pepper ripens to deep red and is usually dried and flaked. It thrives in heat and full sun with even water; harvest when fully colored.",
  },
  {
    name: "Chrysanthemum Greens (Shungiku)",
    type: "Vegetable",
    image: "chrysanthemumgreens",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 9],
    notes:
      "Shungiku is an edible chrysanthemum grown for aromatic leaves. Sow in cool weather, harvest young shoots before it flowers, and it regrows after cutting.",
  },
  {
    name: "Corn Salad (Mache)",
    type: "Vegetable",
    image: "cornsalad",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 9, 10],
    notes:
      "Corn Salad (Mâche) is a cold-hardy salad green that grows through winter. Sow in cool weather and cut the tender rosettes whole or leaf by leaf.",
  },
  {
    name: "Frisee",
    type: "Vegetable",
    image: "frisee",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 8, 9],
    notes:
      "Frisée is a curly, slightly bitter endive for cool seasons. Grow it in steady moisture and blanch the center a week before harvest to sweeten it.",
  },
  {
    name: "Garden Cress",
    type: "Vegetable",
    image: "gardencress",
    minZone: "3a",
    maxZone: "11b",
    plantMonths: [3, 4, 5, 9],
    notes:
      "Garden Cress is a peppery green ready in weeks. Sow thickly in cool weather, keep it moist, and snip the young seedlings for salads and sandwiches.",
  },
  {
    name: "Orach",
    type: "Vegetable",
    image: "orach",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Orach, or mountain spinach, is a heat-tolerant leafy green. Sow in spring, harvest young leaves often, and pinch flower stalks to keep it producing.",
  },
  {
    name: "Sea Kale",
    type: "Vegetable",
    image: "seakale",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4, 9],
    notes:
      "Sea Kale is a hardy perennial grown for its blanched spring shoots. Plant it in full sun and well-drained soil, and force the crowns in early spring.",
  },
  {
    name: "Fiddlehead Fern",
    type: "Vegetable",
    image: "fiddleheadfern",
    minZone: "3a",
    maxZone: "7b",
    plantMonths: [4, 5],
    notes:
      "Fiddlehead Fern (ostrich fern) is a shade-loving perennial harvested in spring. Pick the tightly coiled fronds young, and always cook them before eating.",
  },
  {
    name: "Ramps (Wild Leek)",
    type: "Vegetable",
    image: "ramps",
    minZone: "3a",
    maxZone: "7b",
    plantMonths: [3, 4],
    notes:
      "Ramps are a woodland perennial onion harvested in early spring. Grow them in rich, shaded, moist soil and harvest sparingly so the patch can spread.",
  },
  {
    name: "Stinging Nettle",
    type: "Vegetable",
    image: "stingingnettle",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Stinging Nettle is a nutritious perennial green harvested in spring. Grow it in moist, rich soil, wear gloves to pick the young tops, and cook before eating.",
  },
  {
    name: "Welsh Onion",
    type: "Vegetable",
    image: "welshonion",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4, 5],
    notes:
      "Welsh Onion is a perennial bunching onion grown for its hollow green stalks. Give it full sun and steady moisture, and snip stalks as you need them.",
  },
  {
    name: "Burdock (Gobo)",
    type: "Vegetable",
    image: "burdock",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [4, 5],
    notes:
      "Burdock (Gobo) grows long, slender roots prized in Japanese cooking. Give it deep, loose, stone-free soil, keep it watered, and dig roots in fall.",
  },
  {
    name: "Scorzonera",
    type: "Vegetable",
    image: "scorzonera",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [4, 5],
    notes:
      "Scorzonera is a black-skinned root with a delicate, oyster-like flavor. Grow it in deep, loose soil, keep moisture steady, and harvest roots in fall.",
  },
  {
    name: "Prickly Pear (Cactus Pear)",
    type: "Fruit",
    image: "pricklypear",
    minZone: "8a",
    maxZone: "11b",
    plantMonths: [4, 5],
    notes:
      "Prickly Pear is a hardy cactus grown for its edible pads and sweet fruit. Give it full sun and gritty, fast-draining soil, and water sparingly.",
  },
  {
    name: "Muscadine Grape",
    type: "Fruit",
    image: "muscadinegrape",
    minZone: "6a",
    maxZone: "10b",
    plantMonths: [2, 3],
    notes:
      "Muscadine is a vigorous Southern grapevine that shrugs off heat and humidity. Give it full sun and a sturdy trellis, and prune hard each dormant season.",
  },
  {
    name: "Kiwano (Horned Melon)",
    type: "Fruit",
    image: "kiwano",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Kiwano is a spiky African melon grown on warm-season vines. Give it full sun, a trellis, and steady water, and harvest once the rind turns golden orange.",
  },
  {
    name: "Korean Melon",
    type: "Fruit",
    image: "koreanmelon",
    minZone: "4a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Korean Melon (Chamoe) is a sweet golden melon on warm-season vines. Give it full sun and steady water, and pick fruit when it turns bright yellow.",
  },
  {
    name: "Charentais Melon",
    type: "Fruit",
    image: "charentaismelon",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Charentais is a fragrant French cantaloupe type. Give it full sun, warm soil, and steady water, and harvest when it smells sweet and slips from the vine.",
  },
  {
    name: "Canary Melon",
    type: "Fruit",
    image: "canarymelon",
    minZone: "5a",
    maxZone: "11b",
    plantMonths: [4, 5, 6],
    notes:
      "Canary Melon has bright yellow skin and pale, sweet flesh. Give it full sun and a long warm season, and harvest once the rind turns deep yellow.",
  },
  {
    name: "Tangelo",
    type: "Fruit Tree",
    image: "tangelo",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [2, 3],
    notes:
      "Tangelo is a juicy tangerine-grapefruit cross for warm, frost-free climates. Give it full sun and well-drained soil; grow it in a pot to shelter in winter.",
  },
  {
    name: "Satsuma",
    type: "Fruit Tree",
    image: "satsuma",
    minZone: "8b",
    maxZone: "11b",
    plantMonths: [2, 3],
    notes:
      "Satsuma is a cold-hardy, easy-peel mandarin. Give it full sun and well-drained soil, feed it through the growing season, and protect it from hard frost.",
  },
  {
    name: "Cara Cara Orange",
    type: "Fruit Tree",
    image: "caracaraorange",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [2, 3],
    notes:
      "Cara Cara is a sweet, pink-fleshed navel orange. Give it full sun and well-drained soil in a frost-free spot, or grow it potted to move indoors in winter.",
  },
  {
    name: "Seville Orange",
    type: "Fruit Tree",
    image: "sevilleorange",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [2, 3],
    notes:
      "Seville is a bitter orange prized for marmalade. Give it full sun and well-drained soil in a warm, frost-free spot, and harvest fruit in late winter.",
  },
  {
    name: "Citron",
    type: "Fruit Tree",
    image: "citron",
    minZone: "9b",
    maxZone: "11b",
    plantMonths: [2, 3],
    notes:
      "Citron is a fragrant citrus grown mostly for its thick, aromatic peel. It needs full sun and frost-free warmth; grow it potted to move indoors in cold areas.",
  },
  {
    name: "Crabapple",
    type: "Fruit Tree",
    image: "crabapple",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [1, 2],
    notes:
      "Crabapple is a hardy tree with tart little fruit good for jelly. Plant it dormant in full sun, prune yearly, and it also helps pollinate other apples.",
  },
  {
    name: "Sour Cherry (Morello)",
    type: "Fruit Tree",
    image: "sourcherry",
    minZone: "4a",
    maxZone: "8b",
    plantMonths: [1, 2, 3],
    notes:
      "Sour Cherry is a hardy, self-fertile tree for baking cherries. Give it full sun and winter chill, plant while dormant, and net the fruit against birds.",
  },
  {
    name: "Damson Plum",
    type: "Fruit Tree",
    image: "damsonplum",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [1, 2, 3],
    notes:
      "Damson is a small, tart plum ideal for jam and preserves. Give it full sun, plant while dormant, and thin the heavy fruit set for better size.",
  },
  {
    name: "Greengage",
    type: "Fruit Tree",
    image: "greengage",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [1, 2, 3],
    notes:
      "Greengage is a richly sweet green plum. Give it full sun and winter chill, plant it dormant, and thin the fruit so branches don't overload.",
  },
  {
    name: "Mirabelle Plum",
    type: "Fruit Tree",
    image: "mirabelleplum",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [1, 2, 3],
    notes:
      "Mirabelle is a small, honey-sweet golden plum. Plant it dormant in full sun with well-drained soil, and prune lightly to keep an open canopy.",
  },
  {
    name: "Tayberry",
    type: "Berry",
    image: "tayberry",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Tayberry is a raspberry-blackberry cross with long, sweet-tart fruit. Train the canes on a trellis, give it full sun, and cut out old canes after fruiting.",
  },
  {
    name: "Saskatoon Berry",
    type: "Berry",
    image: "saskatoonberry",
    minZone: "2a",
    maxZone: "7b",
    plantMonths: [3, 4],
    notes:
      "Saskatoon is a super-hardy shrub with sweet, blueberry-like fruit. Give it full sun and well-drained soil, and it needs little care once established.",
  },
  {
    name: "Thimbleberry",
    type: "Berry",
    image: "thimbleberry",
    minZone: "3a",
    maxZone: "8b",
    plantMonths: [3, 4],
    notes:
      "Thimbleberry is a thornless native cane with soft, tart-sweet berries. Give it partial sun and moist soil; the delicate fruit is best eaten fresh.",
  },
  {
    name: "Alpine Strawberry",
    type: "Berry",
    image: "alpinestrawberry",
    minZone: "3a",
    maxZone: "10b",
    plantMonths: [2, 3, 4],
    notes:
      "Alpine Strawberry makes tiny, intensely aromatic berries all season. It tolerates part shade, doesn't send runners, and grows well in pots and borders.",
  },
  {
    name: "Pineberry",
    type: "Berry",
    image: "pineberry",
    minZone: "4a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Pineberry is a white strawberry with a pineapple-like flavor. Grow it like a strawberry in full sun and rich soil, and plant a red variety nearby to pollinate.",
  },
  {
    name: "Strawberry Guava",
    type: "Fruit",
    image: "strawberryguava",
    minZone: "9a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Strawberry Guava is a small evergreen tree with sweet red fruit. Give it full sun and well-drained soil in a frost-free spot, or grow it in a large pot.",
  },
  {
    name: "Rose Hip",
    type: "Fruit",
    image: "rosehip",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Rose Hip is the vitamin-rich fruit of rugosa and other roses. Give the shrub full sun, skip deadheading in late summer, and pick hips after the first frost.",
  },
  {
    name: "Goumi Berry",
    type: "Berry",
    image: "goumiberry",
    minZone: "5a",
    maxZone: "9b",
    plantMonths: [3, 4],
    notes:
      "Goumi is a hardy, nitrogen-fixing shrub with tart-sweet red berries. Give it full sun, and it thrives even in poor soil once established.",
  },
  {
    name: "Chilean Guava (Ugni)",
    type: "Berry",
    image: "chileanguava",
    minZone: "7a",
    maxZone: "10b",
    plantMonths: [3, 4, 5],
    notes:
      "Chilean Guava (Ugni) is a compact evergreen shrub with aromatic red berries. Give it full sun to part shade and well-drained soil; it grows well in pots.",
  },
  {
    name: "Grape Hyacinth",
    type: "Flower",
    image: "grapehyacinth",
    minZone: "3a",
    maxZone: "9b",
    plantMonths: [9, 10, 11],
    notes:
      "Grape Hyacinth is a hardy little spring bulb with clusters of tiny, grape-like blue blooms. Plant bulbs in fall in full sun to part shade and well-drained soil; it naturalizes and spreads easily.",
  },
  {
    name: "Jocote (Spanish Plum)",
    type: "Fruit",
    image: "jocote",
    minZone: "10a",
    maxZone: "11b",
    plantMonths: [3, 4, 5],
    notes:
      "Jocote, or Spanish Plum, is a small tropical tree with tart-sweet, plum-like fruit. Give it full sun and well-drained soil in a frost-free climate; it tolerates heat and drought once established.",
  },
];
export default produceData;