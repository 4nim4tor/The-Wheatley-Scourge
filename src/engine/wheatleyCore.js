// Pure state management — no React, no JSX

// --- Internal State ---
const state = {
	mood: "FRIENDLY",
	intensity: 1,
	attention: "IDLE",
	lastAction: null,
	lastUpdated: Date.now(),
};

// --- Mood Progression Ladder ---
const progression = [
	"FRIENDLY",
	"INSECURE",
	"CRUEL",
	"INCOMPETENT",
	"POWER_HUNGRY",
];

// --- Persistence Helpers ---
const STORAGE_KEY = "wheatley_state";

function saveState() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.warn("WheatleyCore: Failed to save state", e);
	}
}

function loadState() {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) Object.assign(state, JSON.parse(saved));
	} catch (e) {
		console.warn("WheatleyCore: Failed to load state", e);
	}
}
loadState();

// --- Mood Management ---
export function setMood(mood, intensity = 1) {
	state.mood = mood;
	state.intensity = intensity;
	state.lastUpdated = Date.now();
	saveState();
}

export function getMood() {
	return { mood: state.mood, intensity: state.intensity };
}

export function escalateMood() {
	const idx = progression.indexOf(state.mood);
	if (idx < progression.length - 1) setMood(progression[idx + 1]);
}

// --- Attention Management ---
export function setAttention(target) {
	state.attention = target;
	state.lastUpdated = Date.now();
	saveState();
}

export function getAttention() {
	return state.attention;
}

// --- Event Handling ---
export function registerEvent(event, subtype = null, payload = {}) {
	state.lastAction = { event, subtype, payload, time: Date.now() };
	state.lastUpdated = Date.now();
	saveState();
}

export function getLastAction() {
	return state.lastAction;
}

// --- Decay / Escalation ---
export function updateDecay() {
	const now = Date.now();
	const elapsed = now - state.lastUpdated;
	if (elapsed > 60000) {
		escalateMood();
		state.lastUpdated = now;
		saveState();
	}
	if (state.intensity > 0) {
		state.intensity = Math.max(0, state.intensity - 0.05);
	}
}

// --- Reset Helper ---
export function resetState() {
	state.mood = "FRIENDLY";
	state.intensity = 1;
	state.attention = "IDLE";
	state.lastAction = null;
	state.lastUpdated = Date.now();
	saveState();
}
