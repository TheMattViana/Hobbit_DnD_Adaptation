// hobbit_data_callings.js

// Hobbit-themed Callings (Professions)
const PROFESSIONS_DATA = {
    "bounder": {
        name: "Bounder of the Shire",
        primaryAbilities: ["Brawn", "Sturdiness"],
        skillProficiencies: ["Athletics (Climbing & Jumping)", "Perception (Noticing Details)"], // Auto-granted
        toolProficiencies: [],
        savingThrows: ["Brawn", "Sturdiness"],
        baseFortitudeDie: 8,
        startingEquipment: ["Sturdy Club (Bounder's Issue)", "Sling", "Leather Jerkin", "Bedroll", "Mess tin", "A stern look for troublemakers"],
        skillPointsBonus: 1, 
        abilityPoints: 2, 
        description: "Keepers of the peace and protectors of the Shire's borders, Bounders are sturdy and observant Hobbits, ready to deal with minor troubles and keep the big folk out.",
        abilities: [
            { id: "bounder_sturdystance", name: "Sturdy Stance", cost: 1, description: "Once per short rest, when you would be knocked prone, you can choose not to be." },
            { id: "bounder_warningshout", name: "Warning Shout", cost: 1, description: "As a reaction when an ally within 30ft is attacked, you can shout a warning. The attacker has disadvantage on that attack roll." }
        ]
    },
    "hearthfriend": {
        name: "Hearth-friend",
        primaryAbilities: ["Spirit", "Charm"],
        skillProficiencies: ["Persuasion (Kindly Requests)", "Insight (Reading Moods)"],
        toolProficiencies: ["Cook's Utensils"],
        savingThrows: ["Spirit", "Charm"],
        baseFortitudeDie: 6,
        startingEquipment: ["Walking Stick (Gnarled Branch)", "Pouch of Pipeweed", "Warm Blanket", "Cook's Utensils", "Recipe for Seed-cakes", "Waterskin"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "The heart of any Hobbit gathering, Hearth-friends are known for their generosity, comforting presence, and ability to make anyone feel at home. They are skilled in the arts of hospitality and fellowship.",
        abilities: [
            { id: "hearth_comfortingword", name: "Comforting Word", cost: 1, description: "As an action, speak soothingly to an ally within 10ft. They gain temporary HP equal to your Charm modifier (min 1)." },
            { id: "hearth_goodbrew", name: "A Good Brew", cost: 1, description: "Once per long rest, you can prepare a special brew (tea or similar) that grants an ally advantage on their next saving throw against being frightened or demoralized." }
        ]
    },
    "tunnelrat": {
        name: "Tunnel-rat (Expert Digger)",
        primaryAbilities: ["Agility", "Wits"],
        skillProficiencies: ["Stealth (Quiet Movement & Hiding)", "Sleight of Hand (Delicate Picking)"],
        toolProficiencies: ["Thieves' Tools (simple picks)", "Shovel (as tool)"],
        savingThrows: ["Agility", "Wits"],
        baseFortitudeDie: 6,
        startingEquipment: ["Kitchen Knife", "Sturdy Spade", "Sling", "Patched Woolen Cloak", "Tinderbox", "A handful of interesting buttons", "Small Coil of Rope (25ft)"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "Some Hobbits are more curious about what lies beneath the surface. Tunnel-rats are adept at navigating tight spaces, finding hidden paths, and have a knack for delicate work.",
        abilities: [
            { id: "tunnel_quietstep", name: "Quiet Step", cost: 1, description: "You can attempt to Hide even when only lightly obscured by shadows or small objects." },
            { id: "tunnel_keeneyes", name: "Keen Eyes", cost: 1, description: "You have advantage on Wisdom (Perception) checks to find hidden objects, weak tunnel walls, or secret passages." }
        ]
    },
    "gaffer": { 
        name: "Gaffer/Gammer (Village Elder)",
        primaryAbilities: ["Wits", "Spirit"],
        skillProficiencies: ["History (Local Lore & Family Trees)", "Medicine (First Aid & Poultices)"],
        toolProficiencies: ["Herbalism Kit"],
        savingThrows: ["Wits", "Spirit"],
        baseFortitudeDie: 6,
        startingEquipment: ["Walking Stick (Gnarled Branch)", "Pouch of Pipeweed", "Spectacles (if needed)", "Book of Riddles (mostly solved)", "A kindly ear and a pocketful of advice", "Herbalism Kit"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "Respected for their wisdom, experience, and knowledge of Hobbit traditions, Gaffers and Gammers are the storytellers and advice-givers of their communities.",
        abilities: [
            { id: "gaffer_sageadvice", name: "Sage Advice", cost: 1, description: "Once per long rest, an ally can ask for your advice on a course of action. They gain advantage on one skill check related to that action within the next hour." },
            { id: "gaffer_weatherwise", name: "Weather-Wise", cost: 1, description: "You can accurately predict the weather for the next 24 hours in your local area with a successful Wits (Nature) check." }
        ]
    },
     "wanderer": {
        name: "Wanderer of Far Fields",
        primaryAbilities: ["Agility", "Spirit"],
        skillProficiencies: ["Survival (Mushroom Finding & Foraging)", "Nature (Gardening & Farming Lore)"],
        toolProficiencies: ["Cartographer's Tools (basic)"],
        savingThrows: ["Agility", "Sturdiness"],
        baseFortitudeDie: 6,
        startingEquipment: ["Shortbow (Elm)", "Travel-Stained Cloak with Hood", "Crumpled Map Fragment", "Tinderbox", "Waterskin", "Smooth River Stone"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "While most Hobbits prefer the comforts of home, some are drawn to the open road and the unexplored corners of the Shire (and perhaps, just a little beyond).",
        abilities: [
            { id: "wanderer_pathfinder", name: "Pathfinder", cost: 1, description: "You have advantage on Wisdom (Survival) checks to avoid getting lost and to find suitable paths in the wilderness." },
            { id: "wanderer_foragerseye", name: "Forager's Eye", cost: 1, description: "When foraging, you find twice as much food and water as normal on a successful Wits (Survival) check." }
        ]
    },
    "burglar": {
        name: "Burglar (Resourceful Scrounger)",
        primaryAbilities: ["Agility", "Wits"],
        skillProficiencies: ["Stealth (Quiet Movement & Hiding)", "Sleight of Hand (Delicate Picking)"],
        toolProficiencies: ["Thieves' Tools (lockpicks & small tools)"],
        savingThrows: ["Agility", "Wits"],
        baseFortitudeDie: 6,
        startingEquipment: ["Kitchen Knife", "Patched Woolen Cloak", "Sack of Marbles", "Small Coil of Rope (25ft)", "Thieves' Tools (simple picks)", "Chalk Nub"],
        skillPointsBonus: 1,
        abilityPoints: 3, 
        description: "More curious than is strictly proper, Burglars have a knack for getting into (and out of) places they shouldn't be, often finding things others have 'misplaced'.",
        abilities: [
            { id: "burglar_findweakness", name: "Find Weakness", cost: 1, description: "Once per short rest, before making an attack roll, skill check for disarming a trap, or picking a lock, you can grant yourself advantage on the roll." },
            { id: "burglar_distraction", name: "Distraction", cost: 1, description: "As an action, you can create a minor distraction. The next creature you choose within 30ft that can see/hear it has disadvantage on its next Wisdom (Perception) check made before the end of your next turn." },
            { id: "burglar_appraise", name: "Quick Appraisal", cost: 1, description: "You have advantage on Wits (Investigation) checks to determine the value or function of small, mundane objects or find hidden compartments." }
        ]
    },
    "gardener": {
        name: "Gardener (Shire Sage)",
        primaryAbilities: ["Spirit", "Wits"],
        skillProficiencies: ["Nature (Gardening & Farming Lore)", "Animal Handling (Befriending Critters)"],
        toolProficiencies: ["Herbalism Kit", "Gardening Tools (spade, trowel)"],
        savingThrows: ["Spirit", "Wits"],
        baseFortitudeDie: 8,
        startingEquipment: ["Sturdy Spade", "Basket of Herbs", "Waterskin", "Seed Pouch with 3 'Mystery Seeds'", "Herbalism Kit", "Pouch of Pipeweed"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "Keepers of the green and growing things, Gardeners understand the secret language of plants and the subtle ways of the wilder parts of the Shire.",
        abilities: [
            { id: "gardener_soothingpoultice", name: "Soothing Poultice", cost: 1, description: "Once per short rest, as an action, you can apply a poultice to a creature. They regain 1d4 + your Spirit modifier in Fortitude. This increases to 1d6 at level 5." },
            { id: "gardener_goodberrywine", name: "Goodberry Wine", cost: 1, description: "Once per long rest, you can spend 10 minutes brewing a small batch of Goodberry Wine. One creature who drinks it gains advantage on their next saving throw against poison or disease within 1 hour." }
        ]
    },
    "storykeeper": {
        name: "Storykeeper (Lore-Warden)",
        primaryAbilities: ["Charm", "Spirit"],
        skillProficiencies: ["Performance (Reciting Tales)", "History (Ancient Lore & Legends)"],
        toolProficiencies: ["Calligrapher's Supplies (quill & ink)"],
        savingThrows: ["Charm", "Spirit"],
        baseFortitudeDie: 6,
        startingEquipment: ["Book of Riddles (mostly solved)", "Wooden Whistle", "Ink Pot and Quills", "Smooth River Stone", "Spectacles (if needed)", "Half-eaten Apple"],
        skillPointsBonus: 2, 
        abilityPoints: 2,
        description: "Storykeepers are the memory of the Hobbits, preserving tales of old, composing new songs, and reminding everyone of the great deeds and funny foibles of their ancestors.",
        abilities: [
            { id: "storykeeper_inspiringtale", name: "Inspiring Tale", cost: 1, description: "As an action, tell a brief, stirring tale. One ally within 30ft who can hear you gains temporary Fortitude equal to your Charm modifier (min 1) for 10 minutes." },
            { id: "storykeeper_balladofbravery", name: "Ballad of Bravery", cost: 1, description: "Once per long rest, as an action, you can sing a ballad. Choose up to two allies within 30ft. They gain advantage on their next saving throw against being frightened made within the next minute." }
        ]
    },
    "watchwarden": {
        name: "Watchwarden (Border Protector)",
        primaryAbilities: ["Agility", "Sturdiness"],
        skillProficiencies: ["Perception (Noticing Details)", "Survival (Tracking & Pathfinding)"],
        toolProficiencies: ["Woodcarver's Tools (for making trail markers)"],
        savingThrows: ["Agility", "Sturdiness"],
        baseFortitudeDie: 8,
        startingEquipment: ["Shortbow (Elm)", "Sturdy Club (Bounder's Issue)", "Travel-Stained Cloak with Hood", "Tinderbox", "Kitchen Knife", "Bedroll"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "More inclined to patrol the further reaches than a typical Bounder, Watchwardens are skilled in woodcraft and archery, keeping an eye out for trouble before it reaches the cozy heart of the Shire.",
        abilities: [
            { id: "watchwarden_aimedshot", name: "Aimed Shot", cost: 1, description: "Once per short rest, when you make an attack roll with a ranged weapon, you can add a +2 bonus to the attack roll." },
            { id: "watchwarden_firstwatch", name: "First Watch", cost: 1, description: "You have advantage on Wisdom (Perception) checks made to notice threats during travel or when keeping watch during a rest." }
        ]
    },
    "mathomfinder": {
        name: "Mathom-Finder (Relic Hunter)",
        primaryAbilities: ["Wits", "Agility"],
        skillProficiencies: ["Investigation (Poking About)", "History (Object Lore)"],
        toolProficiencies: ["Tinker's Tools (small gears & wires)", "Magnifying Glass"],
        savingThrows: ["Wits", "Agility"],
        baseFortitudeDie: 6,
        startingEquipment: ["Walking Stick (Gnarled Branch)", "Magnifying Glass", "Shiny Brass Button", "Notebook and Charcoal Pencil", "Tinker's Tools (simple picks)", "Key (Rusty)"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "Mathom-Finders have a peculiar interest in old, forgotten, or discarded items. They can often discern the history or hidden uses of such 'mathoms'.",
        abilities: [
            { id: "mathom_discerntrick", name: "Discern Trick", cost: 1, description: "You have advantage on Wits (Investigation) checks made to see through simple illusions or identify the workings of a simple mechanical trap or puzzle." },
            { id: "mathom_juryrig", name: "Jury-Rig", cost: 1, description: "Once per long rest, with 10 minutes of work and your Tinker's Tools, you can temporarily repair a broken mundane item or create a small, non-magical device to solve an immediate, simple problem (e.g., a small noise-maker, a short-lived light source from a pebble and wire - DM's discretion)." }
        ]
    },
    "waybreadbaker": {
        name: "Waybread Baker (Heart's Comfort)",
        primaryAbilities: ["Spirit", "Sturdiness"],
        skillProficiencies: ["Medicine (Comforting Care)", "Persuasion (Encouragement)"],
        toolProficiencies: ["Cook's Utensils (specialty in baking)"],
        savingThrows: ["Spirit", "Sturdiness"],
        baseFortitudeDie: 8, 
        startingEquipment: ["Rolling Pin", "Pouch of Special Flour", "Recipe for '旅人のパン' (Waybread - Lembas-inspired)", "Cook's Utensils", "Strangely Warm Pebble", "Herbal Tea Bags (3)"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "Waybread Bakers are masters of creating food that not only fills the belly but also warms the spirit. Their presence is a comfort, and their creations can mend more than just hunger.",
        abilities: [
            { id: "waybread_hearteningmorsel", name: "Heartening Morsel", cost: 1, description: "Once per short rest, as an action, you can give a specially prepared morsel (e.g., a small biscuit) to an ally. They gain temporary Fortitude equal to 1d4 + your Spirit modifier." },
            { id: "waybread_comfortingaroma", name: "Comforting Aroma", cost: 1, description: "When you take a short rest and prepare food, you and up to three allies resting with you recover one additional point of Fortitude if they spend any Resilience Dice." }
        ]
    },
    "brewer": { // New Brewer Calling
        name: "Shire Brewer",
        primaryAbilities: ["Wits", "Spirit"],
        skillProficiencies: ["Expert Cooking (Brewing Focus)", "Persuasion (Sharing Brews)"],
        toolProficiencies: ["Brewer's Supplies", "Cook's Utensils"],
        savingThrows: ["Sturdiness", "Wits"],
        baseFortitudeDie: 6,
        startingEquipment: ["Brewer's Supplies", "Sturdy Mug", "Recipe Book (mostly empty)", "Pouch of Barley", "Small Waterskin", "A cheerful song for brewing time"],
        skillPointsBonus: 1,
        abilityPoints: 2,
        description: "A connoisseur of fine ales, ciders, and other delightful beverages. Shire Brewers bring cheer and warmth to any gathering with their carefully crafted concoctions.",
        abilities: [
            { id: "brewer_qualitycontrol", name: "Quality Control", cost: 1, description: "You have advantage on Wits checks related to identifying ingredients, judging the quality of food and drink, or noticing impurities." },
            { id: "brewer_heartytoast", name: "Hearty Toast", cost: 1, description: "Once per short rest, as an action, you can lead a toast with a brew you've made. You and up to two allies who partake gain temporary Fortitude equal to your Spirit modifier (min 1) for 10 minutes." },
            { id: "brewer_sturdydrinker", name: "Sturdy Drinker", cost: 1, description: "You have advantage on saving throws against the effects of alcohol and gain resistance to poison damage from ingested substances." }
        ]
    },
    "other": {
        name: "Other (Custom)",
        primaryAbilities: [], skillProficiencies: [], toolProficiencies: [],
        savingThrows: [], baseFortitudeDie: 6,
        startingEquipment: ["Walking Stick (Gnarled Branch)", "Patched Woolen Cloak", "Tinderbox", "Waterskin", "Small Coil of Rope (25ft)"], // Generic starting kit
        skillPointsBonus: 2, 
        abilityPoints: 2,
        description: "A Hobbit of unique talents and experiences, not fitting neatly into common roles.",
        abilities: []
    }
};
