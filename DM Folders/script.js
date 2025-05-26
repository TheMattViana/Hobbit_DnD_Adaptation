// script.js for Hobbit Adventures Character Sheet (v7.1.5 - DM View Loading Fix & Minor Refinements)

// --- CONSTANTS AND DATA ---
const SHEET_VERSION = "7.1.5"; // Updated version
const LOCAL_STORAGE_KEY = `hobbitAdventureSheet_v${SHEET_VERSION}`;
const AUTO_SAVE_INTERVAL_MS = 60000;
const INITIAL_ABILITY_SCORE_POINTS = 7;
const MIN_BASE_ABILITY_SCORE = 8;
const MAX_ABILITY_SCORE_FROM_POINTS = 15;
const DM_VIEW_PLAYER_KEY = "DM_VIEW_PLAYER_DATA"; // Key for DM to view player sheets

// --- GLOBAL STATE VARIABLES ---
let characterState = {
    uiVisibility: { // To store visibility states of panels
        quickNotesArea: true,
        customDiceRollerFixed: true,
        diceRollerSectionFixed: true
    },
    abilities: {}, // Ensure abilities is an object
    baseAbilities: {}, // Ensure baseAbilities is an object
    savingThrowsProf: {}, // Ensure savingThrowsProf is an object
    learnedSkills: {}, // Ensure learnedSkills is an object
    professionAutoSkills: [], // Ensure professionAutoSkills is an array
    learnedProfessionAbilities: {}, // Ensure learnedProfessionAbilities is an object
    inventory: [], // Ensure inventory is an array
    customLearnedSkills: [] // Ensure customLearnedSkills is an array
};
let autoSaveTimer;
let attackRowCount = 0;
let masterItemList = [];

// --- UTILITY FUNCTIONS ---
function getElement(id) { return document.getElementById(id); }
function getValue(id) { const el = getElement(id); if (!el) return null; if (el.type === 'checkbox') return el.checked; if (el.type === 'number') return parseInt(el.value) || 0; return el.value; }
function setValue(id, value) { const el = getElement(id); if (!el) return; if (el.type === 'checkbox') el.checked = value; else el.value = value; }
function setHTML(id, html) { const el = getElement(id); if (el) el.innerHTML = html; }
function setText(id, text) { const el = getElement(id); if (el) el.textContent = text; }

// --- UI VISIBILITY TOGGLE ---
function toggleSectionVisibility(sectionId) {
    const section = getElement(sectionId);
    if (section) {
        section.classList.toggle('hidden');
        if (characterState.uiVisibility) { // Ensure uiVisibility object exists
            characterState.uiVisibility[sectionId] = !section.classList.contains('hidden');
            saveCharacterData(true); // Auto-save UI preference
        }
    }
}

function applyUIVisibility() {
    if (characterState.uiVisibility) {
        for (const sectionId in characterState.uiVisibility) {
            const section = getElement(sectionId);
            if (section) {
                if (characterState.uiVisibility[sectionId]) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            }
        }
    } else { // Default to visible if not set
        characterState.uiVisibility = {
            quickNotesArea: true,
            customDiceRollerFixed: true,
            diceRollerSectionFixed: true
        };
        applyUIVisibility(); // Re-apply with defaults
    }
}


// --- ABILITY SCORE POINT MANAGEMENT ---
function updateAbilityScorePointsDisplay() {
    setText('abilityScorePointsAvailable', characterState.abilityPointsAvailable || 0);
    ['brawn', 'agility', 'sturdiness', 'wits', 'spirit', 'charm'].forEach(id => {
        const abilityScoreInput = getElement(id);
        if (abilityScoreInput) {
             abilityScoreInput.value = characterState.abilities[id] || MIN_BASE_ABILITY_SCORE;
        }
        updateAbilityScoreDisplay(id);
    });
}

function spendAbilityPoint(abilityId) {
    if (characterState.abilityPointsAvailable > 0) {
        if ((characterState.abilities[abilityId] || MIN_BASE_ABILITY_SCORE) < MAX_ABILITY_SCORE_FROM_POINTS) {
            characterState.abilities[abilityId] = (characterState.abilities[abilityId] || MIN_BASE_ABILITY_SCORE) + 1;
            characterState.abilityPointsAvailable--;
            updateAllCalculations(false);
            updateAbilityScorePointsDisplay();
            saveCharacterData(true);
        } else {
            alert(`You cannot raise ${abilityId} above ${MAX_ABILITY_SCORE_FROM_POINTS} using ability points.`);
        }
    } else {
        alert("No ability score points available to spend.");
    }
}

function unspendAbilityPoint(abilityId) {
    const currentScore = characterState.abilities[abilityId] || MIN_BASE_ABILITY_SCORE;
    if (currentScore > (characterState.baseAbilities ? characterState.baseAbilities[abilityId] : MIN_BASE_ABILITY_SCORE)) {
        characterState.abilities[abilityId]--;
        characterState.abilityPointsAvailable++;
        updateAllCalculations(false);
        updateAbilityScorePointsDisplay();
        saveCharacterData(true);
    } else {
        alert(`Cannot reduce ${abilityId} below its base score of ${characterState.baseAbilities ? characterState.baseAbilities[abilityId] : MIN_BASE_ABILITY_SCORE}.`);
    }
}


// --- CORE CALCULATIONS & UI UPDATES ---
function calculateModifier(score) { return Math.floor((score - 10) / 2); }
function getProficiencyBonus() { const level = characterState.level || 1; if (level >= 17) return 6; if (level >= 13) return 5; if (level >= 9) return 4; if (level >= 5) return 3; return 2; }
function updateProficiencyBonusDisplay() { setText('proficiencyBonus', `+${getProficiencyBonus()}`); }

function getAbilityScoreTotal(abilityId) {
    let effectiveBaseScore = (characterState.abilities && characterState.abilities[abilityId]) ? characterState.abilities[abilityId] : MIN_BASE_ABILITY_SCORE;
    let itemBonus = 0;
    if (characterState.inventory && Array.isArray(characterState.inventory)) {
        characterState.inventory.forEach(itemInstance => {
            if (itemInstance.equipped && itemInstance.effects) {
                itemInstance.effects.forEach(effect => {
                    if (effect.type === "stat_bonus" && effect.stat === abilityId) {
                        itemBonus += (effect.value || 0);
                    }
                });
            }
        });
    }
    return effectiveBaseScore + itemBonus;
}

function updateAbilityScoreDisplay(abilityId) {
    const scoreWithSpentPoints = (characterState.abilities && characterState.abilities[abilityId]) ? characterState.abilities[abilityId] : MIN_BASE_ABILITY_SCORE;
    setValue(abilityId, scoreWithSpentPoints);

    const totalScoreWithItems = getAbilityScoreTotal(abilityId);
    const modifier = calculateModifier(totalScoreWithItems);

    setText(`${abilityId}Mod`, `Mod: ${(modifier >= 0 ? '+' : '')}${modifier}`);
    setText(`${abilityId}Total`, totalScoreWithItems);
}

function updateAllAbilityModifiers() {
    ['brawn', 'agility', 'sturdiness', 'wits', 'spirit', 'charm'].forEach(id => {
        updateAbilityScoreDisplay(id);
    });
}

function updateSavingThrowsDisplay() {
    const profBonus = getProficiencyBonus();
    ['Brawn', 'Agility', 'Sturdiness', 'Wits', 'Spirit', 'Charm'].forEach(saveName => {
        const abilityKey = saveName.toLowerCase();
        const totalAbilityScore = getAbilityScoreTotal(abilityKey);
        const abilityMod = calculateModifier(totalAbilityScore);
        const isProficient = (characterState.savingThrowsProf && characterState.savingThrowsProf[`save${saveName}Prof`]) || false;
        let totalBonus = abilityMod + (isProficient ? profBonus : 0);
        if (characterState.inventory && Array.isArray(characterState.inventory)) {
            characterState.inventory.forEach(itemInstance => {
                if (itemInstance.equipped && itemInstance.effects) {
                    itemInstance.effects.forEach(effect => {
                        if (effect.type === "saving_throw_bonus" && effect.save === abilityKey) totalBonus += (effect.value || 0);
                    });
                }
            });
        }
        setText(`save${saveName}Value`, (totalBonus >= 0 ? '+' : '') + totalBonus);
    });
}

function updateInitiativeDisplay() {
    const totalAgility = getAbilityScoreTotal('agility');
    const agilityMod = calculateModifier(totalAgility);
    let initiativeBonus = agilityMod;
    if (characterState.inventory && Array.isArray(characterState.inventory)) {
        characterState.inventory.forEach(itemInstance => {
            if (itemInstance.equipped && itemInstance.effects) {
                itemInstance.effects.forEach(effect => {
                    if (effect.type === "initiative_bonus") initiativeBonus += (effect.value || 0);
                });
            }
        });
    }
    setText('initiative', (initiativeBonus >= 0 ? '+' : '') + initiativeBonus);
}

function updateSkillsDisplayValues() {
    setValue('skillPointsDisplay', characterState.currentCharacterSkillPoints || 0);
    setValue('manualSkillPointsInput', characterState.currentCharacterSkillPoints || 0);

    SKILLS_DATA.forEach(skill => {
        const skillCheckbox = getElement(`${skill.id}Prof`);
        if (skillCheckbox) {
            const isProficient = skillCheckbox.checked;
            const totalAbilityScoreForSkill = getAbilityScoreTotal(skill.ability);
            const abilityMod = calculateModifier(totalAbilityScoreForSkill);
            let skillBonus = abilityMod + (isProficient ? getProficiencyBonus() : 0);
            if (characterState.inventory && Array.isArray(characterState.inventory)) {
                characterState.inventory.forEach(itemInstance => {
                    if (itemInstance.equipped && itemInstance.effects) {
                        itemInstance.effects.forEach(effect => {
                            if (effect.type === "skill_bonus" && effect.skill_id === skill.id) skillBonus += (effect.value || 0);
                        });
                    }
                });
            }
            const valueSpan = getElement(`${skill.id}Value`);
            if (valueSpan) valueSpan.textContent = (skillBonus >= 0 ? '+' : '') + skillBonus;
        }
    });
    renderCustomSkillsList();
}

function applyManualSkillPoints() {
    const manualPoints = getValue('manualSkillPointsInput');
    if (manualPoints !== null && !isNaN(manualPoints)) {
        characterState.currentCharacterSkillPoints = manualPoints;
        updateSkillsDisplayValues();
        saveCharacterData(true);
        logDiceRoll('System', 'Skill Points Manually Adjusted', `New total: ${manualPoints}`);
    } else {
        alert("Invalid number for skill points.");
    }
}


