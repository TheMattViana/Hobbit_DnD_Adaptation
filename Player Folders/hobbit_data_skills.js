// hobbit_data_skills.js

// Skills Data with Level Requirements, Costs, and Prerequisites
const SKILLS_DATA = [
    // --- Tier 1: Basic Hobbit Talents (Cost 1, Level 1 unless noted) ---
    { name: "Acrobatics", ability: "agility", id: "skillAcrobatics", cost: 1, levelReq: 1, prereq: null, description: "Perform nimble maneuvers, keep your balance, tumble." },
    { name: "Small Critter Handling", ability: "spirit", id: "skillAnimalHandlingCritters", cost: 1, levelReq: 1, prereq: null, description: "Calm, befriend, or guide small animals (e.g., squirrels, rabbits, badgers, friendly dogs)." },
    { name: "Climbing & Jumping", ability: "brawn", id: "skillAthletics", cost: 1, levelReq: 1, prereq: null, description: "Perform acts of physical prowess like climbing short walls or jumping over puddles." },
    { name: "Tall Tales", ability: "charm", id: "skillDeception", cost: 1, levelReq: 1, prereq: null, description: "Spin a convincing yarn, mislead with a white lie, or exaggerate an exploit." },
    { name: "History (Local Lore & Family Trees)", ability: "wits", id: "skillHistory", cost: 1, levelReq: 1, prereq: null, description: "Recall local history, legends, notable Hobbit families, and boundaries." }, // Changed name for clarity
    { name: "Ancient Lore & Legends", ability: "wits", id: "skillHistoryAncient", cost: 1, levelReq: 1, prereq: null, description: "Recall tales of elder days, forgotten lines of kings, and the history of important objects or places." },
    { name: "Reading Moods", ability: "spirit", id: "skillInsight", cost: 1, levelReq: 1, prereq: null, description: "Discern true intentions of other Hobbits, sense a mood." },
    { name: "Stern Grumbling", ability: "charm", id: "skillIntimidation", cost: 1, levelReq: 1, prereq: null, description: "Influence through stern warnings or expressing deep disapproval (Hobbit style)." },
    { name: "Poking About", ability: "wits", id: "skillInvestigation", cost: 1, levelReq: 1, prereq: null, description: "Deduce information from examining objects, find hidden pantry stores." },
    { name: "First Aid & Poultices", ability: "spirit", id: "skillMedicine", cost: 1, levelReq: 1, prereq: null, description: "Provide basic medical care, apply simple herbal poultices." },
    { name: "Gardening & Farming Lore", ability: "wits", id: "skillNature", cost: 1, levelReq: 1, prereq: null, description: "Knowledge of common plants, farming, gardening, and local seasons." },
    { name: "Noticing Details", ability: "spirit", id: "skillPerception", cost: 1, levelReq: 1, prereq: null, description: "Notice small details, dangers, and things out of place." },
    { name: "Storytelling & Riddles", ability: "charm", id: "skillPerformance", cost: 1, levelReq: 1, prereq: null, description: "Entertain with stories, songs, riddles, or simple tunes on a whistle." },
    { name: "Reciting Tales", ability: "charm", id: "skillPerformanceTales", cost: 1, levelReq: 1, prereq: null, description: "Entertain with well-told stories, epic poems, or dramatic recitations." },
    { name: "Kindly Requests", ability: "charm", id: "skillPersuasion", cost: 1, levelReq: 1, prereq: null, description: "Influence with tact, reason, and good Hobbit-nature." },
    { name: "Pocketing Biscuits", ability: "agility", id: "skillSleightOfHand", cost: 1, levelReq: 1, prereq: null, description: "Perform acts of manual dexterity, subtly take an extra biscuit." },
    { name: "Delicate Picking", ability: "agility", id: "skillSleightDelicate", cost: 1, levelReq: 1, prereq: null, description: "Perform acts of manual dexterity like picking pockets or manipulating small objects unseen." },
    { name: "Quiet Movement & Hiding", ability: "agility", id: "skillStealth", cost: 1, levelReq: 1, prereq: null, description: "Move without being noticed, hide effectively behind barrels or in tall grass." },
    { name: "Mushroom Finding & Foraging", ability: "spirit", id: "skillSurvival", cost: 1, levelReq: 1, prereq: null, description: "Track, forage for edible plants (especially mushrooms), and find shelter in the wild." },

    // --- Tier 2: Developing Hobbit Skills ---
    { name: "Expert Cooking (Brewing Focus)", ability: "wits", id: "skillExpertCooking", cost: 2, levelReq: 2, prereq: "skillNature", description: "Prepare exceptionally satisfying meals or simple brews that may grant minor temporary boons (e.g., +1 to Fortitude for an hour)." }, // Modified for Brewer
    { name: "Advanced First Aid", ability: "spirit", id: "skillAdvancedMedicine", cost: 2, levelReq: 3, prereq: "skillMedicine", description: "Craft more effective herbal remedies; can treat minor diseases or remove simple poisons with a successful check." },
    { name: "Trap Disarming", ability: "agility", id: "skillTrapDisarm", cost: 2, levelReq: 3, prereq: "skillSleightOfHand", description: "Identify and safely disable simple mechanical traps or snares." },
    { name: "Quick Fingers", ability: "agility", id: "skillQuickFingers", cost: 2, levelReq: 4, prereq: "skillSleightOfHand", description: "Once per short rest, gain advantage on one Sleight of Hand check." },
    { name: "Hearty Constitution", ability: "sturdiness", id: "skillHeartyCon", cost: 2, levelReq: 2, prereq: null, description: "Once per long rest, gain advantage on one saving throw against poison or disease." },
    { name: "Surefooted", ability: "agility", id: "skillSurefooted", cost: 1, levelReq: 2, prereq: "skillAcrobatics", description: "Difficult terrain from natural sources (mud, roots) doesn't halve your speed." },
    { name: "Pipeweed Connoisseur", ability: "wits", id: "skillPipeweed", cost: 1, levelReq: 2, prereq: null, description: "Identify quality pipeweed. Sharing good pipeweed can grant advantage on a Charm-based check with another Hobbit once per day." },
    { name: "Fast Talker", ability: "charm", id: "skillFastTalker", cost: 2, levelReq: 3, prereq: "skillDeception", description: "Once per long rest, talk your way out of a minor non-violent confrontation with a successful Charm (Deception) check." },
    { name: "Simple Lockpicking", ability: "agility", id: "skillLockpickingSimple", cost: 2, levelReq: 2, prereq: "skillSleightDelicate", description: "Open simple locks using Thieves' Tools." },
    { name: "Herbalism & Cultivation", ability: "wits", id: "skillHerbalismCultivation", cost: 2, levelReq: 2, prereq: "skillNature", description: "Identify, gather, and cultivate useful herbs and plants for food, medicine, or other simple uses." },
    { name: "Tracking & Pathfinding", ability: "spirit", id: "skillTrackingPathfinding", cost: 2, levelReq: 3, prereq: "skillSurvival", description: "Follow tracks, navigate through wilderness, and find hidden paths or trails." },
    { name: "Object Lore", ability: "wits", id: "skillObjectLore", cost: 1, levelReq: 2, prereq: "skillHistory", description: "Recall information about the history, origin, or common uses of mundane objects." },
    { name: "Comforting Care", ability: "spirit", id: "skillComfortingCare", cost: 1, levelReq: 2, prereq: "skillMedicine", description: "Tend to the sick or injured, providing comfort and improving their spirits, aiding natural recovery." },
    { name: "Burglar's Eye for Detail", ability: "wits", id: "skillBurglarDetail", cost: 1, levelReq: 2, prereq: "skillInvestigation", description: "Advantage on Wits (Investigation) checks to spot hidden mechanisms, small valuables, or subtle clues often missed by others. (Burglar Themed)" },
    { name: "Waybread Wisdom", ability: "spirit", id: "skillWaybreadWisdom", cost: 1, levelReq: 2, prereq: "skillExpertCooking", description: "You know the secret to making your baked goods last longer and taste better on the road. (Waybread Baker Themed)" },
    // New Brewer Skills - Tier 2
    { name: "Basic Brewing", ability: "wits", id: "skillBasicBrewing", cost: 2, levelReq: 2, prereq: "skillExpertCooking", description: "You can use Brewer's Supplies to create simple ales and ciders. Your brews are refreshing and well-liked. (Brewer Themed)" },
    { name: "Ingredient Savvy", ability: "wits", id: "skillIngredientSavvy", cost: 1, levelReq: 3, prereq: "skillNature", description: "You have a knack for finding or identifying quality ingredients for brewing, even in unusual places. Advantage on checks to forage for brewing components. (Brewer Themed)" },


    // --- Tier 3: Accomplished Hobbit Skills ---
    { name: "Shire Lore Master", ability: "wits", id: "skillLoreMaster", cost: 3, levelReq: 5, prereq: "skillHistory", description: "Become an expert in Hobbit tales, genealogies, and ancient boundaries. Gain advantage on related History checks." },
    { name: "Master Gardener", ability: "wits", id: "skillMasterGardener", cost: 2, levelReq: 4, prereq: "skillHerbalismCultivation", description: "Can identify rare herbs and cultivate plants that might have minor beneficial properties (DM's discretion). (Gardener Themed)" },
    { name: "Unseen Passage", ability: "agility", id: "skillUnseenPassage", cost: 3, levelReq: 5, prereq: "skillStealth", description: "When you successfully Hide, you remain hidden even if you move up to half your speed, as long as you remain lightly obscured." },
    { name: "Hobbit Rally", ability: "spirit", id: "skillHobbitBravery", cost: 2, levelReq: 4, prereq: "skillPersuasion", description: "Once per long rest, as an action, give an inspiring word to an ally. They gain advantage on their next attack roll or saving throw." },
    { name: "Second Breakfast Endurance", ability: "sturdiness", id: "skillSecondBreakfast", cost: 3, levelReq: 5, prereq: "skillHeartyCon", description: "Once per day, after a short rest, regain an additional 1d6 Fortitude." },
    { name: "Average Lockpicking", ability: "agility", id: "skillLockpickingAverage", cost: 3, levelReq: 5, prereq: "skillLockpickingSimple", description: "Open locks of average complexity using Thieves' Tools. (Burglar Themed)" },
    { name: "Silent Approach", ability: "agility", id: "skillSilentApproach", cost: 2, levelReq: 4, prereq: "skillStealth", description: "You have advantage on Dexterity (Stealth) checks made to move silently." },
    { name: "Herbal Infusion", ability: "spirit", id: "skillHerbalInfusion", cost: 2, levelReq: 4, prereq: "skillHerbalismCultivation", description: "With 10 minutes and your Herbalism Kit, create a tea that grants resistance to poison for 1 hour to one creature. (Gardener Themed)" },
    { name: "Inspiring Speech", ability: "charm", id: "skillInspiringSpeech", cost: 2, levelReq: 4, prereq: "skillPerformanceTales", description: "Once per long rest, give a short speech to bolster your allies. Up to three allies who hear you gain advantage on their next attack roll or ability check within the next minute. (Storykeeper Themed)" },
    { name: "Trapfinding", ability: "wits", id: "skillTrapfinding", cost: 2, levelReq: 4, prereq: "skillInvestigation", description: "You have advantage on Wisdom (Perception) or Wits (Investigation) checks to find hidden traps. (Mathom-Finder/Burglar Themed)" },
    { name: "Watchful Gaze", ability: "spirit", id: "skillWatchfulGaze", cost: 2, levelReq: 3, prereq: "skillPerception", description: "You can use your action to focus your senses. For the next minute, you have advantage on Wisdom (Perception) checks that rely on sight. (Watchwarden Themed)" },
    {
        name: "Precise Striker",
        ability: "agility",
        id: "skillPreciseStrikerFinesse",
        cost: 2,
        levelReq: 5,
        prereq: "skillSleightDelicate",
        description: "Your deft movements allow for more accurate strikes with light weapons.",
        effects: [
            { type: "skill_attack_bonus_weapon_property", property: "finesse", value: 1, details: "+1 Atk with Finesse weapons" }
        ]
    },
    {
        name: "Giant Feller",
        ability: "brawn",
        id: "skillGiantFeller",
        cost: 2,
        levelReq: 6,
        prereq: "skillAthletics",
        description: "You know how to hit big creatures where it hurts.",
        effects: [
            { type: "skill_damage_bonus_target_size", target_size: "large", value: 2, details: "+2 Dmg vs Large creatures" }
        ]
    },
    // New Brewer Skills - Tier 3
    { name: "Hearty Brews", ability: "spirit", id: "skillHeartyBrews", cost: 2, levelReq: 5, prereq: "skillBasicBrewing", description: "Your brews are exceptionally fortifying. When allies consume a brew you made (via Hearty Toast or similar), they gain an additional 1d4 temporary Fortitude. (Brewer Themed)" },
    { name: "Connoisseur's Nose", ability: "wits", id: "skillConnoisseurNose", cost: 1, levelReq: 4, prereq: "skillBasicBrewing", description: "You can identify common and uncommon beverages by scent alone and can often tell if a drink is poisoned or tainted with a successful Wits (Investigation) check. (Brewer Themed)" },


    // --- Tier 4: Truly Remarkable Hobbit Skills ---
    { name: "Legendary Storyteller", ability: "charm", id: "skillLegendaryStoryteller", cost: 3, levelReq: 7, prereq: "skillPerformance", description: "Your tales are so captivating they can hold the attention of a small group for an extended period, potentially distracting them or making them more amicable." },
    { name: "Simple Master of Disguise", ability: "charm", id: "skillMasterDisguise", cost: 2, levelReq: 6, prereq: "skillDeception", description: "You are adept at creating simple disguises using common items to appear as another (similarly sized) commoner." },
    { name: "Tunnel Sense", ability: "wits", id: "skillTunnelSense", cost: 3, levelReq: 6, prereq: "skillInvestigation", description: "You have an uncanny sense for underground spaces, gaining advantage on checks to navigate tunnels or detect structural weaknesses." },
    { name: "Nearly Unseen Stealth", ability: "agility", id: "skillMasterStealth", cost: 3, levelReq: 7, prereq: "skillSilentApproach", description: "You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena." },
    { name: "Legendary Recipes (and Brews)", ability: "wits", id: "skillLegendaryRecipes", cost: 3, levelReq: 6, prereq: "skillExpertCooking", description: "You can create food or brews that provide significant, though temporary, benefits, such as notable healing or short-term buffs (DM's discretion, requires rare ingredients). (Waybread Baker/Brewer Themed)" }, // Modified for Brewer
    { name: "Master Tracker", ability: "spirit", id: "skillMasterTracker", cost: 3, levelReq: 7, prereq: "skillTrackingPathfinding", description: "You can track creatures across difficult terrain or in poor conditions with remarkable accuracy. You learn their exact number, sizes, and how long ago they passed through an area. (Watchwarden Themed)" },
    { name: "Riveting Narrative", ability: "charm", id: "skillRivetingNarrative", cost: 3, levelReq: 6, prereq: "skillInspiringSpeech", description: "As an action, you can tell such a compelling story that one hostile creature within 30ft who can hear and understand you must make a Spirit saving throw (DC 8 + your proficiency bonus + Charm mod). On a failure, it is charmed by you for 1 minute or until it takes damage. (Storykeeper Themed)" },
    { name: "Mathom Lore", ability: "wits", id: "skillMathomLore", cost: 2, levelReq: 5, prereq: "skillObjectLore", description: "You can spend 10 minutes examining a non-magical object to learn its approximate age, origin, and any significant historical events it might have been involved in (DM's discretion). (Mathom-Finder Themed)" },
    {
        name: "Master Archer",
        ability: "agility",
        id: "skillMasterArcher",
        cost: 3,
        levelReq: 7,
        prereq: "skillWatchfulGaze", 
        description: "Your skill with bows is legendary among Hobbits.",
        effects: [
            { type: "skill_attack_bonus_weapon_category", category: "bow", value: 1, details: "+1 Atk with Bows" },
            { type: "skill_damage_bonus_weapon_category", category: "bow", value: 1, details: "+1 Dmg with Bows" }
        ]
    },
    // New Brewer Skill - Tier 4
    { name: "Master Brewer's Touch", ability: "wits", id: "skillMasterBrewerTouch", cost: 3, levelReq: 7, prereq: "skillHeartyBrews", description: "You can craft truly exceptional beverages. Once per long rest, create a special brew that grants up to 3 creatures who drink it advantage on their next saving throw against fear or charm effects for 1 hour. (Brewer Themed)" }
];
