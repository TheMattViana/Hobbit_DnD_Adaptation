// dm_script.js - Dungeon Master Dashboard Logic (with Player Sheet Modal)

const DM_LOCAL_STORAGE_KEY = "hobbitAdventureDM_data"; // Changed key to store all DM data
const DM_VIEW_PLAYER_KEY = "DM_VIEW_PLAYER_DATA"; // Key for passing player data to player sheet (now unused for modal view)

// Add a new state object for DM UI visibility and encounter state
let dmState = {
    uiVisibility: {
        customDiceRollerFixedDM: true,
        diceLogSectionFixedDM: true,
        quickNotesAreaDM: true
    },
    quickNotesText: "",
    currentEncounter: [], // Initialize current encounter here
    dmDiceLog: [], // Initialize DM dice log here
    loadedPlayerCharacters: [] // Initialize loaded player characters here
};

// --- UTILITY FUNCTIONS ---
// Helper to get an HTML element by its ID
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        // console.warn(`Element with ID '${id}' not found.`); // Suppress for cleaner console unless debugging specific elements
    }
    return element;
}

// Helper to get the value of an input element (handles text, number, checkbox)
function getValue(id) {
    const el = getElement(id);
    if (!el) return null;
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'number') return parseInt(el.value) || 0;
    return el.value;
}

// Helper to set the value of an input element (handles text, number, checkbox)
function setValue(id, value) {
    const el = getElement(id);
    if (el) {
        if (el.type === 'checkbox') el.checked = value;
        else el.value = value;
    }
}

// Helper to set the text content of an element
function setText(id, text) {
    const el = getElement(id);
    if (el) {
        el.textContent = text;
    }
}

// Function to calculate ability modifier
function calculateModifier(score) {
    return Math.floor((score - 10) / 2);
}

// --- DM UI VISIBILITY TOGGLE ---
function toggleSectionVisibility(sectionId) {
    const section = getElement(sectionId);
    if (section) {
        section.classList.toggle('hidden');
        dmState.uiVisibility[sectionId] = !section.classList.contains('hidden');
        saveDMData(true); // Auto-save UI preference
    }
}

function applyDMUIVisibility() {
    for (const sectionId in dmState.uiVisibility) {
        const section = getElement(sectionId);
        if (section) {
            if (dmState.uiVisibility[sectionId]) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        }
    }
}

// --- DM TAB MANAGEMENT ---
// Function to handle tab switching in the DM dashboard
function openDMTab(evt, tabName) {
    console.log(`Opening DM tab: ${tabName}`);
    // Hide all tab content sections
    Array.from(document.getElementsByClassName("dm-tab-content")).forEach(tc => {
        tc.style.display = "none";
        tc.classList.remove("active");
    });
    // Deactivate all tab buttons
    Array.from(document.getElementsByClassName("tab-button")).forEach(tb => tb.classList.remove("active"));

    // Show the selected tab content and activate its button
    const selectedTabContent = getElement(tabName);
    if (selectedTabContent) {
        selectedTabContent.style.display = "block";
        selectedTabContent.classList.add("active");
    }
    if(evt && evt.currentTarget) {
        evt.currentTarget.classList.add("active");
    }

    // Refresh content for specific tabs when they are opened to ensure data is current
    switch (tabName) {
        case 'playerOverview':
            renderPlayerSummaryList();
            break;
        case 'encounterTracker':
            populateEncounterAddDropdowns(); // Populate dropdowns when opening encounter tab
            renderEncounterList();
            break;
        case 'monsterManual':
            renderMonsterList(getValue('monsterFilter'));
            break;
        case 'itemsReference':
            renderItemList(getValue('itemFilter'));
            break;
        case 'skillsReference':
            renderSkillList(getValue('skillFilter'));
            break;
        case 'callingsReference':
            renderCallingList(getValue('callingFilter'));
            break;
        case 'diceRollerDM': // This is the tab-based dice roller
            updateDMDiceLogDisplay();
            break;
    }
}


// --- PLAYER CHARACTER MANAGEMENT ---

// Imports multiple player character JSON files selected by the user
function importPlayerCharacters(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        console.log("No files selected for import.");
        return;
    }

    let importedCount = 0;
    let filesProcessed = 0;
    const totalFiles = files.length;

    Array.from(files).forEach(file => {
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                // Basic check for a valid character sheet by looking for charName
                if (importedData && importedData.charName) {
                    // Check if a character with the same name is already loaded to prevent duplicates
                    if (!dmState.loadedPlayerCharacters.some(pc => pc.charName === importedData.charName)) {
                        dmState.loadedPlayerCharacters.push(importedData);
                        importedCount++;
                        logDMRoll('System', `Imported Player: ${importedData.charName}`, `File: ${file.name}`);
                    } else {
                        logDMRoll('System', `Skipped Duplicate Player: ${importedData.charName}`, `A character with this name is already loaded.`);
                    }
                } else {
                    logDMRoll('System', `Skipped Invalid File: ${file.name}`, `Not a valid character sheet JSON.`);
                }
            } catch (error) {
                console.error("Error parsing file:", file.name, error);
                logDMRoll('System', `Error parsing file: ${file.name}`, `File might be corrupted or not JSON.`);
            } finally {
                filesProcessed++;
                // After all files are processed
                if (filesProcessed === totalFiles) {
                    saveDMData(); // Save the updated list of players
                    renderPlayerSummaryList(); // Re-render the player list
                    populateEncounterAddDropdowns(); // Update encounter dropdowns
                    alert(`Successfully imported ${importedCount} character(s).`);
                    event.target.value = null; // Clear the file input for subsequent imports
                }
            }
        };
        reader.onerror = function(e) {
            console.error("Error reading file:", file.name, e);
            logDMRoll('System', `Error reading file: ${file.name}`, `Could not read file.`);
            filesProcessed++;
            if (filesProcessed === totalFiles) {
                saveDMData();
                renderPlayerSummaryList();
                populateEncounterAddDropdowns(); // Update encounter dropdowns
                alert(`Finished import with errors. Imported ${importedCount} character(s).`);
                event.target.value = null;
            }
        };
        reader.readAsText(file); // Read the file content as text
    });
}