// --- SKILL DISPLAY ---
function populateSkillsList() {
    const skillsListContainer = getElement('skillsList');
    if (!skillsListContainer) return;
    skillsListContainer.innerHTML = '';
    const charLevel = characterState.level || 1;
    const skillsByLevel = SKILLS_DATA.reduce((acc, skill) => {
        const level = skill.levelReq;
        if (!acc[level]) acc[level] = [];
        acc[level].push(skill);
        return acc;
    }, {});

    Object.keys(skillsByLevel).sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
        const tierDiv = document.createElement('div');
        tierDiv.className = 'skill-tier mb-4';
        tierDiv.innerHTML = `<h5 class="skill-tier-title">Tier ${level} Skills (Level ${level} Required)</h5>`;
        const tierContentDiv = document.createElement('div');
        tierContentDiv.className = 'skill-tier-content';

        skillsByLevel[level].sort((a, b) => a.name.localeCompare(b.name)).forEach(skill => {
            const skillWrapper = document.createElement('div');
            skillWrapper.className = 'skill-item p-3 border-2 border-hobbit-brown/30 rounded-md bg-hobbit-parchment/50 shadow-sm hover:border-hobbit-gold transition-colors duration-150';
            const isLearned = !!(characterState.learnedSkills && characterState.learnedSkills[skill.id]);
            const isAutoGranted = characterState.professionAutoSkills && characterState.professionAutoSkills.includes(skill.id);
            const isLockedByLevel = charLevel < skill.levelReq && !isLearned && !isAutoGranted;
            const isLockedByPrereq = skill.prereq && !(characterState.learnedSkills && characterState.learnedSkills[skill.prereq]) && !isLearned && !isAutoGranted;
            const isLocked = isLockedByLevel || isLockedByPrereq;

            if (isLearned) skillWrapper.classList.add('maxed');
            if (isAutoGranted) skillWrapper.classList.add('auto-granted');
            if (isLocked && !isLearned && !isAutoGranted) skillWrapper.classList.add('locked');

            let nameLabelHTML = `<label for="${skill.id}Prof" class="text-hobbit-brown font-semibold cursor-pointer">${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})</label>`;
            if (isAutoGranted) nameLabelHTML += ` <span class="text-xs text-hobbit-green italic">(Calling)</span>`;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.id = `${skill.id}Prof`;
            checkbox.className = 'skill-prof-checkbox form-checkbox h-4 w-4 text-hobbit-green rounded focus:ring-hobbit-green ml-2 align-middle';
            checkbox.onchange = () => handleSkillLearnToggle(skill.id, skill.cost);
            checkbox.checked = isLearned; checkbox.disabled = isLocked || isAutoGranted;

            const valueSpan = document.createElement('span');
            valueSpan.id = `${skill.id}Value`; valueSpan.className = 'font-bold text-hobbit-green float-right';
            const totalAbilityScoreForSkill = getAbilityScoreTotal(skill.ability);
            const abilityMod = calculateModifier(totalAbilityScoreForSkill);
            const totalSkillBonus = abilityMod + (isLearned ? getProficiencyBonus() : 0);
            valueSpan.textContent = (totalSkillBonus >= 0 ? '+' : '') + totalSkillBonus;

            const infoDiv = document.createElement('div');
            infoDiv.className = 'text-xs text-gray-700 mt-1 clear-both';
            let infoText = `<span class="skill-cost-level">Cost: ${skill.cost} SP</span>`;
            if (skill.prereq) { const prereqSkill = SKILLS_DATA.find(s => s.id === skill.prereq); infoText += `<br><span class="skill-prereq">Requires: ${prereqSkill ? prereqSkill.name : 'Unknown'}</span>`; }
            infoDiv.innerHTML = `${infoText}<br><em class="skill-description">${skill.description || ""}</em>`;
            if (skill.effects) {
                let effectsHTML = '<br><span class="text-xs text-hobbit-green italic">Effects: ';
                effectsHTML += skill.effects.map(eff => eff.details || eff.type).join(', ');
                effectsHTML += '</span>';
                infoDiv.innerHTML += effectsHTML;
            }
            if (isLockedByLevel && !isLearned && !isAutoGranted) infoDiv.innerHTML += ` <span class="text-red-600 font-semibold">(Level ${skill.levelReq} required)</span>`;
            else if (isLockedByPrereq && !isLearned && !isAutoGranted) infoDiv.innerHTML += ` <span class="text-red-600 font-semibold">(Prerequisite not met)</span>`;


            const rollButton = document.createElement('button');
            rollButton.textContent = 'Roll'; rollButton.className = 'button-hobbit-base button-hobbit-action text-xs py-0.5 px-2 ml-2 mt-1';
            rollButton.onclick = () => rollSkill(skill.ability, `${skill.id}Prof`, skill.name, skill.id);
            rollButton.disabled = !isLearned;

            const topPart = document.createElement('div');
            topPart.className = 'flex justify-between items-center';
            const labelAndCheckbox = document.createElement('div');
            labelAndCheckbox.innerHTML = nameLabelHTML; labelAndCheckbox.appendChild(checkbox);
            topPart.appendChild(labelAndCheckbox); topPart.appendChild(valueSpan);
            skillWrapper.appendChild(topPart); skillWrapper.appendChild(infoDiv); skillWrapper.appendChild(rollButton);
            tierContentDiv.appendChild(skillWrapper);
        });
        tierDiv.appendChild(tierContentDiv);
        skillsListContainer.appendChild(tierDiv);
    });
    renderCustomSkillsList();
    updateSkillsDisplayValues();
}

function handleSkillLearnToggle(skillId, cost) {
    const skill = SKILLS_DATA.find(s => s.id === skillId); if (!skill) return;
    const charLevel = characterState.level || 1;
    if (!characterState.learnedSkills) characterState.learnedSkills = {}; // Ensure initialized
    const isCurrentlyLearned = !!characterState.learnedSkills[skill.id];
    const checkbox = getElement(`${skill.id}Prof`);

    if (!isCurrentlyLearned) {
        if (charLevel < skill.levelReq) { alert("Character level too low for this skill."); if(checkbox) checkbox.checked = false; return; }
        if (skill.prereq && !(characterState.learnedSkills && characterState.learnedSkills[skill.prereq])) { alert(`Prerequisite skill "${SKILLS_DATA.find(s => s.id === skill.prereq)?.name || 'Unknown'}" not learned.`); if(checkbox) checkbox.checked = false; return; }
        if (characterState.currentCharacterSkillPoints >= cost) { characterState.currentCharacterSkillPoints -= cost; characterState.learnedSkills[skill.id] = true; }
        else { alert("Not enough Skill Points!"); if(checkbox) checkbox.checked = false; return; }
    } else {
        if (characterState.professionAutoSkills && characterState.professionAutoSkills.includes(skill.id)) { alert(`Cannot unlearn "${skill.name}" as it is automatically granted by your Calling.`); if(checkbox) checkbox.checked = true; return; }
        const isPrereqForOthers = SKILLS_DATA.some(s => s.prereq === skillId && characterState.learnedSkills && characterState.learnedSkills[s.id]);
        if (isPrereqForOthers) { alert(`Cannot unlearn "${skill.name}" as it's a prerequisite for other learned skills. Unlearn those first.`); if(checkbox) checkbox.checked = true; return; }
        characterState.currentCharacterSkillPoints += cost; delete characterState.learnedSkills[skill.id];
    }
    updateAllCalculations(false); updateSkillsDisplayValues();
    const rollButton = checkbox.closest('.skill-item').querySelector('button');
    if (rollButton) rollButton.disabled = !characterState.learnedSkills[skill.id];
}

function addCustomLearnedSkill() {
    const name = prompt("Enter custom skill name:");
    if (!name) return;
    const abilityOptions = ['brawn', 'agility', 'sturdiness', 'wits', 'spirit', 'charm'];
    const ability = prompt(`Enter associated ability (${abilityOptions.join(', ')}):`)?.toLowerCase();
    if (!ability || !abilityOptions.includes(ability)) {
        alert("Invalid ability selected.");
        return;
    }
    const description = prompt("Enter skill description:");

    if (!characterState.customLearnedSkills) {
        characterState.customLearnedSkills = [];
    }
    const customSkillId = `customskill_${Date.now()}`;
    characterState.customLearnedSkills.push({
        id: customSkillId,
        name: name,
        ability: ability,
        description: description || "Custom skill.",
        isCustom: true
    });
    logDiceRoll('System', `Custom Skill Added: ${name}`, `Ability: ${ability.toUpperCase()}`);
    renderCustomSkillsList();
    saveCharacterData(true);
}

function renderCustomSkillsList() {
    const customSkillsContainer = getElement('customSkillsList');
    if (!customSkillsContainer) return;
    customSkillsContainer.innerHTML = '';

    if (characterState.customLearnedSkills && characterState.customLearnedSkills.length > 0) {
        const header = document.createElement('h5');
        header.className = 'skill-tier-title mt-4';
        header.textContent = 'Custom Learned Skills';
        customSkillsContainer.appendChild(header);

        const listContentDiv = document.createElement('div');
        listContentDiv.className = 'skill-tier-content';

        characterState.customLearnedSkills.forEach(skill => {
            const skillWrapper = document.createElement('div');
            skillWrapper.className = 'skill-item p-3 border-2 border-hobbit-gold/50 rounded-md bg-hobbit-parchment/60 shadow-sm custom-skill-item';

            const totalAbilityScoreForSkill = getAbilityScoreTotal(skill.ability);
            const abilityMod = calculateModifier(totalAbilityScoreForSkill);
            const skillBonus = abilityMod + getProficiencyBonus();

            skillWrapper.innerHTML = `
                <div class="flex justify-between items-center">
                    <strong class="text-hobbit-brown">${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})</strong>
                    <span class="font-bold text-hobbit-green">${(skillBonus >= 0 ? '+' : '')}${skillBonus}</span>
                </div>
                <p class="text-xs text-gray-700 mt-1">${skill.description}</p>
                <button onclick="rollSkill('${skill.ability}', null, '${skill.name}', '${skill.id}', true)" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-2 mt-1">Roll</button>
                <button onclick="removeCustomSkill('${skill.id}')" class="button-hobbit-base button-hobbit-clear text-xs py-0.5 px-1.5 ml-1">Remove</button>
            `;
            listContentDiv.appendChild(skillWrapper);
        });
        customSkillsContainer.appendChild(listContentDiv);
    }
}

function removeCustomSkill(skillIdToRemove) {
    if (characterState.customLearnedSkills) {
        characterState.customLearnedSkills = characterState.customLearnedSkills.filter(skill => skill.id !== skillIdToRemove);
        renderCustomSkillsList();
        saveCharacterData(true);
        logDiceRoll('System', `Custom Skill Removed.`, `ID: ${skillIdToRemove}`);
    }
}


function updateAllCalculations(fullRecalculateFromInputs = false) {
    updateAllAbilityModifiers();
    updateProficiencyBonusDisplay();
    updateSavingThrowsDisplay();
    updateInitiativeDisplay();
    updateSkillsDisplayValues();
    updateAllAttackBonuses();
    updateDefenseDisplay();
    updateMaxFortitudeDisplay();
    setText('professionAbilityPointsSpentDisplay', characterState.spentProfessionAbilityPoints || 0);
    updateAbilityScorePointsDisplay();
}

