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
];
export default produceData;