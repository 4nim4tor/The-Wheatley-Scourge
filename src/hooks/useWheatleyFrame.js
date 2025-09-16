import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function useWheatleyFrame({
	eye,
	lidTop,
	lidBottom,
	ref,
	targetGaze,
	blinkProgress,
}) {
	useFrame(() => {
		if (eye) {
			eye.rotation.x += (targetGaze.y - eye.rotation.x) * 0.2;
			eye.rotation.y += (targetGaze.x - eye.rotation.y) * 0.2;
		}

		const eyeYaw = eye?.rotation.y || 0;
		if (ref.current) {
			const threshold = 0.087;
			const maxEyeRange = 0.35;

			if (Math.abs(eyeYaw) > threshold) {
				const targetSphereYaw = THREE.MathUtils.clamp(
					eyeYaw,
					-maxEyeRange,
					maxEyeRange
				);
				ref.current.rotation.y +=
					(targetSphereYaw - ref.current.rotation.y) * 0.05;
			}
		}

		if (lidTop) lidTop.rotation.z = 0.3 * (1 - blinkProgress);
		if (lidBottom) lidBottom.rotation.z = 0.3 * (1 - blinkProgress);
	});
}