function handleLevelChange() {
    const newLevel = getValue('level');
    const oldLevel = characterState.level || 1;
    const levelDiff = newLevel - oldLevel;

    const witsMod = calculateModifier(getAbilityScoreTotal('wits'));
    const pointsPerLevelGained = Math.max(1, 2 + witsMod);
    characterState.currentCharacterSkillPoints = (characterState.currentCharacterSkillPoints || 0) + (levelDiff * pointsPerLevelGained);


    if (levelDiff > 0) {
        for (let lvl = oldLevel + 1; lvl <= newLevel; lvl++) {
            if (lvl === 3 || lvl === 6 || lvl === 9) {
                characterState.abilityPointsAvailable = (characterState.abilityPointsAvailable || 0) + 1;
                logDiceRoll('System', `Gained 1 Ability Score Point at level ${lvl}.`, '');
            }
        }
    } else if (levelDiff < 0) {
         for (let lvl = oldLevel; lvl > newLevel; lvl--) {
            if (lvl === 3 || lvl === 6 || lvl === 9) {
                characterState.abilityPointsAvailable = Math.max(0, (characterState.abilityPointsAvailable || 0) - 1);
                 logDiceRoll('System', `Reclaimed 1 Ability Score Point due to de-leveling from ${lvl}.`, '');
            }
        }
        alert(`Level reduced. ${Math.abs(levelDiff * pointsPerLevelGained)} skill points adjusted. Please review learned skills and spent ability points.`);
    }
    characterState.level = newLevel;
    populateSkillsList();
    updateAllCalculations(true);
}

function calculateInitialSkillPoints(level = 1) {
    const baseWits = (characterState.abilities && characterState.abilities.wits) ? characterState.abilities.wits : MIN_BASE_ABILITY_SCORE;
    const witsMod = calculateModifier(baseWits);
    let initialPoints = (2 + witsMod) * level;
    return Math.max(initialPoints, level);
}

function selectProfession() {
    const selectedProfessionKey = getValue('professionSelect');
    const profData = PROFESSIONS_DATA[selectedProfessionKey];

    // Ensure characterState properties are initialized
    characterState.learnedSkills = characterState.learnedSkills || {};
    characterState.professionAutoSkills = characterState.professionAutoSkills || [];
    characterState.savingThrowsProf = characterState.savingThrowsProf || {};
    characterState.learnedProfessionAbilities = characterState.learnedProfessionAbilities || {};
    characterState.inventory = characterState.inventory || [];


    // Resetting logic when changing professions
    if (characterState.professionKey && characterState.professionKey !== selectedProfessionKey) {
        const oldProfData = PROFESSIONS_DATA[characterState.professionKey];
        if (oldProfData) {
            characterState.spentProfessionAbilityPoints = 0;
            if (characterState.professionBonusApplied && typeof characterState.professionSkillPointsBonus === 'number') {
                 characterState.currentCharacterSkillPoints -= characterState.professionSkillPointsBonus;
            }
            characterState.professionAutoSkills.forEach(autoSkillId => {
                if (characterState.learnedSkills[autoSkillId]) {
                    delete characterState.learnedSkills[autoSkillId];
                }
            });
        }
    }

    // Initialize/reset characterState properties related to profession
    characterState.professionKey = selectedProfessionKey;
    characterState.professionName = "";
    characterState.professionDesc = "";
    characterState.professionSkillPointsBonus = 0;
    characterState.professionAbilityPointsTotal = 0;
    characterState.spentProfessionAbilityPoints = 0;
    characterState.learnedProfessionAbilities = {}; // Reset learned abilities for the new profession
    characterState.professionAutoSkills = [];
    characterState.professionBonusApplied = false;

    Object.keys(characterState.savingThrowsProf).forEach(key => characterState.savingThrowsProf[key] = false);
    ['Brawn', 'Agility', 'Sturdiness', 'Wits', 'Spirit', 'Charm'].forEach(stKey => {
        const checkbox = getElement(`save${stKey}Prof`); if (checkbox) checkbox.checked = false;
    });

    if (profData) {
        characterState.professionName = profData.name || "Unknown Calling";
        characterState.professionDesc = profData.description || "";
        characterState.professionSkillPointsBonus = profData.skillPointsBonus || 0;
        characterState.professionAbilityPointsTotal = profData.abilityPoints || 0;

        if ((!characterState.isNewSheet && !characterState.professionBonusApplied) || characterState.isNewSheet) {
            characterState.currentCharacterSkillPoints = (characterState.currentCharacterSkillPoints || 0) + characterState.professionSkillPointsBonus;
            characterState.professionBonusApplied = true;
        }

        (profData.savingThrows || []).forEach(stName => {
            characterState.savingThrowsProf[`save${stName}Prof`] = true;
            const checkbox = getElement(`save${stName}Prof`); if (checkbox) checkbox.checked = true;
        });

        (profData.skillProficiencies || []).forEach(profSkillName => {
            const skillToProf = SKILLS_DATA.find(s => s.name.startsWith(profSkillName.split(' (')[0]));
            if (skillToProf) {
                characterState.learnedSkills[skillToProf.id] = true;
                if (!characterState.professionAutoSkills.includes(skillToProf.id)) {
                    characterState.professionAutoSkills.push(skillToProf.id);
                }
            }
        });

        const attacksTableBody = getElement('attacksTableBody');
        if (attacksTableBody && (characterState.isNewSheet || (characterState.inventory.length === 0 && !characterState.initialEquipmentSet))) {
            attacksTableBody.innerHTML = '';
            attackRowCount = 0;
            (profData.startingEquipment || []).forEach(itemNameOrPartial => {
                const itemData = masterItemList.find(masterItem => masterItem.name === itemNameOrPartial || masterItem.name.startsWith(itemNameOrPartial.split(" (")[0]));
                if (itemData) addItemToInventory(JSON.parse(JSON.stringify(itemData)), 1, false);
                else addItemToInventory({ name: itemNameOrPartial, description: "Starting equipment", effects: [] }, 1, false);
            });
            characterState.initialEquipmentSet = true;
        }

        const otherProfSection = getElement('otherProfessionSection');
        const profFeaturesDisplay = getElement('professionFeaturesDisplay');
        if (selectedProfessionKey === "other") {
            if(otherProfSection) otherProfSection.style.display = 'block';
            characterState.professionName = getValue('otherProfessionName') || "Custom Calling";
            characterState.professionDesc = getValue('otherProfessionDesc') || "Details for the custom calling.";
        } else {
            if(otherProfSection) otherProfSection.style.display = 'none';
        }

        let abilitiesHTML = `<h4 class="text-lg font-medieval text-hobbit-green mb-2">${characterState.professionName} Abilities:</h4>`;
        if (profData.abilities && profData.abilities.length > 0) {
             profData.abilities.forEach(ab => {
                const isLearned = !!(characterState.learnedProfessionAbilities && characterState.learnedProfessionAbilities[ab.id]);
                abilitiesHTML += `<div class="ability-item p-3 border rounded-md bg-hobbit-parchment/60 shadow-sm mb-2 ${isLearned ? 'learned' : ''}" id="ability-${ab.id}"><div class="flex justify-between items-center"><strong class="text-hobbit-brown">${ab.name}</strong><span class="text-xs text-gray-500">(Cost: ${ab.cost || 0} AP)</span></div><p class="text-xs text-gray-600 mt-1 mb-2">${ab.description}</p><button onclick="learnProfessionAbility('${selectedProfessionKey}', '${ab.id}')" class="button-hobbit-base button-hobbit-action text-xs py-1 px-2 ${isLearned ? 'opacity-50 cursor-not-allowed' : ''}" ${isLearned ? 'disabled' : ''}>${isLearned ? 'Learned' : 'Learn'}</button></div>`;
            });
        } else {
            abilitiesHTML += `<p class="text-sm text-gray-500 italic">No specific abilities listed.</p>`;
        }
        if(profFeaturesDisplay) profFeaturesDisplay.innerHTML = abilitiesHTML;
    } else {
        const otherProfSection = getElement('otherProfessionSection');
        if(otherProfSection) otherProfSection.style.display = 'none';
        const profFeaturesDisplay = getElement('professionFeaturesDisplay');
        if(profFeaturesDisplay) profFeaturesDisplay.innerHTML = '<p class="text-sm text-gray-500 italic">Select a calling to see its features.</p>';
    }

    updateFeaturesTraitsWithProfession();
    setText('professionSkillPointsDisplay', characterState.professionSkillPointsBonus);
    setText('professionAbilityPointsDisplay', characterState.professionAbilityPointsTotal);
    setText('professionAbilityPointsSpentDisplay', characterState.spentProfessionAbilityPoints);

    populateSkillsList();
    updateAllCalculations(true);

    if (!characterState.isNewSheet) saveCharacterData(true);

    if (typeof window.addCallingIcon === 'function') {
        window.addCallingIcon();
    }
}

function updateCustomProfessionDetails() { if (characterState.professionKey === 'other') { characterState.professionName = getValue('otherProfessionName') || "Custom Calling"; characterState.professionDesc = getValue('otherProfessionDesc') || "Details for the custom calling."; updateFeaturesTraitsWithProfession(); } }