// Renders a summarized list of all loaded player characters
function renderPlayerSummaryList() {
    const playerListDiv = getElement('playerSummaryList');
    if (!playerListDiv) return;

    playerListDiv.innerHTML = ''; // Clear existing list
    if (dmState.loadedPlayerCharacters.length === 0) {
        playerListDiv.innerHTML = '<p class="text-gray-600 italic">No player characters loaded yet. Import JSON files above.</p>';
        return;
    }

    dmState.loadedPlayerCharacters.forEach(pc => {
        // Calculate basic stats for display
        const level = pc.level || 1;
        // Proficiency bonus calculation (simplified from player script)
        const profBonus = (level >= 17 ? 6 : (level >= 13 ? 5 : (level >= 9 ? 4 : (level >= 5 ? 3 : 2))));
        // Ability modifier calculation (simplified, assumes base 10 if not set)
        const agilityScore = (pc.abilities && pc.abilities.agility) ? pc.abilities.agility : 10;
        const initiative = calculateModifier(agilityScore); // Use common utility function

        const playerCard = document.createElement('div');
        // Applying player-summary-card for overall styling
        playerCard.className = 'player-summary-card p-4 shadow-md bg-hobbit-parchment-light rounded-md';
        playerCard.innerHTML = `
            <h4 class="text-lg font-medieval text-hobbit-brown mb-2">${pc.charName || 'Unnamed'} (Lvl ${level})</h4>
            <p class="text-sm"><strong>Calling:</strong> ${pc.professionName || 'None'}</p>
            <p class="text-sm"><strong>Homestead:</strong> ${pc.homestead || 'Unknown'}</p>
            <div class="grid grid-cols-2 gap-x-2 mt-2 text-sm">
                <p><strong>Fortitude:</strong> ${pc.fortitudeCurrent || pc.fortitudeMax || 10}/${pc.fortitudeMax || 10}</p>
                <p><strong>Defense (AC):</strong> ${pc.defense || 10}</p>
                <p><strong>Initiative:</strong> ${(initiative >= 0 ? '+' : '')}${initiative}</p>
                <p><strong>Prof. Bonus:</strong> +${profBonus}</p>
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="dm.openPlayerSheetModal('${pc.charName}')" class="button-hobbit-base button-hobbit-action text-xs py-1 px-2">View Full Sheet</button>
                <button onclick="dm.removePlayerCharacter('${pc.charName}')" class="button-hobbit-base button-hobbit-clear text-xs py-1 px-2">Remove</button>
            </div>
        `;
        playerListDiv.appendChild(playerCard);
    });
}

// Opens the full player character sheet in a modal
function openPlayerSheetModal(charName) {
    const player = dmState.loadedPlayerCharacters.find(pc => pc.charName === charName);
    const modal = getElement('playerSheetModal');
    const contentDiv = getElement('playerSheetContent');

    if (!player || !modal || !contentDiv) {
        console.error("Could not open player sheet modal. Missing player data or modal elements.");
        return;
    }

    // Populate modal content
    contentDiv.innerHTML = `
        <h2 class="text-3xl font-medieval text-hobbit-green mb-4 border-b-2 border-hobbit-brown pb-2">${player.charName || 'Unnamed Hobbit'}</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><strong>Player:</strong> ${player.playerName || 'N/A'}</div>
            <div><strong>Homestead:</strong> ${player.homestead || 'N/A'}</div>
            <div><strong>Level:</strong> ${player.level || 1}</div>
            <div><strong>Calling:</strong> ${player.professionName || 'N/A'}</div>
        </div>

        <h3 class="text-xl font-medieval text-hobbit-brown mb-2">Core Stats</h3>
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><strong>Prof. Bonus:</strong> +${(player.level >= 17 ? 6 : (player.level >= 13 ? 5 : (player.level >= 9 ? 4 : (player.level >= 5 ? 3 : 2))))}</div>
            <div><strong>Initiative:</strong> ${(calculateModifier(player.abilities.agility || 10) >= 0 ? '+' : '')}${calculateModifier(player.abilities.agility || 10)}</div>
            <div><strong>Defense (AC):</strong> ${player.defense || 10}</div>
            <div>
                <strong>Fortitude (HP):</strong>
                <input type="number" id="playerModalCurrentHP" value="${player.fortitudeCurrent || player.fortitudeMax || 10}"
                       min="0" max="${player.fortitudeMax || 10}"
                       class="input-hobbit-sm w-16 text-center text-sm p-1 ml-1"
                       onchange="dm.updatePlayerModalHP('${player.charName}', this.value)">
                / ${player.fortitudeMax || 10}
            </div>
        </div>

        <h3 class="text-xl font-medieval text-hobbit-brown mb-2">Ability Scores</h3>
        <div class="grid grid-cols-3 gap-2 mb-4">
            ${Object.entries(player.abilities || {}).map(([key, value]) => `
                <div class="text-center p-2 border border-hobbit-gold/50 rounded-md bg-hobbit-parchment-light">
                    <strong class="block text-hobbit-brown">${key.substring(0, 3).toUpperCase()}</strong>
                    <span class="text-xl font-bold text-hobbit-green">${value}</span>
                    <span class="text-sm text-gray-700">Mod: ${(calculateModifier(value) >= 0 ? '+' : '')}${calculateModifier(value)}</span>
                </div>
            `).join('')}
        </div>

        <h3 class="text-xl font-medieval text-hobbit-brown mt-4 mb-2">Saving Throws</h3>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            ${['Brawn', 'Agility', 'Sturdiness', 'Wits', 'Spirit', 'Charm'].map(saveName => {
                const abilityKey = saveName.toLowerCase();
                const totalAbilityScore = player.abilities[abilityKey] || 10;
                const abilityMod = calculateModifier(totalAbilityScore);
                const isProficient = player.savingThrowsProf && player.savingThrowsProf[`save${saveName}Prof`];
                const profBonus = (player.level >= 17 ? 6 : (player.level >= 13 ? 5 : (player.level >= 9 ? 4 : (player.level >= 5 ? 3 : 2))));
                const totalBonus = abilityMod + (isProficient ? profBonus : 0);
                return `<div><strong>${saveName}:</strong> ${(totalBonus >= 0 ? '+' : '')}${totalBonus} ${isProficient ? '(P)' : ''}</div>`;
            }).join('')}
        </div>

        <h3 class="text-xl font-medieval text-hobbit-brown mt-4 mb-2">Skills</h3>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            ${(player.learnedSkills && SKILLS_DATA) ? Object.keys(player.learnedSkills).map(skillId => {
                const skill = SKILLS_DATA.find(s => s.id === skillId);
                if (!skill) return '';
                const totalAbilityScore = player.abilities[skill.ability] || 10;
                const abilityMod = calculateModifier(totalAbilityScore);
                const profBonus = (player.level >= 17 ? 6 : (player.level >= 13 ? 5 : (player.level >= 9 ? 4 : (player.level >= 5 ? 3 : 2))));
                const totalSkillBonus = abilityMod + profBonus; // Assuming learned skills are proficient
                return `<div><strong>${skill.name}:</strong> ${(totalSkillBonus >= 0 ? '+' : '')}${totalSkillBonus}</div>`;
            }).join('') : '<p class="text-sm text-gray-500 italic">No skills learned.</p>'}
        </div>

        <h3 class="text-xl font-medieval text-hobbit-brown mt-4 mb-2">Inventory Summary</h3>
        <div class="mb-4 max-h-48 overflow-y-auto border p-2 rounded bg-hobbit-parchment-light">
            ${(player.inventory && player.inventory.length > 0) ? player.inventory.map(item => `
                <p class="text-sm">${item.name} ${item.equipped ? '(Equipped)' : ''} - ${item.description || ''}</p>
            `).join('') : '<p class="text-sm text-gray-500 italic">No items in inventory.</p>'}
        </div>

        <h3 class="text-xl font-medieval text-hobbit-brown mt-4 mb-2">DM Notes / Temp Effects</h3>
        <textarea id="playerModalDMNotes" class="input-hobbit w-full text-sm p-2 resize-none" rows="4"
                  onchange="dm.updatePlayerModalNotes('${player.charName}', this.value)">${player.dmNotes || ''}</textarea>

        <h3 class="text-xl font-medieval text-hobbit-brown mt-4 mb-2">Features & Traits</h3>
        <div class="mb-4 max-h-48 overflow-y-auto border p-2 rounded bg-hobbit-parchment-light whitespace-pre-wrap">
            ${player.featuresTraits || '<p class="text-sm text-gray-500 italic">No features/traits.</p>'}
        </div>
    `;

    modal.classList.remove('hidden'); // Show the modal
}

