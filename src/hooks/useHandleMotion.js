import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";

export function useHandleMotion(handleUpper, handleLower, options = {}) {
	const { frequency = 3, amplitude = 0.1, mode = "idle" } = options;
	const timeRef = useRef(0);

	const baseUpper = handleUpper?.rotation.z ?? 0;
	const baseLower = handleLower?.rotation.z ?? 0;

	useFrame(({ clock }) => {
		const t = clock.elapsedTime;

		if (mode === "idle") {
			const twitch = Math.sin(t * frequency) * amplitude;

			if (handleUpper) handleUpper.rotation.z = baseUpper + twitch;
			if (handleLower) handleLower.rotation.z = baseLower - twitch;
		}

		// Future modes: blink, react, squint, etc.
	});
}
