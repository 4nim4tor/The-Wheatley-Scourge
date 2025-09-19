import { registerEvent, updateDecay } from "./wheatleyCore";
import { getNextLine } from "./dialogueEngine";

// Utility: show Wheatley’s line (replace with your UI hook)
let speaking = false;
let speakCooldown = 4000;

function showWheatleyLine(line) {
	if (speaking) return; // ignore if still cooling down
	speaking = true;

	console.log("Wheatley:", line);
	// TODO: integrate with your speech bubble / widget renderer

	setTimeout(() => {
		speaking = false;
	}, speakCooldown);
}

function trackCursorProximity(wheatleyEl) {
	if (!wheatleyEl) return;

	document.addEventListener("mousemove", (e) => {
		const rect = wheatleyEl.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const dx = e.clientX - centerX;
		const dy = e.clientY - centerY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const maxDist = Math.max(window.innerWidth, window.innerHeight);
		const proximity = 1 - Math.min(distance / maxDist, 1);

		// Fire a custom event for the model to consume
		document.dispatchEvent(
			new CustomEvent("wheatley-proximity", {
				detail: { dx, dy, distance, proximity },
			})
		);
	});
}

export function initWheatleySensors() {
	// --- Cursor over Wheatley widget ---
	const wheatleyEl = document.getElementById("wheatley-widget");
	if (wheatleyEl) {
		trackCursorProximity(wheatleyEl);

		let hoverTimer;

		wheatleyEl.addEventListener("mouseenter", () => {
			registerEvent("cursor", "overWidget");
			showWheatleyLine(getNextLine({ event: "cursor", subtype: "overWidget" }));

			hoverTimer = setTimeout(() => {
				registerEvent("cursor", "hover");
				showWheatleyLine(getNextLine({ event: "cursor", subtype: "hover" }));
			}, 2000);
		});

		wheatleyEl.addEventListener("mouseleave", () => {
			clearTimeout(hoverTimer);
		});
	}

	// --- Cursor shake detection ---
	let lastX = 0,
		lastTime = 0,
		shakeCount = 0;
	document.addEventListener("mousemove", (e) => {
		const dx = Math.abs(e.clientX - lastX);
		const dt = e.timeStamp - lastTime;

		if (dx > 50 && dt < 100) {
			shakeCount++;
			if (shakeCount > 3) {
				registerEvent("cursor", "shake");
				showWheatleyLine(getNextLine({ event: "cursor", subtype: "shake" }));
				shakeCount = 0;
			}
		} else {
			shakeCount = 0;
		}

		lastX = e.clientX;
		lastTime = e.timeStamp;
	});

	// --- Typing detection ---
	const inputEl = document.querySelector("textarea, input[type='text']");
	if (inputEl) {
		let typingTimer;

		inputEl.addEventListener("input", (e) => {
			const length = e.target.value.length;

			if (length > 50) {
				registerEvent("typing", "longText");
				showWheatleyLine(getNextLine({ event: "typing", subtype: "longText" }));
			} else if (length > 0) {
				registerEvent("typing", "shortText");
				showWheatleyLine(
					getNextLine({ event: "typing", subtype: "shortText" })
				);
			}

			clearTimeout(typingTimer);
			typingTimer = setTimeout(() => {
				registerEvent("typing", "pause");
				showWheatleyLine(getNextLine({ event: "typing", subtype: "pause" }));
			}, 2000);
		});
	}

	// --- Link hover & click spam ---
	document.querySelectorAll("a, button").forEach((el) => {
		let clickCount = 0;
		let clickTimer;

		el.addEventListener("mouseenter", () => {
			registerEvent("link", "hover");
			showWheatleyLine(getNextLine({ event: "link", subtype: "hover" }));
		});

		el.addEventListener("click", () => {
			clickCount++;
			clearTimeout(clickTimer);
			clickTimer = setTimeout(() => (clickCount = 0), 1000);

			if (clickCount > 3) {
				registerEvent("link", "clickSpam");
				showWheatleyLine(getNextLine({ event: "link", subtype: "clickSpam" }));
				clickCount = 0;
			}

			// Easter egg: anomaly chance
			if (Math.random() < 0.1) {
				registerEvent("error", "anomaly");
				showWheatleyLine(getNextLine({ event: "error", subtype: "anomaly" }));
			}
		});
	});

	// --- Theme toggle detection ---
	let toggleCount = 0;
	let toggleTimer;

	window.addEventListener("themeToggle", (e) => {
		const newTheme = e.detail; // "dark" or "light"
		toggleCount++;
		clearTimeout(toggleTimer);

		if (toggleCount > 3) {
			registerEvent("themeToggle", "rapidSwitch");
			showWheatleyLine(
				getNextLine({ event: "themeToggle", subtype: "rapidSwitch" })
			);
			toggleCount = 0;
		} else {
			registerEvent("themeToggle", newTheme);
			showWheatleyLine(
				getNextLine({ event: "themeToggle", subtype: newTheme })
			);
		}

		toggleTimer = setTimeout(() => (toggleCount = 0), 2000);
	});

	// --- Idle timeout ---
	let idleTimer;
	function resetIdleTimer() {
		clearTimeout(idleTimer);
		idleTimer = setTimeout(() => {
			registerEvent("idle", "long");
			showWheatleyLine(getNextLine({ event: "idle", subtype: "long" }));
		}, 60000); // 60s idle
	}

	["mousemove", "keydown", "click"].forEach((evt) => {
		document.addEventListener(evt, resetIdleTimer);
	});
	resetIdleTimer();

	// --- Mood decay/escalation background loop ---
	setInterval(() => {
		updateDecay();
	}, 10000); // check every 10s
}