function learnProfessionAbility(professionKey, abilityId) {
    const prof = PROFESSIONS_DATA[professionKey]; if (!prof || !prof.abilities) return;
    const ability = prof.abilities.find(a => a.id === abilityId); if (!ability) return;

    characterState.learnedProfessionAbilities = characterState.learnedProfessionAbilities || {}; // Ensure exists
    if (characterState.learnedProfessionAbilities[ability.id]) { alert(`${ability.name} already learned.`); return; }

    const currentSpentAP = characterState.spentProfessionAbilityPoints || 0;
    const totalAP = characterState.professionAbilityPointsTotal || 0;
    const costAP = ability.cost || 0;

    if ((totalAP - currentSpentAP) >= costAP) {
        characterState.spentProfessionAbilityPoints = currentSpentAP + costAP;
        characterState.learnedProfessionAbilities[ability.id] = true;

        const abilityDiv = getElement(`ability-${ability.id}`);
        if (abilityDiv) {
            abilityDiv.classList.add('learned');
            const button = abilityDiv.querySelector('button');
            if (button) {
                button.textContent = 'Learned';
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
        setText('professionAbilityPointsSpentDisplay', characterState.spentProfessionAbilityPoints);
        logDiceRoll('System', `${ability.name} learned.`, `Cost: ${costAP} AP.`);
        updateFeaturesTraitsWithProfession();
        saveCharacterData(true);
    } else { alert("Not enough Calling Ability Points!"); }
}

function updateFeaturesTraitsWithProfession() {
    let baseFeatures = `Hobbit Resilience: Advantage on saving throws against being frightened.\nHobbit Nimbleness: Can move through the space of any creature larger than yours.\nBrave Little Souls: Once per long rest, reroll a failed attack, check, or save.`;
    const profKey = characterState.professionKey;
    const profData = PROFESSIONS_DATA[profKey];

    if (characterState.professionName) {
        baseFeatures += `\n\n--- CALLING: ${characterState.professionName} ---`;
        if (characterState.professionDesc) baseFeatures += `\n${characterState.professionDesc}`;
        if (profData && profData.abilities) {
            const inherentAbilities = profData.abilities.filter(a => !a.cost || a.cost === 0).map(a => `- ${a.name}: ${a.description}`).join('\n');
            if (inherentAbilities) baseFeatures += `\nInherent Abilities:\n${inherentAbilities}`;
        }
    }

    let learnedAbilitiesText = "\n\n--- Learned Calling Abilities ---";
    let hasLearnedProfAbilities = false;
    if (characterState.learnedProfessionAbilities && profData && profData.abilities) {
        for (const abilityId in characterState.learnedProfessionAbilities) {
            if (characterState.learnedProfessionAbilities[abilityId]) {
                const abilityData = profData.abilities.find(a => a.id === abilityId);
                if (abilityData) {
                    learnedAbilitiesText += `\n- ${abilityData.name}: ${abilityData.description}`;
                    hasLearnedProfAbilities = true;
                }
            }
        }
    }
    if (hasLearnedProfAbilities) baseFeatures += learnedAbilitiesText;

    const existingFeatures = getValue('featuresTraits');
    const customFeatureMarker = "CUSTOM ABILITY:"; let customFeaturesSection = "";
    if (existingFeatures) {
        const lines = existingFeatures.split('\n'); let inCustomSection = false; let customHeaderFound = false;
        lines.forEach(line => {
            if (line.includes("--- Custom Features ---")) { inCustomSection = true; customHeaderFound = true; if (!customFeaturesSection.includes("--- Custom Features ---")) customFeaturesSection += "\n\n--- Custom Features ---"; return; }
            if (line.startsWith(customFeatureMarker) || (inCustomSection && line.trim() !== "")) { if (!customHeaderFound && !customFeaturesSection.includes("--- Custom Features ---")) { customFeaturesSection += "\n\n--- Custom Features ---"; customHeaderFound = true; } customFeaturesSection += `\n${line}`; }
        });
    }
    if (customFeaturesSection) baseFeatures += customFeaturesSection;
    setValue('featuresTraits', baseFeatures);
}

// --- ATTACKS ---
function addAttackRow(attack = { name: '', damage: '', notes: '' }, doSave = true) {
    const tableBody = getElement('attacksTableBody'); if (!tableBody) return;
    const newRow = tableBody.insertRow(); const newIndex = attackRowCount++;
    newRow.innerHTML = `<td class="p-1 border border-hobbit-brown"><input type="text" class="input-hobbit attack-name w-full text-sm p-1" value="${attack.name || ''}" id="attackName${newIndex}" onchange="updateSingleAttackBonus(${newIndex})"></td><td class="p-1 border border-hobbit-brown"><input type="text" class="input-hobbit-readonly attack-bonus w-16 text-center text-sm p-1" id="atkBonus${newIndex}" readonly></td><td class="p-1 border border-hobbit-brown"><input type="text" class="input-hobbit attack-damage w-full text-sm p-1" value="${attack.damage || ''}" id="attackDamage${newIndex}" onchange="updateSingleAttackBonus(${newIndex})"></td><td class="p-1 border border-hobbit-brown"><input type="text" class="input-hobbit attack-notes w-full text-sm p-1" value="${attack.notes || ''}" id="attackNotes${newIndex}"></td><td class="p-1 border border-hobbit-brown text-center"><button class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5" onclick="rollAttack(${newIndex})">Atk</button><button class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5" onclick="rollDamage(${newIndex})">Dmg</button><button class="button-hobbit-base button-hobbit-clear text-xs py-0.5 px-1.5" onclick="deleteAttackRow(this)">Del</button></td>`;
    updateSingleAttackBonus(newIndex);
    if (doSave && !characterState.isNewSheet) saveCharacterData(true);
}
function deleteAttackRow(button) { const row = button.closest('tr'); if (row) row.remove(); updateAllAttackBonuses(); saveCharacterData(true); }

function updateSingleAttackBonus(rowIndex) {
    const profBonus = getProficiencyBonus();
    const totalBrawn = getAbilityScoreTotal('brawn'); const totalAgility = getAbilityScoreTotal('agility');
    const brawnMod = calculateModifier(totalBrawn); const agilityMod = calculateModifier(totalAgility);
    const weaponNameInput = getElement(`attackName${rowIndex}`);
    const weaponName = weaponNameInput ? weaponNameInput.value.toLowerCase() : "";
    let abilityModForAttack = brawnMod;
    const inventoryItemInstance = characterState.inventory.find(itemInst => itemInst.name.toLowerCase() === weaponName && itemInst.equipped);
    let itemMasterData = null;
    if (inventoryItemInstance) itemMasterData = masterItemList.find(mi => mi.name === inventoryItemInstance.name);
    let isFinesse = false; let isRanged = false;
    if (itemMasterData) {
        if (itemMasterData.type && itemMasterData.type.toLowerCase().includes("ranged")) isRanged = true;
        if (itemMasterData.finesse) isFinesse = true;
    } else {
        const finesseKeywords = ["dagger", "rapier", "shortsword", "scimitar", "whip", "knife"];
        const rangedKeywords = ["sling", "bow", "dart", "crossbow"];
        if (rangedKeywords.some(rw => weaponName.includes(rw))) isRanged = true;
        if (finesseKeywords.some(fw => weaponName.includes(fw))) isFinesse = true;
    }
    if (isRanged) abilityModForAttack = agilityMod;
    else if (isFinesse) abilityModForAttack = Math.max(brawnMod, agilityMod);
    let totalBonus = abilityModForAttack + profBonus;
    let notesFromEffects = "";
    if (itemMasterData && itemMasterData.effects) {
        itemMasterData.effects.forEach(effect => {
            if (effect.type === "attack_bonus") totalBonus += (effect.value || 0);
            if (effect.type === "conditional_attack_bonus" && effect.details) notesFromEffects += (notesFromEffects ? "; " : "") + effect.details;
        });
    }
    const atkBonusInput = getElement(`atkBonus${rowIndex}`);
    if (atkBonusInput) atkBonusInput.value = (totalBonus >= 0 ? '+' : '') + totalBonus;
    const notesInput = getElement(`attackNotes${rowIndex}`);
    if (notesInput && notesFromEffects && !notesInput.value.includes(notesFromEffects)) {
        notesInput.value = (notesInput.value ? notesInput.value + "; " : "") + notesFromEffects;
    }
}
function updateAllAttackBonuses() { const tableBody = getElement('attacksTableBody'); if (!tableBody) return; for (let i = 0; i < attackRowCount; i++) { if (getElement(`attackName${i}`)) updateSingleAttackBonus(i); } }

// --- DICE ROLLING ---
let diceLog = [];
function logDiceRoll(type, result, details = '', isAutoSave = false) { const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit'}); const logEntry = { type, result, details, timestamp, isAutoSave }; diceLog.unshift(logEntry); if (diceLog.length > 50) diceLog.pop(); updateDiceLogDisplay(); }

function updateDiceLogDisplay() {
    const diceLogDiv = getElement('diceLog');
    if (!diceLogDiv) return;
    diceLogDiv.innerHTML = diceLog.map((entry, index) => {
        let entryClass = "log-entry";
        if (index === 0 && !entry.isAutoSave) {
            entryClass += " latest-log-entry";
        }
        if (entry.isAutoSave) {
            return `<div class="${entryClass} auto-save-message">System | ${entry.result} | <em>(${entry.timestamp})</em></div>`;
        }
        return `<div class="${entryClass}"><span class="font-semibold">${entry.type}:</span> <strong>${entry.result}</strong><p class="text-xs text-gray-700">${entry.details} <em>(${entry.timestamp})</em></p></div>`;
    }).join('');
    if (diceLog.length === 0) {
        diceLogDiv.innerHTML = `<p class="text-gray-600 italic">Dice rolls will appear here...</p>`;
    }
}
function clearDiceLog() { diceLog = []; updateDiceLogDisplay(); }
function performRoll(num, sides, mod, description) { let total = 0; let rolls = []; for (let i = 0; i < num; i++) { let roll; if (sides === 100) { const tens = Math.floor(Math.random() * 10) * 10; const units = Math.floor(Math.random() * 10); roll = (tens === 0 && units === 0) ? 100 : tens + units; } else roll = Math.floor(Math.random() * sides) + 1; rolls.push(roll); total += roll; } total += mod; const rollString = rolls.join(', '); const modString = mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : ''; logDiceRoll(description, total, `${num}d${sides} (${rollString})${modString}`); return total; }
function rollCustomDice() { const numDice = getValue('numDice'); const diceType = getValue('diceType'); const modifier = getValue('diceModifier'); performRoll(numDice, diceType, modifier, 'Custom Roll'); }
function rollInitiative() {
    const totalAgility = getAbilityScoreTotal('agility'); const agilityMod = calculateModifier(totalAgility);
    let initiativeBonus = agilityMod;
    if (characterState.inventory) characterState.inventory.forEach(item => { if (item.equipped && item.effects) item.effects.forEach(eff => { if (eff.type === "initiative_bonus") initiativeBonus += (eff.value || 0); }); });
    performRoll(1, 20, initiativeBonus, 'Initiative');
}
function rollSavingThrow(abilityKey) {
    const profBonus = getProficiencyBonus(); const totalAbilityScore = getAbilityScoreTotal(abilityKey);
    const abilityMod = calculateModifier(totalAbilityScore);
    const isProficient = (characterState.savingThrowsProf && characterState.savingThrowsProf[`save${abilityKey.charAt(0).toUpperCase() + abilityKey.slice(1)}Prof`]) || false;
    let totalMod = abilityMod + (isProficient ? profBonus : 0); let hasAdvantage = false; let advantageSource = "";
    if (characterState.inventory) characterState.inventory.forEach(item => { if (item.equipped && item.effects) item.effects.forEach(eff => { if (eff.type === "saving_throw_bonus" && eff.save === abilityKey) totalMod += (eff.value || 0); if ((eff.type === "advantage_on_saving_throw" && eff.save === abilityKey) || (eff.type === "advantage_on_saving_throw_condition" && eff.details && eff.details.toLowerCase().includes("save vs being " + eff.condition))) { hasAdvantage = true; advantageSource = item.name; } }); });
    let rollDescription = `${abilityKey.charAt(0).toUpperCase() + abilityKey.slice(1)} Save`;
    if (hasAdvantage) rollDescription += ` (Adv. from ${advantageSource})`;
    performRoll(1, 20, totalMod, rollDescription);
    if (hasAdvantage) logDiceRoll("System", "Rolled with Advantage", `Source: ${advantageSource}. Roll 2d20, take highest.`);
}
function rollSkill(abilityKey, skillProfId, skillName, skillId, isCustom = false) {
    const profBonus = getProficiencyBonus();
    const totalAbilityScoreForSkill = getAbilityScoreTotal(abilityKey);
    const abilityMod = calculateModifier(totalAbilityScoreForSkill);
    let isProficient = false;
    if (!isCustom && getElement(skillProfId)) {
        isProficient = getElement(skillProfId).checked;
    } else if (isCustom) {
        isProficient = true;
    }

    let totalMod = abilityMod + (isProficient ? profBonus : 0);
    let hasAdvantage = false;
    let advantageSource = "";

    if (characterState.inventory) {
        characterState.inventory.forEach(item => {
            if (item.equipped && item.effects) {
                item.effects.forEach(eff => {
                    if (eff.type === "skill_bonus" && eff.skill_id === skillId) totalMod += (eff.value || 0);
                    if (eff.type === "advantage_on_skill_check" && eff.skill_id === skillId) { hasAdvantage = true; advantageSource = item.name; }
                });
            }
        });
    }
    let rollDescription = `${skillName || abilityKey} Check`;
    if (hasAdvantage) rollDescription += ` (Adv. from ${advantageSource})`;
    performRoll(1, 20, totalMod, rollDescription);
    if (hasAdvantage) logDiceRoll("System", "Rolled with Advantage", `Source: ${advantageSource}. Roll 2d20, take highest.`);
}

function rollAttack(rowIndex) {
    const atkBonusInput = getElement(`atkBonus${rowIndex}`);
    const weaponNameInput = getElement(`attackName${rowIndex}`);
    if (!atkBonusInput || !weaponNameInput) return;

    let baseAtkBonusFromSheet = parseInt(atkBonusInput.value) || 0;
    const weaponName = weaponNameInput.value || "Attack";
    let conditionalBonusTotal = 0;
    let notesForRoll = [];

    const inventoryItemInstance = characterState.inventory.find(itemInst => itemInst.name.toLowerCase() === weaponName.toLowerCase() && itemInst.equipped);
    let itemMasterData = null;
    if (inventoryItemInstance) {
        itemMasterData = masterItemList.find(mi => mi.name === inventoryItemInstance.name);
    }

    if (itemMasterData && itemMasterData.effects) {
        itemMasterData.effects.forEach(effect => {
            if (effect.type === "conditional_attack_bonus") {
                const conditionMet = confirm(`Rolling for ${weaponName}.\n${effect.details}\nIs the condition met for "${effect.condition_target.join(" or ")}"?`);
                if (conditionMet) {
                    conditionalBonusTotal += (effect.value || 0);
                    notesForRoll.push(`+${effect.value} vs ${effect.condition_target.join('/')} (from ${itemMasterData.name})`);
                }
            }
        });
    }

    if (characterState.learnedSkills && itemMasterData) {
        for (const skillId in characterState.learnedSkills) {
            if (characterState.learnedSkills[skillId]) {
                const skillData = SKILLS_DATA.find(s => s.id === skillId);
                if (skillData && skillData.effects) {
                    skillData.effects.forEach(effect => {
                        let applies = false;
                        let effectValue = effect.value || 0;
                        if (effect.type === "skill_attack_bonus_weapon_property" && itemMasterData[effect.property]) {
                            applies = true;
                        } else if (effect.type === "skill_attack_bonus_weapon_category" && itemMasterData.type && itemMasterData.type.toLowerCase().includes(effect.category.toLowerCase())) {
                            applies = true;
                        }
                        if (applies) {
                            conditionalBonusTotal += effectValue;
                            notesForRoll.push(`Skill: ${skillData.name} (+${effectValue} from ${effect.details || effect.type})`);
                        }
                    });
                }
            }
        }
    }

    let finalNotesString = notesForRoll.length > 0 ? ` (${notesForRoll.join('; ')})` : '';
    performRoll(1, 20, baseAtkBonusFromSheet + conditionalBonusTotal, `${weaponName} - Attack Roll${finalNotesString}`);
}


function rollDamage(rowIndex) {
    const damageInput = getElement(`attackDamage${rowIndex}`);
    const weaponNameInput = getElement(`attackName${rowIndex}`);
    if (!damageInput || !weaponNameInput) return;
    const damageString = damageInput.value;
    const weaponName = weaponNameInput.value || "Damage";

    const match = damageString.match(/(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/i);
    if (match) {
        const numDice = parseInt(match[1]);
        const diceSides = parseInt(match[2]);
        let baseDamageStringModifier = 0;
        if (match[4]) {
            baseDamageStringModifier = parseInt(match[4]);
            if (match[3] === '-') { baseDamageStringModifier = -baseDamageStringModifier; }
        }

        const totalBrawn = getAbilityScoreTotal('brawn');
        const totalAgility = getAbilityScoreTotal('agility');
        const brawnMod = calculateModifier(totalBrawn);
        const agilityMod = calculateModifier(totalAgility);
        let abilityModForDamage = brawnMod;

        const inventoryItemInstance = characterState.inventory.find(itemInst => itemInst.name.toLowerCase() === weaponName.toLowerCase() && itemInst.equipped);
        let itemMasterData = null;
        if (inventoryItemInstance) {
            itemMasterData = masterItemList.find(mi => mi.name === inventoryItemInstance.name);
        }

        let isFinesseDamage = false;
        let isRangedDamage = false;

        if (itemMasterData) {
            if (itemMasterData.type && itemMasterData.type.toLowerCase().includes("ranged")) isRangedDamage = true;
            if (itemMasterData.finesse) isFinesseDamage = true;
        } else {
            const customItemNotes = getElement(`attackNotes${rowIndex}`)?.value.toLowerCase() || "";
            if (customItemNotes.includes("ranged")) isRangedDamage = true;
            if (customItemNotes.includes("finesse")) isFinesseDamage = true;
        }


        if (isRangedDamage) {
            abilityModForDamage = agilityMod;
        } else if (isFinesseDamage) {
            abilityModForDamage = Math.max(brawnMod, agilityMod);
        }

        let totalDamageModifier = baseDamageStringModifier + abilityModForDamage;
        let notesForRoll = [];
        if (abilityModForDamage !== 0) {
             notesForRoll.push(`Ability Mod: ${(abilityModForDamage >= 0 ? '+' : '')}${abilityModForDamage}`);
        }

        if (itemMasterData && itemMasterData.effects) {
            itemMasterData.effects.forEach(effect => {
                if (effect.type === "damage_bonus") {
                    totalDamageModifier += (effect.value || 0);
                     notesForRoll.push(`+${effect.value} from ${itemMasterData.name}`);
                }
                if (effect.type === "conditional_damage_bonus") {
                    const conditionMet = confirm(`Rolling damage for ${weaponName}.\n${effect.details}\nIs the condition met for "${effect.condition_target.join(" or ")}"?`);
                    if (conditionMet) {
                        totalDamageModifier += (effect.value || 0);
                        notesForRoll.push(`+${effect.value} vs ${effect.condition_target.join('/')} (from ${itemMasterData.name})`);
                    }
                }
            });
        }

        if (characterState.learnedSkills && itemMasterData) {
            for (const skillId in characterState.learnedSkills) {
                if (characterState.learnedSkills[skillId]) {
                    const skillData = SKILLS_DATA.find(s => s.id === skillId);
                    if (skillData && skillData.effects) {
                        skillData.effects.forEach(effect => {
                            let applies = false;
                            let effectValue = effect.value || 0;
                            if (effect.type === "skill_damage_bonus_weapon_category" && itemMasterData.type && itemMasterData.type.toLowerCase().includes(effect.category.toLowerCase())) {
                                applies = true;
                            } else if (effect.type === "skill_damage_bonus_target_size" && effect.target_size) {
                                const confirmSize = confirm(`Is the target of ${weaponName} considered '${effect.target_size}' for the skill "${skillData.name}"?`);
                                if (confirmSize) {
                                    applies = true;
                                }
                            }
                            if (applies) {
                                totalDamageModifier += effectValue;
                                notesForRoll.push(`Skill: ${skillData.name} (+${effectValue} from ${effect.details || effect.type})`);
                            }
                        });
                    }
                }
            }
        }

        let finalNotesString = notesForRoll.length > 0 ? ` (${notesForRoll.join('; ')})` : '';
        performRoll(numDice, diceSides, totalDamageModifier, `${weaponName} - Damage${finalNotesString}`);
    } else {
        logDiceRoll(`${weaponName} - Damage`, 'Invalid Format', `Could not parse: ${damageString}`);
        alert(`Could not parse damage string: "${damageString}". Expected format like "1d8 + 2" or "2d6".`);
    }
}


// --- INVENTORY MANAGEMENT ---
function populateAddItemSelect() {
    const select = getElement('addItemSelect'); if (!select) return;
    select.innerHTML = '<option value="">-- Select an item --</option>';
    if (!masterItemList || masterItemList.length === 0) { console.warn("Master item list empty."); return; }
    masterItemList.sort((a,b) => a.name.localeCompare(b.name)).forEach(item => { const option = document.createElement('option'); option.value = item.name; option.textContent = item.name; select.appendChild(option); });
}
function addItemToInventoryFromSelect() {
    const select = getElement('addItemSelect'); const itemName = select.value;
    if (!itemName) { alert("Please select an item."); return; }
    const itemData = masterItemList.find(item => item.name === itemName);
    if (itemData) { addItemToInventory(JSON.parse(JSON.stringify(itemData)), 1, false); select.value = ""; }
    else alert("Selected item data not found.");
}

function addCustomItemToInventory() {
    const name = getValue('customItemName');
    if (!name) { alert("Custom item name is required."); return; }
    const description = getValue('customItemDesc') || "Custom item.";
    const quantity = getValue('customItemQty') || 1;
    const type = getValue('customItemType') || "Mundane Item";
    const damage = getValue('customItemDamage') || "";
    const effectsNotes = getValue('customItemEffects') || "";

    const customItemData = {
        name: name,
        description: description,
        type: type,
        damage: damage,
        effects: effectsNotes ? [{ type: "custom_effect", details: effectsNotes }] : [],
        isCustom: true
    };

    addItemToInventory(customItemData, quantity);

    setValue('customItemName', '');
    setValue('customItemDesc', '');
    setValue('customItemQty', 1);
    setValue('customItemType', '');
    setValue('customItemDamage', '');
    setValue('customItemEffects', '');
}


function addItemToInventory(itemData, quantity = 1, equipDefault = false) {
    if (!characterState.inventory) characterState.inventory = [];
    const instanceId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newItemInstance = { ...itemData, id: instanceId, quantity: quantity, equipped: equipDefault, effects: itemData.effects ? JSON.parse(JSON.stringify(itemData.effects)) : [] };
    characterState.inventory.push(newItemInstance);
    if (itemData.damage && (itemData.type?.toLowerCase().includes("melee") || itemData.type?.toLowerCase().includes("ranged") || itemData.type?.toLowerCase().includes("weapon"))) {
        let notes = itemData.type || '';
        if (itemData.range) notes += ` (Range: ${itemData.range})`;
        if (itemData.finesse) notes += (notes ? ', ' : '') + 'Finesse';
        if (itemData.light) notes += (notes ? ', ' : '') + 'Light';
        if (itemData.two_handed) notes += (notes ? ', ' : '') + 'Two-Handed';
        if (itemData.versatile) notes += (notes ? ', ' : '') + `Versatile (${itemData.versatile})`;
        let attackExists = false;
        const attackTableBody = getElement('attacksTableBody');
        if (attackTableBody) {
            const attackRows = attackTableBody.rows;
            for (let i = 0; i < attackRows.length; i++) {
                const nameInput = attackRows[i].querySelector('input.attack-name');
                if (nameInput && nameInput.value.toLowerCase() === itemData.name.toLowerCase()) {
                    attackExists = true; break;
                }
            }
        }
        if (!attackExists) addAttackRow({ name: itemData.name, damage: itemData.damage, notes: notes }, false);
    }
    renderInventoryList(); updateAllCalculations(true);
    if (!characterState.isNewSheet) saveCharacterData(true);
}
function toggleEquipItem(itemInstanceId) {
    const itemInstance = characterState.inventory.find(inst => inst.id === itemInstanceId);
    if (itemInstance) { itemInstance.equipped = !itemInstance.equipped; renderInventoryList(); updateAllCalculations(true); saveCharacterData(true); }
}
function removeItemFromInventory(itemInstanceId) {
    characterState.inventory = characterState.inventory.filter(inst => inst.id !== itemInstanceId);
    renderInventoryList(); updateAllCalculations(true); saveCharacterData(true);
}
function renderInventoryList() {
    const inventoryListDiv = getElement('inventoryList'); if (!inventoryListDiv) return;
    inventoryListDiv.innerHTML = '';
    if (!characterState.inventory || characterState.inventory.length === 0) { inventoryListDiv.innerHTML = '<p class="text-sm text-gray-500 italic">No items in inventory.</p>'; return; }
    characterState.inventory.forEach(itemInstance => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `inventory-item p-2 border-b border-hobbit-gold/30 ${itemInstance.equipped ? 'equipped bg-hobbit-green/10' : ''}`;
        let effectsText = ""; if (itemInstance.effects && itemInstance.effects.length > 0) effectsText = itemInstance.effects.map(eff => eff.details || eff.type).join(', ');
        itemDiv.innerHTML = `<div class="flex-grow"><span class="font-semibold text-hobbit-brown">${itemInstance.name}</span> ${effectsText ? `<span class="item-effects block text-xs text-hobbit-green/80 italic ml-2">${effectsText}</span>` : ''}<p class="text-xs text-hobbit-dark-text/70 ml-2">${itemInstance.description || ''}</p></div><div class="flex space-x-2 items-center ml-2"><button onclick="toggleEquipItem('${itemInstance.id}')" class="button-hobbit-base text-xs py-1 px-2 ${itemInstance.equipped ? 'button-hobbit-action' : 'button-hobbit-import'}">${itemInstance.equipped ? 'Unequip' : 'Equip'}</button><button onclick="removeItemFromInventory('${itemInstance.id}')" class="button-hobbit-base button-hobbit-clear text-xs py-1 px-2">Remove</button></div>`;
        inventoryListDiv.appendChild(itemDiv);
    });
}

// --- DEFENSE AND FORTITUDE ---
function updateDefenseDisplay() {
    let baseACFromInput = getValue('defense') || 10; let finalAC = baseACFromInput;
    if (characterState.inventory) characterState.inventory.forEach(item => { if (item.equipped && item.effects) item.effects.forEach(eff => { const master = masterItemList.find(mi => mi.name === item.name); let isPrimary = false; if (master && master.type && (master.type.toLowerCase().includes("armor") || master.type.toLowerCase().includes("shield"))) isPrimary = true; if (eff.type === "ac_bonus" && !isPrimary) finalAC += (eff.value || 0); }); });
    setValue('defense', finalAC);
}
function updateMaxFortitudeDisplay() {
    const level = characterState.level || 1;
    const totalSturdiness = getAbilityScoreTotal('sturdiness');
    const sturdinessMod = calculateModifier(totalSturdiness);
    let maxHP = 0; const profKey = characterState.professionKey;
    const profData = PROFESSIONS_DATA[profKey];
    const baseFortitudeDie = profData ? (profData.baseFortitudeDie || 6) : 6;
    maxHP = baseFortitudeDie + sturdinessMod; // Level 1
    if (level > 1) { const avgHitDieRoll = Math.ceil(baseFortitudeDie / 2 + 0.5); maxHP += (level - 1) * Math.max(1, (avgHitDieRoll + sturdinessMod)); }
    if (characterState.inventory) characterState.inventory.forEach(item => { if (item.equipped && item.effects) item.effects.forEach(eff => { if (eff.type === "hp_bonus") maxHP += (eff.value || 0); if (eff.type === "hp_per_level_bonus") maxHP += ((eff.value || 0) * level); }); });
    maxHP = Math.max(maxHP, level);
    setValue('fortitudeMax', maxHP);
    if (getValue('fortitudeCurrent') > maxHP || characterState.isNewSheet) setValue('fortitudeCurrent', maxHP);
    else setValue('fortitudeCurrent', getValue('fortitudeMax')); // Ensure current HP is set to max if it was higher or new sheet
}

// --- SAVE/LOAD FUNCTIONALITY ---
function collectCharacterData() {
    const data = {
        version: SHEET_VERSION,
        charName: getValue('charName'), playerName: getValue('playerName'), homestead: getValue('homestead'),
        level: getValue('level'), background: getValue('background'),
        abilities: { ...(characterState.abilities || {}) },
        baseAbilities: { ...(characterState.baseAbilities || {}) },
        abilityPointsAvailable: characterState.abilityPointsAvailable,
        customLearnedSkills: characterState.customLearnedSkills ? JSON.parse(JSON.stringify(characterState.customLearnedSkills)) : [],
        uiVisibility: { ...(characterState.uiVisibility || {}) },
        fortitudeMax: getValue('fortitudeMax'), fortitudeCurrent: getValue('fortitudeCurrent'),
        resilienceDiceTotal: getValue('resilienceDiceTotal'), resilienceDiceSpent: getValue('resilienceDiceSpent'),
        defense: getValue('defense'),
        inventory: characterState.inventory ? JSON.parse(JSON.stringify(characterState.inventory)) : [],
        coinsCP: getValue('coinsCP'), coinsSP: getValue('coinsSP'), coinsGP: getValue('coinsGP'),
        featuresTraits: getValue('featuresTraits'),
        personalityTraits: getValue('personalityTraits'), ideals: getValue('ideals'), bonds: getValue('bonds'), flaws: getValue('flaws'),
        appearanceNotes: getValue('appearanceNotes'),
        charAge: getValue('charAge'), charHeight: getValue('charHeight'), charWeight: getValue('charWeight'), charEyes: getValue('charEyes'), charHair: getValue('charHair'), charSkin: getValue('charSkin'),
        notesAllies: getValue('notesAllies'), quickNotesTextarea: getValue('quickNotesTextarea'),
        professionKey: getValue('professionSelect'),
        otherProfessionName: getValue('otherProfessionName'), otherProfessionDesc: getValue('otherProfessionDesc'),
        savingThrowsProf: { ...(characterState.savingThrowsProf || {}) },
        learnedSkills: { ...(characterState.learnedSkills || {}) },
        currentCharacterSkillPoints: characterState.currentCharacterSkillPoints,
        professionSkillPointsBonus: characterState.professionSkillPointsBonus,
        professionBonusApplied: characterState.professionBonusApplied || false,
        professionAbilityPointsTotal: characterState.professionAbilityPointsTotal,
        spentProfessionAbilityPoints: characterState.spentProfessionAbilityPoints,
        learnedProfessionAbilities: { ...(characterState.learnedProfessionAbilities || {}) },
        professionAutoSkills: [...(characterState.professionAutoSkills || [])],
        initialEquipmentSet: characterState.initialEquipmentSet || false,
        attacks: [],
        diceLog: [...diceLog]
    };
    ['Brawn', 'Agility', 'Sturdiness', 'Wits', 'Spirit', 'Charm'].forEach(st => { data.savingThrowsProf[`save${st}Prof`] = getValue(`save${st}Prof`); });
    const attackTableBody = getElement('attacksTableBody');
    if (attackTableBody) {
        const attackRows = attackTableBody.rows;
        for (let i = 0; i < attackRows.length; i++) {
            const nameInput = attackRows[i].querySelector('input.attack-name');
            if (nameInput && nameInput.id) {
                const attackIndex = nameInput.id.replace('attackName', '');
                data.attacks.push({
                    name: getValue(`attackName${attackIndex}`),
                    damage: getValue(`attackDamage${attackIndex}`),
                    notes: getValue(`attackNotes${attackIndex}`)
                });
            }
        }
    }
    const charImageDisplay = getElement('characterImageDisplay');
    const charImageSrc = charImageDisplay ? charImageDisplay.src : null;
    if (charImageSrc && !charImageSrc.includes('placehold.co') && charImageSrc.startsWith('data:image')) data.charImage = charImageSrc; else data.charImage = null;
    return data;
}

function applyCharacterData(data) {
    const defaultAbilities = { brawn: MIN_BASE_ABILITY_SCORE, agility: MIN_BASE_ABILITY_SCORE, sturdiness: MIN_BASE_ABILITY_SCORE, wits: MIN_BASE_ABILITY_SCORE, spirit: MIN_BASE_ABILITY_SCORE, charm: MIN_BASE_ABILITY_SCORE };
    characterState = {
        level: data.level || 1,
        abilities: data.abilities || { ...defaultAbilities },
        baseAbilities: data.baseAbilities || { ...defaultAbilities },
        abilityPointsAvailable: data.abilityPointsAvailable !== undefined ? data.abilityPointsAvailable : INITIAL_ABILITY_SCORE_POINTS,
        customLearnedSkills: data.customLearnedSkills ? JSON.parse(JSON.stringify(data.customLearnedSkills)) : [],
        uiVisibility: data.uiVisibility || { quickNotesArea: true, customDiceRollerFixed: true, diceRollerSectionFixed: true },
        savingThrowsProf: data.savingThrowsProf || {},
        learnedSkills: data.learnedSkills || {},
        currentCharacterSkillPoints: data.currentCharacterSkillPoints !== undefined ? data.currentCharacterSkillPoints : 0,
        professionKey: data.professionKey || "",
        professionName: data.professionName || "", // Ensure these are initialized
        professionDesc: data.professionDesc || "", // Ensure these are initialized
        professionSkillPointsBonus: data.professionSkillPointsBonus || 0,
        professionBonusApplied: data.professionBonusApplied || false,
        professionAbilityPointsTotal: data.professionAbilityPointsTotal || 0,
        spentProfessionAbilityPoints: data.spentProfessionAbilityPoints || 0,
        learnedProfessionAbilities: data.learnedProfessionAbilities || {},
        professionAutoSkills: data.professionAutoSkills || [],
        inventory: data.inventory ? JSON.parse(JSON.stringify(data.inventory)) : [],
        initialEquipmentSet: data.initialEquipmentSet || false,
        isNewSheet: false
    };
    applyUIVisibility();

    if (data.currentCharacterSkillPoints === undefined || (data.version && parseFloat(data.version) < 7.1)) {
        characterState.currentCharacterSkillPoints = calculateInitialSkillPoints(characterState.level);
        if (PROFESSIONS_DATA[characterState.professionKey] && PROFESSIONS_DATA[characterState.professionKey].skillPointsBonus > 0 && !characterState.professionBonusApplied) {
            characterState.currentCharacterSkillPoints += PROFESSIONS_DATA[characterState.professionKey].skillPointsBonus;
            characterState.professionBonusApplied = true;
        }
    }
     if (data.abilityPointsAvailable === undefined && (!data.version || parseFloat(data.version) < 7.1)) {
        characterState.abilityPointsAvailable = INITIAL_ABILITY_SCORE_POINTS;
        let pointsSpentFromOldStats = 0;
        ['brawn', 'agility', 'sturdiness', 'wits', 'spirit', 'charm'].forEach(id => {
            const diff = (characterState.abilities[id] || MIN_BASE_ABILITY_SCORE) - (characterState.baseAbilities[id] || MIN_BASE_ABILITY_SCORE);
            if (diff > 0) pointsSpentFromOldStats += diff;
        });
        characterState.abilityPointsAvailable = Math.max(0, (characterState.abilityPointsAvailable || 0) - pointsSpentFromOldStats);
        for (let lvl = 1; lvl <= characterState.level; lvl++) {
            if (lvl === 3 || lvl === 6 || lvl === 9) {
                 characterState.abilityPointsAvailable++;
            }
        }
    }


    ['charName', 'playerName', 'homestead', 'level', 'background', 'fortitudeCurrent', 'resilienceDiceTotal', 'resilienceDiceSpent', 'defense', 'coinsCP', 'coinsSP', 'coinsGP', 'featuresTraits', 'personalityTraits', 'ideals', 'bonds', 'flaws', 'appearanceNotes', 'charAge', 'charHeight', 'charWeight', 'charEyes', 'charHair', 'charSkin', 'notesAllies', 'quickNotesTextarea', 'otherProfessionName', 'otherProfessionDesc'].forEach(id => setValue(id, data[id]));

    setValue('professionSelect', data.professionKey || "");
    selectProfession();

    if (data.savingThrowsProf) { for (const key in data.savingThrowsProf) { setValue(key, data.savingThrowsProf[key]); if(characterState.savingThrowsProf) characterState.savingThrowsProf[key] = data.savingThrowsProf[key]; } }

    const attacksTableBody = getElement('attacksTableBody');
    if (attacksTableBody) {
        attacksTableBody.innerHTML = '';
    }
    attackRowCount = 0;
    if (data.attacks && Array.isArray(data.attacks)) data.attacks.forEach(attack => addAttackRow(attack, false));
    else addDefaultAttackRows();

    const charImageDisplay = getElement('characterImageDisplay');
    if (charImageDisplay) {
        if (data.charImage && data.charImage.startsWith('data:image')) charImageDisplay.src = data.charImage;
        else charImageDisplay.src = 'https://placehold.co/200x200/A0522D/F0EAD6?text=Brave+Hobbit&font=medievalsharp';
    }
    const charImageInput = getElement('charImage');
    if (charImageInput) charImageInput.value = '';

    diceLog = data.diceLog || []; updateDiceLogDisplay();
    renderInventoryList();
    updateAllCalculations(true);
    populateSkillsList();
    updateCharacterNameInTitle();

    const loadedProfKey = characterState.professionKey;
    if (PROFESSIONS_DATA[loadedProfKey] && PROFESSIONS_DATA[loadedProfKey].abilities && characterState.learnedProfessionAbilities) {
        PROFESSIONS_DATA[loadedProfKey].abilities.forEach(ab => {
            if (characterState.learnedProfessionAbilities[ab.id]) {
                const abilityItemDiv = getElement(`ability-${ab.id}`);
                if (abilityItemDiv) { abilityItemDiv.classList.add('learned'); const learnButton = abilityItemDiv.querySelector('button'); if (learnButton) { learnButton.disabled = true; learnButton.textContent = 'Learned'; learnButton.classList.add('opacity-50', 'cursor-not-allowed'); } }
            }
        });
    }
    updateMaxFortitudeDisplay();
    // Ensure current HP is within bounds of new max HP
    const currentFortitude = getValue('fortitudeCurrent');
    const maxFortitude = getValue('fortitudeMax');
    if (currentFortitude > maxFortitude) {
        setValue('fortitudeCurrent', maxFortitude);
    } else {
        setValue('fortitudeCurrent', data.fortitudeCurrent || maxFortitude);
    }
}

function saveCharacterData(isAuto = false) { try { const dataToSave = collectCharacterData(); localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave)); if (!isAuto) { alert('Character data saved!'); logDiceRoll('System', 'Character Data Saved!', `Manual Save`); } else { const autoSaveStatusEl = getElement('autoSaveStatus'); if(autoSaveStatusEl) { autoSaveStatusEl.textContent = `Auto-saved at ${new Date().toLocaleTimeString()}`; setTimeout(() => { autoSaveStatusEl.textContent = ''; }, 5000); } } } catch (error) { console.error("Error saving character data:", error); if (!isAuto) alert("Failed to save character data. Browser might be blocking local storage or out of space. Try serving files from a local web server."); } }

function loadCharacterData() {
    let dataToLoad = null;

    // Priority 1: Check for data passed from DM dashboard
    const dmViewDataJSON = localStorage.getItem(DM_VIEW_PLAYER_KEY);
    if (dmViewDataJSON) {
        try {
            dataToLoad = JSON.parse(dmViewDataJSON);
            localStorage.removeItem(DM_VIEW_PLAYER_KEY); // Clear the key after successful read
            console.log("DM View data found and parsed.");
        } catch (e) {
            console.error("Error parsing DM View data:", e);
            // Don't alert here, just log. Let the main flow decide what to do.
            localStorage.removeItem(DM_VIEW_PLAYER_KEY); // Clear corrupted key
            dataToLoad = null; // Ensure we don't use corrupted data
        }
    }

    // Priority 2: If no DM data, try loading from regular local storage
    if (!dataToLoad) {
        const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDataJSON) {
            try {
                dataToLoad = JSON.parse(savedDataJSON);
                console.log("Local storage data found and parsed.");
            } catch (e) {
                console.error("Error parsing saved data:", e);
                // Don't alert here.
                dataToLoad = null; // Ensure we don't use corrupted data
            }
        }
    }

    // Now, attempt to apply the data if any was successfully loaded
    if (dataToLoad) {
        // Check version compatibility if loading from LOCAL_STORAGE_KEY (DM_VIEW_PLAYER_KEY might be fresh)
        // For DM_VIEW, we assume it's always the latest version as it's generated by the DM app.
        if (dataToLoad.version !== SHEET_VERSION && parseFloat(dataToLoad.version || "0") < parseFloat(SHEET_VERSION)) {
            if (!confirm(`Loading data from an older version (Saved: ${dataToLoad.version || 'pre-7.1'}, Current: ${SHEET_VERSION}). Some features or data might need manual review/adjustment. Continue?`)) {
                logDiceRoll('System', 'Load cancelled: version mismatch.', '');
                return false; // User cancelled due to version mismatch
            }
        }
        applyCharacterData(dataToLoad);
        logDiceRoll('System', 'Character Data Loaded!', `Version: ${dataToLoad.version || 'unknown'}`);
        return true; // Successfully loaded and applied
    }

    return false; // No valid data found to load
}