// Closes the player sheet modal
function closePlayerSheetModal() {
    const modal = getElement('playerSheetModal');
    if (modal) {
        modal.classList.add('hidden'); // Hide the modal
    }
}

// Updates a player's current Fortitude (HP) in the loadedPlayerCharacters array
function updatePlayerModalHP(charName, newHP) {
    const playerIndex = dmState.loadedPlayerCharacters.findIndex(pc => pc.charName === charName);
    if (playerIndex > -1) {
        let hp = parseInt(newHP) || 0;
        const player = dmState.loadedPlayerCharacters[playerIndex];
        if (hp > player.fortitudeMax) {
            hp = player.fortitudeMax; // Cap at max HP
        } else if (hp < 0) {
            hp = 0; // Don't go below 0
        }
        player.fortitudeCurrent = hp;
        saveDMData(true); // Save the updated player data
        logDMRoll('Player HP', `${charName} HP: ${hp}/${player.fortitudeMax}`);
        // Re-render player summary list to reflect HP change on main overview
        renderPlayerSummaryList();
        // Also update HP in encounter tracker if present
        const encounterParticipant = dmState.currentEncounter.find(p => p.type === 'player' && p.name === charName);
        if (encounterParticipant) {
            encounterParticipant.currentFortitude = hp;
            renderEncounterList();
        }
    }
}

// Updates DM notes for a player in the loadedPlayerCharacters array
function updatePlayerModalNotes(charName, newNotes) {
    const playerIndex = dmState.loadedPlayerCharacters.findIndex(pc => pc.charName === charName);
    if (playerIndex > -1) {
        dmState.loadedPlayerCharacters[playerIndex].dmNotes = newNotes;
        saveDMData(true); // Save the updated player data
        logDMRoll('Player Notes', `${charName} Notes Updated`);
    }
}


// Removes a specific player character from the loaded list
function removePlayerCharacter(charName) {
    if (confirm(`Are you sure you want to remove ${charName}? This cannot be undone for this session.`)) {
        dmState.loadedPlayerCharacters = dmState.loadedPlayerCharacters.filter(pc => pc.charName !== charName);
        saveDMData(); // Save changes to local storage
        renderPlayerSummaryList(); // Re-render the list
        populateEncounterAddDropdowns(); // Update encounter dropdowns
        logDMRoll('System', `Removed Player: ${charName}`);
    }
}

// Clears all loaded player characters from the list
function clearAllPlayers() {
    if (confirm("Are you sure you want to clear ALL loaded player characters? This cannot be undone for this session.")) {
        dmState.loadedPlayerCharacters = [];
        saveDMData(); // Clear from local storage
        renderPlayerSummaryList(); // Re-render the empty list
        populateEncounterAddDropdowns(); // Update encounter dropdowns
        logDMRoll('System', 'Cleared all loaded player characters.');
    }
}

// --- ENCOUNTER TRACKER FUNCTIONS ---
function populateEncounterAddDropdowns() {
    const playerSelect = getElement('addPlayerToEncounterSelect');
    const monsterSelect = getElement('addMonsterToEncounterSelect');

    if (playerSelect) {
        playerSelect.innerHTML = '<option value="">-- Select Player --</option>';
        dmState.loadedPlayerCharacters.forEach(pc => {
            const option = document.createElement('option');
            option.value = pc.charName;
            option.textContent = pc.charName;
            playerSelect.appendChild(option);
        });
    }

    if (monsterSelect && typeof MONSTERS_DATA !== 'undefined' && Array.isArray(MONSTERS_DATA)) {
        monsterSelect.innerHTML = '<option value="">-- Select Monster --</option>';
        MONSTERS_DATA.sort((a,b) => a.name.localeCompare(b.name)).forEach(monster => {
            const option = document.createElement('option');
            option.value = monster.id;
            option.textContent = `${monster.name} (CR ${monster.challengeRating})`;
            monsterSelect.appendChild(option);
        });
    }
}

function addSelectedPlayerToEncounter() {
    const playerSelect = getElement('addPlayerToEncounterSelect');
    if (!playerSelect || !playerSelect.value) return;

    const charName = playerSelect.value;
    const player = dmState.loadedPlayerCharacters.find(pc => pc.charName === charName);

    if (player) {
        // Ensure player is not already in encounter (by name, as IDs might differ if re-added)
        if (dmState.currentEncounter.some(p => p.type === 'player' && p.name === player.charName)) {
            alert(`${player.charName} is already in the encounter.`);
            return;
        }

        const agilityScore = (player.abilities && player.abilities.agility) ? player.abilities.agility : 10;
        const initiativeMod = calculateModifier(agilityScore);
        const newParticipant = {
            id: `player_${player.charName}_${Date.now()}`, // Unique ID for instance
            name: player.charName,
            type: 'player',
            maxFortitude: player.fortitudeMax || 10,
            currentFortitude: player.fortitudeCurrent || player.fortitudeMax || 10,
            initiative: 0, // Will be rolled
            initiativeMod: initiativeMod,
            data: player // Store full player data for later reference if needed
        };
        dmState.currentEncounter.push(newParticipant);
        logDMRoll('Encounter', `Added Player: ${player.charName}`);
        renderEncounterList();
        saveDMData(true);
        playerSelect.value = ""; // Reset dropdown
    }
}

function addSelectedMonsterToEncounter() {
    const monsterSelect = getElement('addMonsterToEncounterSelect');
    if (!monsterSelect || !monsterSelect.value) return;

    const monsterId = monsterSelect.value;
    const monster = MONSTERS_DATA.find(m => m.id === monsterId);

    if (monster) {
        // Allow adding multiple instances of the same monster
        const instanceCount = dmState.currentEncounter.filter(p => p.type === 'monster' && p.data.id === monster.id).length + 1;
        const instanceName = `${monster.name} #${instanceCount}`;

        const agilityScore = (monster.abilities && monster.abilities.agility) ? monster.abilities.agility : 10;
        const initiativeMod = calculateModifier(agilityScore);
        const newParticipant = {
            id: `monster_${monster.id}_${Date.now()}`, // Unique ID for instance
            name: instanceName, // Use instance name
            originalName: monster.name, // Keep original name for reference
            type: 'monster',
            maxFortitude: monster.fortitude,
            currentFortitude: monster.fortitude,
            initiative: 0, // Will be rolled
            initiativeMod: initiativeMod,
            data: monster // Store full monster data for later reference if needed
        };
        dmState.currentEncounter.push(newParticipant);
        logDMRoll('Encounter', `Added Monster: ${instanceName}`);
        renderEncounterList();
        saveDMData(true);
        monsterSelect.value = ""; // Reset dropdown
    }
}

