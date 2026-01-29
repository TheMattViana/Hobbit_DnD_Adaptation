// hobbit_data_monsters.js
// Expanded monster data for Hobbit Adventures DM Dashboard

const MONSTERS_DATA = [
    // --- Common Shire Creatures (CR 0 - 1/8) ---
    {
        id: "giant_rat",
        name: "Giant Rat",
        type: "Beast",
        challengeRating: 1/8,
        fortitude: 7, // 2d6
        armorClass: 12,
        speed: "20ft",
        abilities: { brawn: 7, agility: 15, sturdiness: 11, wits: 2, spirit: 10, charm: 4 },
        skills: ["Stealth (+4)"],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The rat has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [{ name: "Bite", attackBonus: "+4", damage: "1d4 + 2 Piercing. Target must succeed on a DC 10 Sturdiness saving throw or contract a minor disease." }],
        description: "Larger and more aggressive than common rats, often found in cellars or sewers, carrying filth and disease."
    },
    {
        id: "giant_spiderling",
        name: "Giant Spiderling",
        type: "Beast",
        challengeRating: 0,
        fortitude: 2, // 1d4
        armorClass: 10,
        speed: "20ft, Climb 20ft",
        abilities: { brawn: 6, agility: 12, sturdiness: 10, wits: 1, spirit: 8, charm: 3 },
        skills: ["Stealth (+3)"],
        senses: "Blindsight 10ft, Darkvision 30ft, Passive Perception 9",
        languages: "—",
        traits: [{ name: "Spider Climb", description: "The spiderling can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check." }],
        actions: [{ name: "Bite", attackBonus: "+3", damage: "1d4 Piercing, and the target must make a DC 8 Sturdiness saving throw or take 1d4 poison damage." }],
        description: "Small, newly hatched spiders, still a nuisance but not yet a major threat."
    },
    {
        id: "badger",
        name: "Badger",
        type: "Beast",
        challengeRating: 0,
        fortitude: 3, // 1d4 + 1
        armorClass: 10,
        speed: "20ft, Burrow 5ft",
        abilities: { brawn: 6, agility: 10, sturdiness: 13, wits: 2, spirit: 12, charm: 5 },
        skills: ["Perception (+3)"],
        senses: "Darkvision 30ft, Passive Perception 13",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The badger has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [{ name: "Bite", attackBonus: "+2", damage: "1d4 + 1 Piercing" }],
        description: "A common, stout creature of the Shire, usually docile but fierce when provoked or defending its sett."
    },
    {
        id: "fox",
        name: "Fox",
        type: "Beast",
        challengeRating: 0,
        fortitude: 2, // 1d4
        armorClass: 12,
        speed: "30ft",
        abilities: { brawn: 3, agility: 15, sturdiness: 10, wits: 5, spirit: 12, charm: 6 },
        skills: ["Perception (+3), Stealth (+3)"],
        senses: "Passive Perception 13",
        languages: "—",
        traits: [{ name: "Keen Hearing and Smell", description: "The fox has advantage on Wisdom (Perception) checks that rely on hearing or smell." }],
        actions: [{ name: "Bite", attackBonus: "+1", damage: "1 Piercing" }],
        description: "A cunning and elusive creature, known for raiding chicken coops and disappearing into the undergrowth."
    },
    {
        id: "rabid_dog",
        name: "Rabid Dog",
        type: "Beast",
        challengeRating: 1/8,
        fortitude: 11, // 2d8 + 2
        armorClass: 12,
        speed: "40ft",
        abilities: { brawn: 13, agility: 13, sturdiness: 12, wits: 3, spirit: 12, charm: 6 },
        skills: ["Perception (+3)"],
        senses: "Passive Perception 13",
        languages: "—",
        traits: [{ name: "Keen Hearing and Smell", description: "The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell." }],
        actions: [{ name: "Bite", attackBonus: "+3", damage: "1d6 + 1 Piercing. Target must succeed on a DC 11 Sturdiness saving throw or contract a minor disease." }],
        description: "A once-domesticated dog, now maddened by disease, attacking anything that moves with frenzied bites."
    },
    {
        id: "large_snake",
        name: "Large Snake",
        type: "Beast",
        challengeRating: 1/8,
        fortitude: 5, // 1d8 + 1
        armorClass: 12,
        speed: "30ft",
        abilities: { brawn: 6, agility: 14, sturdiness: 11, wits: 2, spirit: 10, charm: 3 },
        skills: ["Stealth (+4)"],
        senses: "Blindsight 10ft, Passive Perception 10",
        languages: "—",
        traits: [{ name: "Constrict", description: "If the snake hits with a bite attack, it can use a bonus action to attempt to grapple the target (escape DC 11)." }],
        actions: [{ name: "Bite", attackBonus: "+4", damage: "1d4 + 2 Piercing" }],
        description: "A non-venomous but surprisingly strong snake, capable of wrapping around small prey."
    },
    {
        id: "swarm_of_bats",
        name: "Swarm of Bats",
        type: "Beast (Swarm)",
        challengeRating: 1/4,
        fortitude: 22, // 5d8
        armorClass: 12,
        speed: "0ft, Fly 30ft",
        abilities: { brawn: 3, agility: 15, sturdiness: 10, wits: 2, spirit: 12, charm: 4 },
        skills: ["Perception (+3)"],
        senses: "Blindsight 60ft, Passive Perception 13",
        languages: "—",
        traits: [
            { name: "Swarm", description: "The swarm can occupy another creature's space and vice versa. The swarm can't regain hit points or gain temporary hit points. It is immune to the grappled or restrained conditions." },
            { name: "Echolocation", description: "The swarm can't use its blindsight while deafened." },
            { name: "Keen Hearing", description: "The swarm has advantage on Wisdom (Perception) checks that rely on hearing." }
        ],
        actions: [{ name: "Bites", attackBonus: "+4", damage: "2d4 Piercing (if swarm has half HP or more, 1d4 Piercing if less)" }],
        description: "A disorienting cloud of flapping, squeaking bats, capable of overwhelming small creatures."
    },

    // --- Minor Threats (CR 1/4 - 1) ---
    {
        id: "young_goblin",
        name: "Young Goblin",
        type: "Humanoid (Goblinoid)",
        challengeRating: 1/8,
        fortitude: 5, // 1d6 + 2
        armorClass: 11, // Leather Armor
        speed: "30ft",
        abilities: { brawn: 8, agility: 12, sturdiness: 10, wits: 9, spirit: 8, charm: 7 },
        skills: ["Stealth (+3)"],
        senses: "Darkvision 60ft, Passive Perception 9",
        languages: "Common, Goblin",
        traits: [{ name: "Cowardly", description: "If reduced to half HP or less, the goblin must succeed on a DC 10 Spirit saving throw or become Frightened until the end of its next turn." }],
        actions: [{ name: "Club", attackBonus: "+2", damage: "1d4 Bludgeoning" }],
        description: "A small, inexperienced goblin, easily scared but still capable of causing trouble."
    },
    {
        id: "goblin_scout", // Re-using from previous list but adding more
        name: "Goblin Scout",
        type: "Humanoid (Goblinoid)",
        challengeRating: 1/4,
        fortitude: 7, // 2d6
        armorClass: 13, // Leather Armor
        speed: "30ft",
        abilities: { brawn: 8, agility: 14, sturdiness: 10, wits: 10, spirit: 8, charm: 8 },
        skills: ["Stealth (+6)"],
        senses: "Darkvision 60ft, Passive Perception 9",
        languages: "Common, Goblin",
        traits: [{ name: "Nimble Escape", description: "The goblin can take the Disengage or Hide action as a bonus action on each of its turns." }],
        actions: [
            { name: "Scimitar", attackBonus: "+4", damage: "1d6 + 2 Slashing" },
            { name: "Shortbow", attackBonus: "+4", damage: "1d6 + 2 Piercing", range: "80/320" }
        ],
        description: "Small, green-skinned humanoids with malicious grins, often found lurking on the edges of the Shire, looking for easy prey or mischief."
    },
    {
        id: "goblin_warrior",
        name: "Goblin Warrior",
        type: "Humanoid (Goblinoid)",
        challengeRating: 1/2,
        fortitude: 11, // 2d8 + 2
        armorClass: 14, // Leather Armor, Shield
        speed: "30ft",
        abilities: { brawn: 10, agility: 14, sturdiness: 12, wits: 10, spirit: 8, charm: 8 },
        skills: ["Stealth (+4)"],
        senses: "Darkvision 60ft, Passive Perception 9",
        languages: "Common, Goblin",
        traits: [{ name: "Pack Tactics", description: "The goblin has advantage on an attack roll against a creature if at least one of the goblin's allies is within 5 feet of the creature and the ally isn't incapacitated." }],
        actions: [
            { name: "Scimitar", attackBonus: "+4", damage: "1d6 + 2 Slashing" },
            { name: "Javelin", attackBonus: "+4", damage: "1d6 + 2 Piercing", range: "30/120" }
        ],
        description: "A more experienced goblin, often part of a raiding party, fighting with crude but effective weapons."
    },
    {
        id: "wolf",
        name: "Wolf",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 11, // 2d8 + 2
        armorClass: 13, // Natural Armor
        speed: "40ft",
        abilities: { brawn: 12, agility: 15, sturdiness: 12, wits: 6, spirit: 10, charm: 6 },
        skills: ["Perception (+3), Stealth (+4)"],
        senses: "Passive Perception 13",
        languages: "—",
        traits: [
            { name: "Keen Hearing and Smell", description: "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell." },
            { name: "Pack Tactics", description: "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated." }
        ],
        actions: [{ name: "Bite", attackBonus: "+4", damage: "1d4 + 2 Piercing. If the target is a creature, it must succeed on a DC 11 Sturdiness saving throw or be knocked prone." }],
        description: "A common predator of the wild, often hunting in packs, known for their cunning and ferocity."
    },
    {
        id: "giant_centipede",
        name: "Giant Centipede",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 4, // 1d6 + 1
        armorClass: 13, // Natural Armor
        speed: "30ft, Climb 30ft",
        abilities: { brawn: 5, agility: 14, sturdiness: 12, wits: 1, spirit: 7, charm: 3 },
        skills: [],
        senses: "Blindsight 30ft, Passive Perception 8",
        languages: "—",
        traits: [],
        actions: [{ name: "Bite", attackBonus: "+4", damage: "1d4 + 2 Piercing, and the target must make a DC 11 Sturdiness saving throw or take 3d6 poison damage. On a successful save, they take half as much damage." }],
        description: "A large, multi-legged insect with a venomous bite, often found in damp, dark places."
    },
    {
        id: "giant_frog",
        name: "Giant Frog",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 18, // 4d8
        armorClass: 11,
        speed: "20ft, Swim 20ft",
        abilities: { brawn: 12, agility: 13, sturdiness: 11, wits: 2, spirit: 10, charm: 3 },
        skills: ["Perception (+2), Stealth (+3)"],
        senses: "Darkvision 30ft, Passive Perception 12",
        languages: "—",
        traits: [{ name: "Amphibious", description: "The frog can breathe air and water." }],
        actions: [
            { name: "Bite", attackBonus: "+3", damage: "1d6 + 1 Piercing" },
            { name: "Tongue", description: "Ranged Weapon Attack: +3 to hit, reach 15 ft., one creature. Hit: The target is grappled (escape DC 11). Until this grapple ends, the target is restrained, and the frog can't use its tongue on another target." }
        ],
        description: "An oversized amphibian with a sticky tongue, capable of snatching small prey from a distance."
    },
    {
        id: "boar",
        name: "Boar",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 11, // 2d8 + 2
        armorClass: 11, // Natural Armor
        speed: "40ft",
        abilities: { brawn: 13, agility: 11, sturdiness: 12, wits: 2, spirit: 9, charm: 5 },
        skills: [],
        senses: "Passive Perception 9",
        languages: "—",
        traits: [{ name: "Charge", description: "If the boar moves at least 20 feet straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 1d6 slashing damage. If the target is a creature, it must succeed on a DC 11 Sturdiness saving throw or be knocked prone." }],
        actions: [{ name: "Tusk", attackBonus: "+3", damage: "1d6 + 1 Slashing" }],
        description: "A wild pig with formidable tusks, known for its aggressive charges when disturbed."
    },
    {
        id: "brown_bear_young",
        name: "Young Brown Bear",
        type: "Beast",
        challengeRating: 1/2,
        fortitude: 19, // 3d8 + 6
        armorClass: 11, // Natural Armor
        speed: "40ft, Climb 30ft",
        abilities: { brawn: 16, agility: 10, sturdiness: 14, wits: 2, spirit: 13, charm: 7 },
        skills: ["Perception (+3)"],
        senses: "Keen Smell, Passive Perception 13",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The bear has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [
            { name: "Multiattack", description: "The bear makes two attacks: one with its bite and one with its claws." },
            { name: "Bite", attackBonus: "+5", damage: "1d6 + 3 Piercing" },
            { name: "Claws", attackBonus: "+5", damage: "2d6 + 3 Slashing" }
        ],
        description: "A young, but still powerful, brown bear, capable of defending its territory fiercely."
    },

    // --- Greater Dangers (CR 1 - 3) ---
    {
        id: "orc_brigand", // Re-using from previous list
        name: "Orc Brigand",
        type: "Humanoid (Orc)",
        challengeRating: 1/2,
        fortitude: 15, // 2d8 + 6
        armorClass: 13, // Hide Armor
        speed: "30ft",
        abilities: { brawn: 14, agility: 12, sturdiness: 16, wits: 8, spirit: 10, charm: 7 },
        skills: ["Intimidation (+2)"],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "Common, Orc",
        traits: [{ name: "Aggressive", description: "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see." }],
        actions: [
            { name: "Greataxe", attackBonus: "+4", damage: "1d12 + 2 Slashing" },
            { name: "Javelin", attackBonus: "+4", damage: "1d6 + 2 Piercing", range: "30/120" }
        ],
        description: "Brutal and savage humanoids, common in the wilder lands, often raiding for plunder and sport. They are a constant threat to travelers."
    },
    {
        id: "orc_archer",
        name: "Orc Archer",
        type: "Humanoid (Orc)",
        challengeRating: 1,
        fortitude: 18, // 3d8 + 6
        armorClass: 14, // Studded Leather
        speed: "30ft",
        abilities: { brawn: 10, agility: 16, sturdiness: 14, wits: 10, spirit: 11, charm: 9 },
        skills: ["Perception (+3)"],
        senses: "Darkvision 60ft, Passive Perception 13",
        languages: "Common, Orc",
        traits: [{ name: "Aggressive", description: "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see." }],
        actions: [
            { name: "Shortsword", attackBonus: "+5", damage: "1d6 + 3 Piercing" },
            { name: "Shortbow", attackBonus: "+5", damage: "1d6 + 3 Piercing", range: "80/320" }
        ],
        description: "An orc skilled in ranged combat, often providing fire support for their brutish kin."
    },
    {
        id: "orc_captain",
        name: "Orc Captain",
        type: "Humanoid (Orc)",
        challengeRating: 2,
        fortitude: 30, // 4d8 + 12
        armorClass: 16, // Chain Mail
        speed: "30ft",
        abilities: { brawn: 16, agility: 12, sturdiness: 16, wits: 12, spirit: 14, charm: 11 },
        skills: ["Intimidation (+3), Survival (+4)"],
        senses: "Darkvision 60ft, Passive Perception 12",
        languages: "Common, Orc",
        traits: [
            { name: "Aggressive", description: "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see." },
            { name: "Leadership", description: "As a bonus action, the captain can utter a special command or warning. Each ally within 30 feet of the captain that can hear it gains advantage on attack rolls until the end of the captain's next turn." }
        ],
        actions: [
            { name: "Multiattack", description: "The captain makes two melee attacks." },
            { name: "Greataxe", attackBonus: "+5", damage: "1d12 + 3 Slashing" },
            { name: "Javelin", attackBonus: "+5", damage: "1d6 + 3 Piercing", range: "30/120" }
        ],
        description: "A seasoned orc leader, commanding small bands of raiders with brutal efficiency."
    },
    {
        id: "warg_scout", // Re-using from previous list
        name: "Warg Scout",
        type: "Beast",
        challengeRating: 1/2,
        fortitude: 13, // 2d8 + 4
        armorClass: 13, // Natural Armor
        speed: "50ft",
        abilities: { brawn: 12, agility: 14, sturdiness: 13, wits: 6, spirit: 12, charm: 6 },
        skills: ["Perception (+3), Stealth (+4)"],
        senses: "Darkvision 60ft, Passive Perception 13",
        languages: "— (understands Goblin/Orc commands)",
        traits: [{ name: "Keen Hearing and Smell", description: "The warg has advantage on Wisdom (Perception) checks that rely on hearing or smell." }],
        actions: [{ name: "Bite", attackBonus: "+4", damage: "1d6 + 2 Piercing. If the target is a creature, it must succeed on a DC 12 Sturdiness saving throw or be knocked prone." }],
        description: "Large, evil wolves with dark fur and glowing eyes, often used as mounts by Goblins and Orcs. They hunt in packs and are exceptionally cunning."
    },
    {
        id: "giant_spider", // Re-using from previous list
        name: "Giant Spider",
        type: "Beast",
        challengeRating: 1,
        fortitude: 26, // 4d10 + 4
        armorClass: 14, // Natural Armor
        speed: "30ft, Climb 30ft",
        abilities: { brawn: 12, agility: 16, sturdiness: 13, wits: 4, spirit: 10, charm: 2 },
        skills: ["Stealth (+7)"],
        senses: "Blindsight 10ft, Darkvision 60ft, Passive Perception 10",
        languages: "—",
        traits: [
            { name: "Spider Climb", description: "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check." },
            { name: "Web Sense", description: "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web." },
            { name: "Web Walker", description: "The spider ignores movement restrictions caused by webbing." }
        ],
        actions: [{ name: "Bite", attackBonus: "+5", damage: "1d8 + 3 Piercing, and the target must make a DC 11 Sturdiness saving throw or take 2d6 poison damage. On a successful save, they take half as much damage." }],
        description: "Monstrous arachnids that weave sticky webs to trap their prey, often found in dark woods or ancient ruins."
    },
    {
        id: "hill_troll_young",
        name: "Young Hill Troll", // Renamed from Young Troll for clarity
        type: "Giant",
        challengeRating: 3,
        fortitude: 63, // 6d10 + 30
        armorClass: 15, // Natural Armor
        speed: "30ft",
        abilities: { brawn: 18, agility: 13, sturdiness: 20, wits: 7, spirit: 9, charm: 7 },
        skills: [],
        senses: "Darkvision 60ft, Passive Perception 9",
        languages: "Giant",
        traits: [
            { name: "Keen Smell", description: "The troll has advantage on Wisdom (Perception) checks that rely on smell." },
            { name: "Regeneration", description: "The troll regains 5 fortitude at the start of its turn. If the troll takes fire or acid damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 fortitude and doesn't regenerate." }
        ],
        actions: [
            { name: "Claw", attackBonus: "+7", damage: "2d6 + 4 Slashing" },
            { name: "Bite", attackBonus: "+7", damage: "1d10 + 4 Piercing" }
        ],
        description: "A large, brutish creature with greenish skin and sharp claws, known for its incredible regenerative abilities. They are not very intelligent but are formidable in combat."
    },
    {
        id: "barrow_wight", // Re-using from previous list
        name: "Barrow-wight",
        type: "Undead",
        challengeRating: 3,
        fortitude: 45, // 6d8 + 18
        armorClass: 14, // Natural Armor
        speed: "30ft",
        abilities: { brawn: 13, agility: 12, sturdiness: 16, wits: 10, spirit: 14, charm: 13 },
        skills: ["Stealth (+3), Perception (+4)"],
        senses: "Darkvision 60ft, Passive Perception 14",
        languages: "Common, Sindarin (corrupted)",
        traits: [
            { name: "Sunlight Sensitivity", description: "While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight." }
        ],
        actions: [
            { name: "Claw", attackBonus: "+3", damage: "1d6 + 1 Slashing" },
            { name: "Life Drain", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d6 + 2 Necrotic damage. The target must succeed on a DC 13 Spirit saving throw or its Fortitude maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its Fortitude maximum to 0." }
        ],
        description: "Malevolent spirits inhabiting ancient barrows, capable of draining the life from their victims. They guard forgotten treasures and cursed artifacts."
    },
    {
        id: "dire_wolf",
        name: "Dire Wolf",
        type: "Beast",
        challengeRating: 1,
        fortitude: 37, // 5d10 + 10
        armorClass: 14, // Natural Armor
        speed: "50ft",
        abilities: { brawn: 17, agility: 15, sturdiness: 15, wits: 7, spirit: 12, charm: 7 },
        skills: ["Perception (+4), Stealth (+4)"],
        senses: "Darkvision 60ft, Keen Hearing and Smell, Passive Perception 14",
        languages: "—",
        traits: [
            { name: "Keen Hearing and Smell", description: "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell." },
            { name: "Pack Tactics", description: "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the creature and the ally isn't incapacitated." }
        ],
        actions: [{ name: "Bite", attackBonus: "+5", damage: "2d6 + 3 Piercing. If the target is a creature, it must succeed on a DC 13 Sturdiness saving throw or be knocked prone." }],
        description: "A larger, more ferocious cousin of the common wolf, often found in deep forests or mountains, hunting in powerful packs."
    },
    {
        id: "giant_snake_constrictor",
        name: "Giant Constrictor Snake",
        type: "Beast",
        challengeRating: 2,
        fortitude: 60, // 8d10 + 16
        armorClass: 12,
        speed: "30ft, Swim 30ft",
        abilities: { brawn: 19, agility: 14, sturdiness: 16, wits: 3, spirit: 10, charm: 5 },
        skills: ["Perception (+2)"],
        senses: "Blindsight 10ft, Passive Perception 12",
        languages: "—",
        traits: [],
        actions: [
            { name: "Bite", attackBonus: "+6", damage: "1d8 + 4 Piercing" },
            { name: "Constrict", description: "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 2d6 + 4 bludgeoning damage, and the target is grappled (escape DC 16). Until this grapple ends, the creature is restrained, and the snake can't constrict another target." }
        ],
        description: "An enormous snake that wraps its prey in crushing coils, found in swamps and dense forests."
    },
    {
        id: "giant_wasp",
        name: "Giant Wasp",
        type: "Beast",
        challengeRating: 1/2,
        fortitude: 13, // 3d6 + 3
        armorClass: 12,
        speed: "10ft, Fly 50ft",
        abilities: { brawn: 10, agility: 12, sturdiness: 12, wits: 1, spirit: 7, charm: 3 },
        skills: [],
        senses: "Passive Perception 8",
        languages: "—",
        traits: [],
        actions: [{ name: "Sting", attackBonus: "+3", damage: "1d6 + 2 Piercing, and the target must make a DC 11 Sturdiness saving throw or take 2d4 poison damage and be poisoned for 1 minute. On a successful save, they take half damage and are not poisoned." }],
        description: "An aggressive, oversized insect with a painful, venomous sting, often found near its nest."
    },
    {
        id: "giant_badger",
        name: "Giant Badger",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 13, // 2d8 + 4
        armorClass: 11,
        speed: "30ft, Burrow 10ft",
        abilities: { brawn: 13, agility: 10, sturdiness: 15, wits: 2, spirit: 12, charm: 5 },
        skills: [],
        senses: "Darkvision 30ft, Passive Perception 11",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The badger has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [
            { name: "Multiattack", description: "The badger makes two attacks: one with its bite and one with its claws." },
            { name: "Bite", attackBonus: "+3", damage: "1d4 + 1 Piercing" },
            { name: "Claws", attackBonus: "+3", damage: "1d6 + 1 Slashing" }
        ],
        description: "A much larger, more formidable version of the common badger, fiercely territorial and a powerful digger."
    },
    {
        id: "giant_toad",
        name: "Giant Toad",
        type: "Beast",
        challengeRating: 1,
        fortitude: 39, // 6d10 + 6
        armorClass: 11,
        speed: "20ft, Swim 40ft",
        abilities: { brawn: 15, agility: 13, sturdiness: 13, wits: 7, spirit: 10, charm: 5 },
        skills: ["Stealth (+3)"],
        senses: "Darkvision 30ft, Passive Perception 10",
        languages: "—",
        traits: [
            { name: "Amphibious", description: "The toad can breathe air and water." },
            { name: "Standing Leap", description: "The toad's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start." }
        ],
        actions: [
            { name: "Bite", attackBonus: "+4", damage: "1d10 + 2 Piercing, and the target is grappled (escape DC 13). Until this grapple ends, the target is restrained, and the toad can't bite another target." },
            { name: "Swallow", description: "The toad makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the toad, and it takes 1d6 acid damage at the start of each of the toad's turns. If the toad takes 10 damage or more on a single turn from a creature inside it, the toad must succeed on a DC 11 Sturdiness saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 5 feet of the toad. If the toad dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 feet of movement, exiting prone." }
        ],
        description: "A massive, warty amphibian found in bogs and marshes, known for its ability to swallow prey whole."
    },
    {
        id: "giant_owl",
        name: "Giant Owl",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 19, // 3d10 + 3
        armorClass: 12,
        speed: "5ft, Fly 60ft",
        abilities: { brawn: 13, agility: 15, sturdiness: 12, wits: 8, spirit: 13, charm: 10 },
        skills: ["Perception (+3), Stealth (+4)"],
        senses: "Darkvision 120ft, Passive Perception 13",
        languages: "Giant Owl, understands Common and Sylvan but can't speak them.",
        traits: [
            { name: "Keen Hearing and Sight", description: "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight." },
            { name: "Flyby", description: "The owl doesn't provoke an opportunity attack when it flies out of an enemy's reach." }
        ],
        actions: [
            { name: "Talons", attackBonus: "+3", damage: "1d6 + 1 Slashing" }
        ],
        description: "A majestic, oversized owl, often found in ancient forests, known for its silent flight and sharp senses."
    },
    {
        id: "giant_weasel",
        name: "Giant Weasel",
        type: "Beast",
        challengeRating: 1/8,
        fortitude: 9, // 2d8
        armorClass: 13,
        speed: "40ft",
        abilities: { brawn: 8, agility: 16, sturdiness: 11, wits: 4, spirit: 12, charm: 5 },
        skills: ["Perception (+3), Stealth (+5)"],
        senses: "Darkvision 60ft, Passive Perception 13",
        languages: "—",
        traits: [{ name: "Keen Hearing and Smell", description: "The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell." }],
        actions: [{ name: "Bite", attackBonus: "+5", damage: "1d4 + 3 Piercing" }],
        description: "A larger, more aggressive version of a common weasel, capable of hunting small game and being a persistent pest."
    },
    {
        id: "carrion_crawler_young",
        name: "Young Carrion Crawler",
        type: "Aberration",
        challengeRating: 1,
        fortitude: 27, // 5d8 + 5
        armorClass: 13, // Natural Armor
        speed: "30ft, Climb 30ft",
        abilities: { brawn: 14, agility: 10, sturdiness: 12, wits: 2, spirit: 10, charm: 5 },
        skills: ["Perception (+2)"],
        senses: "Darkvision 60ft, Passive Perception 12",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The crawler has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [
            { name: "Tentacles", attackBonus: "+4", damage: "1d4 + 2 Piercing. Target must succeed on a DC 13 Sturdiness saving throw or be poisoned for 1 minute. While poisoned, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success." },
            { name: "Bite", attackBonus: "+4", damage: "1d6 + 2 Piercing" }
        ],
        description: "A grotesque, segmented creature with numerous tentacles around its mouth, found in dark, damp places, feeding on decaying flesh."
    },
    {
        id: "giant_fire_beetle",
        name: "Giant Fire Beetle",
        type: "Beast",
        challengeRating: 0,
        fortitude: 4, // 1d6 + 1
        armorClass: 13, // Natural Armor
        speed: "30ft",
        abilities: { brawn: 8, agility: 10, sturdiness: 12, wits: 1, spirit: 7, charm: 3 },
        skills: [],
        senses: "Blindsight 30ft, Passive Perception 8",
        languages: "—",
        traits: [{ name: "Illumination", description: "The beetle sheds dim light in a 10-foot radius." }],
        actions: [{ name: "Bite", attackBonus: "+1", damage: "1d6 Piercing" }],
        description: "A large beetle with glowing glands, often kept for its natural light, but can deliver a painful bite if agitated."
    },
    {
        id: "stirge",
        name: "Stirge",
        type: "Beast",
        challengeRating: 1/8,
        fortitude: 2, // 1d4
        armorClass: 14,
        speed: "10ft, Fly 40ft",
        abilities: { brawn: 4, agility: 16, sturdiness: 10, wits: 2, spirit: 8, charm: 4 },
        skills: ["Stealth (+5)"],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "—",
        traits: [],
        actions: [{ name: "Blood Drain", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1d4 + 3 piercing damage, and the stirge attaches to the target. While attached, the stirge doesn't attack. Instead, at the start of each of the stirge's turns, the target loses 1d4 + 3 fortitude due to blood loss. The stirge can detach itself by spending 5 feet of its movement. It does so after it drains 10 fortitude from the target or if the target dies. A creature, including the target, can use its action to detach the stirge." }],
        description: "A small, winged creature resembling a mosquito, but much larger, that feeds on the blood of living creatures."
    },
    {
        id: "giant_lizard",
        name: "Giant Lizard",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 19, // 3d8 + 6
        armorClass: 12, // Natural Armor
        speed: "30ft, Swim 30ft",
        abilities: { brawn: 15, agility: 12, sturdiness: 13, wits: 2, spirit: 10, charm: 5 },
        skills: [],
        senses: "Darkvision 30ft, Passive Perception 10",
        languages: "—",
        traits: [],
        actions: [{ name: "Bite", attackBonus: "+4", damage: "1d8 + 2 Piercing" }],
        description: "A large, scaly reptile, often found in warm, damp environments, capable of a surprisingly quick bite."
    },
    {
        id: "giant_owl_juvenile",
        name: "Juvenile Giant Owl",
        type: "Beast",
        challengeRating: 0,
        fortitude: 13, // 2d10 + 2
        armorClass: 11,
        speed: "5ft, Fly 50ft",
        abilities: { brawn: 10, agility: 14, sturdiness: 11, wits: 7, spirit: 12, charm: 9 },
        skills: ["Perception (+3), Stealth (+4)"],
        senses: "Darkvision 90ft, Passive Perception 12",
        languages: "Giant Owl, understands Common and Sylvan but can't speak them.",
        traits: [
            { name: "Keen Hearing and Sight", description: "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight." }
        ],
        actions: [
            { name: "Talons", attackBonus: "+2", damage: "1d4 + 1 Slashing" }
        ],
        description: "A young giant owl, still learning to hunt but already a formidable presence in the night sky."
    },
    {
        id: "swarm_of_rats",
        name: "Swarm of Rats",
        type: "Beast (Swarm)",
        challengeRating: 1/4,
        fortitude: 24, // 7d6
        armorClass: 10,
        speed: "30ft",
        abilities: { brawn: 7, agility: 15, sturdiness: 10, wits: 2, spirit: 10, charm: 4 },
        skills: ["Stealth (+4)"],
        senses: "Darkvision 30ft, Keen Smell, Passive Perception 10",
        languages: "—",
        traits: [
            { name: "Swarm", description: "The swarm can occupy another creature's space and vice versa. The swarm can't regain hit points or gain temporary hit points. It is immune to the grappled or restrained conditions." },
            { name: "Keen Smell", description: "The swarm has advantage on Wisdom (Perception) checks that rely on smell." }
        ],
        actions: [{ name: "Bites", attackBonus: "+2", damage: "2d6 Piercing (if swarm has half HP or more, 1d6 Piercing if less). Target must succeed on a DC 10 Sturdiness saving throw or contract a minor disease." }],
        description: "A writhing mass of hungry rats, capable of overwhelming and devouring anything in their path."
    },
    {
        id: "giant_frog_juvenile",
        name: "Juvenile Giant Frog",
        type: "Beast",
        challengeRating: 0,
        fortitude: 11, // 2d8 + 2
        armorClass: 10,
        speed: "15ft, Swim 15ft",
        abilities: { brawn: 10, agility: 12, sturdiness: 11, wits: 2, spirit: 10, charm: 3 },
        skills: ["Perception (+2), Stealth (+3)"],
        senses: "Darkvision 30ft, Passive Perception 12",
        languages: "—",
        traits: [{ name: "Amphibious", description: "The frog can breathe air and water." }],
        actions: [{ name: "Bite", attackBonus: "+2", damage: "1d4 + 1 Piercing" }],
        description: "A smaller, less dangerous giant frog, still capable of a surprising leap and bite."
    },
    {
        id: "hobgoblin_soldier",
        name: "Hobgoblin Soldier",
        type: "Humanoid (Goblinoid)",
        challengeRating: 1/2,
        fortitude: 11, // 2d8 + 2
        armorClass: 15, // Chain Shirt, Shield
        speed: "30ft",
        abilities: { brawn: 13, agility: 12, sturdiness: 12, wits: 10, spirit: 10, charm: 9 },
        skills: [],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "Common, Goblin",
        traits: [{ name: "Martial Advantage", description: "Once per turn, if the hobgoblin hits a creature with a weapon attack and that creature is within 5 feet of an ally of the hobgoblin that isn't incapacitated, the hobgoblin can deal an extra 1d4 damage to the creature." }],
        actions: [
            { name: "Longsword", attackBonus: "+3", damage: "1d8 + 1 Slashing" },
            { name: "Javelin", attackBonus: "+3", damage: "1d6 + 1 Piercing", range: "30/120" }
        ],
        description: "Disciplined and militaristic, hobgoblins are more organized and dangerous than their goblin kin, often forming small, well-equipped patrols."
    },
    {
        id: "bugbear_thug",
        name: "Bugbear Thug",
        type: "Humanoid (Goblinoid)",
        challengeRating: 1,
        fortitude: 27, // 4d8 + 8
        armorClass: 16, // Hide Armor, Shield
        speed: "30ft",
        abilities: { brawn: 15, agility: 14, sturdiness: 13, wits: 8, spirit: 11, charm: 9 },
        skills: ["Stealth (+6)"],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "Common, Goblin",
        traits: [
            { name: "Brute", description: "A melee weapon attack deals one extra die of its damage when the bugbear hits with it (included in the attack)." },
            { name: "Surprise Attack", description: "If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 2d6 damage from the attack." }
        ],
        actions: [
            { name: "Morningstar", attackBonus: "+4", damage: "2d8 + 2 Piercing" }, // Brute included
            { name: "Javelin", attackBonus: "+4", damage: "2d6 + 2 Piercing", range: "30/120" } // Brute included
        ],
        description: "Large, hairy goblinoids known for their strength and ambushing tactics, often serving as enforcers or elite warriors for larger goblinoid forces."
    },
    {
        id: "giant_owl_guardian",
        name: "Giant Owl Guardian",
        type: "Beast",
        challengeRating: 1,
        fortitude: 30, // 5d10 + 5
        armorClass: 13,
        speed: "5ft, Fly 60ft",
        abilities: { brawn: 14, agility: 16, sturdiness: 13, wits: 10, spirit: 14, charm: 12 },
        skills: ["Perception (+4), Stealth (+5)"],
        senses: "Darkvision 120ft, Passive Perception 14",
        languages: "Giant Owl, understands Common and Sylvan but can't speak them.",
        traits: [
            { name: "Keen Hearing and Sight", description: "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight." },
            { name: "Flyby", description: "The owl doesn't provoke an opportunity attack when it flies out of an enemy's reach." }
        ],
        actions: [
            { name: "Multiattack", description: "The owl makes two attacks: one with its beak and one with its talons." },
            { name: "Beak", attackBonus: "+4", damage: "1d4 + 2 Piercing" },
            { name: "Talons", attackBonus: "+4", damage: "1d6 + 2 Slashing" }
        ],
        description: "An ancient and wise giant owl, acting as a protector of its territory or a guide for those it deems worthy."
    },
    {
        id: "grick",
        name: "Grick",
        type: "Aberration",
        challengeRating: 2,
        fortitude: 27, // 5d8 + 5
        armorClass: 14, // Natural Armor
        speed: "30ft, Climb 30ft",
        abilities: { brawn: 14, agility: 14, sturdiness: 12, wits: 5, spirit: 10, charm: 5 },
        skills: ["Perception (+2), Stealth (+4)"],
        senses: "Darkvision 60ft, Passive Perception 12",
        languages: "—",
        traits: [{ name: "Stone Camouflage", description: "The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain." }],
        actions: [
            { name: "Multiattack", description: "The grick makes two attacks: one with its tentacles and one with its beak." },
            { name: "Tentacles", attackBonus: "+4", damage: "1d6 + 2 Piercing" },
            { name: "Beak", attackBonus: "+4", damage: "1d4 + 2 Piercing" }
        ],
        description: "A worm-like aberration with a beak and four tentacles, native to underground caverns, known for its ability to blend into rocky environments."
    },
    {
        id: "shadow",
        name: "Shadow",
        type: "Undead",
        challengeRating: 1/2,
        fortitude: 16, // 3d8 + 3
        armorClass: 12,
        speed: "30ft",
        abilities: { brawn: 6, agility: 14, sturdiness: 13, wits: 6, spirit: 10, charm: 12 },
        skills: ["Stealth (+4)"],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "—",
        traits: [
            { name: "Amorphous", description: "The shadow can move through a space as narrow as 1 inch wide without squeezing." },
            { name: "Shadow Stealth", description: "While in dim light or darkness, the shadow can take the Hide action as a bonus action." },
            { name: "Sunlight Weakness", description: "While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws." }
        ],
        actions: [{ name: "Strength Drain", description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1d4 + 2 necrotic damage, and the target's Brawn score is reduced by 1d4. The target dies if this reduces its Brawn to 0. The reduction lasts until the target finishes a short or long rest." }],
        description: "A malevolent, incorporeal undead creature that drains the strength from its victims, leaving them as withered husks."
    },
    {
        id: "giant_wolf_spider",
        name: "Giant Wolf Spider",
        type: "Beast",
        challengeRating: 1/4,
        fortitude: 7, // 2d6
        armorClass: 13,
        speed: "40ft, Climb 40ft",
        abilities: { brawn: 8, agility: 15, sturdiness: 10, wits: 3, spirit: 10, charm: 4 },
        skills: ["Perception (+2), Stealth (+4)"],
        senses: "Blindsight 10ft, Darkvision 60ft, Passive Perception 12",
        languages: "—",
        traits: [{ name: "Spider Climb", description: "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check." }],
        actions: [{ name: "Bite", attackBonus: "+3", damage: "1d4 + 2 Piercing, and the target must make a DC 10 Sturdiness saving throw or take 1d6 poison damage. On a successful save, they take half as much damage." }],
        description: "A fast-moving, venomous spider that hunts its prey actively rather than relying on webs."
    },
    {
        id: "giant_badger_old",
        name: "Old Giant Badger",
        type: "Beast",
        challengeRating: 1/2,
        fortitude: 22, // 3d8 + 9
        armorClass: 12,
        speed: "30ft, Burrow 10ft",
        abilities: { brawn: 15, agility: 10, sturdiness: 16, wits: 3, spirit: 13, charm: 6 },
        skills: ["Perception (+3)"],
        senses: "Darkvision 30ft, Keen Smell, Passive Perception 13",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The badger has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [
            { name: "Multiattack", description: "The badger makes two attacks: one with its bite and one with its claws." },
            { name: "Bite", attackBonus: "+4", damage: "1d6 + 2 Piercing" },
            { name: "Claws", attackBonus: "+4", damage: "1d8 + 2 Slashing" }
        ],
        description: "An ancient and formidable giant badger, its fur matted with age, fiercely defending its extensive burrow system."
    },
    {
        id: "brown_bear_old",
        name: "Old Brown Bear",
        type: "Beast",
        challengeRating: 1,
        fortitude: 34, // 4d10 + 12
        armorClass: 12, // Natural Armor
        speed: "40ft, Climb 30ft",
        abilities: { brawn: 18, agility: 10, sturdiness: 16, wits: 3, spirit: 14, charm: 8 },
        skills: ["Perception (+4)"],
        senses: "Keen Smell, Passive Perception 14",
        languages: "—",
        traits: [{ name: "Keen Smell", description: "The bear has advantage on Wisdom (Perception) checks that rely on smell." }],
        actions: [
            { name: "Multiattack", description: "The bear makes two attacks: one with its bite and one with its claws." },
            { name: "Bite", attackBonus: "+6", damage: "1d8 + 4 Piercing" },
            { name: "Claws", attackBonus: "+6", damage: "2d8 + 4 Slashing" }
        ],
        description: "A grizzled, veteran brown bear, its strength and ferocity undiminished by age, a true force of nature in the wilds."
    },
    {
        id: "giant_constrictor_snake_juvenile",
        name: "Juvenile Giant Constrictor Snake",
        type: "Beast",
        challengeRating: 1,
        fortitude: 30, // 4d10 + 8
        armorClass: 11,
        speed: "30ft, Swim 30ft",
        abilities: { brawn: 17, agility: 14, sturdiness: 14, wits: 3, spirit: 10, charm: 5 },
        skills: ["Perception (+2)"],
        senses: "Blindsight 10ft, Passive Perception 12",
        languages: "—",
        traits: [],
        actions: [
            { name: "Bite", attackBonus: "+5", damage: "1d6 + 3 Piercing" },
            { name: "Constrict", description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 1d8 + 3 bludgeoning damage, and the target is grappled (escape DC 14). Until this grapple ends, the creature is restrained, and the snake can't constrict another target." }
        ],
        description: "A younger, but still dangerous, constrictor snake, learning to ambush and overpower its prey."
    },
    {
        id: "giant_centipede_large",
        name: "Large Giant Centipede",
        type: "Beast",
        challengeRating: 1/2,
        fortitude: 11, // 3d6 + 3
        armorClass: 14, // Natural Armor
        speed: "30ft, Climb 30ft",
        abilities: { brawn: 7, agility: 15, sturdiness: 12, wits: 1, spirit: 7, charm: 3 },
        skills: [],
        senses: "Blindsight 30ft, Passive Perception 8",
        languages: "—",
        traits: [],
        actions: [{ name: "Bite", attackBonus: "+5", damage: "1d6 + 3 Piercing, and the target must make a DC 12 Sturdiness saving throw or take 4d6 poison damage. On a successful save, they take half as much damage." }],
        description: "A particularly large and venomous giant centipede, its bite capable of delivering a potent neurotoxin."
    },
    {
        id: "dark_creeper",
        name: "Dark Creeper",
        type: "Humanoid",
        challengeRating: 1/2,
        fortitude: 13, // 3d6 + 3
        armorClass: 14, // Leather Armor
        speed: "30ft",
        abilities: { brawn: 9, agility: 14, sturdiness: 11, wits: 10, spirit: 10, charm: 6 },
        skills: ["Stealth (+4)"],
        senses: "Darkvision 120ft, Passive Perception 10",
        languages: "Undercommon",
        traits: [
            { name: "Light Sensitivity", description: "While in bright light, the creeper has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight." },
            { name: "Death Burst", description: "When the creeper dies, it explodes into a cloud of inky darkness. Each creature within 10 feet of it must succeed on a DC 10 Sturdiness saving throw or be blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success." }
        ],
        actions: [{ name: "Shortsword", attackBonus: "+4", damage: "1d6 + 2 Piercing" }],
        description: "Small, shadowy humanoids from the deep places of the world, sensitive to light and prone to exploding into blinding darkness upon death."
    },
    {
        id: "ghoul",
        name: "Ghoul",
        type: "Undead",
        challengeRating: 1,
        fortitude: 22, // 5d8
        armorClass: 12,
        speed: "30ft",
        abilities: { brawn: 13, agility: 15, sturdiness: 10, wits: 10, spirit: 10, charm: 8 },
        skills: [],
        senses: "Darkvision 60ft, Passive Perception 10",
        languages: "Common",
        traits: [{ name: "Undead Fortitude", description: "If damage reduces the ghoul to 0 fortitude, it must make a Sturdiness saving throw with a DC of 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the ghoul drops to 1 fortitude instead." }],
        actions: [
            { name: "Claws", attackBonus: "+4", damage: "2d4 + 2 Slashing. If the target is a creature other than an elf or undead, it must succeed on a DC 10 Sturdiness saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success." },
            { name: "Bite", attackBonus: "+2", damage: "1d6 + 0 Piercing" }
        ],
        description: "A ravenous undead creature, once humanoid, now driven by an insatiable hunger for living flesh, its touch capable of paralyzing its victims."
    }
];

// Function to easily get all monsters in a single list for populating selectors or for searching
function getAllMonstersList() {
    return MONSTERS_DATA;
}
