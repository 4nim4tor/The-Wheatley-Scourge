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
		const twitch = Math.sin(t * frequency) * amplitude;

		if (handleUpper) {
			handleUpper.rotation.z = baseUpper + twitch;
			handleUpper.rotation.z = MathUtils.clamp(
				handleUpper.rotation.z,
				MathUtils.degToRad(-75),
				MathUtils.degToRad(75)
			);
		}

		if (handleLower) {
			handleLower.rotation.z = baseLower - twitch;
			handleLower.rotation.z = MathUtils.clamp(
				handleLower.rotation.z,
				MathUtils.degToRad(-75),
				MathUtils.degToRad(75)
			);
		}

		// Future modes: blink, react, squint, etc.
	});
}