function renderEncounterList() {
    const encounterListDiv = getElement('encounterList');
    if (!encounterListDiv) return;

    encounterListDiv.innerHTML = '';
    if (dmState.currentEncounter.length === 0) {
        encounterListDiv.innerHTML = '<p class="text-gray-600 italic">Add players or monsters to start an encounter.</p>';
        return;
    }

    dmState.currentEncounter.forEach((participant, index) => {
        const participantDiv = document.createElement('div');
        participantDiv.className = `p-3 border-2 rounded-md shadow-sm mb-2 ${participant.type === 'player' ? 'bg-hobbit-parchment-light border-hobbit-green/50' : 'bg-hobbit-parchment/80 border-hobbit-red/50'}`;
        participantDiv.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <h4 class="font-medieval text-lg ${participant.type === 'player' ? 'text-hobbit-green' : 'text-hobbit-red'}">
                    ${participant.name} <span class="text-sm font-sans text-gray-600">(${participant.type === 'player' ? 'Player' : 'Monster'})</span>
                </h4>
                <button onclick="dm.removeEncounterParticipant(${index})" class="button-hobbit-base button-hobbit-clear text-xs py-0.5 px-1.5">Remove</button>
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-2">
                <div>
                    <strong>Initiative:</strong>
                    <input type="number" value="${participant.initiative}" class="input-hobbit-sm w-16 text-center text-sm p-1 ml-1" onchange="dm.updateEncounterInitiative(${index}, this.value)">
                    <button onclick="dm.rollIndividualInitiative(${index})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 ml-1">Roll</button>
                </div>
                <div>
                    <strong>Fortitude:</strong>
                    <input type="number" value="${participant.currentFortitude}" class="input-hobbit-sm w-16 text-center text-sm p-1 ml-1" onchange="dm.updateEncounterHP(${index}, this.value)">
                    / ${participant.maxFortitude}
                </div>
            </div>
            ${participant.type === 'monster' && participant.data && participant.data.actions ? `
                <div class="mt-2 text-xs">
                    <strong>Actions:</strong>
                    ${participant.data.actions.map((action, actionIdx) => `
                        <span class="inline-block bg-hobbit-brown/10 rounded px-1 py-0.5 mr-1 mb-1">
                            ${action.name}
                            <button onclick="dm.rollMonsterAttack('${participant.data.id}', ${actionIdx})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1 ml-1">Atk</button>
                            ${action.damage ? `<button onclick="dm.rollMonsterDamage('${participant.data.id}', ${actionIdx})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1 ml-0.5">Dmg</button>` : ''}
                        </span>
                    `).join('')}
                </div>
            ` : ''}
            ${participant.type === 'player' && participant.data ? `
                <div class="mt-2 text-xs">
                    <button onclick="dm.openPlayerSheetModal('${participant.data.charName}')" class="button-hobbit-base button-hobbit-import text-xs py-1 px-2 mt-2">View Player Sheet</button>
                </div>
            ` : ''}
        `;
        encounterListDiv.appendChild(participantDiv);
    });
    saveDMData(true); // Save encounter state after rendering
}

function rollAllInitiative() {
    dmState.currentEncounter.forEach(p => {
        p.initiative = performDMRoll(1, 20, p.initiativeMod, `${p.name} Initiative`);
    });
    sortInitiative(); // Sort after rolling
}

function rollIndividualInitiative(index) {
    if (dmState.currentEncounter[index]) {
        const p = dmState.currentEncounter[index];
        p.initiative = performDMRoll(1, 20, p.initiativeMod, `${p.name} Initiative`);
        renderEncounterList(); // Re-render to update the single initiative value
        sortInitiative(); // Resort after individual roll
    }
}

function sortInitiative() {
    dmState.currentEncounter.sort((a, b) => b.initiative - a.initiative); // Descending order
    renderEncounterList();
    logDMRoll('Encounter', 'Initiative Sorted');
    saveDMData(true);
}

function updateEncounterInitiative(index, newInitiative) {
    if (dmState.currentEncounter[index]) {
        dmState.currentEncounter[index].initiative = parseInt(newInitiative) || 0;
        // No need to re-render and sort immediately here, as it happens on sortInitiative() or next full render
        saveDMData(true);
    }
}

function updateEncounterHP(index, newHP) {
    if (dmState.currentEncounter[index]) {
        let hp = parseInt(newHP) || 0;
        if (hp > dmState.currentEncounter[index].maxFortitude) {
            hp = dmState.currentEncounter[index].maxFortitude; // Cap at max HP
        } else if (hp < 0) { // Ensure HP doesn't go below 0
            hp = 0;
        }
        dmState.currentEncounter[index].currentFortitude = hp;
        renderEncounterList(); // Re-render to update the display
        saveDMData(true);
        logDMRoll('Encounter', `${dmState.currentEncounter[index].name} HP: ${hp}/${dmState.currentEncounter[index].maxFortitude}`);

        // If this is a player character in the encounter, also update their main loadedPlayerCharacters data
        if (dmState.currentEncounter[index].type === 'player') {
            const playerInLoadedList = dmState.loadedPlayerCharacters.find(p => p.charName === dmState.currentEncounter[index].name);
            if (playerInLoadedList) {
                playerInLoadedList.fortitudeCurrent = hp;
                // No need to re-render player summary here, as renderEncounterList already calls saveDMData
            }
        }
    }
}

function removeEncounterParticipant(index) {
    if (confirm(`Remove ${dmState.currentEncounter[index].name} from encounter?`)) {
        logDMRoll('Encounter', `Removed: ${dmState.currentEncounter[index].name}`);
        dmState.currentEncounter.splice(index, 1);
        renderEncounterList();
        saveDMData(true);
    }
}

function clearEncounter() {
    if (confirm("Are you sure you want to clear the entire encounter?")) {
        dmState.currentEncounter = [];
        logDMRoll('Encounter', 'Encounter Cleared');
        renderEncounterList();
        saveDMData(true);
    }
}


// --- MONSTER MANUAL FUNCTIONS ---
// Renders the list of monsters, with an optional filter
function renderMonsterList(filterText = '') {
    const monsterListDiv = getElement('monsterList');
    if (!monsterListDiv) return;
    monsterListDiv.innerHTML = ''; // Clear existing list

    // Ensure MONSTERS_DATA is available
    if (typeof MONSTERS_DATA === 'undefined' || !Array.isArray(MONSTERS_DATA)) {
        monsterListDiv.innerHTML = '<p class="text-red-600 italic">Monster data not loaded. Check hobbit_data_monsters.js.</p>';
        console.error("MONSTERS_DATA is not defined or not an array.");
        return;
    }

    // Filter monsters based on the provided text
    const lowerFilter = filterText ? filterText.toLowerCase() : '';
    const filteredMonsters = MONSTERS_DATA.filter(monster => {
        return monster.name.toLowerCase().includes(lowerFilter) ||
               monster.type.toLowerCase().includes(lowerFilter) ||
               (monster.description && monster.description.toLowerCase().includes(lowerFilter)) ||
               (monster.traits && monster.traits.some(trait => trait.description.toLowerCase().includes(lowerFilter))) ||
               (monster.actions && monster.actions.some(action => action.name.toLowerCase().includes(lowerFilter) || (action.description && action.description.toLowerCase().includes(lowerFilter))));
    });

    if (filteredMonsters.length === 0) {
        monsterListDiv.innerHTML = '<p class="text-gray-600 italic">No monsters match your filter.</p>';
        return;
    }

    // Create and append a card for each filtered monster
    filteredMonsters.forEach(monster => {
        const monsterCard = document.createElement('div');
        monsterCard.className = 'monster-card rounded-lg';
        monsterCard.innerHTML = `
            <h4 class="text-lg font-medieval mb-2">${monster.name} <span class="text-sm font-sans text-gray-600">(CR ${monster.challengeRating})</span></h4>
            <p class="text-sm italic mb-2">${monster.type}</p>
            <div class="grid grid-cols-2 gap-x-4 mb-3 text-sm">
                <div class="stat-line"><strong>Fortitude:</strong> ${monster.fortitude}</div>
                <div><strong>AC:</strong> ${monster.armorClass}</div>
                <div class="stat-line"><strong>Speed:</strong> ${monster.speed}</div>
                <div><strong>Languages:</strong> ${monster.languages || '—'}</div>
                <div class="stat-line col-span-2"><strong>Senses:</strong> ${monster.senses}</div>
            </div>
            <h5 class="text-md font-medieval text-hobbit-brown mb-2">Abilities</h5>
            <div class="abilities-grid">
                ${Object.entries(monster.abilities || {}).map(([key, value]) => `
                    <div class="ability-item"><strong>${key.substring(0, 3).toUpperCase()}</strong><span>${value}</span></div>
                `).join('')}
            </div>
            ${monster.skills && monster.skills.length > 0 ? `
                <h5 class="text-md font-medieval text-hobbit-brown mt-4 mb-2">Skills</h5>
                <p class="text-sm">${monster.skills.join(', ')}</p>
            ` : ''}
            <h5 class="text-md font-medieval text-hobbit-brown mt-4 mb-2">Traits</h5>
            <ul class="list-disc list-inside text-sm space-y-1">
                ${(monster.traits || []).map(trait => `<li><strong>${trait.name}:</strong> ${trait.description}</li>`).join('')}
            </ul>
            <h5 class="text-md font-medieval text-hobbit-brown mt-4 mb-2">Actions</h5>
            <ul class="list-disc list-inside text-sm space-y-1">
                ${(monster.actions || []).map((action, actionIndex) => `
                    <li>
                        <strong>${action.name}:</strong> ${action.attackBonus ? `+${action.attackBonus} to hit, ` : ''}${action.damage || ''}${action.range ? `, range ${action.range}` : ''}${action.description ? `. ${action.description}` : ''}
                        <button onclick="dm.rollMonsterAttack('${monster.id}', ${actionIndex})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 ml-2">Atk</button>
                        ${action.damage ? `<button onclick="dm.rollMonsterDamage('${monster.id}', ${actionIndex})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 ml-1">Dmg</button>` : ''}
                    </li>
                `).join('')}
            </ul>
            <p class="text-xs italic text-gray-700 mt-4">${monster.description || ''}</p>
            <button onclick="dm.openMonsterSheetModal('${monster.id}')" class="button-hobbit-base button-hobbit-import text-xs py-1 px-2 mt-3 w-full">View Full Sheet</button>
        `;
        monsterListDiv.appendChild(monsterCard);
    });
}

// Filters the monster list based on user input
function filterMonsters() {
    const filterText = getValue('monsterFilter');
    renderMonsterList(filterText);
}

// Rolls a monster's attack
function rollMonsterAttack(monsterId, actionIndex) {
    const monster = MONSTERS_DATA.find(m => m.id === monsterId);
    if (!monster || !monster.actions || !monster.actions[actionIndex]) {
        console.error("Monster or action not found for attack roll:", monsterId, actionIndex);
        return;
    }
    const action = monster.actions[actionIndex];
    const attackBonus = parseInt(action.attackBonus || '+0'); // Parse bonus, default to 0
    performDMRoll(1, 20, attackBonus, `${monster.name} - ${action.name} Attack`);
}

// Rolls a monster's damage
function rollMonsterDamage(monsterId, actionIndex) {
    const monster = MONSTERS_DATA.find(m => m.id === monsterId);
    if (!monster || !monster.actions || !monster.actions[actionIndex]) {
        console.error("Monster or action not found for damage roll:", monsterId, actionIndex);
        return;
    }
    const action = monster.actions[actionIndex];
    const damageString = action.damage;

    const match = damageString.match(/(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/i);
    if (match) {
        const numDice = parseInt(match[1]);
        const diceSides = parseInt(match[2]);
        let modifier = 0;
        if (match[4]) {
            modifier = parseInt(match[4]);
            if (match[3] === '-') { modifier = -modifier; }
        }
        performDMRoll(numDice, diceSides, modifier, `${monster.name} - ${action.name} Damage`);
    } else {
        logDMRoll(`${monster.name} - ${action.name} Damage`, 'Invalid Format', `Could not parse: ${damageString}`);
        alert(`Could not parse damage string for ${monster.name}'s ${action.name}: "${damageString}". Expected format like "1d8 + 2" or "2d6".`);
    }
}

// Opens the monster sheet modal
function openMonsterSheetModal(monsterId) {
    const monster = MONSTERS_DATA.find(m => m.id === monsterId);
    const modal = getElement('monsterSheetModal');
    const contentDiv = getElement('monsterSheetContent');

    if (!monster || !modal || !contentDiv) {
        console.error("Could not open monster sheet modal. Missing monster data or modal elements.");
        return;
    }

    // Populate modal content
    contentDiv.innerHTML = `
        <h2 class="text-3xl font-medieval text-hobbit-red mb-4 border-b-2 border-hobbit-brown pb-2">${monster.name}</h2>
        <p class="text-lg italic text-hobbit-brown mb-3">${monster.type} (CR ${monster.challengeRating})</p>

        <div class="grid grid-cols-2 gap-4 mb-4">
            <div><strong>Fortitude:</strong> ${monster.fortitude}</div>
            <div><strong>Armor Class:</strong> ${monster.armorClass}</div>
            <div><strong>Speed:</strong> ${monster.speed}</div>
            <div><strong>Languages:</strong> ${monster.languages || '—'}</div>
            <div class="col-span-2"><strong>Senses:</strong> ${monster.senses}</div>
        </div>

        <h3 class="text-xl font-medieval text-hobbit-green mb-2">Abilities</h3>
        <div class="grid grid-cols-3 gap-2 mb-4">
            ${Object.entries(monster.abilities || {}).map(([key, value]) => `
                <div class="text-center p-2 border border-hobbit-gold/50 rounded-md bg-hobbit-parchment-light">
                    <strong class="block text-hobbit-brown">${key.substring(0, 3).toUpperCase()}</strong>
                    <span class="text-xl font-bold text-hobbit-green">${value}</span>
                    <span class="text-sm text-gray-700">Mod: ${(calculateModifier(value) >= 0 ? '+' : '')}${calculateModifier(value)}</span>
                </div>
            `).join('')}
        </div>

        ${monster.skills && monster.skills.length > 0 ? `
            <h3 class="text-xl font-medieval text-hobbit-green mt-4 mb-2">Skills</h3>
            <p class="text-sm">${monster.skills.join(', ')}</p>
        ` : ''}

        <h3 class="text-xl font-medieval text-hobbit-green mt-4 mb-2">Traits</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
            ${(monster.traits || []).map(trait => `<li><strong>${trait.name}:</strong> ${trait.description}</li>`).join('')}
        </ul>

        <h3 class="text-xl font-medieval text-hobbit-green mt-4 mb-2">Actions</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
            ${(monster.actions || []).map((action, actionIndex) => `
                <li>
                    <strong>${action.name}:</strong> ${action.attackBonus ? `+${action.attackBonus} to hit, ` : ''}${action.damage || ''}${action.range ? `, range ${action.range}` : ''}${action.description ? `. ${action.description}` : ''}
                    <button onclick="dm.rollMonsterAttack('${monster.id}', ${actionIndex})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 ml-2">Atk</button>
                    ${action.damage ? `<button onclick="dm.rollMonsterDamage('${monster.id}', ${actionIndex})" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 ml-1">Dmg</button>` : ''}
                </li>
            `).join('')}
        </ul>
        <p class="text-sm italic text-gray-700 mt-4">${monster.description || ''}</p>
    `;

    modal.classList.remove('hidden'); // Show the modal
}

// Closes the monster sheet modal
function closeMonsterSheetModal() {
    const modal = getElement('monsterSheetModal');
    if (modal) {
        modal.classList.add('hidden'); // Hide the modal
    }
}


// --- REFERENCE DATA FUNCTIONS (Items, Skills, Callings) ---

// Renders the list of all game items, with an optional filter
function renderItemList(filterText = '') {
    const itemListDiv = getElement('itemList');
    if (!itemListDiv) return;
    itemListDiv.innerHTML = '';

    // Ensure getAllItemsList function from hobbit_data_items.js is globally accessible
    if (typeof getAllItemsList !== 'function') {
        itemListDiv.innerHTML = '<p class="text-red-600 italic">Item data function (getAllItemsList) not loaded. Check hobbit_data_items.js.</p>';
        console.error("getAllItemsList is not defined.");
        return;
    }
    const allItems = getAllItemsList();

    const lowerFilter = filterText ? filterText.toLowerCase() : '';
    const filteredItems = allItems.filter(item => {
        return item.name.toLowerCase().includes(lowerFilter) ||
               (item.description && item.description.toLowerCase().includes(lowerFilter)) ||
               (item.effects && item.effects.some(eff => (eff.details || eff.type).toLowerCase().includes(lowerFilter))) ||
               (item.type && item.type.toLowerCase().includes(lowerFilter)) ||
               (item.category && item.category.toLowerCase().includes(lowerFilter));
    });

    if (filteredItems.length === 0) {
        itemListDiv.innerHTML = '<p class="text-gray-600 italic">No items match your filter.</p>';
        return;
    }

    // Render each item as a card/div using reference-item-card class
    filteredItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'reference-item-card'; // Apply new class for consistent styling
        let effectsHtml = item.effects ? item.effects.map(eff => eff.details || eff.type).join('; ') : '';
        itemDiv.innerHTML = `
            <h4 class="font-semibold text-hobbit-brown">${item.name} <span class="text-xs text-gray-500">(${item.category || item.type || 'Gear'})</span></h4>
            <p class="text-sm text-gray-700 mt-1">${item.description || ''}</p>
            ${item.damage ? `<p class="text-xs"><strong>Damage:</strong> ${item.damage} <button onclick="dm.rollItemDamage('${item.name}')" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 ml-2">Roll Dmg</button></p>` : ''}
            ${effectsHtml ? `<p class="text-xs italic text-hobbit-green">Effects: ${effectsHtml}</p>` : ''}
        `;
        itemListDiv.appendChild(itemDiv);
    });
}

// Filters the item list based on user input
function filterItems() {
    const filterText = getValue('itemFilter');
    renderItemList(filterText);
}

// Rolls damage for a specific item (from item reference)
function rollItemDamage(itemName) {
    const allItems = typeof getAllItemsList === 'function' ? getAllItemsList() : [];
    const item = allItems.find(i => i.name === itemName);
    if (!item || !item.damage) {
        console.error("Item or item damage not found for roll:", itemName);
        return;
    }
    const damageString = item.damage;

    const match = damageString.match(/(\d+)d(\d+)\s*(?:([+-])\s*(\d+))?/i);
    if (match) {
        const numDice = parseInt(match[1]);
        const diceSides = parseInt(match[2]);
        let modifier = 0;
        if (match[4]) {
            modifier = parseInt(match[4]);
            if (match[3] === '-') { modifier = -modifier; }
        }
        performDMRoll(numDice, diceSides, modifier, `${itemName} Damage`);
    } else {
        logDMRoll(`${itemName} Damage`, 'Invalid Format', `Could not parse: ${damageString}`);
        alert(`Could not parse damage string for ${itemName}: "${damageString}". Expected format like "1d8 + 2" or "2d6".`);
    }
}

// Renders the list of all skills, with an optional filter
function renderSkillList(filterText = '') {
    const skillListDiv = getElement('skillList');
    if (!skillListDiv) return;
    skillListDiv.innerHTML = '';

    // Ensure SKILLS_DATA is available
    if (typeof SKILLS_DATA === 'undefined' || !Array.isArray(SKILLS_DATA)) {
        skillListDiv.innerHTML = '<p class="text-red-600 italic">Skill data not loaded. Check hobbit_data_skills.js.</p>';
        console.error("SKILLS_DATA is not defined or not an array.");
        return;
    }

    const lowerFilter = filterText ? filterText.toLowerCase() : '';
    const filteredSkills = SKILLS_DATA.filter(skill => {
        return skill.name.toLowerCase().includes(lowerFilter) ||
               skill.ability.toLowerCase().includes(lowerFilter) ||
               (skill.description && skill.description.toLowerCase().includes(lowerFilter)) ||
               (skill.prereq && (SKILLS_DATA.find(s => s.id === skill.prereq)?.name || '').toLowerCase().includes(lowerFilter));
    });

    if (filteredSkills.length === 0) {
        skillListDiv.innerHTML = '<p class="text-gray-600 italic">No skills match your filter.</p>';
        return;
    }

    filteredSkills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'reference-item-card'; // Apply new class for consistent styling
        let effectsHtml = skill.effects ? skill.effects.map(eff => eff.details || eff.type).join('; ') : '';
        skillDiv.innerHTML = `
            <h4 class="font-semibold text-hobbit-brown">${skill.name} <span class="text-xs text-gray-500">(${skill.ability.substring(0,3).toUpperCase()})</span></h4>
            <p class="text-sm text-gray-700 mt-1">${skill.description || ''}</p>
            <p class="text-xs"><strong>Cost:</strong> ${skill.cost} SP, <strong>Level Req:</strong> ${skill.levelReq}</p>
            ${skill.prereq ? `<p class="text-xs"><strong>Prereq:</strong> ${SKILLS_DATA.find(s => s.id === skill.prereq)?.name || 'Unknown'}</p>` : ''}
            ${effectsHtml ? `<p class="text-xs italic text-hobbit-green">Effects: ${effectsHtml}</p>` : ''}
            <button onclick="dm.rollReferenceSkill('${skill.id}')" class="button-hobbit-base button-hobbit-action text-xs py-0.5 px-1.5 mt-2">Roll Skill</button>
        `;
        skillListDiv.appendChild(skillDiv);
    });
}

// Filters the skill list based on user input
function filterSkills() {
    const filterText = getValue('skillFilter');
    renderSkillList(filterText);
}

// Rolls a skill check from the reference list
function rollReferenceSkill(skillId) {
    const skill = SKILLS_DATA.find(s => s.id === skillId);
    if (!skill) {
        console.error("Skill not found for roll:", skillId);
        return;
    }

    // Prompt DM for ability score or use a default (e.g., 10 for average)
    let abilityScore = prompt(`Enter the ${skill.ability} score for ${skill.name} roll (e.g., 10):`);
    abilityScore = parseInt(abilityScore) || 10; // Default to 10 if invalid input

    const abilityMod = calculateModifier(abilityScore);
    // DM can decide if proficient, for simplicity, we'll just use the ability mod for now.
    // Or you could prompt: let isProficient = confirm(`Is the creature proficient in ${skill.name}?`);
    // let totalMod = abilityMod + (isProficient ? 2 : 0); // Assuming +2 proficiency bonus for simplicity

    performDMRoll(1, 20, abilityMod, `${skill.name} Check (${skill.ability.substring(0,3).toUpperCase()})`);
}


// Renders the list of all callings/professions, with an optional filter
function renderCallingList(filterText = '') {
    const callingListDiv = getElement('callingList');
    if (!callingListDiv) return;
    callingListDiv.innerHTML = '';

    // Ensure PROFESSIONS_DATA is available
    if (typeof PROFESSIONS_DATA === 'undefined' || typeof PROFESSIONS_DATA !== 'object') {
        callingListDiv.innerHTML = '<p class="text-red-600 italic">Calling data not loaded. Check hobbit_data_calling.js.</p>';
        console.error("PROFESSIONS_DATA is not defined or not an object.");
        return;
    }

    const lowerFilter = filterText ? filterText.toLowerCase() : '';
    const filteredCallings = Object.values(PROFESSIONS_DATA).filter(calling => {
        return calling.name.toLowerCase().includes(lowerFilter) ||
               (calling.description && calling.description.toLowerCase().includes(lowerFilter)) ||
               (calling.primaryAbilities && calling.primaryAbilities.some(ab => ab.toLowerCase().includes(lowerFilter))) ||
               (calling.skillProficiencies && calling.skillProficiencies.some(sp => sp.toLowerCase().includes(lowerFilter))) ||
               (calling.abilities && calling.abilities.some(ab => ab.name.toLowerCase().includes(lowerFilter) || ab.description.toLowerCase().includes(lowerFilter)));
    });

    if (filteredCallings.length === 0) {
        callingListDiv.innerHTML = '<p class="text-gray-600 italic">No callings match your filter.</p>';
        return;
    }

    filteredCallings.forEach(calling => {
        const callingDiv = document.createElement('div');
        callingDiv.className = 'reference-item-card'; // Apply new class for consistent styling
        callingDiv.innerHTML = `
            <h4 class="font-semibold text-hobbit-brown">${calling.name}</h4>
            <p class="text-sm text-gray-700 mt-1">${calling.description || ''}</p>
            <p class="text-xs"><strong>Primary Abilities:</strong> ${calling.primaryAbilities ? calling.primaryAbilities.join(', ') : 'None'}</p>
            <p class="text-xs"><strong>Skill Proficiencies:</strong> ${calling.skillProficiencies ? calling.skillProficiencies.join(', ') : 'None'}</p>
            ${calling.abilities && calling.abilities.length > 0 ? `
                <h5 class="text-xs font-semibold text-hobbit-green mt-2">Abilities:</h5>
                <ul class="list-disc list-inside text-xs space-y-0.5 ml-2">
                    ${calling.abilities.map(ab => `<li><strong>${ab.name}:</strong> ${ab.description}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        callingListDiv.appendChild(callingDiv);
    });
}

