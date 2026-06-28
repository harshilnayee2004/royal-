/**
 * Mode State Manager (Retail / Bulk Mode)
 * Keeps a single source of truth for the active catalog mode, updates the URL parameter,
 * and notifies subscribers when the mode changes.
 */

let currentMode = 'retail';
const listeners = [];

// Initialize from URL search parameters
const urlParams = new URLSearchParams(window.location.search);
const modeParam = urlParams.get('mode');
if (modeParam === 'bulk' || modeParam === 'retail') {
    currentMode = modeParam;
}

export function getMode() {
    return currentMode;
}

export function setMode(mode) {
    if (mode !== 'retail' && mode !== 'bulk') return;
    if (currentMode === mode) return;
    currentMode = mode;

    // Update the URL mode param without forcing a reload
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    window.history.pushState({}, '', url.toString());

    // Notify all subscribers of the updated mode
    listeners.forEach(fn => fn(currentMode));
}

export function subscribeToModeChange(fn) {
    listeners.push(fn);
    // Return unsubscribe function
    return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
    };
}