function loadCharacterDataPrompt() { if (confirm("Loading will overwrite any unsaved changes. Are you sure?")) { if (!loadCharacterData()) { if (!localStorage.getItem(LOCAL_STORAGE_KEY)) { logDiceRoll('System', 'No saved data found.', ''); initializeNewSheet(); } } else alert('Character data loaded!'); } }

function initializeNewSheet() {
    const defaultAbilities = { brawn: MIN_BASE_ABILITY_SCORE, agility: MIN_BASE_ABILITY_SCORE, sturdiness: MIN_BASE_ABILITY_SCORE, wits: MIN_BASE_ABILITY_SCORE, spirit: MIN_BASE_ABILITY_SCORE, charm: MIN_BASE_ABILITY_SCORE };
    characterState = {
        level: 1,
        abilities: { ...defaultAbilities },
        baseAbilities: { ...defaultAbilities },
        abilityPointsAvailable: INITIAL_ABILITY_SCORE_POINTS,
        customLearnedSkills: [],
        uiVisibility: { quickNotesArea: true, customDiceRollerFixed: true, diceRollerSectionFixed: true },
        savingThrowsProf: {},
        learnedSkills: {},
        currentCharacterSkillPoints: 0,
        professionKey: "",
        professionName: "",
        professionDesc: "",
        professionSkillPointsBonus: 0,
        professionBonusApplied: false,
        professionAbilityPointsTotal: 0,
        spentProfessionAbilityPoints: 0,
        learnedProfessionAbilities: {},
        professionAutoSkills: [],
        inventory: [],
        initialEquipmentSet: false,
        isNewSheet: true
    };
    applyUIVisibility();

    characterState.currentCharacterSkillPoints = calculateInitialSkillPoints(1);

    attackRowCount = 0;
    ['charName', 'playerName', 'homestead', 'level', 'background', 'fortitudeMax', 'fortitudeCurrent', 'resilienceDiceTotal', 'resilienceDiceSpent', 'defense', 'coinsCP', 'coinsSP', 'coinsGP', 'featuresTraits', 'personalityTraits', 'ideals', 'bonds', 'flaws', 'appearanceNotes', 'charAge', 'charHeight', 'charWeight', 'charEyes', 'charHair', 'charSkin', 'notesAllies', 'otherProfessionName', 'otherProfessionDesc', 'quickNotesTextarea'].forEach(id => setValue(id, ""));
    setValue('charName', "New Hobbit"); setValue('homestead', "A Comfy Hole");setValue('level', 1);setValue('background', "Simple Farmer");
    setValue('fortitudeMax', 10); setValue('fortitudeCurrent', 10);setValue('resilienceDiceTotal', "1d6"); setValue('resilienceDiceSpent', 0);setValue('defense', 10);
    setValue('coinsCP', 10); setValue('coinsSP', 5); setValue('coinsGP', 0);
    setValue('featuresTraits', `Hobbit Resilience: Advantage on saving throws against being frightened.\nHobbit Nimbleness: Can move through the space of any creature that is of a size larger than yours.\nBrave Little Souls: Once per long rest, you can reroll a failed attack roll, ability check, or saving throw. You must use the new roll.`);
    setValue('personalityTraits', "Always curious and cheerful.");setValue('ideals', "Comfort and friendship are the best things in life.");setValue('bonds', "My home and my garden mean everything to me.");setValue('flaws', "Perhaps a bit too fond of second breakfast.");setValue('appearanceNotes', "Rosy cheeks and a friendly smile.");setValue('charAge', "33"); setValue('charHeight', "3'6\""); setValue('charWeight', "60 lbs");setValue('charEyes', "Blue"); setValue('charHair', "Brown, curly"); setValue('charSkin', "Fair");

    const charImgDisplay = getElement('characterImageDisplay');
    if (charImgDisplay) charImgDisplay.src = 'https://placehold.co/200x200/A0522D/F0EAD6?text=Brave+Hobbit&font=medievalsharp';
    const charImgInput = getElement('charImage');
    if (charImgInput) charImgInput.value = '';

    ['Brawn', 'Agility', 'Sturdiness', 'Wits', 'Spirit', 'Charm'].forEach(stKey => { const checkbox = getElement(`save${stKey}Prof`); if (checkbox) checkbox.checked = false; });

    setValue('professionSelect', "");
    selectProfession();

    const attacksTBody = getElement('attacksTableBody');
    if (attacksTBody) attacksTBody.innerHTML = '';
    addDefaultAttackRows();

    renderInventoryList();
    updateAllCalculations(true);
    populateSkillsList(); updateCharacterNameInTitle();
    diceLog = []; updateDiceLogDisplay(); logDiceRoll('System', 'New Sheet Initialized', `Version ${SHEET_VERSION}`);
    characterState.isNewSheet = false;
}