// Filters the calling list based on user input
function filterCallings() {
    const filterText = getValue('callingFilter');
    renderCallingList(filterText);
}

// --- DICE ROLLER FUNCTIONS (Adapted from player script for DM use) ---
// Logs a dice roll entry into the DM's dice log
function logDMRoll(type, result, details = '', isAutoSave = false) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit'});
    const logEntry = { type, result, details, timestamp, isAutoSave };
    dmState.dmDiceLog.unshift(logEntry); // Add to the beginning of the log
    if (dmState.dmDiceLog.length > 50) dmState.dmDiceLog.pop(); // Keep log size manageable (max 50 entries)
    updateDMDiceLogDisplay(); // Update the display immediately
}

// Updates the HTML display of the DM's dice log
function updateDMDiceLogDisplay() {
    const diceLogDiv = getElement('dmDiceLog'); // This is the tab-based log
    const diceLogFixedDiv = getElement('dmDiceLogFixed'); // This is the fixed panel log

    // Update the tab-based log
    if (diceLogDiv) {
        diceLogDiv.innerHTML = dmState.dmDiceLog.map((entry, index) => {
            let entryClass = "log-entry";
            if (index === 0 && !entry.isAutoSave) { entryClass += " latest-log-entry"; }
            if (entry.isAutoSave) { return `<div class="${entryClass} auto-save-message">System | ${entry.result} | <em>(${entry.timestamp})</em></div>`; }
            return `<div class="${entryClass}"><span class="font-semibold">${entry.type}:</span> <strong>${entry.result}</strong><p class="text-xs text-gray-700">${entry.details} <em>(${entry.timestamp})</em></p></div>`;
        }).join('');
        if (dmState.dmDiceLog.length === 0) { diceLogDiv.innerHTML = `<p class="text-gray-600 italic">Dice rolls will appear here...</p>`; }
    }

    // Update the fixed panel log
    if (diceLogFixedDiv) {
        diceLogFixedDiv.innerHTML = dmState.dmDiceLog.map((entry, index) => {
            let entryClass = "log-entry";
            if (index === 0 && !entry.isAutoSave) { entryClass += " latest-log-entry"; }
            if (entry.isAutoSave) { return `<div class="${entryClass} auto-save-message">System | ${entry.result} | <em>(${entry.timestamp})</em></div>`; }
            return `<div class="${entryClass}"><span class="font-semibold">${entry.type}:</span> <strong>${entry.result}</strong><p class="text-xs text-gray-700">${entry.details} <em>(${entry.timestamp})</em></p></div>`;
        }).join('');
        if (dmState.dmDiceLog.length === 0) { diceLogFixedDiv.innerHTML = `<p class="text-gray-600 italic">Dice rolls will appear here...</p>`; }
    }
}

