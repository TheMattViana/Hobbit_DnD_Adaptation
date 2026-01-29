// hobbit_data_items.js

// --- WEAPONS ---
const COMMON_WEAPONS = [
    { name: "Rolling Pin", damage: "1d4 Bludgeoning", type: "Simple Melee", description: "Surprisingly hefty, good for baking and bonking." },
    { name: "Sturdy Spade", damage: "1d4 Bludgeoning", type: "Simple Melee", description: "Useful for digging victory gardens or fending off pests. Counts as a Club." },
    { name: "Walking Stick (Gnarled Branch)", damage: "1d4 Bludgeoning", type: "Simple Melee", description: "Good for leaning on during long walks, or a quick thwack. Counts as a Club, or 1d6 if used two-handed (Quarterstaff)." },
    { name: "Sling", damage: "1d4 Bludgeoning", type: "Simple Ranged", range: "30/120", description: "For discouraging squirrels or overly curious Goblins. Requires stones." },
    { name: "Kitchen Knife", damage: "1d3 Piercing", type: "Simple Melee", finesse: true, description: "Sharp enough for vegetables, or a very desperate situation. Counts as a Dagger (1d4) if well-made." },
    { name: "Pitchfork (Small)", damage: "1d6 Piercing", type: "Simple Melee", two_handed: true, description: "Better for hay than fighting, but has its points." },
    { name: "Sturdy Mug", damage: "1d3 Bludgeoning", type: "Simple Melee", light: true, description: "A heavy mug, good for holding ale or as an improvised weapon." } // Added for Brewer
];

const MARTIAL_WEAPONS_HOBBIT = [
    { name: "Shortbow (Elm)", damage: "1d6 Piercing", type: "Martial Ranged", range: "80/320", two_handed: true, description: "A simple bow, good for hunting rabbits or the occasional trespassing Orc." },
    { name: "Sturdy Club (Bounder's Issue)", damage: "1d6 Bludgeoning", type: "Simple Melee", description: "A well-balanced club, issued to those who keep the peace." },
    { name: "Well-Kept Dagger", damage: "1d4 Piercing", type: "Simple Melee", finesse: true, light: true, description: "A proper dagger, perhaps an old letter opener or a gift from a travelling relative." },
    { name: "Hatchet", damage: "1d6 Slashing", type: "Simple Melee", light: true, description: "For chopping wood, or other, less pleasant tasks."}
];

const GREAT_WEAPONS_HOBBIT = [
    {
        name: "Tookish Courage (Short Sword)",
        damage: "1d6 Piercing",
        type: "Martial Melee",
        finesse: true,
        light: true,
        description: "An old, but surprisingly well-balanced short sword, bearing a faint Tookish emblem. Seems to hum faintly in the presence of Goblins.",
        effects: [
            { type: "conditional_attack_bonus", condition_target: ["Goblin", "Orc"], value: 1, details: "+1 to attack vs Goblins/Orcs" },
            { type: "conditional_damage_bonus", condition_target: ["Goblin", "Orc"], value: 1, details: "+1 to damage vs Goblins/Orcs" }
        ]
    },
    {
        name: "Granny Weatherwax's 'Persuader' (Quarterstaff)",
        damage: "1d8 Bludgeoning",
        type: "Simple Melee",
        versatile: "1d10",
        two_handed: true,
        description: "An unassuming but incredibly solid quarterstaff, polished smooth with age. Once per day, can be used to cast 'Command' (DC 12 Wisdom save) on a creature you strike with it.",
        effects: [
            { type: "special_ability", details: "Once per day, cast 'Command' (DC 12 Wis) on creature struck." }
        ]
    }
];

// --- ARMOR & CLOTHES ---
const COMMON_CLOTHES_ARMOR = [
    { name: "Homespun Tunic & Trousers", ac_bonus: 0, type: "Clothing", description: "Simple, comfortable, and easily patched." },
    { name: "Sturdy Work Britches", ac_bonus: 0, type: "Clothing", description: "Made of thick canvas, good for gardening." },
    { name: "Patched Woolen Cloak", ac_bonus: 0, type: "Clothing", description: "Offers some warmth against a chill wind." },
    { name: "Leather Apron", ac_bonus: 0, type: "Clothing", description: "Protects clothes from spills and splashes, offers minimal protection (AC 10 + Dex if unarmored)." },
    { name: "Thick Quilted Vest", ac_bonus: 1, type: "Light Armor (Padded)", description: "A surprisingly warm and somewhat protective vest. (AC 11 + Dex)" }
];

const STURDY_CLOTHES_ARMOR = [
    { name: "Boiled Leather Cap", ac_bonus: 1, type: "Helmet (counts as part of light armor)", description: "A hardened leather cap, offers a bit of noggin protection." },
    { name: "Old Leather Jerkin", ac_bonus: 1, type: "Light Armor (Leather)", description: "A bit stiff, but has seen many seasons. (AC 11 + Dex)" },
    { name: "Travel-Stained Cloak with Hood", ac_bonus: 0, type: "Clothing", description: "A heavy wool cloak, good for keeping the weather out and blending into the hedgerows." }
];

