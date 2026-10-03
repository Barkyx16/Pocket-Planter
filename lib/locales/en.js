// English source strings. This file is the reference dictionary: every other
// locale is validated against its key set, and any key missing elsewhere falls
// back to the value here.
//
// Placeholders use {braces} and are interpolated by t(). Keep them identical
// across locales — the tests assert this.

export default {

  gettingStarted: {
    title: "Get growing",
    subtitle: "{done} of {total} done — a few taps to your first garden",
    setZone: "Set your growing zone",
    savePlant: "Save your first plant",
    addToBed: "Add a plant to a garden bed",
    logWater: "Log your first watering",
    addPhoto: "Add your first garden photo",
    dismiss: "Dismiss",
    done: "done",
  },


  common: {
    save: "Save",
    done: "Done",
    reset: "Reset",
    back: "Back",
    compare: "Compare",
    claim: "Claim",
    cancel: "Cancel",
    delete: "Delete",
    ok: "OK",
    notNow: "Not now",
    gotIt: "Got it",
    openSettings: "Open Settings",
    turnOn: "Turn On",
    maybeLater: "Maybe later",
    noThanks: "No thanks",
    somethingWrong: "Something went wrong",
    pleaseTryAgain: "Please try again.",
  },

  language: {
    title: "🌐 Language",
    body: "Choose the language Pocket Planter uses.",
    select: "Select a language",
  },

  tabs: {
    more: "More",
    home: "Home",
    plants: "Plants",
    garden: "Garden",
    weather: "Weather",
    journal: "Journal",
    quests: "Quests",
    settings: "Settings",
    premium: "Premium",
  },

  settings: {
    cloudSave: "☁️ Cloud Save Connected",
    smartReminders: "Smart Reminders",
    haptics: "📳 Haptics",
    hapticsLabel: "Haptic feedback",
    hapticsBody: "Vibration feedback on taps and actions.",
    units: "📏 Units",
    unitsBody: "Choose how temperatures and rainfall are shown across the app.",
    unitsImperial: "°F · inches",
    unitsMetric: "°C · mm",
    yearInReview: "🌻 Year in Review",
    shareGarden: "📤 SHARE YOUR GARDEN",
    exportBackup: "💾 Export & Backup",
    premiumBilling: "👑 Premium & Billing",
    everythingYouNeedToPlan: "Everything you need to plan, track, and grow a thriving garden — all in one place.",
    subscribeToPocketPlanterPremium: "Subscribe to Pocket Planter Premium",
    opening: "Opening…",
    unlockPremium: "Unlock Premium 🌱",
    cancelAnytimeRestoresOnNew: "Cancel anytime • Restores on new device",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms of Use",
    restorePreviousPurchases: "Restore previous purchases",
    restoring: "Restoring…",
    restorePurchases: "↩️ Restore Purchases",
    manageOrCancelYourSubscription: "Manage or cancel your subscription",
    manageOrCancelSubscription: "⚙️ Manage or Cancel Subscription",
    cancelAnytime: "Cancel anytime",
    cloudSync: "Cloud sync",
    developerTools: "🛠 DEVELOPER TOOLS",
    removeBeforeAppStoreSubmission: "Remove before App Store submission",
    dumpScheduledReminders: "Dump Scheduled Reminders",
    logsEveryScheduledNotificationTrigger: "Logs every scheduled notification + trigger to console",
    fireTestNotification5s: "Fire Test Notification (5s)",
    verifiesTheFullPipelineBackground: "Verifies the full pipeline — background the app to see it appear",
    clearAllScheduled: "Clear All Scheduled",
    onetimeFlushToRemoveOrphaned: "One-time flush to remove orphaned legacy reminders",
    premiumOnTapToDisable: "Premium ON — Tap to disable",
    unlockFullAppDev: "Unlock Full App (Dev)",
    togglesAllPremiumLocksOn: "Toggles all premium locks on and off",
    settings: "⚙️ Settings",
    yourAccountRemindersAndData: "Your account, reminders, and data.",
    myGardenReminders: "🔔 MY GARDEN REMINDERS",
    exportAsCsv: "📄 EXPORT AS CSV",
    photoStorage: "📸 PHOTO STORAGE",
  },

  auth: {
    heroSignup: "Create your\ngarden account",
    heroLogin: "Welcome back,\ngardener",
    subSignup: "Start growing smarter — free to begin.",
    subLogin: "Log in to pick up where you left off.",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signUp: "Sign Up",
    logIn: "Log In",
    switchToLogin: "Already have an account? Log in",
    switchToSignup: "Need an account? Sign up",
    forgotPassword: "Forgot password?",
    resetEyebrow: "🔒 RESET PASSWORD",


    errWrongPassword: "That email and password don't match.",

    errEmailNotConfirmed: "Confirm your email first. Check your inbox for the link we sent.",

    errAccountExists: "There's already an account with that email. Try signing in.",

    errWeakPassword: "Choose a stronger password, at least 6 characters.",

    errTooManyTries: "Too many attempts. Wait a minute and try again.",

    errBadEmail: "That email address doesn't look right.",

    errSignupClosed: "New sign-ups are paused right now.",

    errOffline: "Can't reach the server. Check your connection and try again.",
    linkSignInTitle: "Sign in from this link?",

    linkSignInBody: "This link signs you in as {email}. Only continue if you asked for it, for example to reset your password.",

    linkSignInConfirm: "Sign in",

    linkExpiredTitle: "Link expired",

    linkExpiredBody: "This link has expired or was already used. Request a new one from the app.",
    signInWithBiometric: "Sign in with {label}",
    enableBiometricTitle: "Enable {label}?",
    enableBiometricBody: "Sign in faster next time with {label} instead of typing your password.",
    enableBiometricConfirm: "Enable {label}",
    biometricFailedTitle: "{label} sign-in failed",
    setNewPasswordTitle: "Set a new password",
    setNewPasswordBody: "Enter a new password for your account.",
    newPasswordPlaceholder: "New password",
    tooShortTitle: "Too short",
    tooShortBody: "Password must be at least 6 characters.",
    updateFailedTitle: "Couldn't update password",
    passwordUpdatedTitle: "Password updated ✅",
    passwordUpdatedBody: "Your password has been changed. You're all set.",
    updatePasswordButton: "Update password",
    checkEmailTitle: "Check Your Email 📧",
    confirmSentBody: "Your account was created! We've sent a confirmation email — please open it and confirm your email address before logging in.",
    signInPrompt: "Please sign in with your email and password.",
    enterEmailTitle: "Enter Your Email",
    enterEmailBody: "Type your email address in the field above first, then tap Forgot Password.",
    resetFailed: "Reset Failed",
    resetSentBody: "If an account exists for that email, a password reset link is on its way.",
  },

  notify: {
    channelName: "Garden Reminders",

    plantCheckTitle: "🌱 Good morning! Check on your {plant}",

    plantCheckBody: "Time for your daily {plant} check-in. Water if the top inch of soil feels dry.",

    recapTitle: "🌻 Your Garden Week",

    recapWaterings: { one: "💧 {count} watering", other: "💧 {count} waterings" },

    recapPhotos: { one: "📸 {count} photo", other: "📸 {count} photos" },

    recapStreak: { one: "🔥 {count}-day streak", other: "🔥 {count}-day streak" },

    recapEmpty: "A fresh week in the garden starts today 🌱 Open Pocket Planter to check on your plants.",

    recapBody: "This week: {parts}. Tap to see your full garden recap 🌿",

    fertilizeTitle: "🌾 Time to fertilize {plant}",

    fertilizeBody: { one: "It's been {count} day since you last fed {plant}. Check if it's ready for another feeding.", other: "It's been {count} days since you last fed {plant}. Check if it's ready for another feeding." },

    harvestTitle: "🎉 Harvest Ready",

    harvestBody: "{plant} should be ready to harvest today.",

    waterTitle: "💧 Time to water {plant}",

    waterBodyRhythm: "Based on your rhythm, {plant} is about due for a drink.",

    waterBodyDefault: "{plant} is likely ready for water — check if the top inch of soil feels dry.",

    frostTitleTonight: "❄️ Frost expected tonight",

    frostTitleTomorrow: "❄️ Frost expected tomorrow night",

    frostTitleInDays: { one: "❄️ Frost expected in {count} day", other: "❄️ Frost expected in {count} days" },

    frostBody: "Low of {temp} coming — cover tender plants and move containers to shelter before dark.",

    heatTitle: "🔥 Extreme heat today — {temp}",

    heatBody: "Water deeply before 9 AM, shade young transplants, and hold off on planting until it cools.",

    frostCheckTitle: "❄️ Frost Check",

    frostCheckBody: "Cold season is here — open Pocket Planter to see if frost is coming and protect your tender plants.",

    monthlyGuideTitle: "🌱 {month} Planting Guide",

    monthlyGuideBody: "Open Pocket Planter to see what to plant this month in your zone.",

    snoozeTitle: { one: "🌱 A plant is off snooze", other: "🌱 {count} plants are off snooze" },

    snoozeBody: { one: "{plants} is ready for water 🌱", other: "{plants} are ready for water 🌱" },

    snoozeBodyMore: "{plants}, and {more} more are ready for water 🌱",
    disabledTitle: "Notifications Disabled",
    offTitle: "Notifications are off",
    promptTitle: "Stay on top of your garden 🌱",
    dailyWaterTitle: "💧 Daily Watering Check",
    dailyWaterBody: "Time to check your garden and water any plants that need moisture today.",
    plantPickTitle: "🌱 Today's Plant Pick",
    plantPickBody: "A fresh plant recommendation is waiting — open Pocket Planter to see what to grow today.",
    plantOfDayOnTitle: "Plant of the Day On 🌱",
    plantOfDayOnBody: "You'll get a daily plant pick every morning at 8:30 AM.",
    plantOfDayOffTitle: "Plant of the Day Off",
    plantOfDayOffBody: "You'll no longer get daily plant pick notifications.",
    weeklyRecapOnTitle: "Weekly Recap On 🌻",
    weeklyRecapOnBody: "You'll get your garden week every Sunday evening.",
    weeklyRecapOffTitle: "Weekly Recap Off",
    weeklyRecapOffBody: "You'll no longer receive the Sunday recap.",
    enableForRecap: "Turn on notifications to get your weekly garden recap.",
    enableForPicks: "Enable notifications in your phone settings to get daily plant picks.",
    enableForFertilizer: "Enable notifications in your phone settings to get fertilizer reminders.",
    enableForPlants: "Enable notifications in your phone settings to receive plant reminders.",
    reminderSet: "Reminder Set! 🌱",
    reminderSetFertilizer: "Reminder Set 🌾",
    reminderFailed: "Could not set reminder. Please try again.",
    enableFirstTitle: "Enable Reminders First",
    enableFirstBody: "Go to the Garden tab and turn on Watering Reminders before adding plant reminders.",
    timePrompt: "What time would you like your daily check-in reminder?",
  },

  backup: {
    restoreButton: "Restore",
    invalidTitle: "Invalid backup",
    invalidPasteBody: "That doesn't look right. Paste the full text from a Pocket Planter backup.",
    notBackupBody: "This isn't a Pocket Planter backup. Paste the full exported text.",
    restoreTitle: "Restore this backup?",
    restoreBody: "This replaces your current garden data with the backup. This can't be undone.",
    restoredTitle: "Restored ✅",
    restoredBody: "Your garden data has been restored from the backup.",
  },

  garden: {
    goalReachedTitle: "GOAL REACHED!",
    goalReachedBody: { one: "You hit your season goal of {count} harvest. What a season! 🌻", other: "You hit your season goal of {count} harvests. What a season! 🌻" },
    deleteCount: { one: "Delete {count}", other: "Delete {count}" },
    savePlant: "Save plant",
    olderThanYear: "1 year",
    olderThanSixMonths: "6 months",
    conflictFixMove: "Move {plant} to {bed} — it has room and no conflicts there.",
    conflictFixEither: "Move {plantA} or {plantB} to a different bed to give them space.",
    bedConflictBody: "{plantA} and {plantB} shouldn't share {bed} — they compete for nutrients and root space, or attract the same pests.\n\n✅ Fix: {fix}",
    conflictMoveButton: "Move {plant}",
    undo: "Undo",
    photoDeleted: "Photo deleted",
    snoozedUntilTomorrow: "{plant} snoozed until tomorrow",
    unfollowed: "Unfollowed {plant}",
    following: "Following {plant} — you'll see its seasonal tips",

    nPlants: { one: "{count} plant", other: "{count} plants" },

    nConflicts: { one: "{count} conflict", other: "{count} conflicts" },

    needMoreSpace: { one: "({count} would need more space)", other: "({count} would need more space)" },

    optimizePrompt: "This will move {moved} and resolve {resolved} of {conflicts}{extra}. Apply it?",

    optimizedSome: "Moved {moved} to better beds. {remain}; add more bed space to fix the rest.",

    conflictsRemain: { one: "{count} conflict remains", other: "{count} conflicts remain" },

    optimizedAll: "Moved {moved}. Every companion conflict is now resolved!",

    conflictBody: "{plant} doesn't pair well with {others} in the same bed. They can compete or attract the same pests. It's still planted; just something to keep in mind. Open Companion Check for a one-tap fix.",

    placedBody: "{plant} was placed in {bed}.",

    done: "Done",

    harvestSavedBody: "{plant} harvest saved to your garden record.",

    areaAllWatered: "Every plant in {area} is already watered today. 🌱",

    fertilizerReminderBody: { one: "You'll get a reminder to fertilize {plant} in {count} day.", other: "You'll get a reminder to fertilize {plant} in {count} days." },

    reminderSetBody: "You'll get a daily {plant} check-in at {time} every morning.",

    notifyOffBody: "Turn on notifications for Pocket Planter in your phone's Settings to get watering, frost, and harvest reminders.",

    notifyPromptBody: "Pocket Planter can remind you when to water, warn you before frost or heat, and tell you when plants are ready to harvest. Turn on notifications?",

    streakSaveBody: "You missed a day, so your streak reset. Use your weekly Streak Freeze to restore your {count}-day streak?",

    noFreezeBody: "You've already used your streak freeze this week. It refreshes at the start of next week. ❄️",

    frozenBody: "Your streak is protected for today. Even if you miss watering, it won't reset. Come back tomorrow!",

    streakRestored: "❄️ {count}-day streak restored!",

    streakPopup: "🔥 {count}-day streak!",

    wateredCount: { one: "💧 Watered {count} plant!", other: "💧 Watered {count} plants!" },

    wateredPlant: "💧 Watered {plant}!",

    wateredArea: "💧 Watered {area}!",

    premiumActivated: "Pocket Planter {plan} activated successfully.",

    planMonthly: "Monthly",

    planYearly: "Yearly",
    careFertilizerTools: "🌿 Care, Fertilizer & Tools",
    tabCare: "🌱 Care",
    tabFertilizer: "🧪 Fertilizer",
    tabShopTools: "🛒 Shop & Tools",
    allWateredTitle: "All watered",
    allWateredBody: "Every saved plant is already watered today. 🌱",
    harvestLogged: "Harvest logged! 🎉",
    conflictTitle: "⚠️ Companion conflict",
    addedTitle: "Added to your garden 🌱",
    openGarden: "Open Garden",
    looksGreatTitle: "Garden looks great! 🌿",
    looksGreatBody: "No companion conflicts to fix — your layout is already harmonious.",
    optimizeTitle: "Auto-optimize layout?",
    optimizeConfirm: "✨ Optimize",
    optimizedTitle: "Garden optimized! 🌿",
    deleteAreaTitle: "Delete this area?",
    deleteAreaBody: "This removes the area and everything planted in it. This cannot be undone.",
    gardenMapCompanionHelp: "Garden Map & Companion Help",
    buildYourFirstGarden: "Build Your First Garden",
    saveAFewPlantsFirst: "Save a few plants first, then place them into your garden layout and track companion planting compatibility.",
    quickAddPlants: "⚡ Quick Add Plants",
    closeQuickAdd: "✕ Close Quick Add",
    plantCombos: "🧩 Plant Combos",
    closePlantCombos: "✕ Close Plant Combos",
    companionCheck: "🌿 Companion Check",
    autooptimizeMyLayout: "✨ Auto-optimize my layout",
    goodPairs: "🟢 Good Pairs",
    conflicts: "🔴 Conflicts",
    shoppingList: "🛒 SHOPPING LIST",
    gardenToolkit: "🧰 GARDEN TOOLKIT",
    gardenTools: "🛠️ Garden Tools",
    closeGardenTools: "✕ Close Garden Tools",
    inventory: "🌱 Inventory",
    bedCalc: "📐 Bed Calc",
    sunlight: "☀️ Sunlight",
    shade: "🌥️ Shade",
    wishlist: "⭐ Wishlist",
    export: "📤 Export",
  },

  photos: {
    permissionTitle: "Photos Permission Needed",
    permissionJournal: "Allow photo access to add garden journal pictures.",
    permissionGarden: "Allow photo access to add a garden photo.",
  },

  premium: {
    unlocked: "Premium Unlocked 👑",
    savesLockedTitle: "Premium saves locked",
    savesLockedBody: "Free users can save up to 5 plants. Upgrade to Premium to save unlimited plants.",
    viewPremium: "View Premium",
    plantHardinessZoneDataCourtesy: "Plant hardiness zone data courtesy of PRISM Climate Group and USDA.",
  },

  streak: {
    noFreezeTitle: "No freeze available",
    frozenTitle: "Streak frozen! ❄️",
    savedTitle: "❄️ Streak freeze saved you!",
    saveTitle: "❄️ Save your streak?",
    useFreeze: "Use freeze ❄️",
  },

  bonus: {
    alreadyClaimedTitle: "Already Claimed 🌱",
    alreadyClaimedBody: "You already claimed your garden bonus. Come back in a bit!",
  },

  purchases: {
    restoredTitle: "Purchases Restored 👑",
    restoredBody: "Your premium subscription has been restored.",
    noneTitle: "No Purchases Found",
    noneBody: "We couldn't find an active subscription to restore for this account.",
    restoreFailed: "Restore Failed",
    restoreFailedBody: "Something went wrong restoring your purchases. Please try again.",
    storeUnavailable: "Store Unavailable",
    storeUnavailableBody: "In-app purchases are not available right now. Please try again later.",
    purchaseFailed: "Purchase Failed",
    purchaseFailedBody: "Something went wrong. Please try again.",
  },

  premiumCard: {
    planMonthly: "Monthly",
    planYearly: "Yearly",
    popular: "POPULAR",
    perMonth: "/ month",
    perYear: "/ year",
    weatherTitle: "Live Weather & Forecast",
    weatherBody: "7-day forecast, daylight, and adaptive watering for your zone.",
    guidesTitle: "Step-by-Step Planting Guides",
    guidesBody: "Exactly how and when to plant everything in your zone.",
    shoppingTitle: "Where to Buy",
    shoppingBody: "Find seeds, soil, and supplies with trusted store links.",
    profileTitle: "Gardener Profile",
    profileBody: "Your stats, badges, and gardening milestones in one place.",
    eyebrow: "POCKET PLANTER PREMIUM",
    headline: "Grow smarter.\nGarden better.",
    blurb: "Everything you need to plan, track, and grow a thriving garden — all in one place.",
    gardenPlots: "Garden Plots",
    everythingIncluded: "EVERYTHING INCLUDED",
    choosePlan: "CHOOSE YOUR PLAN",
    choosePlanBody: "Choose monthly or yearly. Cancel anytime.",
    bestValue: "BEST VALUE",
    savings: "Save 30%",
    frostTitle: "Frost & Heat Alerts",
    frostBody: "Get warned before dangerous temps hit your garden.",
    wateringTitle: "Smart Watering Guidance",
    wateringBody: "Weather-aware daily watering recommendations.",
    companionTitle: "Companion Intelligence",
    companionBody: "Which plants thrive together — and which to keep apart.",
    plannerTitle: "Garden Planner Map",
    plannerBody: "Plan all 12 plots with live compatibility scoring.",
    journalTitle: "Journal & Photo Timeline",
    journalBody: "Document your garden's growth with dated photos.",
    pestsTitle: "Pest Watch & Guides",
    pestsBody: "Spot and stop pests before they spread.",
    xpTitle: "XP, Levels & Achievements",
    xpBody: "Earn rewards and badges for daily garden care.",
    questsTitle: "Daily Quests & Streaks",
    questsBody: "Complete challenges and keep your streak alive.",
    unlimitedTitle: "Unlimited Saved Plants",
    unlimitedBody: "Save as many plants as your garden needs.",
    cloudTitle: "Cloud Backup & Sync",
    cloudBody: "Your garden saved safely across all devices.",
  },

  journal: {
    photosThisWeek: { one: "{count} photo this week", other: "{count} photos this week" },
    suggestionsFor: "Suggestions for {stage}",
    stageLabelText: "Stage: {stage}",
    uploading: "Uploading…",
    allStages: "📅 All Stages",
    stageSeedling: "Seedling",
    stageFlowering: "Flowering",
    moodHopeful: "🌱 Hopeful",
    moodThriving: "😍 Thriving",
    moodHarvestDay: "🍅 Harvest Day",
    moodWinterGrowing: "❄️ Winter Growing",
    gardenUpdate: "Garden Update",
    stageLeaf: "Leaf Growth",
    stageFruit: "Fruit Forming",
    stageHarvest: "Harvest Ready",
    badgeFirstSprout: "First Sprout",
    badgePhotoKeeper: "Photo Keeper",
    badgeGardenStory: "Garden Story",
    badgeHarvestHero: "Harvest Hero",
    badgeMonthlyGrower: "Monthly Grower",
    shareText: "Check out my garden progress on Pocket Planter! 🌱",
    shareFailed: "Share failed",
    shareFailedBody: "Could not share this photo right now.",
    totalPhotos: "Total Photos",
    plantsDocumented: "Plants Documented",
    thisMonth: "This Month",
    photoActivity: "📈 Photo Activity — Last 6 Months",
    growthBreakdown: "🌱 Growth Stage Breakdown",
    timeline: "📅 Timeline",
    byPlant: "🌿 By Plant",
    emptyTitle: "Start Your Garden Story",
    addFirstPhoto: "📷 Add Your First Photo",
    takesSeconds: "Takes 5 seconds · no green thumb required",
    greatMoments: "✨ GREAT MOMENTS TO CAPTURE",
    momentSprout: "First sprout",
    momentLeaves: "New leaves",
    momentWatering: "Watering day",
    momentFlower: "First flower",
    momentFruit: "Fruit forming",
    momentHarvest: "Harvest day",
    badgesToUnlock: "🏆 BADGES TO UNLOCK",
    addPhoto: "Add Photo",
    searchPlaceholder: "Search by plant or caption...",
    allPlants: "🌿 All Plants",
    snapAPhotoWheneverSomething: "Snap a photo whenever something changes. In a few weeks you'll have a beautiful timeline of your garden growing from seed to harvest — with progress bars, streaks, and badges along the way.",
    clearFilters: "Clear filters",
    noEntriesFound: "No entries found",
    tryAdjustingYourSearchOr: "Try adjusting your search or filters to see your plants.",
    growing: "🌱 Growing",
    day: " · Day ",
    growthProgress: "Growth Progress",
    writeACaption: "Write a caption...",
    smartCaptionIdeas: "✨ Smart caption ideas",
    saveCaption: "Save Caption",
    tapToAddACaption: "Tap to add a caption... ✏️",
    getSmartCaptionIdeas: "✨ Get smart caption ideas",
    tapToExpandAddCaption: "Tap to expand, add caption, or get smart suggestions ✨",
    collapse: "▲ Collapse",
    tapToExpand: "▼ Tap to expand",
    tryAdjustingYourSearchOr2: "Try adjusting your search or filters.",
    gardenJournal: "📸 Garden Journal",
    gardenTimeline: "🌿 Garden Timeline",
    thrivingNearYou: "🌍 Thriving Near You",
    harvest: "🚜 Harvest",
    goal: "🎯 Goal",
    recipes: "🍽️ Recipes",
    storage: "🧊 Storage",
    journalTools: "📓 Journal Tools",
    timelapse: "🎞️ Timelapse",
    soilTest: "🧫 Soil Test",
  },

  a11y: {
    careDeleted: "Care entry deleted",
    harvestDeleted: "Harvest deleted",
    useFreeze: "Use",
    usedFreeze: "Used",
    wateringDeleted: "Watering entry deleted",
    logWater: "Log watering for {name}",
    logRepot: "Log repotting for {name}",
    rooted: "{name} rooted",
    select: "Select {name}",
    areaPhoto: "Change photo for {area}",
    toBed: "to {bed}",
    saved: "Saved",
    resetTimer: "Reset timer",
    minus30: "Subtract 30 seconds",
    plus30: "Add 30 seconds",
    close: "Close",
    dismiss: "Dismiss",
    clearSearch: "Clear search",
    deleteEntry: "Delete entry",
    deleteTask: "Delete task",
    removeItem: "Remove item",
    addItem: "Add",
    sharePhoto: "Share photo",
    previousFrame: "Previous photo",
    nextFrame: "Next photo",
    showFrame: "Show photo {n}",
    previousMonth: "Previous month",
    nextMonth: "Next month",
  },

  empty: {
    noAchievementsTitle: "No badges yet",
    noAchievementsBody: "Keep growing and you'll earn badges as you go.",
    noWateringTitle: "No waterings logged",
    noWateringBody: "Nothing logged this week yet — tap a plant to get started.",
    noPlantsMatchTitle: "No plants match",
    noPlantsMatchBody: "Try a different filter, or clear the search to see everything.",
  },

  myGardenToday: {
    todaysGardenPlan: "📋 TODAY'S GARDEN PLAN",
    dailyGardenTasks: "Daily garden tasks",
    allTasksCompleteYourGarden: "🌟 All tasks complete — your garden is thriving!",
    allPlantsWatered: "All plants watered!",
    nothingNeedsWaterToday: "Nothing needs water today",
    greetMorning: "Hey There! 🌅",
    tipMorning: "Morning is the best time to water — cooler temps reduce evaporation.",
    greetAfternoon: "Good afternoon! ☀️",
    tipAfternoon: "Midday heat is high. Check on any plants in direct sun and make sure soil stays moist.",
    greetEvening: "Good evening! 🌙",
    tipEvening: "Evening is a great time to check tonight's forecast and cover any frost-sensitive plants.",
    wxLoadingTitle: "Weather loading",
    wxLoadingText: "Your forecast will appear shortly.",
    wxFrostTitle: "Frost risk tonight",
    wxFrostText: "Low of {temp} — cover tender plants and move containers to shelter before dark.",
    wxExtremeTitle: "Extreme heat today",
    wxExtremeText: "High of {temp} — water before 9 AM, add shade cloth, and skip transplanting.",
    wxHotTitle: "Hot day ahead",
    wxHotText: "High of {temp} — water deeply early and mulch around roots to hold moisture.",
    wxRainTitle: "Rain likely today",
    wxRainText: "{pct}% chance of rain — skip watering and check drainage on containers.",
    wxShowersTitle: "Possible showers",
    wxShowersText: "{pct}% rain chance — check soil before watering, may not be needed.",
    wxGreatTitle: "Great garden day",
    wxGreatText: "{temp} high, {pct}% rain — ideal conditions for planting, watering, and garden care.",
    tipSpringHot: "🌱 Hot zone spring: get plants in the ground now before summer heat peaks. Prioritize tomatoes, peppers, and basil.",
    tipSpring: "🌱 Spring is prime planting season. Focus on getting seeds started and transplants in the ground while temps are mild.",
    tipSummerHot: "🔥 Summer in hot zones: deep watering every 2-3 days keeps roots cool. Harvest zucchini and beans daily.",
    tipSummer: "☀️ Summer peak: water consistently, harvest regularly, and watch for heat stress on leafy greens.",
    tipFallCold: "🍂 Fall in cold zones: harvest everything before first frost and plant garlic for next spring.",
    tipFall: "🍂 Fall growing season: great time for cool crops like kale, spinach, lettuce, and root vegetables.",
    tipWinter: "❄️ Winter prep: add compost to beds, protect perennials, and start planning your spring garden layout.",
    plantsNeedWater: { one: "{count} plant needs water", other: "{count} plants need water" },
    wateredOfToday: "{watered} of {total} plants watered today",
    wateredDoneTap: "{watered}/{total} done — tap to go to Plants tab",
    photosLoggedToday: { one: "{count} photo logged today!", other: "{count} photos logged today!" },
    seedsRightWindow: "{plants} — it's the right window for your zone.",
    startSeedsIndoors: { one: "Start {count} seed indoors", other: "Start {count} seeds indoors" },
    heroFrost: "Start it indoors now — frost is in the forecast, so it'll be ready to transplant once nights warm up.",
    heroHeat: "It can handle the current heat — plant early morning and water deeply to get it established.",
    heroPrimeZone: "This is a prime planting window in Zone {zone} right now.",
    heroPrimeArea: "This is a prime planting window in your area right now.",
    heroEasy: "An easy, forgiving grower — a great low-effort pick to add to your garden this week.",
    heroSeasonalZone: "A strong seasonal match for Zone {zone} worth planning into your garden this week.",
    heroSeasonalArea: "A strong seasonal match for your area worth planning into your garden this week.",
    dayLong: "Long days now — cool crops like lettuce, spinach, and cilantro may bolt. Harvest young and give afternoon shade.",
    dayShort: "Short days slow most growth. Focus on cold-hardy greens and root crops, and don't expect fast results.",
    dayGood: "Good daylight for steady growth across most vegetables.",
    sowLast: "Last sown {days}d ago · every ~{interval}d",
    sowNext: "Next round in ~{days}d · every ~{interval}d",
    sowRecommended: "Recommended every ~{interval}d in season",
    yearsAgo: { one: "{count} year ago", other: "{count} years ago" },
    monthsAgo: { one: "{count} month ago", other: "{count} months ago" },
    triageOverdue: "{overdue} overdue — start at the top.",
    triageOverdueToday: "{overdue} overdue, {today} due today — start at the top.",
    triageToday: "{today} due today, plus tomorrow's coming up.",
    triageNone: "Nothing overdue — just tomorrow's on deck.",
    bucketOverdue: "Overdue",
    bucketToday: "Due today",
    bucketTomorrow: "Tomorrow",
    harvestReadyCount: { one: "{count} plant ready to harvest!", other: "{count} plants ready to harvest!" },
    harvestComingUp: "Harvest coming up",
    streakWaterOne: "Water {plant} today to keep your streak",
    streakWaterMany: { one: "Water {count} plant today to keep your streak", other: "Water {count} plants today to keep your streak" },
    streaksWinding: { one: "{count} watering streak winding down", other: "{count} watering streaks winding down" },
    rainMayHelpCheckSoil: "Rain may help — check soil before watering",
    tapToGoToPlants: "Tap to go to Plants tab →",
    harvestNowForPeakFlavor: "Harvest now for peak flavor and to keep plants producing",
    tapToGoToGarden: "Tap to go to Garden tab →",
    itsBeen14DaysSince: "It's been 14+ days since last feeding — time to fertilize",
    uploadingPhoto: "Uploading photo…",
    addAGardenPhoto: "Add a garden photo",
    yourGardenStoryIsGrowing: "Your garden story is growing — great work!",
    documentYourGardensProgressWith: "Document your garden's progress with a photo",
    tapToAddAPhoto: "Tap to add a photo →",
    seasonalTip: "💡 Seasonal Tip",
    noPlantsSavedYet: "No plants saved yet",
    browseThePlantsTabAnd: "Browse the Plants tab and save your first plant to start tracking your garden",
    plantThisMonth: "Plant this month:",
    aStrongPickForYour: "A strong pick for your zone right now — tap to see the care guide",
  },

  fertilizerIntelligence: {
    feedingGuide: "Feeding Guide",
    fertilizerType: "Fertilizer Type",
    bestTime: "Best Time",
    whatToBuy: "What to Buy",
    proTip: "💡 Pro Tip",
    plantsDueForFeeding: "🪴 Plants due for feeding",
  },

  guildTemplates: {
    provenPlantCombosThatGrow: "Proven plant combos that grow better together. Tap a combo to see its plants and add the ones you want.",
  },

  gardenToolkit: {
    fullyEquipped: "🎉 Fully equipped!",
    shop: "Shop ›",
  },

  harvestRecipes: {
    saveOrHarvestAFew: "Save or harvest a few edible crops and this card will suggest simple ways to cook and enjoy them.",
    recipesEasy: " recipes easy",
    recipes: "Recipes ›",
  },

  soilCareLog: {
    totalLogs: "Total Logs",
    thisMonth: "This Month",
    plantsTracked: "Plants Tracked",
    topAction: "Top Action",
    last: "Last:",
    wholeGarden: "whole garden",
    cancel: "✕ Cancel",
    logCareAction: "＋ Log Care Action",
    whichPlant: "Which plant?",
    wholeGarden2: "🌍 Whole Garden",
    whatDidYouDo: "What did you do?",
    addANoteOptional: "Add a note (optional)",
    egUsedOrganicNeemOil: "e.g. Used organic neem oil, pH was 6.5, added 2 cups compost...",
    logCareEntry: "✅ Log Care Entry",
    calendar: "📅 Calendar",
    timeline: "📋 Timeline",
    today: "📅 Today",
    all: "🌿 All",
    garden: "🌍 Garden",
    noCareLoggedForThis: "No care logged for this day. Tap ＋ to add an entry.",
    noCareEntriesYetTap: "No care entries yet. Tap ＋ to log your first action!",
    noCareLoggedYet: "No care logged yet",
    tapAboveToLogYour: "Tap ＋ above to log your first care action. Track compost, repotting, pest treatment, pH tests, and more.",
  },

  gardenStatsDashboard: {

    dashTodo: "To-Do",

    dashPlantsNeedWater: { one: "{count} plant needs watering", other: "{count} plants need watering" },

    dashWaterAllNow: { one: "Water {count} plant now", other: "Water all {count} now" },
    xp: "XP •",
    consistencyBonus: "consistency bonus",
    plants: "🌱 PLANTS",
    inGardenMap: "in garden map",
    watering: "💧 WATERING",
    wateredToday: "Watered Today",
    totalWaterings: "total waterings",
    journal: "📸 JOURNAL",
    totalPhotos: "Total Photos",
    thisMonth: "this month",
    harvest: "🚜 HARVEST",
    toHarvest: "To harvest",
    plantsTracked: "plants tracked",
    tapToOpenThePlants: "Tap to open the Plants tab and water →",
    waterAllPlantsThatNeed: "Water all plants that need water today",
    checkYourPlantCardsTo: "Check your plant cards to harvest today",
    itsBeen14DaysSince: "It's been 14+ days since last feeding",
    gardenHasCompanionConflicts: "Garden has companion conflicts",
    checkTheGardenTabTo: "Check the Garden tab to fix plant pairings",
    saveYourFirstPlantTo: "Save your first plant to get started",
    browseThePlantsTabAnd: "Browse the Plants tab and tap Save on any plant",
    photosLogged: "Photos Logged",
    plantsDocumented: "Plants Documented",
    thisMonth2: "This Month",
    thisWeeksMomentum: "This week's momentum",
    myPocketPlanterGardenThis: "🌱 My Pocket Planter garden this week:",
    growingSmarterWithPocketPlanter: "Growing smarter with Pocket Planter 🌿",
    shareMyGardenWeek: "Share my garden week",
    shareMyGardenWeek2: "📸 Share my garden week",
  },

  onboarding: {
    setMyZone: "Set My Zone 🌿",
    next: "Next →",
    skipForNow: "Skip for now",
  },

  accountCloud: {
    syncPending: "Not synced yet",
    syncJustNow: "Just now",
    syncMinutesAgo: "{count} min ago",
    syncHoursAgo: "{count} hr ago",
    emailLabel: "Email",
    inactive: "Inactive",
    unknown: "Unknown",
    enterNewEmailFirst: "Enter a new email first.",
    couldNotChangeEmail: "Could not change email:",
    checkNewEmailInbox: "Check your new email inbox for a confirmation link!",
    somethingWentWrong: "Something went wrong. Try again.",
    noEmailFound: "No email found for this account.",
    couldNotSendReset: "Could not send reset email:",
    resetEmailSent: "Password reset email sent! Check your inbox.",
    logOutTitle: "Log Out",
    logOutConfirm: "Are you sure you want to log out?",
    deleteAccountTitle: "Delete Account",
    deleteAccountBody: "This will permanently delete your account and all garden data. This cannot be undone.",
    deleteAccountConfirm: "Delete My Account",
    errorTitle: "Error",
    sessionError: "Could not verify your session. Please log out and back in, then try again.",
    deletionFailed: "Deletion Failed",
    deletionFailedBody: "Something went wrong. Please email support@pocketplanter.green for help.",
    accountDeleted: "Account Deleted",
    accountDeletedBody: "Your account and all data have been permanently removed.",
    contactSupport: "Contact Support",
    contactSupportBody: "Please email support@pocketplanter.green to complete account deletion.",
    notSignedIn: "Not signed in",
    premiumStatus: "Premium Status",
    active: "Active ✅",
    savedPlants: "Saved Plants",
    journalPhotos: "Journal Photos",
    gardenPlots: "Garden Plots",
    memberSince: "Member Since",
    changeEmail: "Change Email",
    newEmailAddress: "New email address",
    sendEmailChangeConfirmation: "Send Email Change Confirmation",
    sendPasswordResetEmail: "Send Password Reset Email",
    logOut: "🚪 Log Out",
    deleteAccount: "🗑 Delete Account",
  },

  harvestStorageGuide: {
    saveOrHarvestAFew: "Save or harvest a few crops and you'll get storage tips — how to keep each one fresh and how long it lasts.",
    keepYourHarvestFreshLonger: "Keep your harvest fresh longer — how to store what you're",
  },

  home: {
    tomorrowNight: "tomorrow night",
    tonightLower: "tonight",
    inNDays: "in {count} days",
    nNightsAway: "❄️ {count} nights away",
    tonight: "❄️ Tonight",
    n1NightAway: "❄️ 1 night away",
    frostExpected: "Frost expected",
    extremeHeatToday: "Extreme heat today",
    wateringSkippedToday: "Watering skipped today",
    chanceOfRainPocketPlanter: "% chance of rain — Pocket Planter is skipping today's watering reminder so you don't overwater. Check soil before watering anyway.",
    whatsNew: "✨ WHAT'S NEW",
    freshUpdates: "Fresh updates 🌱",
    gotIt: "Got it 🌿",
    searchPlantsPestsAndJournal: "Search plants, pests, and journal",
    searchPlantsPestsJournal: "Search plants, pests, journal…",
    gardenDashboard: "🌱 Garden Dashboard",
    plantPick: "🌟 Plant Pick",
    showFrostDatesCard: "❄️ Show frost dates card",
    daylightToday: "☀️ Daylight Today",
    thisMonth: "🗓️ This Month",
    pestWatch: "🐛 Pest Watch",
    plantingSowingFrost: "🌱 Planting, Sowing & Frost",
    plantingHarvestCalendar: "📅 PLANTING & HARVEST CALENDAR",
    successionSowing: "🔁 Succession Sowing",
    closeSuccessionSowing: "✕ Close Succession Sowing",
    frostDates: "❄️ Frost Dates",
    closeFrostDates: "✕ Close Frost Dates",
    savedPlants: "🌿 Saved Plants",
    streakFreeze: "Streak Freeze",
    protectYourStreakOnA: "Protect your streak on a busy day. Refreshes weekly.",
    usedThisWeekRefreshesNext: "Used this week — refreshes next week.",
    useStreakFreeze: "Use streak freeze",
  },

  areaPlannerMap: {
    createAnAreaFirst: "Create an area first",
    addAGardenAreaAbove: "Add a garden area above (like Backyard or Balcony), then place your saved plants into it.",
    perfectGarden: "🌱 PERFECT GARDEN",
    aDreamBedWith: "A dream bed with",
    addTheseToMyGarden: "Add these to my garden",
    maybeLater: "Maybe later",
    allGardens: "‹ All gardens",
    waterBed: "💧 Water bed",
    needWater: "need water",
    inThisBed: "🤝 IN THIS BED",
    greatCompanionsToAdd: "🌱 GREAT COMPANIONS TO ADD",
    thesePairWellWithWhat: "These pair well with what you've already planted in",
    deleteGarden: "🗑 Delete garden",
  },


  pollinatorPlanner: {
    pollinatorsMeanBetterFruitSet: "Pollinators mean better fruit set and fewer pests. Tuck a few of these near your veggies to bring in bees, butterflies, and beneficial insects.",
    greatAdditions: "🐝 GREAT ADDITIONS",
  },

  plants: {

    attrContainer: "🪴 Container-friendly",

    attrFullSun: "☀️ Full sun",

    attrPerennial: "🔁 Perennial",

    picksLockedTitle: "This month's picks locked",

    picksLockedBody: "Unlock Premium to see the best plants to start this month, matched to your zone and climate.",

    notPrimeMonth: "{month} isn't a prime planting window for Zone {zone}. Try another month above, or browse all plants to plan ahead.",

    cmpDifficulty: "Difficulty",

    cmpHarvest: "Harvest",

    cmpZones: "Zones",

    cmpType: "Type",

    cmpVs: "VS",

    noMatchSearch: "Nothing matches \"{query}\". Try a different name or clear your search.",

    noMatchType: "Nothing in {type} matches right now. Try viewing all plants instead.",

    unlockAllCount: { one: "🔒 Unlock all {count} plant with Premium", other: "🔒 Unlock all {count} plants with Premium" },

    unlockAllA11y: "Unlock all plants with Premium",

    a11yFilterBy: "Filter by {label}",

    a11yRemoveFilter: "Remove {label} filter",

    a11ySortBy: "Sort by {label}",

    harvestBlooms: "Blooms seasonally",

    harvestFoliage: "Grown for foliage",

    harvestInDays: { one: "~{count} day harvest", other: "~{count} day harvest" },

    harvestPerennial: "Perennial — harvests seasonally",
    thisMonthsPicks: "📅 This Month's Picks",
    allPlants: "All plants",
    nothingIdealFor: "Nothing ideal for",
    setYourZipCodeOn: "Set your zip code on the Weather tab to unlock plant recommendations matched to your growing zone.",
    yourPlantingCalendar: "📅 Your Planting Calendar",
    recentlyViewed: "🕐 RECENTLY VIEWED",
    searchPlants: "Search plants...",
    showingPlantableNow: "🌱 Showing plantable now ✓",
    showAllDifficulties: "Show all difficulties",
    smart: "✨ Smart",
    fastestHarvest: "⚡ Fastest harvest",
    difficulty: "🎯 Difficulty",
    plantComparison: "⚔️ Plant Comparison",
    clearComparison: "Clear Comparison",
    selectOneMorePlantTo: "⚔️ Select one more plant to compare with ",
    selectMultiple: "☑️ Select multiple",
    noPlantsFound: "No plants found",
    noPlantsMatchTheCurrent: "No plants match the current filter.",
    didYouMean: "Did you mean?",
    showAllPlants: "Show all plants",
    showMorePlants: "Show more plants (",
    showLess: "Show less",
    more: "more)",
  },

  liveWeather: {

    stillNeedWater: { one: "{count} saved plant still needs watering today", other: "{count} saved plants still need watering today" },
    alert: "⚠️ Alert",
    smartActionsForToday: "⚡ Smart Actions for Today",
    tapOneToCheckIt: "Tap one to check it off — it disappears. Refreshes each day.",
    allDoneForToday: "🎉 All done for today!",
    freshActionsRefreshTomorrow: "Fresh actions refresh tomorrow.",
  },

  frostOverride: {
    frostfreeGrowingDays: "frost-free growing days",
    usingYourCustomDates: "✓ Using your custom dates",
    estimatedFromYourZone: "📍 Estimated from your zone",
    lastSpringFrost: "LAST SPRING FROST",
    safeToPlantOut: "Safe to plant out ✓",
    firstFallFrost: "FIRST FALL FROST",
    harvestByThen: "Harvest by then 🧺",
    yourGrowingSeason: "🌱 Your growing season",
    editMyFrostDates: "✏️  Edit my frost dates",
    dialInMyRealLocal: "🎯  Dial in my real local dates",
    knowYourRealLocalFrost: "Know your real local frost dates? Enter them as MM-DD to sharpen every seed-starting and frost-window tip in the app.",
    lastSpringFrostMmdd: "LAST SPRING FROST (MM-DD)",
    eg0315: "e.g. 03-15",
    firstFallFrostMmdd: "FIRST FALL FROST (MM-DD)",
    eg1115: "e.g. 11-15",
    useMmddFormatLike0315: "Use MM-DD format, like 03-15.",
    saveFrostDates: "Save frost dates",
    noFrostInMyArea: "🌵 No frost in my area — hide this card",
  },

  gardenIntelligence: {
    weekHigh: "Week High",
    weekLow: "Week Low",
    rainyDays: "Rainy Days",
    needWater: "Need Water",
    plantNowInZone: "🌱 PLANT NOW IN ZONE",
  },

  weatherTeaser: {
    liveGardenWeather: "🌤️ LIVE GARDEN WEATHER",
    gardenWeather: "Garden Weather",
    smartWeatherIntelligenceForYour: "• Smart weather intelligence for your garden",
    unlockPremiumToSeeYour: "Unlock premium to see your personalized action plan",
    unlockPremiumWeatherIntelligence: "👑 Unlock Premium Weather Intelligence",
    n299monthCancelAnytime: "$2.99/month • Cancel anytime",
  },


  plantingCalendar: {
    pickPlantingDate: "When are you planting?",
    addRemindersButton: "Add reminders",
    startIndoorsEvent: "🌱 Start {plant} indoors",
    plantOutEvent: "🪴 Plant out {plant}",
    harvestEvent: "🚜 Harvest {plant} (approx.)",
    addedByPocketPlanter: "Added by Pocket Planter 🌱",
    calendarAccessNeededTitle: "Calendar access needed",
    calendarAccessNeededBody: "Allow calendar access to add your planting and harvest reminders.",
    noCalendarTitle: "No calendar found",
    noCalendarBody: "Couldn't find a calendar on your device to add events to.",
    addedTitle: "Added to your calendar 📅",
    addedBody: "{count} reminders added, anchored to {date}.",
    unavailableTitle: "Calendar unavailable",
    unavailableBody: "Adding to your calendar will work after the next app update.",
    addTheseToMyCalendar: "📅 Add these to my calendar",
    tight: "❄️ Tight",
    startIndoors: "Start indoors",
    directSow: "Direct sow",
    plantOut: "Plant out",
  },

  reminderControl: {
    wateringReminders: "Watering Reminders",
    addDailyRemindersFromPlant: "Add daily reminders from plant pages.",
    frostAlerts: "Frost Alerts",
    eveningReminderToCheckOvernight: "Evening reminder to check overnight lows.",
    monthlyPlantingGuides: "Monthly Planting Guides",
    reminderOnThe1stOf: "Reminder on the 1st of every month.",
    dailyWateringCheck: "Daily Watering Check",
    morningReminderToCheckYour: "Morning reminder to check your garden.",
    plantOfTheDay: "Plant of the Day",
    dailyPlantPickEveryMorning: "Daily plant pick every morning.",
    weeklyRecap: "Weekly Recap",
    sundayEveningSummaryOfYour: "Sunday evening summary of your gardening week.",
    changeDailyWateringReminderTime: "Change daily watering reminder time",
    reminderTime: "⏰ Reminder time",
    whenYourDailyWateringCheck: "When your daily watering check arrives",
  },

  seedInventory: {
    trackTheSeedsAndSupplies: "Track the seeds and supplies you already own so you never double-buy. Tap the flag to mark anything running low.",
    addAnItemYouOwn: "Add an item you own…",
    nothingAddedYetAddSeed: "Nothing added yet — add seed packets, compost, fertilizer, or tools you have.",
    reorder: "🛒 Reorder",
    markAsStocked: "Mark as stocked",
    markAsRunningLow: "Mark as running low",
    shopForMoreSeedsSupplies: "🛒 Shop for more seeds & supplies",
  },


  pestDetailScreen: {
    gardenPestMostActive: "Garden pest · Most active",
    whatItIs: "WHAT IT IS",
    whatToLookFor: "WHAT TO LOOK FOR",
    damageItCauses: "DAMAGE IT CAUSES",
    howToPreventIt: "HOW TO PREVENT IT",
    howToTreatIt: "HOW TO TREAT IT",
    plantsAtRisk: "🌱 PLANTS AT RISK",
    inYourGardenTheseCould: "In your garden, these could be targeted — tap to open:",
    commonlyTargets: "Commonly targets:",
    whenItsActive: "📅 WHEN IT'S ACTIVE",
    backToPestWatch: "Back to Pest Watch",
  },

  forecast: {
    bestPlantingDay: "• 🌱 Best planting day:",
    weekHigh: "Week High",
    weekLow: "Week Low",
    rainyDays: "Rainy Days",
    bestDay: "Best Day",
  },

  gardenStory: {
    myPocketPlanterGarden: "🌱 MY POCKET PLANTER GARDEN",
    yourMvpPlant: "YOUR MVP PLANT",
    yourMostharvestedPlant: "Your most-harvested plant",
    growingSmarterWithPocketPlanter: "Growing smarter with Pocket Planter 🌿",
    shareAsImage: "📸 Share as Image",
    shareAsText: "📤 Share as Text",
  },

  waterUsage: {
    weekTotal: "{unit} this week",
    allTimeTotal: "{unit} all-time",
    thirstiestLine: "💧 Thirstiest: {plant} (~{amount} {unit})",
    unitCups: "cups",
    unitGal: "gal",
    unitL: "L",
    entryAmount: "{amount} {unit}",
    whichPlant: "WHICH PLANT?",
    wholeGarden: "🌍 Whole Garden",
    howMuch: "HOW MUCH?",
    eg2: "e.g. 2",
    logWatering: "💧 Log Watering",
    logAWateringAmount: "＋ Log a Watering Amount",
  },

  profile: {
    gardenerProfile: "Gardener Profile",
    unlockYourFullGardenerProfile: "Unlock your full gardener profile, XP progression, level-up rewards, achievement badges, and collectible banners.",
    achievementsEarned: "Achievements Earned",
    bannersEarned: "Banners Earned",
    dailyQuests: "⚡ Daily Quests",
    seasonalChallenges: "🎯 Seasonal Challenges",
    gardenStory: "📖 Garden Story",
    yourStory: "📖 YOUR STORY",
    gardenRoiBudget: "💰 Garden ROI & Budget",
    gardenRoi: "💰 GARDEN ROI",
    gardenBudget: "💵 GARDEN BUDGET",
  },

  weather: {
    liveGardenWeather: "🌤️ Live Garden Weather",
    gardenWeatherThisWeek: "🌤️ Garden Weather This Week",
    closeWeeklyForecast: "✕ Close Weekly Forecast",
    gardenIntelligence: "🧠 Garden Intelligence",
    closeGardenIntelligence: "✕ Close Garden Intelligence",
    wateringInsights: "💧 Watering Insights",
    schedule: "🗓️ Schedule",
    rainfall: "🌧️ Rainfall",
    usage: "🚿 Usage",
    n7day: "🌤️ 7-Day",
  },

  achievement: {
    unlocked: "ACHIEVEMENT UNLOCKED",
    bannerUnlocked: "NEW BANNER UNLOCKED",
    bannerTapToClose: "Tap to close · equip it in your profile",
    streakTitle: { one: "{count}-DAY STREAK!", other: "{count}-DAY STREAK!" },
    streakBody: { one: "You've opened Pocket Planter {count} day in a row. Incredible consistency! 🌱", other: "You've opened Pocket Planter {count} days in a row. Incredible consistency! 🌱" },
    yearTitle: "1 YEAR!",
    daysTitle: { one: "{count} DAY!", other: "{count} DAYS!" },
    yearBody: "You've been growing with Pocket Planter for a whole year. What a journey! 🌳",
    daysBody: { one: "You've been gardening with Pocket Planter for {count} day. Your garden has come so far! 🌱", other: "You've been gardening with Pocket Planter for {count} days. Your garden has come so far! 🌱" },
    firstPlantTitle: "FIRST PLANT!",
    firstPlantBody: "You just saved your very first plant. Welcome to your garden journey! 🌿",
    secretAchievementUnlocked: "SECRET ACHIEVEMENT UNLOCKED",
    theGardenGnome: "The Garden Gnome",
    youveMasteredEveryCornerOf: "You've mastered every corner of Pocket Planter. Every plant saved, every photo logged, every quest completed, every level climbed.",
    youAreATrueGarden: "You are a true Garden Gnome. 🌟",
    oneOfTheGreatestGardeners: "🏆 One of the greatest gardeners alive!!!",
    tapAnywhereToClose: "Tap anywhere to close",
    earned: "🏆 Earned",
    noAchievementsYetKeepGrowing: "No achievements yet — keep growing and you'll earn badges as you go.",
  },

  adaptiveWatering: {
    waterYourPlantsAFew: "Water your plants a few times and Pocket Planter will learn each one's rhythm and build a personalized schedule here.",
    startingFromTypicalNeeds: "starting from typical needs",
    every: "Every ~",
    learnedFromYou: "· 🧠 learned from you",
    typical: "· typical",
    dueNow: "Due now",
    checkSoil: "🌧️ check soil",
    intervalLearnedFromYourWatering: "🧠 = interval learned from your watering history · intervals tighten automatically in heat.",
  },

  dataExport: {
    export: "Export ›",
  },

  savedPlants: {

    recent: "Recent",

    needsWater: "Needs water",

    neverWatered: "Never watered",

    wateredToday: "Watered today",

    wateredYesterday: "Watered yesterday",

    wateredDaysAgo: { one: "Watered {count} day ago", other: "Watered {count} days ago" },

    wateredWeeksAgo: { one: "Watered {count} week ago", other: "Watered {count} weeks ago" },

    waterDueToday: "Water due today",

    waterTomorrow: "Water tomorrow",

    waterInDays: { one: "Water in {count} day", other: "Water in {count} days" },

    rainCheckSoil: "Rain expected — check soil first",

    healthFrost: "Frost Risk",

    healthHeat: "Heat Stressed",

    healthNeedsWater: "Needs Water",

    healthHealthy: "Healthy",

    alpha: "A–Z",

  },

  plantPicker: {

    addAPlant: "Add a plant",

    searchSaved: "Search your saved plants",

    noMatching: "No matching saved plants. Save more plants, then place them here.",

    inThisPlot: "In this plot",

    clearThisPlot: "Clear this plot",

  },

  barcodeScanner: {

    closeScanner: "Close scanner",

    scanPacket: "Scan packet",

    cameraNeededTitle: "Camera access needed",

    cameraNeededBody: "Allow the camera to scan a seed packet's barcode or QR code.",

    allowCamera: "Allow camera",

    pointAtCode: "Point at the packet's barcode or QR",

    needsNewBuildTitle: "Scanning needs the latest build",

    needsNewBuildBody: "Update to the newest version of Pocket Planter to scan packets. You can still add items by hand.",

  },

  gardenAreaManager: {

    addNamed: "Add a {count}-plant {design}",

    addFlowerBedSized: "Add a {count}-plant flower bed",

    addBedSized: "Add a {count}-plant bed",

    howManyPlantsCount: "HOW MANY PLANTS?  ({count})",

    vegetablePatch: "Vegetable Patch",

    frontYard: "Front Yard",

    backyard: "Backyard",

    balcony: "Balcony",

    indoors: "Indoors",

    raisedBed: "Raised Bed",

    herbGarden: "Herb Garden",

    hangingPlanter: "Hanging Planter",

    flowerBed: "Flower Bed",

    cuttingGarden: "Cutting Garden",

    cottageBorder: "Cottage Border",

    windowBox: "Window Box",

    containerPot: "Container Pot",

    hangingBasket: "Hanging Basket",

    addFlowerBed: "Add a flower bed",

    addGardenBed: "Add a garden bed",

    addFlowerBedCta: "＋ Add a Flower Bed",

    addGardenBedCta: "＋ Add a Garden Bed",

    newFlowerBed: "New flower bed",

    newGardenBed: "New garden bed",

    fallbackFlowerBed: "Flower Bed {n}",

    fallbackGardenBed: "Garden Bed {n}",

  },


  flowerTab: {

    allFlowersTitle: "🌸 All Flowers & Houseplants",

    catalogCount: "{count} flowers and houseplants to browse, save, and plant.",

    unlockAllA11y: "Unlock all flowers and houseplants with Premium",

    unlockAllCta: "🔒 Unlock all {count} flowers & houseplants with Premium",

    showMore: "Show more — {count} more",

    flowerGarden: "🌸 Flower Garden",

    planYourBeds: "Plan your flower & houseplant beds",

    planYourBedsBody: "Save some flowers or houseplants from the Plants tab, then add a bed above to arrange them.",

    combosTitle: "💐 Flower & Houseplant Combos",

    combosLocked: "Flower combos locked",

    combosLockedBody: "Unlock Premium for proven flower and houseplant combos you can plant as a ready-made bed.",

    bloomsTitle: "🌸 Blooms & Flowers",

    pollinators: "🐝 Pollinators",

    bouquets: "💐 Bouquets",

    bloomsLocked: "Blooms & bouquets locked",

    bloomsLockedBody: "Unlock Premium for pollinator planning, cut-flower guides, and vase tracking.",

    homeToolsTitle: "🪴 Home & Care Tools",

    houseplants: "🪴 Houseplants",

    careLog: "💧 Care Log",

    rooms: "🏠 Rooms",

    petSafe: "🐾 Pet-Safe",

    propagate: "🌱 Propagate",

    homeToolsLocked: "Home & care tools locked",

    homeToolsLockedBody: "Unlock Premium for houseplant care schedules, rooms, pet-safe checks, and propagation tracking.",

  },

  gardenPlacement: {

    whereShouldGo: "Where should {plant} go?",

    flowerNote: "🌸 Flowers & houseplants live in your Flowers & Home garden.",

    edibleNote: "🌿 Edible plants live in your garden beds.",

    pickABed: "🪴 PICK A BED",

    hasRoom: "Has room — no conflicts",

    mayClashWith: "⚠ May clash with {plants}",

    fullSwapBelow: "Full ({count} plants) — swap one out below",

    swapOutAnother: "Swap out another plant ({count})",

    swapOutA: "Swap out a plant ({count})",

    noBedsYet: "No garden beds yet",

    noFlowerBedsYet: "No Flowers & Home garden beds yet",

    createBelowAndPlant: "Create a new bed below and {plant} will be planted in it.",

    orStartNewOne: "OR START A NEW ONE",

    createOne: "CREATE ONE",

    plantInNewBed: "Plant in a new garden bed",

    plantInNewFlowerBed: "Plant in a new Flowers & Home bed",

    createNewBedFor: "Create a new bed for {plant}",

  },

  gardenShoppingList: {
    seeds: "🌱 Seeds",
    feed: "🌾 Feed",
    dontForgetTheBasicsCompost: "🧺 Don't forget the basics: compost or potting mix, a balanced fertilizer, and mulch.",
    shareCopyList: "📤 Share / Copy List",
  },

  globalSearchModal: {
    searchPlantsPestsJournal: "Search plants, pests, journal…",
    searchAcrossYourPlantsPest: "Search across your plants, pest guides, and journal.",
    plants: "🌱 PLANTS",
    inYourGarden: "✓ In your garden",
    tapToOpen: "Tap to open",
    pests: "🐛 PESTS",
    openPestGuide: "Open pest guide",
    journal: "📸 JOURNAL",
    gardenUpdate: "Garden Update",
  },

  premiumIntro: {
    pocketPlanterPremium: "👑 Pocket Planter Premium",
    turnYourBackyardIntoA: "Turn your backyard into a",
    thrivingGarden: "thriving garden.",
    unlockCompanionPlantingIntelligenceSmart: "Unlock companion planting intelligence, smart weather alerts, garden compatibility scoring, reminders, journal photos, and a beautiful garden map.",
    pairScores: "🟢 Pair scores",
    avoidWarnings: "⚠ Avoid warnings",
    pestTips: "🐛 Pest tips",
    gardenScore: "🗺️ Garden score",
    startGrowingSmarter: "Start Growing Smarter 🌱",
    maybeLater: "Maybe later",
    n299monthOr2499yearCancelAnytime: "🛡️ $2.99/month or $24.99/year • Cancel anytime",
  },

  bedPlanner: {
    saveAFewPlantsFirst: "Save a few plants first, then this calculator will tell you how many of each fit in a bed of any size.",
    enterYourBedSizeAnd: "Enter your bed size and pick a plant to see how many fit at the recommended spacing.",
    widthFt: "Width (ft)",
    lengthFt: "Length (ft)",
    plantsFit: "plants fit",
    rows: "rows ×",
    perRow: "per row · ~",
    spacingInA: "\" spacing in a",
    ftBed: "ft bed",
    widthM: "Width (m)",
    lengthM: "Length (m)",
    cmSpacingInA: " cm spacing in a",
    mBed: "m bed",
    enterAValidBedSize: "Enter a valid bed size to calculate.",
  },

  gardenROI: {
    netSavings: "NET SAVINGS",
    netSoFar: "NET SO FAR",
    yourTopEarner: "🏆 Your top earner:",
    eg45: "e.g. 45",
    updateSuppliesSpent: "✏️ Update supplies spent",
    addWhatYouveSpent: "＋ Add what you've spent",
  },

  harvestGoal: {
    eg20: "e.g. 20",
    goalReached: "Goal Reached! 🎉",
    yourSeasonGoal: "Your Season Goal",
    complete: "% complete",
    setANewGoal: "Set a new goal",
    changeGoal: "Change goal",
  },

  profileBanners: {
    noBannersYetKeepGrowing: "No banners yet — keep growing to unlock collectible banners for your profile.",
    noBannersYet: "No banners yet",
    levelUpSavePlantsLog: "Level up, save plants, log photos, and build streaks — each banner pops up the moment you earn it.",
    active: ", active",
    tapToSetActive: ", tap to set active",
    earned: "🎏 Earned",
    active2: "✓ Active",
    set: "Set →",
    removeActiveBanner: "Remove active banner",
  },

  plantTypes: {

    all: "All",

    vegetables: "Vegetables",

    treeFruits: "Tree Fruits",

    tropicalFruits: "Tropical Fruits",

    berries: "Berries",

    herbs: "Herbs",

    flowers: "Flowers",

    houseplants: "Houseplants",

    grains: "Grains",

    nuts: "Nuts",

    easy: "Easy",

    medium: "Medium",

    hard: "Hard",

    beginnerFriendly: "Beginner friendly",

    needsMoreCare: "Needs more care",

    moderateCare: "Moderate care",

  },


  plantPage: {


    back: "Back",


    levelUp: "LEVEL UP!",


    levelReached: "🎉 Level {level} Reached!",


    zonesRange: "Zones {min}–{max}",


    dailyControls: "Daily controls",


    gardenActions: "Garden Actions",


    gardenActionsBody: "Mark watering, set reminders, and log progress photos for every plant in your garden.",


    harvestTracker: "Harvest Tracker",


    readyToHarvest: "Ready to harvest!",


    readyInDays: { one: "Ready in {count} day", other: "Ready in {count} days" },


    logHarvest: "🎉 Log a Harvest",


    restart: "Restart",


    start: "Start",


    fertilizerTracker: "Fertilizer Tracker",


    lastFed: "Last fed {date}",


    trackFertilizer: "Track fertilizer applications",


    tracking: "Tracking",


    watered: "Watered",


    markWatered: "Mark watered",


    addToGarden: "Add to garden",


    reminder: "Reminder",


    addPhoto: "Add photo",


    smartCare: "Smart Care",


    factSun: "Sun",


    factWater: "Water needs",


    factSpacing: "Spacing",


    factSoil: "Soil",


    factDifficulty: "Difficulty",


    factWindow: "Planting window",


    factWateringToday: "Watering today",


    factBestSpot: "Best spot",


    factWeather: "Weather advice",


    problems: "🐛 Problems & Protection",


    problemsBody: "Pests and diseases to watch for on {plant} — tap any one for its full guide.",


    commonPests: "Common Pests",


    commonDiseases: "Common Diseases",


    watchFor: "Watch for: ",


    preventTreat: "Prevent & treat: ",


    stepByStep: "Step by step",


    howToPlant: "How to Plant",


    howToPlantBody: "Get step-by-step planting guides tailored to every plant in your zone.",


    stepsIntro: { one: "{count} step to get {plant} in the ground. Check your seed packet for variety-specific timing.", other: "{count} steps to get {plant} in the ground. Check your seed packet for variety-specific timing." },


    companionIntel: "🌿 Companion Intelligence",


    companionLocked: "Companion planting locked",


    companionLockedBody: "Unlock premium to see excellent pairs, plants to avoid, pest prevention tips, and companion search.",


    whoToPlantNear: "Who to plant near {plant} — and who to keep apart. Tap any plant to open it.",


    plantTogether: "Plant Together",


    okNearby: "OK Nearby",


    keepApart: "Keep Apart",


    noCompanionData: "No companion data for {plant} yet — it's an easygoing neighbor for most plants.",


    shopSupply: "Shop & Supply",


    whereToBuy: "Where to Buy",


    whereToBuyBody: "Find seeds, fertilizer, and supplies for this plant — with links to Amazon, Park Seed, Home Depot, and local garden centers.",


    findSuppliesZip: "Find seeds, fertilizer, and supplies for {plant} near ZIP code {zip}.",


    findSuppliesArea: "Find seeds, fertilizer, and supplies for {plant} near you.",


    buySeedsAmazon: "Buy {plant} Seeds on Amazon",


    shipsToDoor: "Ships to your door",


    buyFertAmazon: "Buy {plant} Fertilizer on Amazon",


    specificNutrients: "Specific nutrients for this plant",


    shopParkSeed: "Shop {plant} at Park Seed",


    trustedSince: "Trusted seed catalog since 1868",


    findCentersNear: "Find Garden Centers Near {zip}",


    findCentersNearYou: "Find Garden Centers Near You",


    localStores: "Local stores near your ZIP code",


    shopHomeDepot: "Shop at Home Depot Garden Center",


    checkLocal: "Check local availability",


    personalNotes: "Personal garden notes",


    notesPlaceholder: "Write notes about {plant}...",


    backToPlants: "Back to plants",


  },



  seasonTransition: {

    labelPlantNow: "Plant now",

    labelStartsIn: "Starts in {month}",

    labelOutsideZone: "Outside your zone",

    labelZoneFit: "Zone fit",
    seasonChangeAhead: "SEASON CHANGE AHEAD",
  },


  frostWindow: {
    frostWindow: "FROST WINDOW",
    mayNotFinishBeforeFrost: "May not finish before frost",
    estimatedFromYourZoneA: "Estimated from your zone — a fast-maturing variety may still finish in time.",
  },

  glowPlant: {
    zones: "• Zones",
    saved: "✓ Saved",
    on: "⚔️ On",
    done: "💧 Done",
    snoozedUntilTomorrow: "😴 Snoozed until tomorrow",
    snoozeUntilTomorrow: "😴 Snooze until tomorrow",
    wateringStreak: "watering streak",
    tapForFullCareGuide: "Tap for full care guide →",
  },

  backupRestore: {
    saveAFullCopyOf: "Save a full copy of your garden — plants, journal, beds, logs, and progress — then restore it on a new device or after reinstalling.",
    exportFullBackup: "Export full backup",
    shareOrSaveTheBackup: "Share or save the backup text somewhere safe.",
    restoreFromBackup: "Restore from backup",
    pasteABackupToBring: "Paste a backup to bring your garden back.",
    pasteYourBackupTextHere: "Paste your backup text here…",
    restoreThisBackup: "Restore this backup",
    restoringReplacesYourCurrentData: "Restoring replaces your current data. Export a fresh backup first if you're unsure.",
  },

  customTasks: {
    setYourOwnRecurringGarden: "Set your own recurring garden reminders — prune, feed, weed, turn compost — and get a nudge on schedule.",
    egPruneTomatoesTurnCompost: "e.g. Prune tomatoes, turn compost…",
    addReminder: "＋ Add reminder",
  },

  emptyGardenStarter: {
    getStarted: "🌱 GET STARTED",
    yourGardensLookingBare: "Your Garden's Looking Bare",
    browseAllPlants: "Browse all plants 🌿",
  },

  gardenerProfile: {
    seedlingStarter: "Seedling Starter",
    enterProfileName: "Enter profile name",
    totalXpEarned: "total XP earned",
    nextBadgeToEarn: "🎯 NEXT BADGE TO EARN",
    everyBadgeUnlockedYoureLegendary: "🏆 Every badge unlocked — you're legendary!",
  },

  personalPlantingCalendar: {
    tapAMonthToSee: "Tap a month to see which of your saved plants to sow",
    nothingToSow: "nothing to sow",
    thisMonth: " · THIS MONTH",
  },

  plantGrowthTimeline: {
    growthTimeline: "📸 Growth timeline",
    sProgress: "'s Progress",
    growthTimeline2: "Growth Timeline",
    watchYourPlantGrowFrom: "Watch your plant grow from seedling to harvest with a photo-by-photo before-and-after timeline.",
    addFirstPhoto: "📸 Add first photo",
    fullProgression: "Full progression",
    addAnotherPhotoToThe: "📸 Add another photo to the timeline",
  },

  sunlightMismatch: {
    sunlightCheck: "☀️ SUNLIGHT CHECK",
    sunPlacementWarnings: "Sun Placement Warnings",
    needsFixing: "NEEDS FIXING",
  },

  budgetTracker: {
    trackWhatYouSpendOn: "Track what you spend on the garden — it feeds your ROI and shows where the money goes.",
    totalInvested: "total invested",
    whatForOptional: "What for? (optional)",
  },

  dailyBonus: {
    dailyReward: "🎁 DAILY REWARD",
    todaysBonusHasAlreadyBeen: "Today's bonus has already been claimed. Come back tomorrow!",
    n7dayStreakClaimYour100: "🔥 7-Day Streak! Claim your 100 XP bonus today!",
    openPocketPlanterDailyAnd: "Open Pocket Planter daily and claim +25 XP.",
    claimedToday: "✅ Claimed Today",
    n100Xp: "🔥 +100 XP",
    n25Xp: "+25 XP",
  },

  daylight: {
    minday: "min/day",
    daysAreGettingLonger: "Days are getting longer",
    daysAreGettingShorter: "Days are getting shorter",
  },


  photoStorage: {
    noGardenPhotosYetAs: "No garden photos yet. As you add journal photos, you'll be able to manage them here.",
    clearOldPhotos: "CLEAR OLD PHOTOS",
    deletingRemovesThoseJournalEntries: "Deleting removes those journal entries permanently. Export a backup first if you want to keep them.",
  },

  rainfallLog: {
    trackRainfallSoYouDont: "Track rainfall so you don't over-water. Plants generally want about 1″ of water per week from rain + you.",
    rainThisWeek: "rain this week",
    logTodaysRain: "Log today's rain",
    rainChanceTodayRememberTo: "% rain chance today — remember to log it if it comes down.",
  },

  seasonalChallenges: {
    youveClaimedEveryRewardThis: "You've claimed every reward this season. Fresh challenges arrive next season. 🌱",
  },

  shadeAdvisor: {
    noShadingRisksSpottedYour: "No shading risks spotted — your tall and short plants look well arranged. Tip: put tall crops (corn, tomatoes, sunflowers) on the north side of a bed so they don't shade the rest.",
    tallPlantsCanCastShade: "Tall plants can cast shade over sun-loving neighbors. Check these beds so nothing gets crowded out of the light.",
    mayShade: "may shade",
    moveTheTallCropsTo: "✅ Move the tall crops to the north (or back) side of the bed so the sun-lovers stay in full light.",
  },

  shareGarden: {
    showOffYourGardenShare: "Show off your garden! Share this snapshot of your progress with friends.",
    myPocketPlanterGarden: "🌱 MY POCKET PLANTER GARDEN",
    growingSmarterWithPocketPlanter: "Growing smarter with Pocket Planter 🌿",
    shareMyGarden: "📤 Share My Garden",
  },

  soilTestLog: {
    logSoilPhReadingsOver: "Log soil pH readings over time and get amendment tips. Test kits are cheap and pH drives how well plants absorb nutrients.",
    latestReading: "Latest reading",
    phEg65: "pH (e.g. 6.5)",
    bedNoteOptional: "Bed / note (optional)",
  },

  sunlightTracker: {
    addAGardenBedFirst: "Add a garden bed first, then log how much sun it gets each day to match the right plants to each spot.",
    watchEachBedOverA: "Watch each bed over a sunny day and log its hours of direct sun — then plant to match.",
  },

  waterTriage: {

    daysOverdue: { one: "{count} day overdue", other: "{count} days overdue" },
    wateringQueue: "🚿 WATERING QUEUE",
    waterTheseInOrder: "Water These, In Order",
    dueToday: "Due today",
    dueTomorrow: "Due tomorrow",
    water: "💧 Water",
  },

  wateringForecast: {
    saveAFewPlantsTo: "Save a few plants to see your watering week take shape.",
    busiestDay: "📅 Busiest day:",
    plants: "plants)",
    rainExpectedSoonCheckSoil: "🌧️ Rain expected soon — check soil first, you may be able to skip.",
    nothingDueAFreeDay: "Nothing due — a free day. 🌤️",
    tapADayToSee: "Tap a day to see which plants are due.",
  },


  allNotes: {
    myGardenNotes: "📝 MY GARDEN NOTES",
    allYourPlantNotes: "All Your Plant Notes",
    everythingYouveWrittenAcrossYour: "Everything you've written across your plants, in one searchable place.",
    searchYourNotes: "Search your notes...",
  },


  fixMyGarden: {
    conflictsToFix: "🔴 CONFLICTS TO FIX",
    bothIn: "📍 Both in:",
    basedOnCompanionPlantingGuidelines: "Based on companion planting guidelines. Rearrange in your Garden planner.",
  },

  harvestReveal: {
    theGlowup: "🌱➡️🍅 THE GLOW-UP",
    howFarTheyveCome: "How Far They've Come",
    yourHarvestedPlantsFromFirst: "Your harvested plants, from first photo to latest. Look at that growth.",
    daysApart: "days apart",
    firstPhoto: "🌱 First photo",
    latest: "🍅 Latest",
  },

  onThisDay: {
    onThisDay: "ON THIS DAY",
    aMemoryFromYourGarden: "A memory from your garden",
    memoriesFromYourGarden: "Memories from your garden",
    lookHowFarYouveCome: "Look how far you've come. Here's what your garden was up to around this time.",
  },

  plantTodayHero: {
    viewCareGuide: "View care guide →",
  },

  seedStarting: {
    seedStarting: "SEED STARTING",
    comingUpToStartIndoors: "Coming up to start indoors",
    startingSeedsIndoorsAheadOf: "Starting seeds indoors ahead of your last frost gives transplants a head start when it warms up.",
    startIndoorsBy: "Start indoors by",
    wksBeforeFrost: "wks before frost",
    transplantAround: "Transplant around",
  },

  thrivingNearYou: {
    popularInZone: "Popular in Zone",
    whatGardenersInYourGrowing: "What gardeners in your growing zone are saving and harvesting most. Updated as your community grows.",
    loadingYourZone: "Loading your zone…",
  },


  yearInReview: {
    grownThisYear: "GROWN THIS YEAR",
    estimatedValueOfYourHarvests: "Estimated value of your harvests",
    shareMyYearInReview: "📤 Share My Year in Review",
  },

  frostBanner: {
    frostExpected: "Frost expected",
    turnOnFrostAlertsIn: "Turn on Frost Alerts in the Garden tab to get a heads-up each cold evening.",
  },

  frostChecklist: {
    coldWeatherPrep: "COLD WEATHER PREP",
    youreColdready: "You're cold-ready! 🌿",
  },

  gardenPlanExport: {
    buildAGardenMapWith: "Build a garden map with a few beds and plants, then export the whole plan to share or save for reference.",
    exportYourFullGardenLayout: "Export your full garden layout — every bed and its plants — as a shareable plan you can send, save, or print.",
    plantsPlaced: "Plants placed",
    exportShareGardenPlan: "📤 Export / Share Garden Plan",
  },

  harvestLog: {
    daysAgo: { one: "{count} day ago", other: "{count} days ago" },
    modalTitle: "🎉 LOG A HARVEST",
    howMuch: "How much did you harvest?",
    placeholder: "e.g. \"6 tomatoes\" or \"2 lbs\"",
    logIt: "Log it",
    totalHarvests: "Total Harvests",
    thisMonth: "This Month",
    noHarvestsLoggedYet: "No harvests logged yet",
    openAPlantAndTap: "Open a plant and tap \"Log a Harvest\" when you pick something. It'll show up here.",
  },

  harvestReady: {
    harvestTracker: "HARVEST TRACKER",
    pickTheseSoonForPeak: "Pick these soon for peak flavor — and to keep your plants producing.",
    thesePlantsAreEnteringTheir: "These plants are entering their harvest window. Keep an eye on them.",
    readyToHarvestNow: "🎉 Ready to harvest now!",
  },

  pestWatch: {
    basedOnTypicalActivityIn: "Based on typical activity in your zone — not a live infestation report.",
  },

  successionSowing: {
    resowTheseOnARhythm: "Re-sow these on a rhythm for a steady, continuous harvest instead of one big glut.",
    sowAnyway: "Sow anyway",
  },



  wateringStreakNudge: {
    dontBreakYourStreak: "DON'T BREAK YOUR STREAK",
    thesePlantsHaveAWatering: "These plants have a watering streak going. Water them before the window closes to keep it alive.",
    dayStreak: "-day streak",
    lastDayToKeepIt: "⏳ Last day to keep it!",
    water: "💧 Water",
  },


  plantAnniversary: {
    plantAnniversary: "PLANT ANNIVERSARY",
    aPlantMilestone: "A plant milestone!",
    together: "together!",
  },


  powerPairs: {
    powerPairs: "🟢 POWER PAIRS",
    thesePlantsShareABed: "These plants share a bed and genuinely help each other. Tap a pair to see why it works.",
    greatPairingIn: "🟢 Great pairing in",
  },

  quickAdd: {
    typeAPlantNameTo: "Type a plant name to add it to your garden in a tap — no scrolling the full list.",
    search179Plants: "Search {count} plants…",
    saved: "✓ Saved",
    add: "+ Add",
  },

  rescueMode: {
    rescueMode: "RESCUE MODE",
    theseHaventBeenWateredIn: "These haven't been watered in a while. A deep watering and a soil check can bring most plants back.",
    daysSinceWatering: "days since watering",
    rescue: "💧 Rescue",
  },



  wateringInsights: {
    logAFewWateringsTo: "Log a few waterings to see your heatmap.",
  },

  wateringRhythm: {
    needsAtLeast3Logged: "Needs at least 3 logged waterings per plant to show a pattern.",
  },

  wishlist: {
    dreamingUpNextSeasonSave: "Dreaming up next season? Save plants you want to try — separate from your active garden.",
    addAPlantToTry: "Add a plant to try next season…",
    yourWishlistIsEmptyAdd: "Your wishlist is empty — add the crops you're excited to grow.",
    growing: "growing ✓",
  },

  errorBoundary: {
    somethingWentWrong: "Something went wrong",
    pocketPlanterHitAnUnexpected: "Pocket Planter hit an unexpected error. Your data is safe — tap below to try again.",
    tryAgain: "Try again",
  },

  growthTimelapse: {
    add2OrMoreDated: "Add 2 or more dated photos of the same plant (from its plant page) and you'll be able to play back its growth here.",
    pause: "⏸ Pause",
    playGrowth: "▶ Play growth",
  },

  premiumLocked: {
    weatherIntelligence: "Weather Intelligence",
    unlockPremiumToSeeSmart: "Unlock premium to see smart weather alerts, frost risk, heat warnings, and watering guidance.",
    unlockPremium: "👑 Unlock Premium ›",
  },



  dailyQuests: {
    claimed: "claimed · +",
    tapToClaim: ", tap to claim",
  },


  monthlyChecklist: {
    gardenChecklist: "Garden Checklist",
    allWrappedUp: " · all wrapped up! 🎉",
  },

  premiumLockedSection: {
    premium: "🔒 Premium",
    unlockPremium: "Unlock Premium 🌱",
  },







  intro: {
    title: "Welcome to Pocket Planter 🌱",
    subtitle: "Your pocket-sized garden companion. Here's what you can do:",
    footer: "Enter your location above to get started — it's free.",
  },

  zone: {
    findTitle: "Find your Garden Zone",
    // Deliberately avoids interpolating the postal-label noun: "enter your
    // {label}" forces a possessive that has to agree in gender, which breaks in
    // German, French and Spanish. The input's own placeholder shows the format.
    findBody: "Pick your country and fill in your location below, so Pocket Planter can match plants to your local growing zone.",
    findButton: "Find my zone",
    useLocation: "Use location",
    loading: "Working out your growing zone from 30 years of local climate data…",
    errorNotFound: "Couldn't find that location in {country}. Check your entry, or try your nearest town instead.",
    errorBusy: "The growing-zone service is busy right now. Check your connection and tap “Find my zone” to try again.",
    yourZone: "Your Growing Zone",
    zoneN: "Zone {zone}",
    change: "✏️ Change Zone",
    changeTitle: "Change your zone?",
    changeBody: "This clears your current location so you can enter a new one. Your saved plants and garden stay intact.",
    changeConfirm: "Change Zone",
  },

  country: {
    select: "Select your country",
    search: "Search {count} countries and territories…",
    noMatch: "No country matches “{query}”.",
  },

  postal: {
    zip: "ZIP code",
    postcode: "Postcode",
    eircode: "Eircode",
    pin: "PIN code",
    cep: "CEP",
    generic: "Postal code",
    city: "City",
    placeholderExample: "e.g. {example}",
    placeholderCity: "Enter your city",
    placeholderGeneric: "Enter your postal code",
  },

  location: {
    deniedTitle: "Location Denied",
    deniedBody: "Allow location access to auto-detect your growing zone.",
    errorTitle: "Location Error",
    errorBody: "Unable to detect your location right now.",
    notFoundTitle: "Location Not Found",
    notFoundBody: "Pocket Planter couldn't work out your growing zone from that location.",
  },

  alerts: {
    setupCapNote: "Free plans stop at 5 saved plants — upgrade to Premium to add the rest of this setup.",
    clearGoalTitle: "Clear goal?",
    clearGoalBody: "This removes your current harvest goal. Your harvest log stays.",
    clearGoalConfirm: "Clear",
    reminderTimeTitle: "Watering Reminder Time",
    reminderTimeBody: "When should Pocket Planter remind you each day?",
    plantNotFoundTitle: "Plant not found",
    plantNotFoundBody: "Could not find “{name}” in the plant catalog.",
    loginRequiredTitle: "Login required",
    loginRequiredBody: "Please log in before adding journal photos.",
    uploadFailedTitle: "Upload failed",
    uploadFailedBody: "Could not upload this journal photo.",
    nothingToClearTitle: "Nothing to clear",
    nothingToClearBody: "You have no photos older than that.",
    deleteOldPhotosTitle: "Delete old photos?",
    deleteOldPhotosBody: {
      one: "This permanently removes {count} photo older than {label}. This can't be undone. Export a backup first if you want to keep it.",
      other: "This permanently removes {count} photos older than {label}. This can't be undone. Export a backup first if you want to keep them.",
    },
    photosClearedTitle: "Photos cleared",
    photosClearedBody: {
      one: "{count} old photo removed.",
      other: "{count} old photos removed.",
    },
    setReminderForTitle: "Set Reminder for {plant}",
    streakBonusTitle: "🔥 7-Day Streak Bonus!",
    streakBonusBody: "Incredible! You've been gardening for {count} days in a row. You earned 100 XP!",
    wateringStreakTitle: "🔥 {count}-Day Watering Streak!",
    wateringStreakBody: "Incredible consistency with {plant}. Keep it growing!",
    wateredTitle: "Watered",
    wateredBody: "{plant} was marked watered for today.",
    cantPlantHereTitle: "Can't plant here",
    cantPlantHereFlowerBody: "The Flowers & Home garden is only for flowers and houseplants. {plant} is an edible — add it to a bed on the Garden tab.",
    cantPlantHereEdibleBody: "Garden beds are only for edible plants. {plant} is a flower or houseplant — add it in the Flowers & Home garden.",
    saveItFirstTitle: "Save it first",
    saveItFirstBody: "Save {plant} to your plants, then you can add it to a garden bed.",
    alreadyPlantedTitle: "Already planted",
    alreadyPlantedBody: "{plant} is already in {bed}. Rearrange it anytime.",
    swappedTitle: "Swapped",
    swappedBody: "{plant} replaced {other} in {bed}.",
    newGardenTitle: "New garden created",
    newGardenBody: "{plant} was planted in a new {kind} bed.",
    newGardenKindFlower: "Flowers & Home",
    newGardenKindEdible: "garden",
    noRoomAutoFixTitle: "No room to auto-fix 🌱",
    noRoomAutoFixBody: {
      one: "Found {count} companion conflict, but there's no free spot in another bed to relocate a plant. Add a bed (or clear a slot) so there's somewhere to move one, then try again.",
      other: "Found {count} companion conflicts, but there's no free spot in another bed to relocate a plant. Add a bed (or clear a slot) so there's somewhere to move one, then try again.",
    },
    setupPlantedTitle: "{plant} planted",
    setupPlantedBody: "Added a pre-planted bed to your {tab} tab. Open it to see the layout and any companion conflicts.{capNote}",
    premiumTitle: "Go unlimited with Premium",
    premiumBodyDefault: "You're on the free plan. Upgrade to Premium to save unlimited plants, plus unlock the garden dashboard, planting, sowing & frost calendars, pest watch, plant picks, and the Flowers & Home tab.",
    premiumBodySaves: "You're on the free plan — up to 5 saved plants. Upgrade to Premium to save unlimited plants, plus unlock the garden dashboard, planting, sowing & frost calendars, pest watch, plant picks, and the Flowers & Home tab.",
    alreadySavedTitle: "Already saved",
    alreadySavedBody: "All of these are already in your plants.",
    savedCountTitle: "Saved {count}",
    savedCappedBody: "Added {count} to your plants. Free plans stop at 5 saved plants — upgrade to Premium to save the rest of this combo.",
    savedTitle: "Saved",
    savedBody: {
      one: "Added {count} plant to your plants. Tap a bed slot on the garden map to place it.",
      other: "Added {count} plants to your plants. Tap a bed slot on the garden map to place them.",
    },
    savedGardenBody: {
      one: "Added {count} plant to your garden.",
      other: "Added {count} plants to your garden.",
    },
    alreadySavedShortBody: "Those were already saved.",
    quickLogTitle: "Quick Log 🌱",
    quickLogBody: "Log a garden action without leaving this screen.",
    gardenFullTitle: "Garden's full",
    gardenFullBody: "There are no empty plots in this bed to add companions to.",
    viewPlantTitle: "View plant",
    viewPlantBody: "Which plant do you want to open?",
    deleteGardenTitle: "Delete garden?",
    deleteGardenBody: "This will remove “{name}” and everything planted in it. This can't be undone.",
    deleteGardenFallbackName: "this garden",
    calendarAccessTitle: "Calendar access needed",
    calendarAccessBody: "Allow calendar access to add the reminder, or use “Share as .ics file” instead.",
    noCalendarTitle: "No calendar found",
    noCalendarBody: "Couldn't find a calendar to write to. Try the .ics file export instead.",
    addedToCalendarTitle: "Added to calendar ✅",
    addedToCalendarBody: "{task} — {freq}, starting {date}.",
    calendarFailedTitle: "Couldn't add event",
    calendarFailedBody: "Something went wrong. Try the .ics file export instead.",
    taskSavedTitle: "Task saved",
    taskSavedBody: "Reminders need notification permission (and a dev build) to fire, but your task is saved here.",
    nothingToExportTitle: "Nothing to export",
    nothingToExportBody: "You don't have any {label} entries yet.",
    enterAmountTitle: "Enter an amount",
    enterAmountSuppliesBody: "Type what you've spent on seeds and supplies (e.g. 45).",
    enterAmountWaterBody: "Type how much you watered (e.g. 2).",
    enterNumberTitle: "Enter a number",
    enterNumberBody: "Set how many harvests you want to log this season (e.g. 20).",
    scheduledRemindersTitle: "Scheduled Reminders",
    nothingScheduledBody: "Nothing scheduled. (In Expo Go, scheduling may be limited — confirm in a dev build.)",
    notificationsOffTitle: "Notifications Off",
    notificationsOffBody: "Enable notifications for Pocket Planter in your phone settings, then try again.",
    testScheduledTitle: "Test Scheduled ⏱️",
    testScheduledBody: "Background the app now — a test notification will fire in ~5 seconds.",
    remindersClearedTitle: "All Reminders Cleared",
    remindersClearedBody: "Every scheduled notification was canceled. Re-toggle your reminders on the Garden tab to reschedule them cleanly.",
    selectActionTitle: "Select an action",
    selectActionBody: "Please tap a care action before logging.",
    fertilizedTitle: "Fertilized! 🌾",
    fertilizedBody: "Want a reminder to fertilize {plant} again?",
    careLoggedTitle: "Care logged! 🌱",
    careLoggedBody: "{icon} {label} logged for {plant}.",
    savePlantsFirstTitle: "Save plants first",
    savePlantsFirstBody: "Save a few plants before applying a garden template.",
    templateAppliedTitle: "Template Applied 🌱",
    templateAppliedBody: "Your garden layout has been filled with saved plants.",
    harvestTrackerTitle: "Harvest Tracker Started",
    harvestTrackerBody: "{plant} is now being tracked.",
    pickTwoTitle: "Pick exactly 2",
    pickTwoBody: "Select two plants to compare them side by side.",
    notificationsDisabledTitle: "Notifications Disabled",
    notificationsDisabledBody: "Enable notifications in your phone settings to receive frost alerts.",
    frostOnTitle: "Frost Alerts On ❄️",
    frostOnBodyForecast: "Frost is already in your forecast — low of {temp} coming. You'll also get a check-in reminder during cold months.",
    frostOnBodyDefault: "You'll get a frost check-in reminder during your zone's cold months, plus an instant alert whenever frost appears in your forecast.",
    frostOffTitle: "Frost Alerts Off",
    frostOffBody: "You will no longer receive frost alerts.",
    monthlyOnTitle: "Monthly Planting Guides On 🌱",
    monthlyOnBody: "You'll receive a planting guide on the 1st of every month.",
    monthlyOffTitle: "Monthly Planting Reminders Off",
    monthlyOffBody: "You will no longer receive monthly planting guide reminders.",
    waterOnTitle: "Daily Watering Check On 💧",
    waterOnBody: "Pocket Planter will remind you every morning at {time} to check your garden.",
    waterOffTitle: "Daily Watering Reminder Off",
    waterOffBody: "You will no longer receive daily watering reminders.",
  },

  games: {
    title: "🎮 Garden Games",
    intro: "Sharpen your gardening know-how. Beat your best score on each game.",
    playA11y: "Play {game}",
    best: "Best: {score}/{total}",
    play: "Play",
    sunTitle: "Sun or Shade?",
    sunDesc: "Guess how much light each plant needs — full sun, partial, or shade.",
    companionTitle: "Companion Match",
    companionDesc: "Pick the plant that grows best alongside each one.",
    waterTitle: "Water Wise",
    waterDesc: "Guess how thirsty each plant is — low, medium, or high water.",
    difficultyTitle: "Green Thumb Test",
    difficultyDesc: "How tricky is each plant to grow — easy, medium, or hard?",
    sunPrompt: "How much light does {plant} need?",
    sunFull: "Full sun",
    sunPartial: "Partial sun",
    sunShade: "Shade",
    sunRevealFull: "{plant} grows best in full sun.",
    sunRevealPartial: "{plant} grows best in partial sun.",
    sunRevealShade: "{plant} grows best in shade.",
    companionPrompt: "Which is the best companion for {plant}?",
    waterPrompt: "How thirsty is {plant}?",
    waterLow: "Low water",
    waterMedium: "Medium water",
    waterHigh: "High water",
    waterRevealLow: "{plant} prefers low watering.",
    waterRevealMedium: "{plant} prefers medium watering.",
    waterRevealHigh: "{plant} prefers high watering.",
    difficultyPrompt: "How hard is {plant} to grow?",
    difficultyRevealEasy: "{plant} is easy to grow. {why}.",
    difficultyRevealMedium: "{plant} is medium difficulty to grow. {why}.",
    difficultyRevealHard: "{plant} is hard to grow. {why}.",
    scored: "You scored {score}/{total}",
    xpEarned: "✨ +{xp} XP earned",
    newBest: "🎉 New best!",
    playAgain: "Play again",
    backToGames: "Back to games",
    couldntStart: "This game couldn't start",
    exit: "‹ Exit",
    questionOf: "Question {n} of {total}",
    seeResults: "See results",
    nextQuestion: "Next question →",
  },

  stats: {
    streak: "Streak",
    health: "Health",
    saved: "Saved",
    plants: "Plants",
    harvests: "Harvests",
    beds: "Beds",
    grown: "Grown",
    spent: "Spent",
    high: "High",
    low: "Low",
    rain: "Rain",
    less: "Less",
    more: "More",
    design: "DESIGN",
    cancelValue: "Cancel",
    anytime: "Anytime",
    previewReady: "{count} Ready!",
    previewNeedWater: { one: "{count} plant needs watering", other: "{count} plants need watering" },
    previewWaterAll: "Water all with one tap",
    previewTitle: "See your full dashboard",
    previewBody: "Unlock Premium for watering, harvests, journal stats and today's to-do list — all in one place.",
    previewA11y: "Unlock the full garden dashboard with Premium",
    backToPlant: "Back to plant",
    plantsAtRisk: "🌿 Plants at risk",
    plantsAtRiskBody: "In your garden, these could be affected — tap to open.",
    timelineEmptyTitle: "Your garden's story starts here",
    timelineEmptyBody: "Add a photo, log a harvest, water a plant, or save something new — it all shows up here as a living timeline.",
    onThisDay: "⏳ ON THIS DAY",
    jumpToTool: "JUMP TO A TOOL",
    toolsFeatures: "TOOLS & FEATURES",
    shareGrowing: { one: "🪴 {count} plant growing", other: "🪴 {count} plants growing" },
    shareWaterings: { one: "💧 {count} watering this week", other: "💧 {count} waterings this week" },
    sharePhotos: { one: "📸 {count} garden photo logged", other: "📸 {count} garden photos logged" },
    shareStreak: { one: "🔥 {count}-day streak going strong", other: "🔥 {count}-day streak going strong" },
    shareLevel: "⭐ Level {level} — {title}",
  },

  calc: {
    tabFeed: "🌾 Feed",
    tabWater: "💧 Water",
    tabTimer: "⏱️ Timer",
    tabMix: "🪴 Mix",
    eg: "e.g. {n}",
    fertIntro: "Mix water-soluble fertilizer to the right strength — no more guessing at the scoop.",
    containerLabel: "WATERING CONTAINER ({unit})",
    litres: "litres",
    gallons: "gallons",
    labelRate: "LABEL RATE (from your fertilizer)",
    rateChip: "{n} tbsp/gal",
    strength: "STRENGTH",
    seedling: "Seedling ¼",
    half: "Half ½",
    full: "Full",
    tbspValue: "{n} tbsp",
    tspMl: "≈ {tsp} tsp · {ml} mL",
    stirInto: "Stir into your {volume} container, then water as usual.",
    enterContainer: "Enter a container size to see the mix.",
    waterIntro: "Work out how much water a bed or pot actually needs — and how long that is on the hose.",
    bed: "🛏️ Garden bed",
    pot: "🪴 Pot / container",
    bedArea: "BED AREA ({unit})",
    waterPerWeek: "WATER PER WEEK",
    wateringsPerWeek: "WATERINGS PER WEEK",
    potDiameter: "POT DIAMETER ({unit})",
    inches: "inches",
    perWatering: "per watering",
    perWeek: "({volume}/week)",
    cansHose: { one: "≈ {count} watering can · or {seconds}s of hose", other: "≈ {count} watering cans · or {seconds}s of hose" },
    enterSize: "Enter a size to estimate.",
    timerIntro: "A hands-on timer for soaker hoses and hand-watering, so beds get an even, measured drink.",
    doneWatering: "✅ Done watering!",
    pause: "Pause",
    restart: "Restart",
    start: "Start",
    mixIntro: "Blend your own mix — pick a recipe and container size for the exact amount of each ingredient.",
    batchSize: "BATCH SIZE ({unit})",
    recipe: "RECIPE",
    ratio: "Ratio {ratio} · mix dry, then moisten.",
    enterBatch: "Enter a batch size to see the recipe.",
    recipeSeed: "Seed-starting",
    recipeGeneral: "General potting",
    recipeCactus: "Cactus / succulent",
    recipeRaised: "Raised bed (Mel's mix)",
    coirPeat: "Coir / peat",
    perlite: "Perlite",
    vermiculite: "Vermiculite",
    compost: "Compost",
    pottingMix: "Potting mix",
    coarseSand: "Coarse sand",
  },

  tools: {
    rainTitle: "🛢️ RAIN BARREL",
    rainIntro: "Track your collected rainwater and how long it'll keep the garden going.",
    rainOf: "of {capacity} · {pct}% full",
    rainEmpty: "Empty — waiting on rain.",
    rainDaysLeft: { one: "≈ {count} day of watering left", other: "≈ {count} days of watering left" },
    rainAdd: "IT RAINED — ADD WATER",
    rainFull: "Full",
    rainUsed: "WATERED — USED WATER",
    rainEmptyBtn: "Empty",
    rainSize: "BARREL SIZE",
    labelsTitle: "🏷️ PLANT LABELS",
    labelsIntro: "Make printable garden stakes for your saved plants — name, planting window, and a care tip.",
    labelsReady: { one: "{count} label ready", other: "{count} labels ready" },
    labelsExport: "Export / share labels",
    labelsQr: "QR STAKE — tap a plant",
    labelsQrNeedsBuild: "QR codes need the latest app build. The text labels above work now on any device.",
    labelsQrHint: "Screenshot or print it, then stick it on a stake next to the plant.",
    labelsEmpty: "Save some plants first and their labels will be ready to print here.",
    labelsShareHeader: "🌿 Pocket Planter — Plant Labels",
    labelsShareHeaderZone: "🌿 Pocket Planter — Plant Labels (Zone {zone})",
    labelsShareHow: "Print, cut along the dashed lines, and stake next to each plant.",
    labelsZones: "Zones {min}–{max}",
    labelsPlant: "Plant: {months}",
    labelsTip: "Tip: {tip}",
    petSevere: "SEVERE",
    petToxic: "TOXIC",
    petMild: "MILD",
    petSafeTag: "SAFE",
    petIntro: "Which of your plants are risky around cats and dogs.",
    petEmpty: "Save some flowers or houseplants to check them here.",
    petKeepAway: "⚠️ KEEP AWAY FROM PETS",
    petSafeHeader: "✅ PET-SAFE",
    petUnknown: "❔ NOT LISTED — CHECK FIRST",
    petDisclaimer: "Best-effort guidance, not veterinary advice. When unsure, keep plants out of reach and check the ASPCA list or your vet.",
    bloomTitle: "🌸 BLOOM SUCCESSION",
    bloomIntro: "Keep something in flower all season so pollinators always have a reason to visit.",
    bloomEmpty: "Save some flowering plants and they'll map out here across the year.",
    bloomGap: "Bloom gap in {months}.",
    bloomAdd: "Add {plant} to cover {month}.",
    bloomAddAny: "Add an early or late bloomer to fill it.",
    bloomNice: "Nice — you've got continuous bloom across the growing season. 🐝",
    bloomAim: "Aim for at least one plant flowering in every month from spring to fall.",
    pairIntro: "Pick any two plants to see if they're good neighbours before you plant.",
    pairFirst: "FIRST PLANT",
    pairSecond: "SECOND PLANT",
    pairDifferent: "Pick two different plants.",
    pairChoose: "Choose a plant in each row to compare them.",
    pairExcellent: "Excellent Pair",
    pairAvoid: "Avoid",
    pairNeutral: "Neutral",
    growTitle: "💡 GROW-LIGHT SCHEDULE",
    growIntro: "Seedlings want 14–16 h of light a day, 2–3″ (5–8 cm) above the leaves. Track each tray's schedule here.",
    growPlaceholder: "Tray / shelf name",
    growAddA11y: "Add grow-light tray",
    growHoursChip: "{h}h/day",
    growTrayLine: "Day {day} · {h}h/day · {window}",
    growRemoveA11y: "Remove tray",
    careIntro: "Log watering and repotting so you always know what's due.",
    careNotLogged: "not logged",
    careWaterDue: "water due",
    careInDays: "in {count}d",
    careRepotDue: "🪴 repot due",
    careEmpty: "Save some houseplants to track their care.",
  },

  toolkit: {
    moonTitle: "🌙 MOON PLANTING",
    moonNew: "New Moon",
    moonWaxCres: "Waxing Crescent",
    moonFirstQ: "First Quarter",
    moonWaxGib: "Waxing Gibbous",
    moonFull: "Full Moon",
    moonWanGib: "Waning Gibbous",
    moonLastQ: "Last Quarter",
    moonWanCres: "Waning Crescent",
    moonIllum: "{pct}% illuminated · day {day} of 29",
    q1Label: "Sow leafy greens",
    q1Text: "Waxing moon, first quarter — a classic time to sow leafy annuals: lettuce, spinach, kale, broccoli, herbs.",
    q2Label: "Sow fruiting crops",
    q2Text: "Waxing toward full — favoured for fruiting above-ground crops: tomatoes, peppers, beans, squash, cucumbers.",
    q3Label: "Sow roots & transplant",
    q3Text: "Waning after full — traditionally best for root crops (carrots, beets, onions, potatoes) and transplanting.",
    q4Label: "Rest, weed & prune",
    q4Text: "Waning to new — a rest phase: weed, prune, harvest for storage, and improve the soil rather than sow.",
    moonDays: { one: "{count} day", other: "{count} days" },
    moonNext: "🌕 Full moon in {full} · 🌑 New moon in {new}",
    moonFolk: "Lunar planting is folk tradition, not a substitute for your frost and soil-temperature timing.",
    germTitle: "🌱 SEED VIABILITY TEST",
    germIntro: "Sprout a few seeds on a damp paper towel, then log how many came up.",
    germPlaceholder: "Seed (e.g. 2022 Tomato packet)",
    germSown: "SEEDS SOWN",
    germSprouted: "HOW MANY SPROUTED?",
    germGreat: "Great",
    germOk: "OK",
    germLow: "Low",
    germPoor: "Poor",
    germTipGreat: "Sow as normal — these seeds are strong.",
    germTipOk: "Still usable — sow a few extra to be safe.",
    germTipLow: "Sow well over your target, or buy fresh seed.",
    germTipPoor: "Time to replace this packet.",
    germViability: "{label} viability",
    germForTen: "For ~10 plants, sow about {count} seeds.",
    germSave: "Save test",
    germDeleteA11y: "Delete test",
    toolTitle: "🔧 TOOL MAINTENANCE",
    toolDue: { one: "{count} task due — keep your tools sharp and clean.", other: "{count} tasks due — keep your tools sharp and clean." },
    toolAllDone: "All tools cared for. Nice. 🛠️",
    toolEvery: "Every {days} days · not logged yet",
    toolDueNow: "Due now · last done {date}",
    toolNextIn: { one: "Next in {count} day", other: "Next in {count} days" },
    toolMarkA11y: "Mark {task} done",
    toolClean: "Clean & disinfect blades",
    toolSharpenPruners: "Sharpen pruners",
    toolOil: "Oil handles & hinges",
    toolSharpenShovel: "Sharpen shovel / hoe edge",
    toolMower: "Sharpen mower blade",
    toolHose: "Drain & store hose",
    soilTitle: "🌡️ SOIL TEMPERATURE",
    soilIntro: "Push a thermometer 2–3″ (5–8 cm) into the bed mid-morning and log it — it tells you what's actually safe to sow.",
    soilLatest: "latest soil temp",
    soilWarmEnough: "✅ Warm enough to sow:",
    soilStillCold: "Still cold — wait for it to warm before direct sowing.",
    soilAt: "At {temp}: {crops} unlock.",
    soilPlaceholder: "Soil temp ({unit})",
    soilAddA11y: "Add soil temperature reading",
    soilRemoveA11y: "Remove reading",
    choreTitle: "🔁 CHORE ROTATION",
    choreIntro: "Share the garden work — chores rotate through everyone each week.",
    choreWho: "WHO HELPS",
    choreAddName: "Add a name",
    choreAddPersonA11y: "Add person",
    choreChores: "CHORES",
    choreAddChore: "Add a chore",
    choreAddChoreA11y: "Add chore",
    choreWater: "Water",
    choreWeed: "Weed",
    choreHarvest: "Harvest",
    choreCompost: "Compost",
    choreFeed: "Feed plants",
    choreThisWeek: "THIS WEEK",
    choreRotates: { one: "rotates in {count} day", other: "rotates in {count} days" },
    chorePrev: "‹ Previous",
    choreNext: "Next ›",
    choreEmpty: "Add at least one person and one chore to start the rotation.",
  },

  misc: {
    calTitle: "📅 ADD TO CALENDAR",
    calIntro: "Put a recurring garden reminder on your real calendar.",
    calWater: "🌿 Water the garden",
    calFertilize: "🌾 Fertilize the garden",
    calPests: "🐛 Check for pests",
    calDaily: "Daily",
    calEvery2: "Every 2 days",
    calEvery3: "Every 3 days",
    calWeekly: "Weekly",
    calNotes: "Added by Pocket Planter 🌿",
    calAdding: "Adding…",
    calAddDevice: "Add to device calendar",
    calShareIcs: "Share as .ics file",
    calFootnote: "Reminders start at {time}. The .ics file works with any calendar app.",
    roomsIntro: "Keep track of which houseplant lives in which room.",
    roomsAddPlaceholder: "Add a room",
    roomsAddA11y: "Add room",
    roomsAddAbove: "Add a room above to start assigning your houseplants.",
    roomsEmpty: "Save some houseplants to organize them by room.",
    roomLiving: "Living Room",
    roomBedroom: "Bedroom",
    roomBathroom: "Bathroom",
    roomKitchen: "Kitchen",
    roomOffice: "Office",
    seedScanA11y: "Scan a seed packet barcode",
    seedScan: "📷 Scan a packet barcode",
    upgrade: "Upgrade",
    propIntro: "Turn one plant into many — track your cuttings and divisions until they root.",
    propPlaceholder: "What are you propagating?",
    propAddA11y: "Add propagation",
    vaseIntro: "Started a fresh vase? Track how many days it has left.",
    vasePlaceholder: "Vase / bouquet name",
    vaseAddA11y: "Add vase",
    vaseRemoveA11y: "Remove vase",
    pestsIntro: "Early warnings for the pests most likely to hit your saved plants this month.",
    pestsLockedTitle: "Pest watch locked",
    pestsLockedBody: "Unlock Premium to get early warnings for the pests most likely to hit your saved plants this month.",
    pestsNoneTitle: "No pest threats right now",
    pestsNoneBody: "None of your saved plants have common pests active this month. Check back as the season changes.",
    pestsSaveBody: "Save a few plants and this tab will warn you about the pests most likely to target them.",
    pestsBrowse: "Browse plants",
    pruneTitle: "✂️ PRUNING THIS MONTH",
    pruneNothing: "Nothing to prune in {month}.",
    pruneNext: "Next: {plant} in {month}.",
    pruneEmpty: "Save some fruit trees, berries, or herbs and their pruning windows will show up here.",
    fcCover: "Cover plants",
    fcSkipPlanting: "Skip planting",
    fcWaterEarly: "Water early",
    fcSkipWatering: "Skip watering",
    fcCheckSoil: "Check soil",
    fcGreat: "Great day! 🌟",
    fcNormal: "Normal care",
    fcBest: "Best",
    fcFrostNights: { one: "{count} frost risk night this week — keep covers ready.", other: "{count} frost risk nights this week — keep covers ready." },
    fcHeatDays: { one: "{count} day above {temp} — water deeply every morning and mulch heavily.", other: "{count} days above {temp} — water deeply every morning and mulch heavily." },
    fcRainyDays: { one: "{count} rainy day ahead — hold off on fertilizing and check container drainage.", other: "{count} rainy days ahead — hold off on fertilizing and check container drainage." },
    fcPerfect: "Perfect growing week ahead — mild temps and low rain chance all week.",
    fcHotWeek: "Hot zone week — high of {temp}. Water before {time} daily and harvest often.",
    fcGoodWeek: { one: "Good garden week — high of {temp} with {count} rainy day. Stay consistent with watering.", other: "Good garden week — high of {temp} with {count} rainy days. Stay consistent with watering." },
    rainPlenty: "Your garden's had plenty of rain this week — most established plants can skip watering. Check the soil first.",
    rainDecent: "A decent soaking this week. Water only the thirstiest plants and containers.",
    rainDry: "Dry week so far — keep up with your normal watering, especially seedlings and pots.",
    rainClear: "Clear",
    rainSoFar: "{amount} so far",
  },

  care: {
    cutEmpty: "Save a few flowers from the Plants tab and their vase life and cutting tips will show up here.",
    cutIntro: "How long each of your flowers lasts in a vase — and how to make them last.",
    cutDays: { one: "🏺 {count} day", other: "🏺 {count} days" },
    cutDries: "🌾 Dries well — {how}",
    cutBouquet: "💐 BUILD A BOUQUET",
    cutStemTypes: { one: "{count} stem type", other: "{count} stem types" },
    cutDaysPlain: { one: "{count} day", other: "{count} days" },
    cutBouquetSummary: "{types} · stays fresh about {days}. Mix heights and one focal bloom for balance.",
    cutTapFew: "Tap a few flowers to design a bouquet (up to 5).",
    guildPlantA11y: "Plant the {guild} setup as a new garden bed",
    guildPlant: "🌱 Plant this setup in my garden",
    guildAddA11y: "Add all {guild} plants to your plants",
    guildAddAll: "＋ Add all to my plants",
    hpIntro: "Light, water and repotting at a glance for your indoor plants.",
    hpMatchLight: "💡 MATCH A ROOM'S LIGHT",
    hpLow: "Low",
    hpMedium: "Medium",
    hpBright: "Bright",
    hpThrivesLow: "Thrives in low light:",
    hpThrivesMedium: "Thrives in medium light:",
    hpThrivesBright: "Thrives in bright light:",
    hpAir: "🌿 AIR",
    hpLightLow: "Low light",
    hpLightIndirect: "Bright indirect",
    hpLightDirect: "Bright / direct",
    hpEvery: "every ~{count}d",
    hpHumLow: "Low",
    hpHumAverage: "Average",
    hpHumHigh: "High",
    hpRepot: { one: "Repot every ~{count} yr.", other: "Repot every ~{count} yrs." },
    hpEmpty: "Save some houseplants from the Plants tab to see their care here.",
    hpPests: "Common houseplant pests",
  },

  counts: {
    wateredPlants: { one: "Watered {count} plant", other: "Watered {count} plants" },
    learnedFrom: { one: "learned from your habits on {count} plant", other: "learned from your habits on {count} plants" },
    planConflicts: { one: "⚠️ {count} companion conflict to review.", other: "⚠️ {count} companion conflicts to review." },
    planTotal: { one: "Total: {plants} plants across {count} bed.", other: "Total: {plants} plants across {count} beds." },
    seasonStartsIn: { one: "{season} starts in {count} day", other: "{season} starts in {count} days" },
    readyToHarvest: { one: "{count} plant ready to harvest!", other: "{count} plants ready to harvest!" },
    dueFertilizer: { one: "{count} plant due for fertilizer", other: "{count} plants due for fertilizer" },
    wateredToday: { one: "{watered} of {count} plant watered today · {week} logged this week.", other: "{watered} of {count} plants watered today · {week} logged this week." },
    shoppingPlanted: { one: "{count} plant planted across your garden — restock seeds or feed in a tap.", other: "{count} plants planted across your garden — restock seeds or feed in a tap." },
    storyAreas: { one: "🗂️ Growing across {count} garden area", other: "🗂️ Growing across {count} garden areas" },
    startIndoors: { one: "Start {count} plant indoors now", other: "Start {count} plants indoors now" },
    heatmapSummary: "{waterings} across {days}. Each square is a day — greener means more.",
    wateringsN: { one: "{count} watering", other: "{count} waterings" },
    daysN: { one: "{count} day", other: "{count} days" },
    toWaterToday: { one: "💧 {count} plant to water today", other: "💧 {count} plants to water today" },
    dueA11y: { one: "{day}: {count} plant due", other: "{day}: {count} plants due" },
    notShown: { one: "{count} plant not shown — water once to start forecasting.", other: "{count} plants not shown — water once to start forecasting." },
    photosN: { one: "{count} photo", other: "{count} photos" },
    daysToHarvest: { one: "⏳ ~{count} day to harvest", other: "⏳ ~{count} days to harvest" },
    pestsCommon: { one: "{count} pest common in {zone} around {month}. Tap any pest for a full guide.", other: "{count} pests common in {zone} around {month}. Tap any pest for a full guide." },
    frostMonths: { one: "That's about {count} month of prime planting in Zone {zone}", other: "That's about {count} months of prime planting in Zone {zone}" },
    itemsOnHand: { one: "{count} item on hand.", other: "{count} items on hand." },
    itemsLow: { one: "{count} item running low — reorder before planting season.", other: "{count} items running low — reorder before planting season." },
    harvestsLogged: { one: "🚜 {count} harvest logged", other: "🚜 {count} harvests logged" },
    gardenPhotos: { one: "📸 {count} garden photo", other: "📸 {count} garden photos" },
    growthPhotos: { one: "{count} photo tracking {plant}'s growth.", other: "{count} photos tracking {plant}'s growth." },
    sunMismatch: { one: "{count} plant may be in the wrong light for the bed it's planted in.", other: "{count} plants may be in the wrong light for the beds they're planted in." },
    pairsClash: { one: "{count} pair of plants in your beds doesn't grow well together. Tap a pair to see why — and how to fix it.", other: "{count} pairs of plants in your beds don't grow well together. Tap a pair to see why — and how to fix it." },
    readyToday: { one: "{count} plant ready to harvest today!", other: "{count} plants ready to harvest today!" },
    needAttention: { one: "{count} plant needs attention", other: "{count} plants need attention" },
    thrivingSaved: "🌱 {count} saved",
    thrivingHarvested: "🎉 {count} harvested",
    thrivingGardeners: { one: "{count} gardener", other: "{count} gardeners" },
    daylightBy: { one: "{direction} by about {count} minute a day.", other: "{direction} by about {count} minutes a day." },
    photoStorage: { one: "You've saved {count} garden photo (roughly {mb} MB). Clear out old ones to free up space.", other: "You've saved {count} garden photos (roughly {mb} MB). Clear out old ones to free up space." },
    liveHarvest: { one: "{count} plant ready to harvest — pick today for peak flavor", other: "{count} plants ready to harvest — pick today for peak flavor" },
    toolsToGrab: { one: "🧰 {count} tool to grab", other: "🧰 {count} tools to grab" },
    itemsHave: { one: "{count} item you already have", other: "{count} items you already have" },
    vaseLeft: { one: "{count} day left", other: "{count} days left" },
    vasePast: "past its best",
    toSow: { one: "{count} plant to sow", other: "{count} plants to sow" },
    streakLeft: { one: "⏳ {count} day left to keep your streak", other: "⏳ {count} days left to keep your streak" },
  },

  levels: {
    l0: "Seedling",
    l5: "Backyard Grower",
    l10: "Green Thumb",
    l15: "Harvest Keeper",
    l20: "Garden Sage",
    l25: "Plant Whisperer",
    l30: "Soil Scientist",
    l35: "Garden Architect",
    l40: "Zone Master",
    l45: "Harvest Legend",
    l50: "Master Botanist",
    l55: "Garden Oracle",
    l60: "Legendary Grower",
    l65: "Elite Cultivator",
    l70: "Grand Gardener",
    l75: "Garden Mythkeeper",
    l80: "Ancient Cultivator",
    l85: "Garden Immortal",
    l90: "Celestial Grower",
    l95: "Garden Transcendent",
    l100: "Garden Gnome",
    lvl: "Lvl {level}",
    levelLine: "Level {level} · {title}",
  },

  badges: {
    first_plant_saved: "First Plant Saved",
    save_5_plants: "Green Thumb",
    save_10_plants: "Garden Collector",
    save_15_plants: "Zone Master",
    save_25_plants: "Plant Library Master",
    save_50_plants: "Plant Encyclopedia",
    water_one_today: "Daily Water Check",
    water_three_today: "Water Watcher",
    water_25_total: "Consistent Gardener",
    water_50_total: "Watering Legend",
    water_100_total: "Water Master",
    streak_3: "Getting Started",
    streak_7: "7-Day Streak",
    streak_14: "Dedicated Grower",
    streak_30: "Garden Obsessed",
    streak_60: "Garden Master",
    first_journal_photo: "First Garden Photo",
    photo_5: "Snapshot Garden",
    photo_logger: "Photo Logger",
    garden_album: "Garden Historian",
    photo_50: "Garden Documentarian",
    first_plot: "First Plot Filled",
    plot_builder: "Plot Builder",
    full_garden: "Full Garden",
    first_care_log: "First Care Entry",
    care_log_5: "Soil Scientist",
    care_log_10: "Care Expert",
    care_log_25: "Garden Scientist",
    first_harvest: "First Harvest Tracked",
    harvest_3: "Harvest King",
    harvest_5: "Harvest Legend",
    harvest_ready: "Harvest Day!",
    gnome: "The Garden Gnome",
    catSaving: "🌱 Plant Saving",
    catWatering: "💧 Watering",
    catStreaks: "🔥 Streaks",
    catJournal: "📸 Journal",
    catMap: "🗺️ Garden Map",
    catCare: "🧪 Care Log",
    catHarvest: "🚜 Harvest",
    catLevels: "⭐ Levels",
    catLegend: "🌟 Legend",
    txtSave: { one: "Save your first plant. {have}/{count} saved.", other: "Save {count} plants. {have}/{count} saved." },
    txtWaterToday: { one: "Water {count} plant today. {have}/{count} watered.", other: "Water {count} plants today. {have}/{count} watered." },
    txtWaterTotal: { one: "Water plants {count} time. {have}/{count} completed.", other: "Water plants {count} times. {have}/{count} completed." },
    txtStreak: { one: "Use Pocket Planter {count} day in a row. {have}/{count} days.", other: "Use Pocket Planter {count} days in a row. {have}/{count} days." },
    txtPhoto: { one: "Add your first journal photo. {have}/{count} added.", other: "Add {count} garden photos. {have}/{count} added." },
    txtPlot: { one: "Fill your first garden plot. {have}/{count} filled.", other: "Fill {count} garden plots. {have}/{count} filled." },
    txtCare: { one: "Log your first care action. {have}/{count} logged.", other: "Log {count} care actions. {have}/{count} logged." },
    txtHarvest: { one: "Track your first harvest. {have}/{count} tracked.", other: "Track {count} harvests. {have}/{count} tracked." },
    txtHarvestReady: "Have a plant ready to harvest. {have}/1 ready.",
    txtLevel: "Reach Level {count}. Level {have}/{count}.",
    txtLegendDone: "You've mastered every corner of Pocket Planter. You are a true Garden Gnome. 🌟",
    txtLegendHidden: "Complete every achievement and reach Level 100 to reveal this secret.",
  },

  quests: {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    bonus: "Bonus",
    water_one: "Water 1 plant",
    water_one_d: "Mark any saved plant as watered today.",
    save_one: "Save a plant",
    save_one_d: "Browse the Plants tab and save a new plant.",
    open_app: "Daily check-in",
    open_app_d: "Open Pocket Planter and check your garden.",
    check_weather: "Check today's weather",
    check_weather_d: "Visit the Weather tab to see today's forecast.",
    streak_keep: "Keep your streak",
    streak_keep_d: "Open the app today to maintain your streak.",
    water_three: "Water 3 plants",
    water_three_d: "Mark 3 saved plants as watered today.",
    journal_one: "Add a journal photo",
    journal_one_d: "Document your garden with a photo today.",
    plan_one: "Place a plant in garden map",
    plan_one_d: "Add or rearrange a plant in your garden planner.",
    care_log_one: "Log a care action",
    care_log_one_d: "Record a care action in your Soil & Care Log.",
    save_three: "Save 3 plants",
    save_three_d: "Have at least 3 plants saved in your collection.",
    water_five: "Water 5 plants",
    water_five_d: "Mark 5 saved plants as watered today.",
    fill_plots: "Fill 3 garden plots",
    fill_plots_d: "Have at least 3 plants placed in your garden map.",
    water_all: "Water all your plants",
    water_all_d: "Mark every saved plant as watered today.",
    journal_three: "Add 3 journal photos",
    journal_three_d: "Log 3 garden photos today.",
    save_five: "Save 5 plants",
    save_five_d: "Have at least 5 plants saved in your collection.",
    care_log_three: "Log 3 care actions",
    care_log_three_d: "Record 3 care actions in your Soil & Care Log today.",
    harvest_check: "Check your harvests",
    harvest_check_d: "Have a plant ready to harvest.",
    full_garden_plot: "Fill 6 garden plots",
    full_garden_plot_d: "Have at least 6 plants placed in your garden map.",
    photo_and_water: "Water & document",
    photo_and_water_d: "Water a plant and snap a progress photo — a good daily garden habit.",
    care_and_water: "Full care day",
    care_and_water_d: "Water 3 plants and log a care action, like feeding or pruning.",
    fertilize_one: "Feed a plant",
    fertilize_one_d: "Start a fertilizer tracker for any plant.",
    harvest_one: "Log a harvest",
    harvest_one_d: "Record something you picked from your garden.",
    check_month: "Check this month's picks",
    check_month_d: "Open the Plants tab to see what to plant now.",
    compare_two: "Compare two plants",
    compare_two_d: "Use Compare on the Plants tab to weigh two options.",
    care_two: "Log 2 care actions",
    care_two_d: "Record two care actions today.",
    photo_two: "Add 2 journal photos",
    photo_two_d: "Document your garden twice today.",
    save_seven: "Grow to 7 plants",
    save_seven_d: "Have at least 7 plants saved.",
    harvest_two: "Log 2 harvests",
    harvest_two_d: "Record two harvests today.",
    fill_nine: "Fill 9 garden plots",
    fill_nine_d: "Have at least 9 plants placed in your garden.",
    save_ten: "Save 10 plants",
    save_ten_d: "Reach 10 saved plants in your collection.",
    fertilize_three: "Feed 3 plants",
    fertilize_three_d: "Have fertilizer trackers on 3 plants.",
    triple_threat: "Complete garden routine",
    triple_threat_d: "Water, photograph, and log a care action — a full round of garden care today.",
    streak_14: "14-Day Streak!",
    streak_14_d: "Use Pocket Planter 14 days in a row.",
    harvest_and_care: "Harvest day care",
    harvest_and_care_d: "Pick something and log a care action the same day to keep the bed productive.",
  },

  banners: {
    seedlingStarter: "Seedling Starter",
    plantCollector: "Plant Collector",
    streakKeeper: "Streak Keeper",
    waterWizard: "Water Wizard",
    masterWaterer: "Master Waterer",
    companionPro: "Companion Pro",
    questCrusher: "Quest Crusher",
    subLevel1: "Unlocked at Level 1",
    subReachLevel: "Reach Level {count}",
    subSave: { one: "Save {count} plant", other: "Save {count} plants" },
    subPhotos: { one: "Add {count} journal photo", other: "Add {count} journal photos" },
    subFillAll: { one: "Fill all {count} garden plot", other: "Fill all {count} garden plots" },
    subStreak: { one: "{count} day streak", other: "{count} day streak" },
    subWaterTotal: { one: "Water {count} plant total", other: "Water {count} plants total" },
    subCare: { one: "Log {count} care action", other: "Log {count} care actions" },
    subTrack: { one: "Track {count} harvest", other: "Track {count} harvests" },
    subCompanion: "Unlock companion planting",
    subQuests: { one: "Complete {count} daily quest", other: "Complete {count} daily quests" },
  },

  timeline: {
    tlAdded: "Added {plant}",
    tlSavedToGarden: "Saved to your garden",
    tlSowed: "Sowed {plant}",
    tlSuccession: "Succession sowing",
    tlPhotoOf: "Photo of {plant}",
    tlGardenPhoto: "Garden photo",
    tlFeeling: "Feeling {mood}",
    tlAddedPhoto: "Added a photo",
    tlHarvested: "Harvested {plant}",
    tlLoggedHarvest: "Logged a harvest",
    tlWholeGarden: "the whole garden",
    tlGardenCare: "Garden care",
    tlEarned: "Earned “{badge}”",
    tlAchievement: "Achievement unlocked",
  },

  advice: {
    frostCover: "Cover tender plants with sheets, row cover, or cloches",
    frostContainers: "Move potted plants into a garage or against the house",
    frostWater: "Water soil before the freeze — moist soil holds heat",
    frostMulch: "Add mulch around roots for insulation",
    frostHarvest: "Harvest anything ripe that frost could damage",
    frostProtectTonight: "Protect your garden — cold tonight",
    frostProtectComing: "Protect your garden — cold coming",
    frostLow: "Low of {temp} expected. Check these off as you go — {done}/{total} done.",
    tipHeat: "This plant is in season, but the heat is high. Plant early in the morning, mulch well, and keep watering consistent.",
    tipChilly: "This plant is in season, but nights are still chilly. Protect young starts until temperatures stay warmer.",
    tipGood: "This is a good time to grow it in your area. Focus on soil moisture, spacing, and steady care during the first few weeks.",
    tipFollow: "Save or follow this plant so you can come back when its planting window gets closer.",
    waterDefault: "Water deeply and consistently while monitoring soil moisture.",
    waterHot: "Hot weather is coming. Deep morning watering will help reduce stress and evaporation.",
    waterRain: "Rain is likely this week. Check the soil before watering again.",
    waterNormal: "Keep the soil lightly moist and avoid shallow watering.",
    recLoadingTitle: "Weather scan loading",
    recLoadingBody: "Once your forecast loads, Pocket Planter will suggest what to water, protect, or plant next.",
    recFrostTitle: "Frost protection night",
    recFrostBody: "Cover tender plants, move containers near shelter, and wait on transplanting until lows warm back up.",
    recHeatTitle: "Heat stress warning",
    recHeatBody: "Water deeply before the afternoon, shade young starts, and skip transplanting today.",
    recRainTitle: "Rain-friendly garden day",
    recRainBody: "Let rain handle watering. Check drainage and avoid soaking containers twice.",
    recPrimeTitle: "Prime Garden Window!",
    recPrimeBody: { one: "{count} zone-matched plant looks reasonable right now. Focus on soil moisture and steady starts.", other: "{count} zone-matched plants look reasonable right now. Focus on soil moisture and steady starts." },
    recPrimeBodySeveral: "Several zone-matched plants look reasonable right now. Focus on soil moisture and steady starts.",
    windowVaries: "Best months vary by zone. Use the Planting Calendar above for seasonal timing.",
  },

  extra: {
    roiLine: "For every {one} spent, you grew ~{value} of produce",
    inDays: { one: "In {count} day", other: "In {count} days" },
    compostToday: "today",
    compostYesterday: "yesterday",
    compostNever: "never",
    compostLast: "🔄 Turned the pile · last: {when}",
    compostAddedGreens: "Added greens",
    compostAddedBrowns: "Added browns",
    scrollTop: "Scroll to top",
    quickLog: "Quick log a garden action",
    waterAllIn: "Water all plants in {area}",
    viewPair: "View {a} or {b}",
    shopSeeds: "Shop for {name} seeds",
    shopFertilizer: "Shop for {name} fertilizer",
    logSowing: "Log a sowing of {name} today",
    waterKeepStreak: "Water {name} to keep its streak",
    pestThreatens: "{pest}, threatens {plants}. Tap for the full pest guide.",
    bannerA11y: "{title} banner",
    openCareGuide: "Open {name} care guide",
    waterNow: "Water {name} now",
    markComplete: "Mark complete: {action}",
    markOwned: "Mark {name} as owned",
    shopFor: "Shop for {name}",
    removeOwned: "Remove {name} from owned",
    powerPair: "{a} and {b}, great pairing. Tap for why it works.",
    replaceIn: "Replace {old} in {bed} with {plant}",
    addTo: "Add {plant} to {bed}",
    showSwap: "Show all plants in {bed} you could swap out",
    exportCsv: "Export {label} as CSV",
    compostAdd: "Add {label}",
    compostTurnedA11y: "Log that you turned the pile",
    compostDelete: "Delete compost entry",
    pestGuide: "{label} — tap for the pest guide",
    diseaseGuide: "{label} — tap for the disease guide",
    compostEyebrow: "Compost tracker",
    compostSubtitle: "Log greens & browns to keep your pile balanced and know when it's ready.",
    compostGreens: "Greens",
    compostBrowns: "Browns",
    compostGreensHint: "veg scraps, grass, coffee",
    compostBrownsHint: "leaves, cardboard, straw",
    compostTurns: "Turns",
    compostReady: "Ready",
    compostCheck: "Check it!",
    compostDays: "~{count}d",
    compostTurned: "Turned the pile",
    compostEmpty: "Log what you add to keep the mix balanced.",
    compostWet: "Too wet & green — add more browns (dry leaves, cardboard, straw).",
    compostDry: "Very dry & brown — add greens (scraps, grass) and a little water.",
    compostBalanced: "Nicely balanced. Turn it every week or two to speed things up.",
    diseaseSigns: "Signs & symptoms",
    diseaseConditions: "Favorable conditions",
    diseaseType: "{type} disease",
    plantDisease: "Plant disease",
    lockPickTitle: "Plant pick locked",
    lockPickBody: "Unlock Premium to get a daily plant pick matched to your zone and the weather.",
    lockTasksTitle: "This month's tasks locked",
    lockTasksBody: "Unlock Premium to see the seasonal to-do list tailored to your zone each month.",
    lockPlantingTitle: "Planting, sowing & frost locked",
    lockPlantingBody: "Unlock Premium for your planting & harvest calendar, succession sowing, and local frost dates.",
  },

  share: {
    plantsGrown: "Plants Grown",
    waterings: "Waterings",
    photos: "Photos",
    dayStreak: "Day Streak",
    harvest: "Harvest",
    storyHeader: "🌱 My Pocket Planter Garden Story:",
    yearHeader: "🌿 My Pocket Planter year in review:",
    yearFooter: "What a year in the garden 🌻",
    lPlants: { one: "🪴 {count} plant grown", other: "🪴 {count} plants grown" },
    yPlants: { one: "🌱 {count} plant grown", other: "🌱 {count} plants grown" },
    lHarvestsLogged: { one: "🎉 {count} harvest logged", other: "🎉 {count} harvests logged" },
    yHarvests: { one: "🎉 {count} harvest", other: "🎉 {count} harvests" },
    lProduce: "💰 ~{value} of produce grown",
    lWaterings: { one: "💧 {count} watering", other: "💧 {count} waterings" },
    lStreak: { one: "🔥 {count}-day streak", other: "🔥 {count}-day streak" },
    mvp: "🏆 MVP plant: {plant}",
    shareDialog: "Share your garden",
    onTrack: "On track",
    waterSooner: "Water sooner",
    spaceOut: "Space it out",
    rhythmDetail: "Every ~{avg}d · target ~{target}d",
    mbEst: "MB (est.)",
    olderYear: "Older than 1 year",
    olderSixMonths: "Older than 6 months",
  },

  seasons: {
    spring: "Spring",
    summer: "Summer",
    fall: "Fall",
    winter: "Winter",
    springMid: "spring",
    summerMid: "summer",
    fallMid: "fall",
    winterMid: "winter",
    windingDown: "{current} is winding down. Get a head start on {next} — here's what does well in Zone {zone} as it opens.",
    chWater: "Water 15 times this {season}",
    chPhotos: "Log 6 garden photos",
    chHarvest: "Record 3 harvests",
    chCare: "Log 5 care actions",
    chAllDone: "All {season} challenges done!",
    chProgress: "{season} challenges · {claimed}/{total} claimed. Finish the rest for bonus XP — they reset each season.",
  },

  ui2: {
    resetsH: "Resets in {count}h",
    resetsM: "Resets in {count}m",
    nothingDue: "✅ Nothing due today — next up {day}",
    caughtUp: "✅ You're all caught up this week!",
    goalHit: { one: "You hit your goal of {count} harvest. Amazing season — set a new one to keep going.", other: "You hit your goal of {count} harvests. Amazing season — set a new one to keep going." },
    goalProgress: { one: "{progress} of {count} harvest logged. {left} to go!", other: "{progress} of {count} harvests logged. {left} to go!" },
    reportHeader: "🌱 My Pocket Planter garden report card:",
    plotsPlanted: { one: "🗺️ {count} plot planted", other: "🗺️ {count} plots planted" },
    careStreak: { one: "🔥 {count}-day care streak", other: "🔥 {count}-day care streak" },
    bannersEarned: "{earned} of {total} banners earned · tap one to display it above your profile.",
    reasonGeneric: "They compete for the same nutrients, water, and root space.",
    reasonSameType: "Both are {type} — grouping them concentrates the same pests and soil-borne diseases.",
    reasonOther: "They compete for the same nutrients and root space, and can stunt each other's growth.",
    conflictInA11y: "{a} and {b} conflict in {bed}. Tap to go to that bed and see how to fix it.",
    conflictA11y: "{a} and {b} conflict. Tap for why and how to fix it.",
    fixLine: "✅ Fix: {fix}",
    synced: "Synced {when} — saved to your account and restored when you sign in on any device.",
    autosave: "Your progress saves automatically to your account.",
    achievementsEarned: "{earned} of {total} achievements earned · {streak}",
    clashesWith: "⚠ Clashes with {plant}",
    swapsOut: "Swaps it out for {plant}",
    rainChance: "💧 {pct}% rain chance",
    frostOn: "Frost on {day} — cover tender plants the night before.",
    heatOn: "Heat stress on {day} — water early and mulch to protect roots.",
    rainyDays: { one: "{count} rainy day — check drainage and hold off fertilizing until soil dries.", other: "{count} rainy days — check drainage and hold off fertilizing until soil dries." },
    hotSummer: "Hot-zone summer — water deeply every 2–3 days and harvest often.",
    coldFall: "Cold-zone fall — harvest before first frost and plant garlic for spring.",
    goodWeekWater: "Good growing week — stay on top of watering.",
    goodWeekPlant: "Good growing week — great for planting and garden care.",
    bestPlant: "Best to plant",
    watering: "Watering",
    bestWater: "Best to water",
    rainCovers: "Rain covers it",
    bestHarvest: "Best to harvest",
    bestFertilize: "Best to fertilize",
    frostRisk: "Frost risk",
    heatRisk: "Heat risk",
    heavyRain: "Heavy rain",
    subTempRain: "{temp} · {pct}% rain",
    subRainToday: "{pct}% rain today",
    subDry: "{temp} · dry",
    subLow: "Low {temp}",
    subHigh: "High {temp}",
    subChance: "{pct}% chance",
    glowRemoveSaved: "Remove {plant} from saved plants",
    glowSave: "Save {plant}",
    glowUndoWater: "Undo watering for {plant}",
    glowMarkWatered: "Mark {plant} as watered today",
    glowInGarden: "{plant} is in your garden",
    glowAddGarden: "Add {plant} to your garden",
    glowSnooze: "Snooze watering for {plant} until tomorrow",
    level: "Level",
    streak: "Streak",
  },

  onboard: {
    s1Eyebrow: "WELCOME TO POCKET PLANTER",
    s1Title: "Grow smarter,\ngarden better.",
    s1Text: "Everything you need to plan, track, and grow a thriving garden — matched to your area.",
    s1f1t: "Your garden zone",
    s1f1d: "Plants matched to your local climate.",
    s1f2t: "What to plant",
    s1f2d: "Monthly picks tailored to your area.",
    s1f3t: "Save favorites",
    s1f3d: "Build your own plant collection.",
    s2Eyebrow: "STEP 1 · YOUR ZONE",
    s2Title: "Find your\ngrowing zone",
    s2Text: "Enter your ZIP and Pocket Planter tailors everything to your local conditions.",
    s2f1t: "Monthly picks",
    s2f1d: "Know exactly what to sow each month.",
    s2f2t: "Weather-aware tips",
    s2f2d: "Guidance that reacts to your forecast.",
    s2f3t: "Frost & heat alerts",
    s2f3d: "Warnings before dangerous temps hit.",
    s3Eyebrow: "STEP 2 · TRACK",
    s3Title: "Track your\ngarden",
    s3Text: "Save plants, log photos, track watering, and plan out every bed.",
    s3f1t: "Watering checks",
    s3f1d: "Never forget to water again.",
    s3f2t: "Journal timeline",
    s3f2d: "Watch your garden grow over time.",
    s3f3t: "Garden planner",
    s3f3d: "Plan beds with companion scoring.",
    s4Eyebrow: "STEP 3 · LEVEL UP",
    s4Title: "Earn XP\nand grow",
    s4Text: "Complete garden actions, build streaks, and unlock achievements.",
    s4f1t: "Daily streaks",
    s4f1d: "Keep your momentum going.",
    s4f2t: "Achievements",
    s4f2d: "Unlock badges as you grow.",
    s4f3t: "Profile rewards",
    s4f3d: "Level up your gardener profile.",
  },

  ui3: {
    frostIndoors: "Move containers indoors or near shelter tonight",
    frostCover: "Cover frost-sensitive plants before dark",
    heatShade: "Add shade cloth over young transplants",
    heatSkip: "Skip transplanting today — heat stress risk too high",
    warmMulch: "Add mulch around plants to retain soil moisture",
    rainSkip: "Skip watering — rain will handle it today",
    rainDrainage: "Check container drainage before rain arrives",
    rainCheckSoil: "Check soil moisture before watering — rain may help",
    idealSow: "Ideal conditions for transplanting or direct sowing today",
    morningWindow: "Perfect morning window for garden care right now",
    tFrost: "Frost risk tonight — premium alert available",
    tHeat: "Extreme heat today — premium action plan available",
    tHot: "Hot day — premium watering guide available",
    tRain: "Heavy rain today — premium garden plan available",
    tGood: "Good growing conditions today",
    lf1: "Frost alerts with cover reminders",
    lf2: "Heat stress warnings and action plans",
    lf3: "Smart daily watering guidance",
    lf4: "7-day garden intelligence forecast",
    lf5: "Zone-specific seasonal insights",
    lf6: "Daily smart action checklist",
    noFlowers: "No flowers saved yet",
    nothingToPlant: "Nothing to plant here",
    flowerBedHint: "This is a flower bed — save some flowers, then place them here.",
    gardenBedHint: "Save a plant that suits this bed, then place it here. (Flowers can't go in a regular garden — plant those on the Flowers tab.)",
    testTitle: "🔔 Test Notification",
    testBody: "If you see this, notifications are firing correctly!",
    remindersOnTitle: "Watering Reminders On",
    remindersOffTitle: "Watering Reminders Off",
    remindersOnBody: "You can now add watering reminders from individual plant pages.",
    remindersOffBody: "Plant-page watering reminders are now disabled.",
    backedUp: "Your garden is backed up",
    backingUp: "Backing up your garden…",
    sowAgain: "Sow again now",
    startFirst: "Start a first sowing",
    onSchedule: "On schedule",
    sunNoteFull: "Great for tomatoes, peppers, squash, most veggies.",
    sunNotePartial: "Good for greens, herbs, root crops, brassicas.",
    sunNoteShade: "Best for leafy greens, mint, and shade-tolerant herbs.",
    plannedWith: "Planned with Pocket Planter 🌿",
    plannedIn: "Planned in Pocket Planter 🌱",
    toSowNow: "To sow now",
    activeMonths: "Active months",
    peakMonth: "Peak month",
    variesByRegion: "Varies by region",
    seasonally: "seasonally",
  },

  ui4: {
    promptBonus: "Bonus claimed! Upgrade to Premium to save unlimited plants and unlock every tab, calendar, and insight.",
    promptWatered: "Watering tracked. Upgrade to Premium to unlock unlimited plants, the garden dashboard, planting & frost calendars, and more.",
    promptQuest: "Quest complete! Upgrade to Premium to save unlimited plants and unlock every tab, calendar, and insight.",
    catDigging: "Digging & Planting",
    catWatering: "Watering",
    catCare: "Care & Harvest",
    catComfort: "Comfort & Protection",
    glovesN: "Garden Gloves",
    trowelN: "Hand Trowel",
    shovelN: "Shovel / Spade",
    cultivatorN: "Hand Cultivator",
    hoseN: "Garden Hose",
    nozzleN: "Spray Nozzle",
    canN: "Watering Can",
    shearsN: "Pruning Shears",
    rakeN: "Garden Rake",
    basketN: "Harvest Basket",
    labelsN: "Plant Labels",
    kneelerN: "Kneeling Pad",
    meterN: "Moisture Meter",
    rowcoverN: "Row Cover",
    lockGardenTitle: "Your garden, mapped",
    lockGardenDesc: "Lay out beds, track what's planted where, and get watering and spacing guidance for every area.",
    lockWeatherTitle: "Weather intelligence",
    lockWeatherDesc: "Frost alerts, rainfall tracking, and daily water-or-don't calls based on your actual forecast.",
    lockGamesTitle: "Garden games",
    lockGamesDesc: "Play, learn your plants, and earn XP toward your gardener level.",
    lockJournalTitle: "Your garden journal",
    lockJournalDesc: "A dated, photo-backed record of every harvest, planting, and note across your seasons.",
    lockGenericTitle: "Premium feature",
    lockGenericDesc: "Upgrade to unlock this part of Pocket Planter.",
    msFirstHarvestT: "FIRST HARVEST!",
    msFirstHarvestB: "You harvested your very first crop. This is what it's all about! 🥗",
    msPlants10T: "10 PLANTS!",
    msPlants10B: "Your garden collection just hit 10 plants. You're building something special. 🌱",
    msPlants25T: "25 PLANTS!",
    msPlants25B: "Twenty-five plants! That's a serious garden. 🌻",
    msWater50T: "50 WATERINGS!",
    msWater50B: "Fifty waterings logged. Your plants are lucky to have you. 💚",
    msWater100T: "100 WATERINGS!",
    msWater100B: "One hundred waterings! Your dedication is next level. 🔥",
    msHarvest10T: "10 HARVESTS!",
    msHarvest10B: "Ten harvests in the books. Your garden is truly producing. 🍅",
    promptPhoto: "Photo added to your journal. Upgrade to Premium to save unlimited plants and unlock every tab, calendar, and insight.",
    promptPlanted: "Nice — that plant's in your garden. Upgrade to Premium to save unlimited plants and unlock the garden dashboard, calendars, pest watch, and the Flowers & Home tab.",
    syncFailed: "Changes aren't syncing to the cloud right now — they'll retry automatically.",
    fix: "Fix",
    set: "Set",
    achievementEyebrow: "ACHIEVEMENT",
    premiumRibbon: "PREMIUM",
    last: "LAST",
  },

  ui5: {
    phAcid: "Acidic — add garden lime or wood ash to raise pH toward 6.5.",
    phAlk: "Alkaline — add elemental sulfur, peat, or compost to lower pH.",
    phIdeal: "Ideal range (6.0–7.5) for most vegetables. Nice soil!",
    capPlant: "plant",
    capSeed1: "{plant} is just getting started 🌱 Day {day} and already showing signs of life!",
    capSeed2: "Tiny but mighty 💚 Watching {plant} push through the soil is pure magic.",
    capSeed3: "Day {day} — {plant} seedling looking healthy and ready to grow!",
    capLeaf1: "{plant} is really taking off now 🌿 The leaf growth this week has been incredible.",
    capLeaf2: "Green and thriving! {plant} is in full leaf growth mode 💪",
    capLeaf3: "Look at those leaves! {plant} is loving the conditions right now.",
    capFlower1: "{plant} is flowering! 🌸 This is the moment I've been waiting for.",
    capFlower2: "Bloom time! {plant} is showing off its beautiful flowers today.",
    capFlower3: "Flowers on the {plant} — pollinators are going to love this 🐝",
    capFruit1: "Fruit is forming on the {plant}! 🍅 Almost there — can't wait for harvest!",
    capFruit2: "{plant} is putting all its energy into this fruit. Looking plump and perfect!",
    capFruit3: "Day {day} — the {plant} fruit is coming along beautifully.",
    capHarvest1: "Harvest day! 🎉 {plant} has been an incredible grower this season.",
    capHarvest2: "It's time! {plant} is ready to harvest and it looks absolutely perfect.",
    capHarvest3: "From seed to harvest — {plant} has been an amazing journey 🌱➡️🍽️",
    pairLegume: "{legume} pulls nitrogen from the air into the soil, feeding {other} naturally so it grows leafier and stronger.",
    pairAroma: "{herb}'s strong scent masks {other} and confuses or repels the pests that would normally target it.",
    pairTall: "{tall} offers light shade and a windbreak while {low} shades the soil below — they stack neatly in the same space instead of competing.",
    pairFamilies: "Different families with different appetites — they draw on different nutrients and root depths, so they share the bed without fighting for the same resources.",
    pairDefault: "They grow happily side by side, making better use of the bed without competing for light, water, or root space.",
  },

  ui6: {
    today: "Today",
    tomorrow: "Tomorrow",
    tmrw: "Tmrw",
    yesterday: "Yesterday",
    inDaysShort: "{count}d",
    weeksAgo: { one: "{count} week ago", other: "{count} weeks ago" },
    monthsAgo: { one: "{count} month ago", other: "{count} months ago" },
    yearsAgo: { one: "{count} year ago", other: "{count} years ago" },
  },

  ui7: {
    thisWeekLabel: "This week",
    caCompost: "Added Compost",
    caRepot: "Repotted",
    caPests: "Treated Pests",
    caPh: "pH Tested",
    caFertilize: "Fertilized",
    caPruned: "Pruned",
    caMulch: "Mulched",
    caTransplant: "Transplanted",
    caWatered: "Deep Watered",
    caStaked: "Staked/Trellised",
    caHarvest: "Harvested",
    caCustom: "Custom Note",
    wLoading: "Loading",
    wFrost: "Frost Risk",
    wExtreme: "Extreme Heat",
    wHot: "Hot Day",
    wHeavyRain: "Heavy Rain",
    wPossibleRain: "Possible Rain",
    wPerfect: "Perfect Day",
    wMild: "Mild Conditions",
    iv3: "3 days",
    ivWeekly: "Weekly",
    iv2w: "2 weeks",
    ivMonthly: "Monthly",
    everyDays: { one: "Every {count} day", other: "Every {count} days" },
    taskNotifTitle: "🌿 Garden Task",
    secure: "Secure",
    topDay: "Top day",
    bestStreak: "Best streak",
    none: "None",
    first: "First",
    latest: "Latest",
    plots: "Plots",
    exHarvest: "Harvest Log",
    exCare: "Care Log",
    exJournal: "Journal",
    exCompost: "Compost Log",
    exGerm: "Germination Tests",
  },

  features: {
    wateringTimerN: "Watering Timer",
    wateringTimerW: "Garden ▸ Tools ▸ Calc ▸ Timer",
    wateringVolumeN: "Watering Volume Calculator",
    wateringVolumeW: "Garden ▸ Tools ▸ Calc ▸ Water",
    rainBarrelN: "Rain Barrel Tracker",
    rainBarrelW: "Weather ▸ Rainfall",
    rainfallLogN: "Rainfall Log",
    rainfallLogW: "Weather ▸ Rainfall",
    soilTempN: "Soil Temperature Tracker",
    soilTempW: "Journal ▸ Soil Test",
    soilPhN: "Soil pH Test Log",
    soilPhW: "Journal ▸ Soil Test",
    compostN: "Compost Tracker",
    compostW: "Garden ▸ Garden Care Tracker",
    fertilizerCalcN: "Fertilizer Mixing Calculator",
    fertilizerCalcW: "Garden ▸ Tools ▸ Calc ▸ Feed",
    pottingMixN: "Potting-Mix Calculator",
    pottingMixW: "Garden ▸ Tools ▸ Calc ▸ Mix",
    pruningN: "Pruning Schedule",
    pruningW: "Garden ▸ Garden Care Tracker",
    seedInventoryN: "Seed Inventory",
    seedInventoryW: "Garden ▸ Tools ▸ Inventory",
    germinationN: "Germination Test",
    germinationW: "Garden ▸ Tools ▸ Inventory",
    growLightN: "Grow-Light Scheduler",
    growLightW: "Garden ▸ Tools ▸ Inventory",
    barcodeN: "Barcode Seed Scanner",
    barcodeW: "Garden ▸ Tools ▸ Inventory",
    pairCheckerN: "Companion Pair Checker",
    pairCheckerW: "Garden ▸ Tools ▸ Pairs",
    moonN: "Moon Planting Calendar",
    moonW: "Garden ▸ Tools ▸ Moon",
    bloomN: "Bloom Succession Planner",
    bloomW: "Garden ▸ Tools ▸ Pollinators",
    bedPlannerN: "Bed Planner",
    bedPlannerW: "Garden ▸ Tools ▸ Bed",
    toolMaintN: "Tool Maintenance Log",
    toolMaintW: "Garden ▸ Tools ▸ Care",
    customRemindersN: "Custom Reminders",
    customRemindersW: "Settings ▸ Custom Tasks",
    choreRotationN: "Chore Rotation",
    choreRotationW: "Settings ▸ Custom Tasks",
    calendarExportN: "Calendar Export",
    calendarExportW: "Settings ▸ Data & Backup",
    plantLabelsN: "Plant Labels & QR Tags",
    plantLabelsW: "Garden ▸ Tools ▸ Export",
    backupN: "Backup & Restore",
    backupW: "Settings ▸ Data & Backup",
    planExportN: "Garden Plan Export",
    planExportW: "Garden ▸ Tools ▸ Export",
  },

  whatsNew: {
    flowers: "173 flowers and houseplants, with a garden of their own",
    combo: "Plant a whole companion combo in one tap, bed and all",
    pickBed: "Pick which bed a plant goes in, or swap one out",
    pestTab: "Pest Watch now has its own tab",
    dailyPlan: "Your daily plan stays put until every task is done",
    fixedPlants: "Fixed plants that were planted but never showed up",
  },

  ui8: {
    replacePlant: "Replace {plant}",
    fixLabel: "Fix: {fix}",
    keepsFor: "Keeps {time}",
    stillRooting: { one: "{count} still rooting — tap the circle when roots appear.", other: "{count} still rooting — tap the circle when roots appear." },
    dueN: { one: "{count} DUE", other: "{count} DUE" },
    saveN: "Save {count}",
    plantedN: { one: "{count} planted", other: "{count} planted" },
    doneOf: "{done}/{total} done",
    plusMore: "+{count} more",
    streakDays: { one: "{count} Day", other: "{count} Days" },
    entriesFound: { one: "{count} entry found", other: "{count} entries found" },
    selectedN: { one: "{count} selected", other: "{count} selected" },
    harvestedPlant: "Harvested {plant}",
    lvl: "Lvl {level}",
    quickWaterAll: "💧 Water all due plants",
    quickAddPhoto: "📸 Add garden photo",
    myGarden: "My Garden",
    moreFlowers: "Flowers & Home",
    moreGames: "Garden Games",
    morePests: "Pest Watch",
    frostRisk: "Frost Risk",
    heatAlert: "Heat Alert",
    rainToday: "Rain Today",
    goodDay: "Good Day",
    botanist: "Botanist",
    loadingForecast: "Loading forecast…",
    frequency: "Frequency",
  },

  sent: {
    perfectHow: "Here's how {plant} thrives — surrounded by its best companions. Tap anywhere to close and build your own.",
    areaGetAlong: "How the plants in {area} get along.",
    adaptiveIntro: "A schedule that adapts to you — {source}, then adjusted for the weather.",
    showMorePlants: "Show more plants ({count} more)",
    showMorePests: "Show more pests ({count} more)",
    showMoreBanners: "Show more banners ({count} more)",
    showMoreBadges: "Show more badges ({count} more)",
    showMoreCombos: "Show more combos ({count} more)",
    recipesHarvesting: "Fresh from your garden — quick ideas for what you're harvesting. Tap to find recipes.",
    recipesGrowing: "Fresh from your garden — quick ideas for what you're growing. Tap to find recipes.",
    seasonNone: "No standout {season} picks matched to Zone {zone} yet — browse all plants to plan ahead.",
    seasonPlan: "Plan my {season} garden 🌿",
    searchNothing: "Nothing matches “{query}”. Try a different word.",
    wateringShowing: "Showing 6 of {count} saved plants",
    starterZone: "Here are a few beginner-friendly plants that do well in Zone {zone}. Save one to start your garden.",
    starterArea: "Here are a few beginner-friendly plants that do well in your area. Save one to start your garden.",
    calendarIntro: "Sow, transplant, and harvest windows for your saved plants in Zone {zone}. Estimated from your frost dates — check seed packets for specifics.",
    frostLow: "Low of {temp} coming — cover tender plants, move containers to shelter, and hold off on transplanting.",
    heatHigh: "High of {temp} — water before 9 AM, shade young plants, add mulch, and skip transplanting today.",
    xpToNext: "{current} / {next} XP · {left} to next level",
    frostFirst: "First frost is estimated around {date}. These crops need longer than that to mature if planted now — start them indoors, pick a faster variety, or wait for spring.",
    frostNeeds: "Needs ~{days}d · only ~{left}d left · short ~{short}d",
    notesNothing: "No notes match “{query}”. Try a different word.",
    thrivingZone: "Not enough gardeners in Zone {zone} yet. As more people grow here, you'll see the most popular plants light up. 🌱",
    thrivingArea: "Not enough gardeners in your area yet. As more people grow here, you'll see the most popular plants light up. 🌱",
    pollinatorHave: "✓ You're already growing {list} — nice, your pollinators are covered!",
    pestPeak: "Peak activity: {months}. Warmer zones often see a longer season.",
    journalDay: "⏳ Day {count} since planting",
    guildCount: "{total} plants · {have} in your garden",
    personalNone: "None of your saved plants have a planting window in {month}. Tap a highlighted month to see what's coming up.",
  },
};