// Clears all entries from the DM's dice log
function clearDiceLog() {
    dmState.dmDiceLog = [];
    updateDMDiceLogDisplay();
    saveDMData(true); // Save cleared log
}

// Performs a generic dice roll and logs the result
function performDMRoll(num, sides, mod, description) {
    let total = 0;
    let rolls = [];
    for (let i = 0; i < num; i++) {
        let roll;
        if (sides === 100) { // Special handling for d100 (00-90 + 1-10)
            const tens = Math.floor(Math.random() * 10) * 10;
            const units = Math.floor(Math.random() * 10);
            roll = (tens === 0 && units === 0) ? 100 : tens + units; // 00 is 100 on d100
        } else {
            roll = Math.floor(Math.random() * sides) + 1;
        }
        rolls.push(roll);
        total += roll;
    }
    total += mod; // Add modifier to the total
    const rollString = rolls.join(', '); // Format individual rolls
    const modString = mod !== 0 ? (mod > 0 ? ` + ${mod}` : ` - ${Math.abs(mod)}`) : ''; // Format modifier string
    logDMRoll(description, total, `${num}d${sides} (${rollString})${modString}`); // Log the result
    return total;
}

// Initiates a custom dice roll based on user input in the DM dice roller (tab version)
function rollCustomDice() {
    const numDice = getValue('dmNumDice');
    const diceType = getValue('dmDiceType');
    const modifier = getValue('dmDiceModifier');
    performDMRoll(numDice, diceType, modifier, 'DM Custom Roll (Tab)');
}

