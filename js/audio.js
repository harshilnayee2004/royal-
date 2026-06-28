/**
 * Web Audio API Soundscape Synthesizer
 * Generates ambient lo-fi furnace drones and sand-roasting crackle noises
 * programmatically on-the-fly without needing any external audio files.
 */
let audioCtx = null;
let droneOsc = null;
let droneGain = null;
let noiseNode = null;
let filterNode = null;
let crackleGainNode = null;
let isPlaying = false;
let crackleTimer = null;
let lfoNode = null;

export function toggleSoundscape(callback) {
    if (isPlaying) {
        stopSoundscape();
        if (callback) callback(false);
    } else {
        startSoundscape().then(success => {
            if (callback) callback(success);
        });
    }
}

async function startSoundscape() {
    try {
        // Initialize Audio Context on user gesture
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }

        // Resume if suspended (browser security)
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        // --- 1. AMBIENT FURNACE DRONE (Harmonic Sine Waves) ---
        droneGain = audioCtx.createGain();
        droneGain.gain.setValueAtTime(0.06, audioCtx.currentTime);

        // Low pitch drone
        droneOsc = audioCtx.createOscillator();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(110, audioCtx.currentTime); // A2 note

        // LFO to slowly swell the volume of the furnace hum
        lfoNode = audioCtx.createOscillator();
        lfoNode.frequency.setValueAtTime(0.2, audioCtx.currentTime); // 0.2Hz (5s period)
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(0.02, audioCtx.currentTime);

        lfoNode.connect(lfoGain);
        lfoGain.connect(droneGain.gain); // Modulate gain
        
        droneOsc.connect(droneGain);
        droneGain.connect(audioCtx.destination);

        lfoNode.start();
        droneOsc.start();

        // --- 2. SAND ROAST CRACKLE (Filtered White Noise clicks) ---
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        // Bandpass filter to isolate the "crisp sand/husk" frequencies
        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(3200, audioCtx.currentTime); // centered at 3.2kHz
        filterNode.Q.setValueAtTime(3.0, audioCtx.currentTime);

        crackleGainNode = audioCtx.createGain();
        crackleGainNode.gain.setValueAtTime(0.0, audioCtx.currentTime); // initially silent

        noiseNode.connect(filterNode);
        filterNode.connect(crackleGainNode);
        crackleGainNode.connect(audioCtx.destination);
        noiseNode.start();

        // Schedule random crackle clicks
        isPlaying = true;
        triggerCrackleLoop();

        return true;
    } catch (e) {
        console.error("Web Audio synthesis failed to start", e);
        return false;
    }
}

function stopSoundscape() {
    isPlaying = false;

    // Clear random crackle timer
    if (crackleTimer) clearTimeout(crackleTimer);

    // Stop and disconnect nodes
    try {
        if (droneOsc) {
            droneOsc.stop();
            droneOsc.disconnect();
        }
        if (lfoNode) {
            lfoNode.stop();
            lfoNode.disconnect();
        }
        if (noiseNode) {
            noiseNode.stop();
            noiseNode.disconnect();
        }
        if (droneGain) droneGain.disconnect();
        if (filterNode) filterNode.disconnect();
        if (crackleGainNode) crackleGainNode.disconnect();
    } catch (e) {
        console.warn("Disconnection failed, nodes already inactive", e);
    }

    droneOsc = null;
    lfoNode = null;
    noiseNode = null;
    droneGain = null;
    filterNode = null;
    crackleGainNode = null;
}

// Generate random micro-envelope clicks for roasting sand crackles
function triggerCrackleLoop() {
    if (!isPlaying || !audioCtx || !crackleGainNode) return;

    const now = audioCtx.currentTime;
    
    // Quick click envelope
    crackleGainNode.gain.cancelScheduledValues(now);
    
    // Randomize click intensity
    const clickVolume = 0.08 + Math.random() * 0.15;
    const decayDuration = 0.005 + Math.random() * 0.012; // 5ms to 17ms decay

    crackleGainNode.gain.setValueAtTime(0, now);
    crackleGainNode.gain.linearRampToValueAtTime(clickVolume, now + 0.001); // 1ms attack
    crackleGainNode.gain.exponentialRampToValueAtTime(0.0001, now + decayDuration); // quick exponential decay

    // Schedule next random click (between 40ms and 300ms)
    const nextInterval = 40 + Math.random() * 260;
    crackleTimer = setTimeout(triggerCrackleLoop, nextInterval);
}
