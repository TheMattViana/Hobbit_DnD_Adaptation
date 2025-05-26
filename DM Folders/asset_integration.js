// asset_integration.js - Adds asset integration to the Hobbit Adventures webapp

// Skill icon mapping based on skill types
const SKILL_ICON_MAPPING = {
    // Nature and outdoor skills
    "skillNature": "images/forest_tree.png",
    "skillSurvival": "images/mushrooms.png",
    "skillHerbalismCultivation": "images/forest_tree.png",
    "skillMasterGardener": "images/forest_tree.png",
    "skillTrackingPathfinding": "images/mountain.png",
    "skillMasterTracker": "images/mountain.png",
    "skillIngredientSavvy": "images/mushrooms.png", // Brewer skill
    
    // Food and social skills
    "skillExpertCooking": "images/lembas_bread.png", // Also used as prereq for brewings
    "skillWaybreadWisdom": "images/lembas_bread.png",
    "skillLegendaryRecipes": "images/lembas_bread.png", // Can include brews
    "skillPersuasion": "images/ale_mug.png",
    "skillPerformance": "images/ale_mug.png",
    "skillBasicBrewing": "images/ale_mug.png", // Brewer skill
    "skillHeartyBrews": "images/ale_mug.png", // Brewer skill
    "skillConnoisseurNose": "images/ale_mug.png", // Brewer skill
    "skillMasterBrewerTouch": "images/ale_mug.png", // Brewer skill
    
    // Combat and weapon skills
    "skillAthletics": "images/sting_sword.png",
    "skillPreciseStrikerFinesse": "images/sting_sword.png",
    "skillGiantFeller": "images/sting_sword.png",
    "skillMasterArcher": "images/elf_archer.png",
    
    // Magic and wisdom skills
    "skillHistoryAncient": "images/wizard_staff.png",
    "skillLoreMaster": "images/wizard_staff.png",
    "skillRivetingNarrative": "images/wizard_staff.png",
    
    // Stealth and burglary skills
    "skillStealth": "images/one_ring.png",
    "skillSleightOfHand": "images/one_ring.png",
    "skillUnseenPassage": "images/one_ring.png",
    "skillMasterStealth": "images/one_ring.png"
};

// Calling/profession icon mapping
const CALLING_ICON_MAPPING = {
    "bounder": "images/sting_sword.png",
    "hearthfriend": "images/ale_mug.png",
    "tunnelrat": "images/hobbit_hole.png",
    "gaffer": "images/wizard_staff.png",
    "wanderer": "images/mountain.png",
    "burglar": "images/one_ring.png",
    "gardener": "images/forest_tree.png",
    "storykeeper": "images/lembas_bread.png",
    "watchwarden": "images/elf_archer.png",
    "mathomfinder": "images/one_ring.png",
    "waybreadbaker": "images/lembas_bread.png",
    "brewer": "images/ale_mug.png", 
    "other": "images/hobbit_idle.png" 
};

// Weapon icon mapping
const WEAPON_ICON_MAPPING = {
    "Short Sword": "images/sting_sword.png",
    "Quarterstaff": "images/wizard_staff.png",
    "Bow": "images/elf_archer.png",
    "Shortbow": "images/elf_archer.png",
    "Club": "images/dwarf_warrior.png", 
    "Mug": "images/ale_mug.png" 
};

// Add skill icons to skill items
function addSkillIcons() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkillIcons);
    } else {
        initSkillIcons();
    }
}

function initSkillIcons() {
    const skillsContainer = document.getElementById('skillsList');
    if (skillsContainer) {
        addIconsToSkillItems(); // Initial call
        const observer = new MutationObserver(function(mutations) {
            // Only re-run if skill items themselves are added/removed,
            // or if their direct children change in a way that might remove an icon.
            // For simplicity, we run it, but addIconsToSkillItems is idempotent.
            addIconsToSkillItems();
        });
        observer.observe(skillsContainer, { childList: true, subtree: true });
    }
}

function addIconsToSkillItems() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        if (item.querySelector('.skill-icon')) return; // Already has an icon
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            const skillId = checkbox.id.replace('Prof', '');
            if (SKILL_ICON_MAPPING[skillId]) {
                const icon = document.createElement('img');
                icon.src = SKILL_ICON_MAPPING[skillId];
                icon.className = 'skill-icon';
                icon.alt = ''; 
                icon.onerror = function() { this.style.display='none'; };
                item.appendChild(icon);
            }
        }
    });
}