// Initiates a custom dice roll based on user input in the DM dice roller (fixed panel version)
function rollCustomDiceFixed() {
    const numDice = getValue('dmNumDiceFixed');
    const diceType = getValue('dmDiceTypeFixed');
    const modifier = getValue('dmDiceModifierFixed');
    performDMRoll(numDice, diceType, modifier, 'DM Custom Roll (Fixed)');
}


// --- SAVE/LOAD DM DATA (for loaded players and DM dice log, and UI visibility) ---
// Saves the current DM session data to local storage
function saveDMData(isAuto = false) {
    try {
        const dmDataToSave = {
            loadedPlayerCharacters: dmState.loadedPlayerCharacters, // Use dmState.loadedPlayerCharacters
            dmDiceLog: dmState.dmDiceLog, // Use dmState.dmDiceLog
            dmUIVisibility: dmState.uiVisibility, // Use dmState.uiVisibility
            quickNotesText: getValue('dmQuickNotesTextarea'), // Save quick notes content
            currentEncounter: dmState.currentEncounter // Save current encounter state
        };
        localStorage.setItem(DM_LOCAL_STORAGE_KEY, JSON.stringify(dmDataToSave));
        if (isAuto) {
            const autoSaveStatusEl = getElement('dmAutoSaveStatus');
            if (autoSaveStatusEl) {
                autoSaveStatusEl.textContent = `Auto-saved at ${new Date().toLocaleTimeString()}`;
                setTimeout(() => { autoSaveStatusEl.textContent = ''; }, 5000);
            }
        } else {
            console.log('DM data manually saved.');
        }
    } catch (error) {
        console.error("Error saving DM data:", error);
    }
}

