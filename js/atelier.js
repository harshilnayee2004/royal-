/**
 * Sensory Atelier Page Controller
 * Manages the interactive Roast Dial, Soundscape synthesizers, and Crate Curation.
 */
import { products } from './products.js';
import { toggleSoundscape } from './audio.js';

export function initAtelier() {
    initRoastDial();
    initSoundscapeController();
    initCrateBuilder();
}

/* ==========================================================================
   Roast Simulator Dial Logic
   ========================================================================== */
function initRoastDial() {
    const slider = document.getElementById('roast-range');
    const profileName = document.getElementById('roast-profile-name');
    const notes = document.getElementById('roast-notes');
    const matches = document.getElementById('roast-matches');
    const displayBox = document.getElementById('roast-display');

    if (!slider) return;

    const profiles = {
        1: {
            name: "Light Roast (Fresh & Subtle)",
            notes: "Gently heated to dry moisture. Safflower oils are preserved. Soft snap, sweet natural grain finish with earthy notes.",
            matches: "Simply Salted Peanuts, Salted Chana, Coconut Chikki"
        },
        2: {
            name: "Golden Roast (The Heritage Standard)",
            notes: "Classic sand-roasted at 160°C. Caramelizes natural starches, releasing fragrant peanut oils. Intense, crisp crunch. The vintage flavor since 1960.",
            matches: "Masala Peanuts, Hing Jeera Chana, Pista Chikki"
        },
        3: {
            name: "Dark Roast (Smoky & Intense)",
            notes: "Slow toasted to deep copper colors. Strongly caramelized oils. Deep toasted smokiness, bold aromatic sharpness with a nutty bitterness.",
            matches: "Chilly Garlic Peanuts, Tandoori Chana, Peanut Crush Chikki"
        }
    };

    slider.addEventListener('input', () => {
        const val = slider.value;
        const data = profiles[val];
        
        if (data) {
            // Apply a brief pulse animation to the text for a premium feedback effect
            displayBox.classList.add('reveal-blur-item');
            setTimeout(() => {
                profileName.textContent = data.name;
                notes.textContent = data.notes;
                matches.textContent = data.matches;
                displayBox.classList.remove('reveal-blur-item');
            }, 150);
        }
    });
}

/* ==========================================================================
   Soundscape Audio Toggle
   ========================================================================== */
function initSoundscapeController() {
    const toggleBtn = document.getElementById('soundscape-toggle');
    const viz = document.getElementById('audio-viz');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        toggleSoundscape((isPlaying) => {
            if (isPlaying) {
                toggleBtn.textContent = "Pause Soundscape";
                toggleBtn.classList.add('active');
                if (viz) viz.classList.add('active');
            } else {
                toggleBtn.textContent = "Play Soundscape";
                toggleBtn.classList.remove('active');
                if (viz) viz.classList.remove('active');
            }
        });
    });
}

/* ==========================================================================
   Custom Crate Builder Logic
   ========================================================================== */
function initCrateBuilder() {
    const gridSlots = document.querySelectorAll('.crate-slot');
    const selectorContainer = document.getElementById('crate-selector-list');
    const counterText = document.getElementById('crate-count');
    const inquireBtn = document.getElementById('inquire-crate-btn');

    if (gridSlots.length === 0 || !selectorContainer) return;

    // Track active crate configuration
    const maxSlots = 6;
    let crateSlots = Array(maxSlots).fill(null); // stores product objects

    // 1. Render Selector list from product catalog
    // Group products to show a diverse sample (e.g. top 8 items)
    const selectSamples = products.slice(0, 10);
    
    selectorContainer.innerHTML = '';
    selectSamples.forEach(p => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'selector-item';
        itemDiv.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <div class="item-name">${p.name}</div>
            <button class="add-slot-btn" data-id="${p.id}"><i class="fa-solid fa-plus"></i> Add</button>
        `;
        
        itemDiv.querySelector('.add-slot-btn').addEventListener('click', () => {
            addToCrate(p);
        });

        selectorContainer.appendChild(itemDiv);
    });

    function addToCrate(product) {
        // Find first empty index
        const emptyIdx = crateSlots.indexOf(null);
        
        if (emptyIdx === -1) {
            alert("Your Crate is fully packed! Remove items to add alternatives.");
            return;
        }

        // Add item
        crateSlots[emptyIdx] = product;
        updateCrateGrid();
    }

    function removeFromCrate(index) {
        crateSlots[index] = null;
        updateCrateGrid();
    }

    function updateCrateGrid() {
        let activeCount = 0;

        crateSlots.forEach((product, idx) => {
            const slot = gridSlots[idx];
            slot.innerHTML = '';

            if (product) {
                activeCount++;
                slot.classList.add('filled');
                slot.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <button class="remove-item-btn" aria-label="Remove ${product.name} from slot">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <span class="slot-label">${product.name.split(' (')[0]}</span>
                `;

                // Wire up remove button
                slot.querySelector('.remove-item-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeFromCrate(idx);
                });
            } else {
                slot.classList.remove('filled');
                slot.innerHTML = `<span class="slot-placeholder">+</span>`;
            }
        });

        // Update Counter Text
        counterText.textContent = `${activeCount} / ${maxSlots} Packed`;

        // Update button states
        if (activeCount > 0) {
            inquireBtn.disabled = false;
            if (activeCount === maxSlots) {
                inquireBtn.textContent = "Inquire Crate (Ready)";
            } else {
                inquireBtn.textContent = `Inquire Box (${activeCount} Items)`;
            }
        } else {
            inquireBtn.disabled = true;
            inquireBtn.textContent = "Inquire Custom Crate";
        }
    }

    // Inquiry Action
    inquireBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Compile items list
        const packedItems = crateSlots.filter(p => p !== null);
        const itemNames = packedItems.map((p, idx) => `${idx + 1}. ${p.name}`).join(', ');
        const messageParam = `Hello, I have created a custom crate selection at your Sensory Atelier containing: [ ${itemNames} ]. Please share shipping options and pricing.`;

        window.location.href = `contact.html?category=distributorship&message=${encodeURIComponent(messageParam)}`;
    });

    // Initialize grid layout state
    updateCrateGrid();
}