const GREAT_CLOTHES_ARMOR = [
    {
        name: "Old Took's Traveling Cloak",
        ac_bonus: 0,
        type: "Clothing (Magical)",
        description: "This cloak, though ancient, is remarkably resistant to wear and grants advantage on Stealth checks made in natural surroundings.",
        effects: [
            { type: "advantage_on_skill_check", skill: "skillStealth", condition: "natural surroundings", details: "Adv. on Stealth in natural surroundings." }
        ]
    },
    {
        name: "Badger-Hide Boots",
        ac_bonus: 0,
        type: "Clothing (Magical)",
        description: "Tough and surprisingly quiet. Wearer gains advantage on saves against being knocked prone and ignores difficult terrain from mud or scree.",
        effects: [
            { type: "advantage_on_saving_throw_condition", condition: "knocked prone", details: "Adv. on saves vs being knocked prone." },
            { type: "ignore_difficult_terrain", terrain_type: ["mud", "scree"], details: "Ignore difficult terrain (mud, scree)." }
        ]
    },
    {
        name: "Helm of Hobbit Wit",
        ac_bonus: 0, // Or could be part of a light armor
        type: "Helmet (Magical)",
        description: "A surprisingly light helmet that seems to sharpen the mind.",
        effects: [
            { type: "stat_bonus", stat: "wits", value: 1, details: "+1 to Wits" }
        ]
    }
];

// --- ITEMS ---
const COMMON_ITEMS = [
    { name: "Tinderbox", description: "Flint, steel, and tinder for starting fires." },
    { name: "Small Coil of Rope (25ft)", description: "Always handy." },
    { name: "Waterskin", description: "Holds a day's worth of water." },
    { name: "Pouch of Pipeweed", description: "A comforting smoke for the road." },
    { name: "Sack of Marbles", description: "For games, or creating a minor distraction." },
    { name: "Half-eaten Apple", description: "A tasty snack, mostly." },
    { name: "Wooden Whistle", description: "For tunes or signals." },
    { name: "Chalk Nub", description: "For marking trails or tallying scores."},
    { name: "Brewer's Supplies", type: "Artisan's Tools", description: "A kit for brewing simple ales and ciders, includes a small kettle, stirring spoon, and basic ingredients." }, // Added for Brewer
    { name: "Cook's Utensils", type: "Artisan's Tools", description: "A set of tools for cooking, including a pot, pan, and various utensils."} // Added for completeness
];

const INTERESTING_ITEMS = [
    { name: "Shiny Brass Button", description: "Unusually large and ornate." },
    { name: "Smooth River Stone", description: "Perfectly shaped for skipping." },
    { name: "Crumpled Map Fragment", description: "Shows a small, unidentifiable part of the Old Forest." },
    { name: "Book of Riddles (mostly solved)", description: "A few tricky ones remain." },
    { name: "Key (Rusty)", description: "Fits no lock you currently know." },
    { name: "Lump of Beeswax", description: "Good for waterproofing or mending."},
    { name: "Recipe Book (mostly empty)", description: "A leather-bound book with a few family recipes and many blank pages for new discoveries."} // Added for Brewer
];

const RARE_ITEMS = [
    { name: "Silver Locket (Unknown Crest)", description: "A tarnished silver locket that refuses to open, bearing an unfamiliar crest." },
    {
        name: "Strangely Warm Pebble",
        description: "This small, dark pebble is always warm to the touch, even in the coldest weather.",
        effects: [
            { type: "resistance", damage_type: "cold", value: "minor", details: "Provides minor comfort against cold."} 
        ]
    },
    {
        name: "Bag of 'Everlasting' Biscuits",
        description: "A small pouch containing three biscuits. They never seem to go stale and are surprisingly filling. Replenishes one biscuit at dawn if any were eaten.",
        effects: [
            { type: "consumable", charges: 3, recharge_rate: "1 at dawn", details: "Provides sustenance. Replenishes 1 biscuit at dawn." }
        ]
    },
    {
        name: "Amulet of Sturdiness",
        description: "A simple stone amulet that feels reassuringly solid.",
        effects: [
            { type: "stat_bonus", stat: "sturdiness", value: 1, details: "+1 to Sturdiness" }
        ]
    },
    // Example Brewed Item (could be crafted via skills)
    {
        name: "Bottle of Old Gammer's Comfort Cordial",
        description: "A small bottle of a surprisingly potent, sweet cordial. Smells of honey and herbs.",
        type: "Consumable (Potion)",
        effects: [
            { type: "consumable_effect", details: "Upon drinking, regain 1d4+1 Fortitude. Grants advantage on next Spirit saving throw within 10 minutes." }
        ]
    }
];

// This ALL_GAME_ITEMS structure can be used by the main script to populate item lists
// and provide a master reference for item properties including their effects.
const ALL_GAME_ITEMS = {
    weapons: {
        common: COMMON_WEAPONS,
        martial: MARTIAL_WEAPONS_HOBBIT,
        great: GREAT_WEAPONS_HOBBIT
    },
    armor: { // Includes clothing that might have effects
        common: COMMON_CLOTHES_ARMOR,
        sturdy: STURDY_CLOTHES_ARMOR,
        great: GREAT_CLOTHES_ARMOR
    },
    gear: { // General items
        common: COMMON_ITEMS,
        interesting: INTERESTING_ITEMS,
        rare: RARE_ITEMS
    }
};

// Function to easily get all items in a single list for populating selectors or for searching
function getAllItemsList() {
    let allItems = [];
    for (const category in ALL_GAME_ITEMS) {
        for (const subCategory in ALL_GAME_ITEMS[category]) {
            allItems = allItems.concat(ALL_GAME_ITEMS[category][subCategory].map(item => ({
                ...item,
                category: `${category}/${subCategory}` // Add category for easier identification
            })));
        }
    }
    return allItems;
}