// Loads DM session data from local storage
function loadDMData() {
    try {
        const savedDataJSON = localStorage.getItem(DM_LOCAL_STORAGE_KEY);
        if (savedDataJSON) {
            const loadedData = JSON.parse(savedDataJSON);
            dmState.loadedPlayerCharacters = loadedData.loadedPlayerCharacters || [];
            dmState.dmDiceLog = loadedData.dmDiceLog || [];
            dmState.uiVisibility = loadedData.dmUIVisibility || {
                customDiceRollerFixedDM: true,
                diceLogSectionFixedDM: true,
                quickNotesAreaDM: true
            };
            dmState.quickNotesText = loadedData.quickNotesText || '';
            dmState.currentEncounter = loadedData.currentEncounter || [];

            setValue('dmQuickNotesTextarea', dmState.quickNotesText); // Apply loaded quick notes
            console.log('DM data loaded.');
            return true;
        }
    } catch (e) {
        console.error("Error loading DM data:", e);
        // If data is corrupted or unreadable, reset to an empty state
        dmState = { // Reset dmState completely
            uiVisibility: { customDiceRollerFixedDM: true, diceLogSectionFixedDM: true, quickNotesAreaDM: true },
            quickNotesText: "",
            currentEncounter: [],
            dmDiceLog: [],
            loadedPlayerCharacters: []
        };
        setValue('dmQuickNotesTextarea', '');
        console.log('Error loading DM data. Starting fresh.');
    }
    return false;
}

// --- INITIALIZATION ---
// This block runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DM script DOMContentLoaded. Initializing...");

    // Expose DM functions to the global window object so they can be called from HTML onclick attributes
    window.dm = {
        openDMTab,
        toggleSectionVisibility, // Expose for toggling fixed panels
        importPlayerCharacters,
        renderPlayerSummaryList,
        openPlayerSheetModal, // Expose new player modal function
        closePlayerSheetModal, // Expose new player modal close function
        updatePlayerModalHP, // Expose HP update for player modal
        updatePlayerModalNotes, // Expose notes update for player modal
        removePlayerCharacter,
        clearAllPlayers,
        populateEncounterAddDropdowns, // Expose for initial setup
        addSelectedPlayerToEncounter,
        addSelectedMonsterToEncounter,
        rollAllInitiative,
        sortInitiative,
        updateEncounterInitiative,
        updateEncounterHP,
        removeEncounterParticipant,
        clearEncounter,
        renderMonsterList,
        filterMonsters,
        openMonsterSheetModal,
        closeMonsterSheetModal,
        rollMonsterAttack,
        rollMonsterDamage,
        renderItemList,
        filterItems,
        rollItemDamage,
        renderSkillList,
        filterSkills,
        rollReferenceSkill,
        renderCallingList,
        filterCallings,
        rollCustomDice, // Tab version
        rollCustomDiceFixed, // Fixed panel version
        clearDiceLog,
        saveDMData // Expose save for manual trigger if needed
    };

    // Initial load and render
    loadDMData(); // Attempt to load saved DM data on startup
    applyDMUIVisibility(); // Apply loaded UI visibility
    renderPlayerSummaryList(); // Display any loaded players
    updateDMDiceLogDisplay(); // Display previous dice rolls (updates both fixed and tab versions)
    populateEncounterAddDropdowns(); // Populate dropdowns with loaded players/monsters
    renderEncounterList(); // Render any previously saved encounter

    // Set the initial active tab to 'Player Overview'
    openDMTab(null, 'playerOverview');

    // Auto-save DM data periodically
    setInterval(() => saveDMData(true), 60000); // Auto-save every 60 seconds
    console.log("DM script initialization complete.");

    // Add event listener for quick notes textarea to auto-save its content
    const dmQuickNotesTextarea = getElement('dmQuickNotesTextarea');
    if (dmQuickNotesTextarea) {
        dmQuickNotesTextarea.addEventListener('input', () => saveDMData(true));
    }
});
