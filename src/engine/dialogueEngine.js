import { getMood, getAttention } from "./wheatleyCore";
import {
	dialogue,
	eventDialogue /*, attentionDialogue */,
} from "../data/wheatleyDialogue";

function randomFrom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function getNextLine(context = {}) {
	const { mood } = getMood();
	const attention = getAttention();

	// 1. Event-specific dialogue (highest priority)
	if (context.event && eventDialogue[context.event]) {
		const category = eventDialogue[context.event][context.subtype];
		if (category && category.length > 0) {
			return randomFrom(category);
		}
	}

	// 2. Mood-based dialogue (fallback personality)
	if (dialogue[mood] && dialogue[mood].length > 0) {
		return randomFrom(dialogue[mood]);
	}

	// 3. Optional: legacy attention-based dialogue (spice layer)
	// Uncomment if you want Wheatley to sometimes react to broad attention states
	/*
  if (attention && attentionDialogue[attention] && attentionDialogue[attention].length > 0) {
    if (Math.random() < 0.3) { // 30% chance to use attention line
      return randomFrom(attentionDialogue[attention]);
    }
  }
  */

	// 4. Absolute fallback
	return "…";
}