function addDefaultAttackRows() {
    const tableBody = getElement('attacksTableBody');
    if (tableBody && tableBody.rows.length === 0) {
        addAttackRow({ name: 'Club (Sturdy Branch)', damage: '1d4 Bludgeoning', notes: 'Light' }, false);
        addAttackRow({ name: 'Sling', damage: '1d4 Bludgeoning', notes: 'Range (30/120)' }, false);
    }
}
function clearCharacterData() { if (confirm("Are you sure you want to clear ALL saved character data? This cannot be undone.")) { localStorage.removeItem(LOCAL_STORAGE_KEY); initializeNewSheet(); alert('All saved data cleared.'); logDiceRoll('System', 'Saved Data Cleared.', 'Sheet reset.'); } }
function exportCharacterData() { const dataToExport = collectCharacterData(); const charName = dataToExport.charName || "hobbit_character"; const filename = `${charName.replace(/\s+/g, '_')}_v${SHEET_VERSION}.json`; const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2)); const downloadAnchorNode = document.createElement('a'); downloadAnchorNode.setAttribute("href", dataStr); downloadAnchorNode.setAttribute("download", filename); document.body.appendChild(downloadAnchorNode); downloadAnchorNode.click(); downloadAnchorNode.remove(); logDiceRoll('System', 'Character data exported.', filename); }
function importCharacterData(event) { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { try { const importedData = JSON.parse(e.target.result); if (importedData.version || confirm("File might be old or not a character sheet. Attempt to load anyway?")) { if (confirm("Importing will overwrite current sheet. Are you sure?")) { applyCharacterData(importedData); saveCharacterData(); alert("Character data imported!"); logDiceRoll('System', 'Character data imported.', file.name); } } else { alert("Invalid character data file."); logDiceRoll('System', 'Import failed: Invalid file.', ''); } } catch (error) { console.error("Error importing file:", error); alert("Error reading character data file."); logDiceRoll('System', 'Import failed: Error reading file.', ''); } }; reader.readAsText(file); if(event.target) event.target.value = null; }