// Add weapon icons to combat section
function addWeaponIcons() {
    const attackRows = document.querySelectorAll('#attacksTableBody tr');
    attackRows.forEach(row => {
        if (row.querySelector('th')) return; // Skip header
        const weaponNameCell = row.querySelector('td:first-child');
        if (weaponNameCell) {
            const existingIcon = weaponNameCell.querySelector('.combat-weapon-icon');
            if (existingIcon) existingIcon.remove(); // Remove old before adding new

            const weaponName = weaponNameCell.textContent.trim();
            let iconPath = null;
            for (const [type, path] of Object.entries(WEAPON_ICON_MAPPING)) {
                if (weaponName.toLowerCase().includes(type.toLowerCase())) {
                    iconPath = path;
                    break;
                }
            }
            if (iconPath) {
                const icon = document.createElement('img');
                icon.src = iconPath;
                icon.className = 'combat-weapon-icon';
                icon.alt = '';
                icon.onerror = function() { this.style.display='none'; };
                weaponNameCell.prepend(icon);
            }
        }
    });
}

// Add calling/profession icon
// This function is now primarily called by script.js after profession selection.
function addCallingIcon() {
    const callingSelect = document.getElementById('professionSelect'); 
    if (!callingSelect) return;

    const iconContainer = callingSelect.parentElement; 
    if (!iconContainer || !iconContainer.classList.contains('flex')) return;

    const existingIcon = iconContainer.querySelector('.calling-icon');
    if (existingIcon) existingIcon.remove();

    const callingValue = callingSelect.value;
    if (!callingValue) return; 
    
    const callingIconPath = CALLING_ICON_MAPPING[callingValue] || "images/hobbit_idle.png"; 

    const icon = document.createElement('img');
    icon.src = callingIconPath;
    icon.className = 'calling-icon h-8 w-8 ml-2 object-contain'; 
    icon.alt = `${callingValue} icon`;
    icon.onerror = function() { this.style.display='none'; };
    iconContainer.appendChild(icon); 
}


// Update character portrait with wooden frame
function updateCharacterPortrait() {
    const portraitContainer = document.querySelector('.character-portrait-container');
    if (portraitContainer) {
        portraitContainer.style.backgroundImage = "url('images/wooden_frame.png')";
    }
}

// Add wooden frames to UI sections
function addWoodenFramesToUI() {
    const sections = document.querySelectorAll('.section-hobbit-border');
    sections.forEach(section => {
        // Check if frame already applied to prevent re-applying by observer if not needed
        if (!section.classList.contains('wooden-frame-border')) {
            section.classList.add('wooden-frame-border'); 
        }
    });
}

// Add campfire to footer
function addCampfireToFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
        if (footer.querySelector('.footer-campfire')) return;
        const campfire = document.createElement('div');
        campfire.className = 'footer-campfire'; 
        footer.appendChild(campfire);
    }
}

// Add fireworks animation for critical hits
function setupFireworksAnimation() {
    document.addEventListener('diceRolled', function(e) {
        if (e.detail && e.detail.isCritical) {
            showFireworksAnimation();
        }
    });
}

function showFireworksAnimation() {
    const fireworks = document.createElement('div');
    fireworks.className = 'fireworks-animation'; 
    document.body.appendChild(fireworks);
    setTimeout(() => {
        fireworks.remove();
    }, 2000); 
}

// Initialize all asset integrations
function initAssetIntegration() {
    // Update JPG to PNG if available
    document.querySelectorAll('img[src$=".jpg"]').forEach(img => {
        const baseName = img.src.split('/').pop().replace('.jpg', '');
        const possiblePngPath = `images/${baseName}.png`;
        const testImg = new Image();
        testImg.onload = function() { 
            img.src = possiblePngPath;
        };
        testImg.src = possiblePngPath; 
    });
    
    addSkillIcons(); // Handles its own observer for skill list changes
    
    // More targeted observer for weapon icons if attacksTableBody changes
    const attacksTableObserver = new MutationObserver(function(mutations) {
        addWeaponIcons();
    });
    const attacksTableBody = document.getElementById('attacksTableBody');
    if (attacksTableBody) {
        attacksTableObserver.observe(attacksTableBody, { childList: true, subtree: true });
    }

    // General observer for less frequent, broader changes like wooden frames if sections are dynamically added/removed
    // For now, addWoodenFramesToUI is called once at init. If sections are truly dynamic, this might be needed.
    // const bodyObserver = new MutationObserver(function(mutations) {
    //     addWoodenFramesToUI(); // Example if sections were dynamic
    // });
    // bodyObserver.observe(document.body, { childList: true, subtree: true });


    updateCharacterPortrait(); // Apply frame to portrait container
    addWoodenFramesToUI(); // Apply frames to other designated sections
    addCampfireToFooter();
    setupFireworksAnimation(); 

    // Initial calls for elements present on load
    addWeaponIcons();
    addCallingIcon(); // Called once at init, then by script.js on profession change
}

// Run initialization when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAssetIntegration);
} else {
    initAssetIntegration(); 
}
