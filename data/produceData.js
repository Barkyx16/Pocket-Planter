const produceData = [
  {
    name: "Tomato",
    type: "Vegetable",
    icon: "🍅",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "A warm-season favorite that grows best in full sun with steady watering and support like cages or stakes.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [1, 2, 9, 10, 11],
    },
    plantingSteps: [
      "Wait until frost risk has passed and nights are staying warmer.",
      "Choose a sunny spot with rich, well-drained soil.",
      "Plant deeply so part of the stem is buried for stronger roots.",
      "Water well after planting and keep moisture steady.",
      "Use a cage or stake early so the plant stays supported.",
    ],
    seedLinks: [
      {
        label: "Buy Tomato Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=tomato%20seeds",
      },
      {
        label: "Buy Tomato Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=tomato",
      },
    ],
  },
  {
    name: "Pepper",
    type: "Vegetable",
    icon: "🫑",
    minZone: "4a",
    maxZone: "10b",
    notes:
      "Peppers thrive once nights stay warm. Avoid planting too early in cool soil.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [2, 3, 9, 10],
    },
    plantingSteps: [
      "Wait for warm weather and soil before planting outdoors.",
      "Choose a sunny location with fertile, well-drained soil.",
      "Plant seedlings at the same depth they were growing before.",
      "Water after planting and keep moisture consistent.",
      "Harvest regularly once fruits reach the size and color you want.",
    ],
    seedLinks: [
      {
        label: "Buy Pepper Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=pepper%20seeds",
      },
      {
        label: "Buy Pepper Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=pepper",
      },
    ],
  },
  {
    name: "Carrot",
    type: "Vegetable",
    icon: "🥕",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Prefers loose soil and cooler temperatures for straight, sweet roots.",
    planting: {
      cool: [4, 5, 6],
      warm: [2, 3, 9, 10],
      hot: [1, 2, 10, 11, 12],
    },
    plantingSteps: [
      "Choose loose soil without rocks so roots grow straight.",
      "Sow seeds directly into the garden since carrots do not transplant well.",
      "Cover seeds lightly and keep the surface moist until they sprout.",
      "Thin seedlings once they are a little taller so roots have room.",
      "Water steadily so roots stay tender and do not split.",
    ],
    seedLinks: [
      {
        label: "Buy Carrot Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=carrot%20seeds",
      },
      {
        label: "Buy Carrot Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=carrot",
      },
    ],
  },
  {
    name: "Lettuce",
    type: "Vegetable",
    icon: "🥬",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Fast-growing and ideal for spring and fall. Provide shade in warmer climates.",
    planting: {
      cool: [4, 5, 6, 8, 9],
      warm: [2, 3, 4, 9, 10, 11],
      hot: [1, 2, 3, 10, 11, 12],
    },
    plantingSteps: [
      "Choose a cool-season planting window for the best flavor.",
      "Plant in sun or partial shade if your climate warms quickly.",
      "Scatter seeds lightly or plant in short rows.",
      "Keep soil consistently moist while seedlings establish.",
      "Harvest outer leaves early or cut full heads when mature.",
    ],
    seedLinks: [
      {
        label: "Buy Lettuce Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=lettuce%20seeds",
      },
      {
        label: "Buy Lettuce Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=lettuce",
      },
    ],
  },
  {
    name: "Spinach",
    type: "Vegetable",
    icon: "🌿",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Thrives in cool weather and bolts quickly once temperatures rise.",
    planting: {
      cool: [4, 5, 8, 9],
      warm: [2, 3, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant during cooler parts of the season for the best growth.",
      "Choose rich soil with good drainage and some organic matter.",
      "Sow seeds shallow and space rows or clusters evenly.",
      "Keep soil moist while plants are establishing.",
      "Pick leaves young and often before heat causes bolting.",
    ],
    seedLinks: [
      {
        label: "Buy Spinach Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=spinach%20seeds",
      },
      {
        label: "Buy Spinach Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=spinach",
      },
    ],
  },
  {
    name: "Cucumber",
    type: "Vegetable",
    icon: "🥒",
    minZone: "4a",
    maxZone: "10b",
    notes:
      "Fast-growing summer crop that benefits from consistent watering.",
    planting: {
      cool: [5, 6],
      warm: [4, 5, 6],
      hot: [2, 3, 9, 10],
    },
    plantingSteps: [
      "Wait until the weather and soil are warm before planting.",
      "Choose a sunny area with fertile, well-drained soil.",
      "Plant seeds or starts with enough room for vines to spread or climb.",
      "Water consistently to keep fruits from turning bitter.",
      "Harvest often while cucumbers are firm and tender.",
    ],
    seedLinks: [
      {
        label: "Buy Cucumber Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cucumber%20seeds",
      },
      {
        label: "Buy Cucumber Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cucumber",
      },
    ],
  },
  {
    name: "Zucchini",
    type: "Vegetable",
    icon: "🥒",
    minZone: "4a",
    maxZone: "10b",
    notes:
      "Very productive plant that benefits from harvesting young fruits often.",
    planting: {
      cool: [5, 6],
      warm: [4, 5, 6],
      hot: [2, 3, 9, 10],
    },
    plantingSteps: [
      "Wait until frost danger has passed and the soil is warm.",
      "Choose a sunny site with fertile soil and room to spread.",
      "Plant seeds or starts with generous spacing.",
      "Water deeply and mulch to help keep the soil evenly moist.",
      "Harvest fruits young and often to keep the plant producing.",
    ],
    seedLinks: [
      {
        label: "Buy Zucchini Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=zucchini%20seeds",
      },
      {
        label: "Buy Zucchini Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=zucchini",
      },
    ],
  },
  {
    name: "Green Bean",
    type: "Vegetable",
    icon: "🫛",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Quick-growing and easy once soil warms. Direct sow after frost risk passes.",
    planting: {
      cool: [5, 6, 7],
      warm: [4, 5, 6, 7],
      hot: [2, 3, 4, 9],
    },
    plantingSteps: [
      "Direct sow after the last frost once the soil has warmed.",
      "Choose a sunny spot with loose, well-drained soil.",
      "Plant seeds at a shallow depth and space rows properly.",
      "Water gently until seedlings are established.",
      "Pick beans often to keep plants flowering and producing.",
    ],
    seedLinks: [
      {
        label: "Buy Green Bean Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=bean%20seeds",
      },
      {
        label: "Buy Green Bean Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=bean",
      },
    ],
  },
  {
    name: "Corn",
    type: "Vegetable",
    icon: "🌽",
    minZone: "4a",
    maxZone: "10b",
    notes:
      "Plant in blocks rather than rows for better pollination and fuller ears.",
    planting: {
      cool: [5, 6],
      warm: [4, 5, 6],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Wait until the soil is warm before planting corn.",
      "Plant in short blocks instead of one long row for better pollination.",
      "Choose full sun and fertile soil with steady moisture.",
      "Water regularly as stalks grow taller and ears develop.",
      "Harvest when silks brown and kernels release a milky juice.",
    ],
    seedLinks: [
      {
        label: "Buy Corn Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=corn%20seeds",
      },
      {
        label: "Buy Corn Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=corn",
      },
    ],
  },
  {
    name: "Potato",
    type: "Vegetable",
    icon: "🥔",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Prefers cooler soil and benefits from hilling soil around stems as plants grow.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 9],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant seed potatoes in cool-season weather before heat builds.",
      "Choose loose soil with good drainage and lots of sun.",
      "Place pieces with eyes facing upward and cover lightly.",
      "Hill soil around stems as plants grow taller.",
      "Harvest new potatoes early or wait for tops to die back for full-size potatoes.",
    ],
    seedLinks: [
      {
        label: "Buy Seed Potatoes - Burpee",
        url: "https://www.burpee.com/search?searchTerm=seed%20potatoes",
      },
      {
        label: "Buy Seed Potatoes - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=potato",
      },
    ],
  },
  {
    name: "Broccoli",
    type: "Vegetable",
    icon: "🥦",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "A cool-season crop that grows best before summer heat arrives.",
    planting: {
      cool: [4, 5, 6, 7],
      warm: [2, 3, 8, 9, 10],
      hot: [1, 2, 9, 10, 11],
    },
    plantingSteps: [
      "Plant during cool weather to help heads form well.",
      "Choose a sunny spot with rich soil and steady moisture.",
      "Set transplants or seedlings with enough room to mature.",
      "Mulch around plants to help keep roots cool.",
      "Cut the main head while it is still tight, then watch for side shoots.",
    ],
    seedLinks: [
      {
        label: "Buy Broccoli Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=broccoli%20seeds",
      },
      {
        label: "Buy Broccoli Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=broccoli",
      },
    ],
  },
  {
    name: "Cauliflower",
    type: "Vegetable",
    icon: "🥦",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Likes steady cool weather and even moisture for better heads.",
    planting: {
      cool: [4, 5, 6],
      warm: [2, 3, 8, 9, 10],
      hot: [1, 2, 9, 10, 11],
    },
    plantingSteps: [
      "Grow during cool weather to avoid stressed or small heads.",
      "Plant in fertile soil with even moisture and full sun.",
      "Space plants well so they have room to form heads.",
      "Keep growth steady with regular watering and feeding.",
      "Harvest when heads are full, tight, and still smooth.",
    ],
    seedLinks: [
      {
        label: "Buy Cauliflower Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cauliflower%20seeds",
      },
      {
        label: "Buy Cauliflower Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cauliflower",
      },
    ],
  },
  {
    name: "Cabbage",
    type: "Vegetable",
    icon: "🥬",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "A dependable cool-weather crop that performs well in spring and fall.",
    planting: {
      cool: [4, 5, 6, 7],
      warm: [2, 3, 8, 9, 10],
      hot: [1, 2, 9, 10, 11],
    },
    plantingSteps: [
      "Plant in cool weather for the sweetest, firmest heads.",
      "Use rich soil with good drainage and plenty of sun.",
      "Set plants with enough spacing for head development.",
      "Keep soil evenly moist so plants grow steadily.",
      "Harvest once heads feel firm and full.",
    ],
    seedLinks: [
      {
        label: "Buy Cabbage Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cabbage%20seeds",
      },
      {
        label: "Buy Cabbage Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cabbage",
      },
    ],
  },
  {
    name: "Kale",
    type: "Vegetable",
    icon: "🥬",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Very reliable in cool weather and often sweeter after light frost.",
    planting: {
      cool: [4, 5, 6, 8, 9],
      warm: [2, 3, 4, 9, 10, 11],
      hot: [1, 2, 10, 11, 12],
    },
    plantingSteps: [
      "Plant during mild weather for the best flavor and growth.",
      "Choose full sun or partial shade in warmer spots.",
      "Use rich, well-drained soil with regular moisture.",
      "Harvest outer leaves first and let the center keep growing.",
      "Keep picking often for a longer harvest season.",
    ],
    seedLinks: [
      {
        label: "Buy Kale Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=kale%20seeds",
      },
      {
        label: "Buy Kale Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=kale",
      },
    ],
  },
  {
    name: "Beet",
    type: "Vegetable",
    icon: "🌱",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Useful for both roots and greens and grows best in mild weather.",
    planting: {
      cool: [4, 5, 6, 8, 9],
      warm: [2, 3, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Sow seeds directly into the garden during mild weather.",
      "Choose loose soil so roots can size up evenly.",
      "Keep the seedbed moist until sprouts appear.",
      "Thin seedlings so roots have room to grow round and smooth.",
      "Harvest roots when they are still tender and not overly large.",
    ],
    seedLinks: [
      {
        label: "Buy Beet Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=beet%20seeds",
      },
      {
        label: "Buy Beet Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=beet",
      },
    ],
  },
  {
    name: "Radish",
    type: "Vegetable",
    icon: "🌱",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "One of the fastest crops you can grow and best harvested young.",
    planting: {
      cool: [4, 5, 6, 8, 9],
      warm: [2, 3, 4, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Sow seeds directly into loose soil in cool weather.",
      "Plant shallowly and keep the top layer of soil moist.",
      "Thin seedlings early so roots size up properly.",
      "Grow quickly with regular moisture and good spacing.",
      "Harvest while roots are still crisp and tender.",
    ],
    seedLinks: [
      {
        label: "Buy Radish Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=radish%20seeds",
      },
      {
        label: "Buy Radish Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=radish",
      },
    ],
  },
  {
    name: "Onion",
    type: "Vegetable",
    icon: "🧅",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Needs full sun and good drainage for strong bulb development.",
    planting: {
      cool: [4, 5],
      warm: [1, 2, 10, 11, 12],
      hot: [1, 2, 10, 11, 12],
    },
    plantingSteps: [
      "Plant in full sun with loose, fertile, well-drained soil.",
      "Start from seed, sets, or young plants depending on your preference.",
      "Keep weeds down so bulbs do not have to compete for space.",
      "Water regularly while bulbs are sizing up.",
      "Harvest once tops begin to bend and dry.",
    ],
    seedLinks: [
      {
        label: "Buy Onion Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=onion%20seeds",
      },
      {
        label: "Buy Onion Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=onion",
      },
    ],
  },
  {
    name: "Garlic",
    type: "Vegetable",
    icon: "🧄",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Usually planted in fall and harvested the following season.",
    planting: {
      cool: [9, 10],
      warm: [10, 11],
      hot: [10, 11, 12],
    },
    plantingSteps: [
      "Plant individual cloves during the fall planting window.",
      "Choose loose soil with good drainage and full sun.",
      "Set cloves pointed end up and cover with soil.",
      "Mulch to help protect roots and regulate soil temperature.",
      "Harvest when lower leaves brown but some upper leaves remain green.",
    ],
    seedLinks: [
      {
        label: "Buy Garlic Seed Stock - Burpee",
        url: "https://www.burpee.com/search?searchTerm=garlic",
      },
      {
        label: "Buy Garlic Seed Stock - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=garlic",
      },
    ],
  },
  {
    name: "Eggplant",
    type: "Vegetable",
    icon: "🍆",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "Needs real warmth to thrive and usually performs best in hot sunny spots.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [2, 3, 9, 10],
    },
    plantingSteps: [
      "Wait until both the weather and soil are truly warm.",
      "Plant in full sun with fertile, well-drained soil.",
      "Space plants well for airflow and strong branching.",
      "Water steadily and mulch around the base.",
      "Harvest fruits while skins are glossy and firm.",
    ],
    seedLinks: [
      {
        label: "Buy Eggplant Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=eggplant%20seeds",
      },
      {
        label: "Buy Eggplant Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=eggplant",
      },
    ],
  },
  {
    name: "Okra",
    type: "Vegetable",
    icon: "🌱",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "Loves heat and keeps producing through hot summer weather.",
    planting: {
      cool: [5, 6],
      warm: [4, 5, 6],
      hot: [3, 4, 5, 6],
    },
    plantingSteps: [
      "Wait for hot weather since okra loves heat.",
      "Choose full sun and soil that drains well.",
      "Plant seeds after the soil has warmed nicely.",
      "Water while young plants establish, then keep moisture steady.",
      "Harvest pods while they are still small and tender.",
    ],
    seedLinks: [
      {
        label: "Buy Okra Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=okra%20seeds",
      },
      {
        label: "Buy Okra Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=okra",
      },
    ],
  },
  {
    name: "Pea",
    type: "Vegetable",
    icon: "🫛",
    minZone: "3a",
    maxZone: "8b",
    notes:
      "A classic cool-season crop that should be planted early.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant early in cool weather before the season warms up.",
      "Choose a sunny site with rich, well-drained soil.",
      "Sow seeds directly and add support for vining types.",
      "Keep soil evenly moist while pods are forming.",
      "Harvest often to encourage more pods.",
    ],
    seedLinks: [
      {
        label: "Buy Pea Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=pea%20seeds",
      },
      {
        label: "Buy Pea Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=pea",
      },
    ],
  },
  {
    name: "Pumpkin",
    type: "Vegetable",
    icon: "🎃",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Needs space, warmth, and enough time to mature before frost.",
    planting: {
      cool: [5, 6],
      warm: [4, 5, 6],
      hot: [3, 4, 5, 6],
    },
    plantingSteps: [
      "Plant once the weather is warm and frost danger is gone.",
      "Choose a sunny space with rich soil and lots of room for vines.",
      "Sow seeds in hills or rows with generous spacing.",
      "Water deeply and mulch to hold moisture.",
      "Harvest when rinds harden and stems start to dry.",
    ],
    seedLinks: [
      {
        label: "Buy Pumpkin Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=pumpkin%20seeds",
      },
      {
        label: "Buy Pumpkin Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=pumpkin",
      },
    ],
  },
  {
    name: "Sweet Potato",
    type: "Vegetable",
    icon: "🍠",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "Thrives in warm soil and long hot growing seasons.",
    planting: {
      cool: [5, 6],
      warm: [4, 5, 6],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Plant slips only after the soil is warm and settled into summer.",
      "Choose a sunny spot with loose soil and good drainage.",
      "Space slips so vines have room to spread.",
      "Water regularly during establishment, then maintain even moisture.",
      "Harvest before cold weather once vines begin to yellow.",
    ],
    seedLinks: [
      {
        label: "Buy Sweet Potato Slips - Burpee",
        url: "https://www.burpee.com/search?searchTerm=sweet%20potato",
      },
      {
        label: "Buy Sweet Potato Slips - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=sweet%20potato",
      },
    ],
  },
  {
    name: "Basil",
    type: "Herb",
    icon: "🌿",
    minZone: "4a",
    maxZone: "10b",
    notes:
      "Sensitive to cold nights. Pinch often to keep plants bushy.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [2, 3, 9, 10],
    },
    plantingSteps: [
      "Wait for warm weather since basil dislikes cold nights.",
      "Plant in full sun with soft, well-drained soil.",
      "Sow seeds shallow or transplant starts carefully.",
      "Keep the soil evenly moist but not soggy.",
      "Pinch the top growth often to encourage bushy plants.",
    ],
    seedLinks: [
      {
        label: "Buy Basil Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=basil%20seeds",
      },
      {
        label: "Buy Basil Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=basil",
      },
    ],
  },
  {
    name: "Parsley",
    type: "Herb",
    icon: "🌿",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Handles cool weather well and grows nicely in containers or beds.",
    planting: {
      cool: [4, 5, 6],
      warm: [2, 3, 4, 9, 10],
      hot: [1, 2, 10, 11, 12],
    },
    plantingSteps: [
      "Choose a sunny or lightly shaded spot with good drainage.",
      "Sow seeds shallowly or set out young plants.",
      "Keep soil lightly moist while parsley gets established.",
      "Harvest outer stems first so the center keeps growing.",
      "Trim often for fresh leaves and fuller plants.",
    ],
    seedLinks: [
      {
        label: "Buy Parsley Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=parsley%20seeds",
      },
      {
        label: "Buy Parsley Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=parsley",
      },
    ],
  },
  {
    name: "Cilantro",
    type: "Herb",
    icon: "🌿",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Prefers cool temperatures and bolts quickly once it warms up.",
    planting: {
      cool: [4, 5, 8, 9],
      warm: [2, 3, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant during the coolest part of your growing season.",
      "Choose a sunny or lightly shaded spot with loose soil.",
      "Direct sow seeds since cilantro does not love transplanting.",
      "Keep the soil evenly moist for steady growth.",
      "Harvest leaves early before hot weather makes plants bolt.",
    ],
    seedLinks: [
      {
        label: "Buy Cilantro Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cilantro%20seeds",
      },
      {
        label: "Buy Cilantro Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cilantro",
      },
    ],
  },
  {
    name: "Mint",
    type: "Herb",
    icon: "🌿",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Very vigorous grower. Best kept in containers to control spreading.",
    planting: {
      cool: [4, 5, 6],
      warm: [3, 4, 5, 9],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Grow mint in a container if you want to control spreading.",
      "Use rich soil and a spot with sun or light afternoon shade.",
      "Plant starts or seeds and water in well.",
      "Keep soil evenly moist for lush leaf growth.",
      "Harvest stems often to keep the plant tidy and productive.",
    ],
    seedLinks: [
      {
        label: "Buy Mint Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=mint%20seeds",
      },
      {
        label: "Buy Mint Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=mint",
      },
    ],
  },
  {
    name: "Chive",
    type: "Herb",
    icon: "🌿",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Easy perennial herb with onion-like flavor and good cold tolerance.",
    planting: {
      cool: [4, 5, 6],
      warm: [3, 4, 5, 9],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a sunny to partly sunny location with good drainage.",
      "Sow seeds or divide clumps into fresh soil.",
      "Water regularly while the plant gets established.",
      "Cut leaves from the outside as needed.",
      "Allow clumps to return year after year if your climate supports it.",
    ],
    seedLinks: [
      {
        label: "Buy Chive Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=chive%20seeds",
      },
      {
        label: "Buy Chive Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=chive",
      },
    ],
  },
  {
    name: "Dill",
    type: "Herb",
    icon: "🌿",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Quick-growing herb that prefers cooler starts and can self-seed readily.",
    planting: {
      cool: [4, 5, 6, 8],
      warm: [2, 3, 4, 9, 10],
      hot: [1, 2, 10, 11],
    },
    plantingSteps: [
      "Sow dill directly into the garden in mild weather.",
      "Choose full sun and well-drained soil.",
      "Plant shallowly and avoid disturbing roots later.",
      "Water gently and keep young plants steady as they grow.",
      "Harvest leaves early and seed heads later if you want both.",
    ],
    seedLinks: [
      {
        label: "Buy Dill Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=dill%20seeds",
      },
      {
        label: "Buy Dill Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=dill",
      },
    ],
  },
  {
    name: "Oregano",
    type: "Herb",
    icon: "🌿",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "A hardy perennial herb that likes sun and well-drained soil.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a sunny location with well-drained soil.",
      "Plant seeds or starts once your growing window opens.",
      "Avoid overly rich or soggy soil so flavor stays strong.",
      "Water while establishing, then keep conditions on the drier side.",
      "Trim often to keep plants full and productive.",
    ],
    seedLinks: [
      {
        label: "Buy Oregano Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=oregano%20seeds",
      },
      {
        label: "Buy Oregano Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=oregano",
      },
    ],
  },
  {
    name: "Thyme",
    type: "Herb",
    icon: "🌿",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "Low-growing herb that prefers sun and drier soil conditions.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Plant thyme in full sun with excellent drainage.",
      "Use light soil and avoid heavy watering once established.",
      "Set plants with good spacing so air can move around them.",
      "Water gently at first, then let soil dry a bit between waterings.",
      "Trim stems often to encourage dense, fragrant growth.",
    ],
    seedLinks: [
      {
        label: "Buy Thyme Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=thyme%20seeds",
      },
      {
        label: "Buy Thyme Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=thyme",
      },
    ],
  },

  {
    name: "Strawberry",
    type: "Berry",
    icon: "🍓",
    minZone: "3a",
    maxZone: "10b",
    notes:
      "Excellent for beds or containers. Mulch helps protect fruit and roots.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Choose a sunny spot with rich, well-drained soil.",
      "Plant crowns so the center stays just above soil level.",
      "Water after planting and mulch around the plants.",
      "Keep fruit off bare soil with straw or clean mulch.",
      "Harvest berries once they color fully and feel fragrant.",
    ],
    seedLinks: [
      {
        label: "Buy Strawberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=strawberry%20seeds",
      },
      {
        label: "Buy Strawberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=strawberry",
      },
    ],
  },
  {
    name: "Blueberry",
    type: "Berry",
    icon: "🫐",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Requires acidic soil and benefits from planting multiple varieties together.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Choose a sunny site and make sure the soil is acidic.",
      "Plant more than one variety if you want stronger pollination.",
      "Set shrubs at the same depth they were growing before.",
      "Mulch around the roots to hold moisture and protect the soil.",
      "Prune lightly as plants mature to keep them productive.",
    ],
    seedLinks: [
      {
        label: "Buy Blueberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=blueberry%20seeds",
      },
      {
        label: "Buy Blueberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=blueberry",
      },
    ],
  },
  {
    name: "Blackberry",
    type: "Berry",
    icon: "🫐",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "A vigorous berry crop that benefits from pruning and support.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10, 11],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant in a sunny location with good airflow.",
      "Use sturdy support if you are growing trailing types.",
      "Mulch around the base to help conserve moisture.",
      "Water during dry stretches, especially while fruit is forming.",
      "Prune canes after fruiting to keep new growth strong.",
    ],
    seedLinks: [
      {
        label: "Buy Blackberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=blackberry%20seeds",
      },
      {
        label: "Buy Blackberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=blackberry",
      },
    ],
  },
  {
    name: "Raspberry",
    type: "Berry",
    icon: "🍓",
    minZone: "3a",
    maxZone: "8b",
    notes:
      "Prefers moderate summers and benefits from regular pruning.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10],
      hot: [1, 2],
    },
    plantingSteps: [
      "Choose a sunny site with air circulation and good drainage.",
      "Plant canes with room for spreading and support if needed.",
      "Keep soil moist but not soggy while plants establish.",
      "Mulch roots to help moderate soil temperature.",
      "Prune old canes on schedule to keep fruit production strong.",
    ],
    seedLinks: [
      {
        label: "Buy Raspberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=raspberry%20seeds",
      },
      {
        label: "Buy Raspberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=raspberry",
      },
    ],
  },
  {
    name: "Gooseberry",
    type: "Berry",
    icon: "🫐",
    minZone: "3a",
    maxZone: "7b",
    notes:
      "A cool-climate berry that does best where summers are milder.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Plant where summers stay moderate and the soil drains well.",
      "Choose sun or light afternoon shade in warmer areas.",
      "Mulch around the base to hold moisture.",
      "Water regularly while young plants establish.",
      "Prune lightly to maintain airflow and fruiting wood.",
    ],
    seedLinks: [
      {
        label: "Buy Gooseberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=gooseberry%20seeds",
      },
      {
        label: "Buy Gooseberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=gooseberry",
      },
    ],
  },
  {
    name: "Currant",
    type: "Berry",
    icon: "🫐",
    minZone: "3a",
    maxZone: "7b",
    notes:
      "Cool-region berry crop that prefers not to bake in high heat.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Plant in a cooler-climate location with good drainage.",
      "Use compost-rich soil and keep roots evenly moist.",
      "Choose sun or light shade depending on heat in your area.",
      "Mulch to protect roots and suppress weeds.",
      "Prune older wood over time to keep plants productive.",
    ],
    seedLinks: [
      {
        label: "Buy Currant Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=currant%20seeds",
      },
      {
        label: "Buy Currant Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=currant",
      },
    ],
  },
  {
    name: "Cranberry",
    type: "Berry",
    icon: "🫐",
    minZone: "3a",
    maxZone: "7b",
    notes:
      "Best suited to cooler climates and acidic conditions.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Choose acidic soil and a site with reliable moisture.",
      "Plant in cool climates where summers are not too intense.",
      "Mulch and keep weeds down around young plants.",
      "Water regularly so roots never dry out fully.",
      "Harvest once fruits fully color and firm up.",
    ],
    seedLinks: [
      {
        label: "Buy Cranberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cranberry%20seeds",
      },
      {
        label: "Buy Cranberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cranberry",
      },
    ],
  },
  {
    name: "Boysenberry",
    type: "Berry",
    icon: "🫐",
    minZone: "5a",
    maxZone: "9b",
    notes:
      "Brambly berry plant that likes sun, support, and regular pruning.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10],
      hot: [1, 2, 11],
    },
    plantingSteps: [
      "Pick a sunny spot with room for canes and support.",
      "Plant in fertile, well-drained soil and water deeply.",
      "Train canes onto a trellis or support structure.",
      "Mulch to help hold moisture around the roots.",
      "Prune after fruiting to keep the plant manageable and productive.",
    ],
    seedLinks: [
      {
        label: "Buy Boysenberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=boysenberry%20seeds",
      },
      {
        label: "Buy Boysenberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=boysenberry",
      },
    ],
  },
  {
    name: "Marionberry",
    type: "Berry",
    icon: "🫐",
    minZone: "6a",
    maxZone: "9a",
    notes:
      "A blackberry type that does especially well in mild regions.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10],
      hot: [1, 2, 11],
    },
    plantingSteps: [
      "Grow in a mild area with sun and good airflow.",
      "Use a trellis or support to manage long canes.",
      "Plant in well-drained soil enriched with compost.",
      "Water consistently while berries are developing.",
      "Prune fruiting canes after harvest and train new ones for next season.",
    ],
    seedLinks: [
      {
        label: "Buy Marionberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=marionberry%20seeds",
      },
      {
        label: "Buy Marionberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=marionberry",
      },
    ],
  },
  {
    name: "Mulberry",
    type: "Berry",
    icon: "🫐",
    minZone: "4a",
    maxZone: "9b",
    notes:
      "Hardy fruiting tree with sweet berries and strong adaptability.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Choose a sunny site with room for a tree to spread.",
      "Plant in well-drained soil and water deeply after planting.",
      "Mulch around the root zone but keep mulch off the trunk.",
      "Prune lightly to guide shape as the tree matures.",
      "Harvest berries when they soften and darken fully.",
    ],
    seedLinks: [
      {
        label: "Buy Mulberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=mulberry%20seeds",
      },
      {
        label: "Buy Mulberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=mulberry",
      },
    ],
  },
  {
    name: "Elderberry",
    type: "Berry",
    icon: "🫐",
    minZone: "3a",
    maxZone: "9b",
    notes:
      "Shrub berry crop that appreciates moisture and benefits from multiple plants.",
    planting: {
      cool: [4, 5],
      warm: [2, 3, 10],
      hot: [1, 2, 11],
    },
    plantingSteps: [
      "Plant in a sunny to partly sunny location with steady moisture.",
      "Use more than one plant if you want stronger fruit set.",
      "Add compost before planting and mulch afterward.",
      "Water regularly while shrubs establish.",
      "Prune older stems over time to refresh growth.",
    ],
    seedLinks: [
      {
        label: "Buy Elderberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=elderberry%20seeds",
      },
      {
        label: "Buy Elderberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=elderberry",
      },
    ],
  },
  {
    name: "Serviceberry",
    type: "Berry",
    icon: "🫐",
    minZone: "4a",
    maxZone: "9a",
    notes:
      "A hardy small tree or shrub that produces sweet blueberry-like fruit.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11],
    },
    plantingSteps: [
      "Choose a sunny or lightly shaded site with good drainage.",
      "Plant as a shrub or small tree with room to mature.",
      "Water deeply after planting and mulch the base.",
      "Prune lightly to shape the plant and improve airflow.",
      "Harvest berries when they turn soft and fully colored.",
    ],
    seedLinks: [
      {
        label: "Buy Serviceberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=serviceberry%20seeds",
      },
      {
        label: "Buy Serviceberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=serviceberry",
      },
    ],
  },
  {
    name: "Lingonberry",
    type: "Berry",
    icon: "🫐",
    minZone: "3a",
    maxZone: "7b",
    notes:
      "Cold-loving berry plant that prefers acidic soil and cooler summers.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Plant in acidic soil where summers stay on the cooler side.",
      "Choose a sunny or lightly shaded location.",
      "Mulch around roots to help hold moisture and protect the soil.",
      "Keep watering steady while plants establish.",
      "Harvest berries once they develop full color and firmness.",
    ],
    seedLinks: [
      {
        label: "Buy Lingonberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=lingonberry%20seeds",
      },
      {
        label: "Buy Lingonberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=lingonberry",
      },
    ],
  },
  {
    name: "Huckleberry",
    type: "Berry",
    icon: "🫐",
    minZone: "4a",
    maxZone: "8b",
    notes:
      "Berry crop that tends to prefer woodland-style conditions and milder summers.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Choose a site with mild conditions and organic-rich soil.",
      "Use light shade if your summers are warm.",
      "Water gently but regularly while plants take hold.",
      "Mulch to create cooler, woodland-like root conditions.",
      "Harvest when berries are fully colored and soften slightly.",
    ],
    seedLinks: [
      {
        label: "Buy Huckleberry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=huckleberry%20seeds",
      },
      {
        label: "Buy Huckleberry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=huckleberry",
      },
    ],
  },

  {
    name: "Apple",
    type: "Fruit Tree",
    icon: "🍎",
    minZone: "3a",
    maxZone: "8b",
    notes:
      "Most varieties need another apple tree nearby for pollination.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Choose a sunny location with room for the tree to mature.",
      "Plant during the cool season while the tree is dormant or settling in.",
      "Dig a hole wider than the root ball and plant at soil level.",
      "Water deeply after planting and mulch around the base.",
      "Plan for pollination by growing another compatible apple nearby if needed.",
    ],
    seedLinks: [
      {
        label: "Buy Apple Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=apple%20seeds",
      },
      {
        label: "Buy Apple Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=apple",
      },
    ],
  },
  {
    name: "Pear",
    type: "Fruit Tree",
    icon: "🍐",
    minZone: "4a",
    maxZone: "9a",
    notes:
      "Reliable fruit tree that benefits from pruning and pollination planning.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant in full sun with enough room for a mature tree.",
      "Use well-drained soil and dig a wide planting hole.",
      "Set the tree at the same depth it was previously growing.",
      "Water deeply and mulch around the root zone.",
      "Prune to build a strong structure and plan for pollination if needed.",
    ],
    seedLinks: [
      {
        label: "Buy Pear Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=pear%20seeds",
      },
      {
        label: "Buy Pear Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=pear",
      },
    ],
  },
  {
    name: "Peach",
    type: "Fruit Tree",
    icon: "🍑",
    minZone: "5a",
    maxZone: "9b",
    notes:
      "Sun-loving tree that benefits from yearly pruning and airflow.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Choose a sunny site with good airflow and drainage.",
      "Plant while conditions are mild and roots can settle in.",
      "Set the tree at soil level and water deeply.",
      "Mulch lightly and keep the trunk area clear.",
      "Prune yearly to maintain shape, airflow, and fruiting wood.",
    ],
    seedLinks: [
      {
        label: "Buy Peach Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=peach%20seeds",
      },
      {
        label: "Buy Peach Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=peach",
      },
    ],
  },
  {
    name: "Plum",
    type: "Fruit Tree",
    icon: "🍑",
    minZone: "4a",
    maxZone: "9b",
    notes:
      "Fruit tree that performs best with good sun and variety planning.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Plant in full sun with well-drained soil.",
      "Dig a hole wider than the roots and set the tree at soil level.",
      "Water deeply right after planting.",
      "Mulch the base and leave space around the trunk.",
      "Check whether your variety needs another plum nearby for pollination.",
    ],
    seedLinks: [
      {
        label: "Buy Plum Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=plum%20seeds",
      },
      {
        label: "Buy Plum Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=plum",
      },
    ],
  },
  {
    name: "Cherry",
    type: "Fruit Tree",
    icon: "🍒",
    minZone: "4a",
    maxZone: "8b",
    notes:
      "Prefers cooler winter climates and good pruning structure.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Choose a sunny spot with excellent drainage.",
      "Plant during the cool season so roots can settle in.",
      "Water deeply after planting and mulch the surrounding soil.",
      "Prune to build a strong branch structure and airflow.",
      "Check if your variety needs a pollination partner nearby.",
    ],
    seedLinks: [
      {
        label: "Buy Cherry Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cherry%20seeds",
      },
      {
        label: "Buy Cherry Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cherry",
      },
    ],
  },
  {
    name: "Apricot",
    type: "Fruit Tree",
    icon: "🍑",
    minZone: "5a",
    maxZone: "8b",
    notes:
      "Early blooming tree that can be sensitive to late frosts.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2],
    },
    plantingSteps: [
      "Choose a protected sunny site with good air drainage.",
      "Plant while weather is still mild and not overly hot.",
      "Set roots at the proper depth and water deeply.",
      "Mulch to regulate soil moisture around the base.",
      "Watch for late frost risk because blooms can open early.",
    ],
    seedLinks: [
      {
        label: "Buy Apricot Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=apricot%20seeds",
      },
      {
        label: "Buy Apricot Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=apricot",
      },
    ],
  },
  {
    name: "Fig",
    type: "Fruit Tree",
    icon: "🍈",
    minZone: "7a",
    maxZone: "10b",
    notes:
      "Thrives in warm climates and often produces heavily once established.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a warm sunny site with good drainage.",
      "Plant where the tree will have room and heat to mature well.",
      "Water deeply after planting and mulch the root zone.",
      "Prune lightly to control shape if needed.",
      "Protect young trees from unusual cold in borderline climates.",
    ],
    seedLinks: [
      {
        label: "Buy Fig Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=fig%20seeds",
      },
      {
        label: "Buy Fig Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=fig",
      },
    ],
  },
  {
    name: "Pomegranate",
    type: "Fruit Tree",
    icon: "🍎",
    minZone: "7a",
    maxZone: "10b",
    notes:
      "Handles heat well and is a strong option for hotter drier climates.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a sunny location with excellent drainage.",
      "Plant during mild weather so roots can establish well.",
      "Water deeply after planting, then avoid keeping soil soggy.",
      "Mulch around the base to help regulate moisture.",
      "Prune lightly to shape the tree and open the center.",
    ],
    seedLinks: [
      {
        label: "Buy Pomegranate Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=pomegranate%20seeds",
      },
      {
        label: "Buy Pomegranate Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=pomegranate",
      },
    ],
  },
  {
    name: "Grape",
    type: "Fruit",
    icon: "🍇",
    minZone: "4a",
    maxZone: "10b",
    notes:
      "Needs sun, pruning, and support but can be very productive over time.",
    planting: {
      cool: [4, 5],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose full sun and install a trellis or support system.",
      "Plant vines in well-drained soil with good airflow.",
      "Water deeply after planting and mulch the base lightly.",
      "Train new vines early so the plant develops strong structure.",
      "Prune every season to maintain fruit quality and size.",
    ],
    seedLinks: [
      {
        label: "Buy Grape Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=grape%20seeds",
      },
      {
        label: "Buy Grape Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=grape",
      },
    ],
  },
  {
    name: "Watermelon",
    type: "Fruit",
    icon: "🍉",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "Needs heat, sun, and a long enough season to ripen well.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Plant only after the weather and soil are fully warm.",
      "Choose a sunny area with rich soil and lots of space for vines.",
      "Sow seeds or plant starts carefully without disturbing roots too much.",
      "Water deeply and keep the soil evenly moist while fruits size up.",
      "Harvest when the fruit sounds hollow and the underside turns creamy.",
    ],
    seedLinks: [
      {
        label: "Buy Watermelon Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=watermelon%20seeds",
      },
      {
        label: "Buy Watermelon Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=watermelon",
      },
    ],
  },
  {
    name: "Cantaloupe",
    type: "Fruit",
    icon: "🍈",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "Loves warm weather and rich soil with steady moisture.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Wait for stable warm weather before planting.",
      "Choose full sun and loose, fertile soil.",
      "Space plants well so vines can spread and breathe.",
      "Water consistently, especially as fruits begin forming.",
      "Harvest when melons turn fragrant and slip easily from the vine.",
    ],
    seedLinks: [
      {
        label: "Buy Cantaloupe Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=cantaloupe%20seeds",
      },
      {
        label: "Buy Cantaloupe Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=cantaloupe",
      },
    ],
  },
  {
    name: "Honeydew",
    type: "Fruit",
    icon: "🍈",
    minZone: "5a",
    maxZone: "10b",
    notes:
      "A warm-season melon that needs time and sun to sweeten fully.",
    planting: {
      cool: [5, 6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Plant after the soil warms and nights stay mild.",
      "Choose a sunny bed with rich, well-drained soil.",
      "Give vines plenty of room to spread.",
      "Water deeply and evenly as fruits grow.",
      "Harvest once fruits color up and show signs of full ripeness.",
    ],
    seedLinks: [
      {
        label: "Buy Honeydew Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=honeydew%20seeds",
      },
      {
        label: "Buy Honeydew Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=honeydew",
      },
    ],
  },
  {
    name: "Lemon",
    type: "Fruit Tree",
    icon: "🍋",
    minZone: "8b",
    maxZone: "10b",
    notes:
      "Best grown in warm climates or containers in cooler regions.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a warm sunny spot protected from hard freezes.",
      "Use well-drained soil or a large container if growing outside the warmest zones.",
      "Plant at the same depth as the nursery container.",
      "Water deeply and let the top of the soil dry slightly between waterings.",
      "Protect young trees during cold snaps.",
    ],
    seedLinks: [
      {
        label: "Buy Lemon Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=lemon%20seeds",
      },
      {
        label: "Buy Lemon Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=lemon",
      },
    ],
  },
  {
    name: "Orange",
    type: "Fruit Tree",
    icon: "🍊",
    minZone: "8b",
    maxZone: "10b",
    notes:
      "A warm-climate citrus tree that needs protection from hard freezes.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Plant in full sun where the tree gets warmth all day.",
      "Use well-drained soil and avoid low, cold spots.",
      "Water deeply after planting and mulch the root zone lightly.",
      "Do not let the tree sit in soggy soil.",
      "Protect from freezes, especially while young.",
    ],
    seedLinks: [
      {
        label: "Buy Orange Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=orange%20seeds",
      },
      {
        label: "Buy Orange Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=orange",
      },
    ],
  },
  {
    name: "Lime",
    type: "Fruit Tree",
    icon: "🍋",
    minZone: "9a",
    maxZone: "10b",
    notes:
      "Tender citrus that prefers real warmth and shelter from cold snaps.",
    planting: {
      cool: [6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose the warmest, sunniest location available.",
      "Plant in fast-draining soil or a container with drainage holes.",
      "Water deeply but avoid overly wet roots.",
      "Mulch lightly while keeping space clear around the trunk.",
      "Bring container plants in or protect them during cold weather.",
    ],
    seedLinks: [
      {
        label: "Buy Lime Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=lime%20seeds",
      },
      {
        label: "Buy Lime Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=lime",
      },
    ],
  },
  {
    name: "Grapefruit",
    type: "Fruit Tree",
    icon: "🍊",
    minZone: "9a",
    maxZone: "10b",
    notes:
      "Best in long warm seasons with plenty of sunlight.",
    planting: {
      cool: [6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Plant in full sun with room for the tree to spread.",
      "Use well-drained soil and water deeply after planting.",
      "Keep young trees consistently watered while they establish.",
      "Mulch to help regulate moisture around the roots.",
      "Protect from hard cold if temperatures dip unusually low.",
    ],
    seedLinks: [
      {
        label: "Buy Grapefruit Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=grapefruit%20seeds",
      },
      {
        label: "Buy Grapefruit Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=grapefruit",
      },
    ],
  },
  {
    name: "Mandarin",
    type: "Fruit Tree",
    icon: "🍊",
    minZone: "8b",
    maxZone: "10b",
    notes:
      "Compact citrus option that grows well in warm climates and containers.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a sunny spot or a large container with drainage.",
      "Plant in well-drained soil and water deeply after planting.",
      "Keep roots evenly moist while the tree gets established.",
      "Feed and prune lightly to maintain healthy growth.",
      "Protect container or young trees during unexpected cold weather.",
    ],
    seedLinks: [
      {
        label: "Buy Mandarin Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=mandarin%20seeds",
      },
      {
        label: "Buy Mandarin Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=mandarin",
      },
    ],
  },
  {
    name: "Tangerine",
    type: "Fruit Tree",
    icon: "🍊",
    minZone: "8b",
    maxZone: "10b",
    notes:
      "Sweet citrus that likes heat, sun, and protection from hard freezes.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Plant in full sun where the tree gets steady warmth.",
      "Choose soil with excellent drainage.",
      "Water deeply after planting and keep young roots moist.",
      "Mulch lightly and avoid piling mulch against the trunk.",
      "Protect from hard freezes while the tree is young.",
    ],
    seedLinks: [
      {
        label: "Buy Tangerine Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=tangerine%20seeds",
      },
      {
        label: "Buy Tangerine Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=tangerine",
      },
    ],
  },
  {
    name: "Meyer Lemon",
    type: "Fruit Tree",
    icon: "🍋",
    minZone: "8b",
    maxZone: "10b",
    notes:
      "Popular container citrus with slightly better cold tolerance than many lemons.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Grow in full sun, especially if you want heavy fruiting.",
      "Use a well-drained bed or a roomy container with drainage.",
      "Water thoroughly and let excess water drain away.",
      "Feed regularly during active growth for better fruit set.",
      "Bring container trees to shelter if cold weather is expected.",
    ],
    seedLinks: [
      {
        label: "Buy Meyer Lemon Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=meyer%20lemon%20seeds",
      },
      {
        label: "Buy Meyer Lemon Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=meyer%20lemon",
      },
    ],
  },
  {
    name: "Avocado",
    type: "Fruit Tree",
    icon: "🥑",
    minZone: "9a",
    maxZone: "10b",
    notes:
      "A warm-climate tree that dislikes hard freezes and soggy roots.",
    planting: {
      cool: [6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a warm site with sun and fast-draining soil.",
      "Plant carefully because avocado roots do not like staying wet.",
      "Water deeply after planting, then avoid soggy conditions.",
      "Mulch lightly to protect roots without burying the trunk.",
      "Protect young trees from hard cold or strong wind.",
    ],
    seedLinks: [
      {
        label: "Buy Avocado Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=avocado%20seeds",
      },
      {
        label: "Buy Avocado Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=avocado",
      },
    ],
  },
  {
    name: "Banana",
    type: "Fruit",
    icon: "🍌",
    minZone: "9a",
    maxZone: "10b",
    notes:
      "Tropical fruit plant that loves heat, moisture, and rich soil.",
    planting: {
      cool: [6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Choose a warm, sheltered spot with rich soil.",
      "Plant where the soil stays moist but drains well.",
      "Water regularly because bananas love steady moisture.",
      "Feed well during active growth for larger leaves and fruiting.",
      "Protect from cold and strong wind whenever possible.",
    ],
    seedLinks: [
      {
        label: "Buy Banana Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=banana%20seeds",
      },
      {
        label: "Buy Banana Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=banana",
      },
    ],
  },
  {
    name: "Papaya",
    type: "Fruit",
    icon: "🍈",
    minZone: "9b",
    maxZone: "10b",
    notes:
      "Fast-growing tropical fruit that needs warmth year-round.",
    planting: {
      cool: [6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Plant only in a warm, frost-free location.",
      "Choose full sun and light, fast-draining soil.",
      "Water steadily while the plant is growing fast.",
      "Avoid waterlogged roots and cold snaps.",
      "Harvest fruits when they begin changing color and soften slightly.",
    ],
    seedLinks: [
      {
        label: "Buy Papaya Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=papaya%20seeds",
      },
      {
        label: "Buy Papaya Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=papaya",
      },
    ],
  },
  {
    name: "Pineapple",
    type: "Fruit",
    icon: "🍍",
    minZone: "9b",
    maxZone: "10b",
    notes:
      "Slow but rewarding tropical plant that does well in containers too.",
    planting: {
      cool: [6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Grow in a warm sunny spot or a container with drainage.",
      "Use light, well-drained soil and avoid soggy roots.",
      "Water regularly but let the soil dry a bit between soakings.",
      "Be patient because pineapples take time to size up.",
      "Protect from cold weather if you are near the lower end of its range.",
    ],
    seedLinks: [
      {
        label: "Buy Pineapple Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=pineapple%20seeds",
      },
      {
        label: "Buy Pineapple Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=pineapple",
      },
    ],
  },
  {
    name: "Mango",
    type: "Fruit Tree",
    icon: "🥭",
    minZone: "10a",
    maxZone: "10b",
    notes:
      "True tropical fruit tree that wants heat, sun, and frost-free conditions.",
    planting: {
      cool: [6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Choose a hot, frost-free location with full sun.",
      "Plant in fast-draining soil and avoid low wet spots.",
      "Water deeply after planting, then allow good drainage.",
      "Give the tree room since it can become large over time.",
      "Protect young trees until they are well established.",
    ],
    seedLinks: [
      {
        label: "Buy Mango Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=mango%20seeds",
      },
      {
        label: "Buy Mango Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=mango",
      },
    ],
  },
  {
    name: "Guava",
    type: "Fruit Tree",
    icon: "🍐",
    minZone: "9b",
    maxZone: "10b",
    notes:
      "Warm-climate fruit tree that can also work well in protected containers.",
    planting: {
      cool: [6],
      warm: [4, 5],
      hot: [3, 4, 5],
    },
    plantingSteps: [
      "Plant in a sunny, warm location with good drainage.",
      "Use a container if you need extra cold protection.",
      "Water deeply after planting and mulch the base.",
      "Prune lightly to shape and manage size.",
      "Protect from cold if temperatures drop unexpectedly.",
    ],
    seedLinks: [
      {
        label: "Buy Guava Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=guava%20seeds",
      },
      {
        label: "Buy Guava Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=guava",
      },
    ],
  },
  {
    name: "Passionfruit",
    type: "Fruit",
    icon: "🍇",
    minZone: "9a",
    maxZone: "10b",
    notes:
      "A vigorous vine that likes warmth, support, and regular watering.",
    planting: {
      cool: [6],
      warm: [4, 5],
      hot: [3, 4, 5, 10],
    },
    plantingSteps: [
      "Choose a warm sunny area and provide strong support for the vine.",
      "Plant in rich, well-drained soil with room to spread.",
      "Water regularly while the vine is establishing and flowering.",
      "Guide new growth onto the support structure early.",
      "Prune to manage size and keep the vine productive.",
    ],
    seedLinks: [
      {
        label: "Buy Passionfruit Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=passionfruit%20seeds",
      },
      {
        label: "Buy Passionfruit Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=passionfruit",
      },
    ],
  },
  {
    name: "Kiwi",
    type: "Fruit",
    icon: "🥝",
    minZone: "7a",
    maxZone: "9b",
    notes:
      "Vining fruit that needs support and usually separate pollination planning.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Plant in full sun with strong support already in place.",
      "Choose fertile, well-drained soil and plenty of space.",
      "Water deeply while vines are getting established.",
      "Train vines early and prune regularly for shape and fruiting.",
      "Check if you need both male and female plants for pollination.",
    ],
    seedLinks: [
      {
        label: "Buy Kiwi Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=kiwi%20seeds",
      },
      {
        label: "Buy Kiwi Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=kiwi",
      },
    ],
  },
  {
    name: "Persimmon",
    type: "Fruit Tree",
    icon: "🍊",
    minZone: "7a",
    maxZone: "10a",
    notes:
      "Adaptable fruit tree that handles heat well once established.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a sunny site with room for a small to medium tree.",
      "Plant in well-drained soil during mild weather.",
      "Water deeply right after planting and mulch around the base.",
      "Prune lightly while the tree is young to shape it.",
      "Harvest fruits when they reach mature color and texture.",
    ],
    seedLinks: [
      {
        label: "Buy Persimmon Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=persimmon%20seeds",
      },
      {
        label: "Buy Persimmon Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=persimmon",
      },
    ],
  },
  {
    name: "Nectarine",
    type: "Fruit Tree",
    icon: "🍑",
    minZone: "5a",
    maxZone: "9b",
    notes:
      "Very similar to peach and appreciates sun, pruning, and airflow.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11, 12],
    },
    plantingSteps: [
      "Choose full sun and a spot with good air movement.",
      "Plant during mild weather and water deeply afterward.",
      "Mulch lightly to help hold moisture around the roots.",
      "Prune each year to keep the canopy open.",
      "Harvest fruits once they color up and soften slightly.",
    ],
    seedLinks: [
      {
        label: "Buy Nectarine Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=nectarine%20seeds",
      },
      {
        label: "Buy Nectarine Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=nectarine",
      },
    ],
  },
  {
    name: "Quince",
    type: "Fruit Tree",
    icon: "🍐",
    minZone: "5a",
    maxZone: "9a",
    notes:
      "Old-fashioned fruit tree that grows well in sunny temperate gardens.",
    planting: {
      cool: [4, 5],
      warm: [2, 3],
      hot: [1, 2, 11],
    },
    plantingSteps: [
      "Plant in a sunny location with temperate growing conditions.",
      "Use well-drained soil and a wide planting hole.",
      "Water deeply after planting and mulch lightly.",
      "Prune to shape the tree and improve airflow.",
      "Harvest fruits once they fully color and ripen.",
    ],
    seedLinks: [
      {
        label: "Buy Quince Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=quince%20seeds",
      },
      {
        label: "Buy Quince Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=quince",
      },
    ],
  },
  {
    name: "Loquat",
    type: "Fruit Tree",
    icon: "🍊",
    minZone: "8a",
    maxZone: "10b",
    notes:
      "Warm-climate fruit tree with attractive foliage and sweet tart fruit.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose a warm sunny site with good drainage.",
      "Plant where the tree gets some protection from harsh cold.",
      "Water deeply after planting and mulch the base.",
      "Prune lightly to shape and maintain airflow.",
      "Harvest fruit once it softens and develops full color.",
    ],
    seedLinks: [
      {
        label: "Buy Loquat Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=loquat%20seeds",
      },
      {
        label: "Buy Loquat Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=loquat",
      },
    ],
  },
  {
    name: "Olive",
    type: "Fruit Tree",
    icon: "🫒",
    minZone: "8a",
    maxZone: "10b",
    notes:
      "Best in hot dry climates with excellent drainage and lots of sun.",
    planting: {
      cool: [5, 6],
      warm: [3, 4],
      hot: [2, 3, 10],
    },
    plantingSteps: [
      "Choose full sun and very well-drained soil.",
      "Plant during mild weather in a site that stays on the dry side.",
      "Water deeply while young, then avoid overly wet conditions.",
      "Prune lightly to shape and improve airflow.",
      "Grow best in hot, bright climates with low humidity.",
    ],
    seedLinks: [
      {
        label: "Buy Olive Seeds - Burpee",
        url: "https://www.burpee.com/search?searchTerm=olive%20seeds",
      },
      {
        label: "Buy Olive Seeds - Baker Creek",
        url: "https://www.rareseeds.com/store/search?search=olive",
      },
    ],
  },
];

export default produceData;