// --- UI AND MISC ---
function openTab(evt, tabName) { Array.from(document.getElementsByClassName("tab-content")).forEach(tc => { tc.style.display = "none"; tc.classList.remove("active"); }); Array.from(document.getElementsByClassName("tab-button")).forEach(tb => tb.classList.remove("active")); getElement(tabName).style.display = "block"; getElement(tabName).classList.add("active"); if(evt && evt.currentTarget) evt.currentTarget.classList.add("active"); }
function togglePersonaSidebar() {
    const sidebar = getElement('personaSidebar');
    sidebar.classList.toggle('translate-x-full');
    if (!sidebar.classList.contains('translate-x-full')) {
        setText('sidebarPersonalityTraits', getValue('personalityTraits') || "Not set.");
        setText('sidebarIdeals', getValue('ideals') || "Not set.");
        setText('sidebarBonds', getValue('bonds') || "Not set.");
        setText('sidebarFlaws', getValue('flaws') || "Not set.");
    }
}
function displayCharacterImage(event) { const reader = new FileReader(); const imageDisplay = getElement('characterImageDisplay'); reader.onload = function(){ imageDisplay.src = reader.result; saveCharacterData(true); }; if (event.target.files && event.target.files[0]) reader.readAsDataURL(event.target.files[0]); else imageDisplay.src = 'https://placehold.co/200x200/A0522D/F0EAD6?text=Brave+Hobbit&font=medievalsharp'; }
function addCustomAbility() { const featuresTextarea = getElement('featuresTraits'); const abilityName = prompt("Enter name of custom ability/feature:"); if (!abilityName) return; const abilityDesc = prompt(`Enter description for ${abilityName}:`); if (!abilityDesc) return; let currentFeatures = featuresTextarea.value; const customFeatureMarker = "CUSTOM ABILITY:"; const newFeature = `\n${customFeatureMarker} ${abilityName} - ${abilityDesc}`; const customHeaderMarker = "\n\n--- Custom Features ---"; if (currentFeatures.includes(customHeaderMarker)) currentFeatures = currentFeatures.replace(customHeaderMarker, customHeaderMarker + newFeature); else if (currentFeatures.includes(customFeatureMarker)) currentFeatures += newFeature; else currentFeatures += `${customHeaderMarker}${newFeature}`; featuresTextarea.value = currentFeatures; logDiceRoll('System', 'Custom feature added.', `Name: ${abilityName}`); saveCharacterData(true); }
function updateCharacterNameInTitle() { const charName = getValue('charName') || "Unnamed Hobbit"; document.title = `${charName} - Hobbit Adventures`; setText('sheetTitle', `${charName} - Character Sheet`); }

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Ensure characterState is fully initialized at the very beginning
    characterState = {
        uiVisibility: { quickNotesArea: true, customDiceRollerFixed: true, diceRollerSectionFixed: true },
        abilities: { brawn: MIN_BASE_ABILITY_SCORE, agility: MIN_BASE_ABILITY_SCORE, sturdiness: MIN_BASE_ABILITY_SCORE, wits: MIN_BASE_ABILITY_SCORE, spirit: MIN_BASE_ABILITY_SCORE, charm: MIN_BASE_ABILITY_SCORE },
        baseAbilities: { brawn: MIN_BASE_ABILITY_SCORE, agility: MIN_BASE_ABILITY_SCORE, sturdiness: MIN_BASE_ABILITY_SCORE, wits: MIN_BASE_ABILITY_SCORE, spirit: MIN_BASE_ABILITY_SCORE, charm: MIN_BASE_ABILITY_SCORE },
        abilityPointsAvailable: INITIAL_ABILITY_SCORE_POINTS,
        customLearnedSkills: [],
        savingThrowsProf: {},
        learnedSkills: {},
        professionAutoSkills: [],
        learnedProfessionAbilities: {},
        inventory: [],
        customLearnedSkills: [],
        currentCharacterSkillPoints: 0,
        professionKey: "",
        professionName: "",
        professionDesc: "",
        professionSkillPointsBonus: 0,
        professionBonusApplied: false,
        professionAbilityPointsTotal: 0,
        spentProfessionAbilityPoints: 0,
        initialEquipmentSet: false,
        isNewSheet: true, // Will be set to false after load or init
        level: 1 // Default level
    };


    if (typeof getAllItemsList === "function" && typeof ALL_GAME_ITEMS !== 'undefined') { masterItemList = getAllItemsList(); populateAddItemSelect(); }
    else { console.error("Item data not found."); masterItemList = []; }

    const professionSelectEl = getElement('professionSelect');
    if (professionSelectEl && typeof PROFESSIONS_DATA !== 'undefined') { for (const key in PROFESSIONS_DATA) { const option = document.createElement('option'); option.value = key; option.textContent = PROFESSIONS_DATA[key].name; professionSelectEl.appendChild(option); } }
    else console.error("Profession data or select element missing.");

    const savingThrowsList = getElement('savingThrowsList');
    if (savingThrowsList) {
        savingThrowsList.innerHTML = '';
        ['Brawn', 'Agility', 'Sturdiness', 'Wits', 'Spirit', 'Charm'].forEach(stat => {
            const div = document.createElement('div'); div.className = 'flex items-center space-x-2 mb-1';
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = `save${stat}Prof`; checkbox.className = 'form-checkbox h-4 w-4 text-hobbit-green rounded focus:ring-hobbit-green';
            checkbox.onchange = () => { if(characterState && characterState.savingThrowsProf) characterState.savingThrowsProf[`save${stat}Prof`] = checkbox.checked; updateSavingThrowsDisplay(); saveCharacterData(true); };
            const label = document.createElement('label'); label.htmlFor = `save${stat}Prof`; label.className = 'text-hobbit-brown'; label.textContent = `${stat}:`;
            const valueSpan = document.createElement('span'); valueSpan.id = `save${stat}Value`; valueSpan.className = 'font-bold text-hobbit-green w-8 text-right'; valueSpan.textContent = '+0';
            const rollButton = document.createElement('button'); rollButton.textContent = 'Roll'; rollButton.className = 'button-hobbit-base button-hobbit-action text-xs py-0.5 px-2 ml-auto'; rollButton.onclick = () => rollSavingThrow(stat.toLowerCase());
            div.appendChild(checkbox); div.appendChild(label); div.appendChild(valueSpan); div.appendChild(rollButton);
            savingThrowsList.appendChild(div);
        });
    }
    ['brawn', 'agility', 'sturdiness', 'wits', 'spirit', 'charm'].forEach(id => {
        const increaseBtn = getElement(`${id}IncreaseBtn`);
        const decreaseBtn = getElement(`${id}DecreaseBtn`);
        if (increaseBtn) increaseBtn.onclick = () => spendAbilityPoint(id);
        if (decreaseBtn) decreaseBtn.onclick = () => unspendAbilityPoint(id);
    });


    // IMPORTANT: loadCharacterData must be called before initializeNewSheet
    // to ensure DM-passed data or saved data is prioritized.
    if (!loadCharacterData()) { // This now tries DM_VIEW_PLAYER_KEY first, then LOCAL_STORAGE_KEY
        console.log("No character data found or loaded. Initializing new sheet.");
        initializeNewSheet(); // If no data found, initialize a new sheet
    } else {
        console.log("Character data loaded successfully.");
        // applyUIVisibility() is called within applyCharacterData now
    }

    const charNameEl = getElement('charName'); if (charNameEl) charNameEl.addEventListener('input', updateCharacterNameInTitle);
    setText('sheetVersionDisplay', SHEET_VERSION);
    const firstTabButton = document.querySelector('.tab-button'); if (firstTabButton) openTab({ currentTarget: firstTabButton }, 'mainStats');
    if (autoSaveTimer) clearInterval(autoSaveTimer); autoSaveTimer = setInterval(() => saveCharacterData(true), AUTO_SAVE_INTERVAL_MS);

    ['defense', 'fortitudeCurrent'].forEach(id => { const el = getElement(id); if (el) el.addEventListener('change', () => { updateAllCalculations(true); saveCharacterData(true); }); });
    const simpleSaveFields = [ 'charName', 'playerName', 'homestead', 'background', 'resilienceDiceTotal', 'resilienceDiceSpent', 'coinsCP', 'coinsSP', 'coinsGP', 'featuresTraits', 'personalityTraits', 'ideals', 'bonds', 'flaws', 'appearanceNotes', 'charAge', 'charHeight', 'charWeight', 'charEyes', 'charHair', 'charSkin', 'notesAllies', 'quickNotesTextarea', 'otherProfessionName', 'otherProfessionDesc' ];
    simpleSaveFields.forEach(id => { const el = getElement(id); if (el) el.addEventListener('change', () => saveCharacterData(true)); });


    if (typeof SKILLS_DATA !== 'undefined') populateSkillsList(); else console.error("SKILLS_DATA not found.");
    updateAllCalculations(true);
    renderInventoryList();
});
