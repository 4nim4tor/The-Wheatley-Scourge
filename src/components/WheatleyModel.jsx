import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

useGLTF.preload("/models/wheatley_portal_2_original.glb");

export default function WheatleyModel(props) {
	const { scene } = useGLTF("/models/wheatley_portal_2_original.glb");

	const eye = scene.getObjectByName("eyeball_eye_010");
	const lidTop = scene.getObjectByName("eyelid_upper_main_061");
	const lidBottom = scene.getObjectByName("eyelid_lower_main_067");

	const ref = useRef(); // Sphere root
	const [targetGaze, setTargetGaze] = useState({ x: 0, y: 0 });

	// const [blinkActive, setBlinkActive] = useState(false);
	const [blinkProgress, setBlinkProgress] = useState(0); // 0 = open, 1 = closed

	useEffect(() => {
		let timeout;
		const triggerBlink = () => {
			let start = performance.now();

			const animateBlink = () => {
				const now = performance.now();
				const elapsed = now - start;
				const duration = 400; // total blink time in ms

				let t = elapsed / duration;
				if (t >= 1) {
					setBlinkProgress(0); // fully open
					return;
				}

				// Ease in/out curve: 0 → 1 → 0
				const progress = Math.sin(Math.PI * t);
				setBlinkProgress(progress);

				requestAnimationFrame(animateBlink);
			};

			animateBlink();
		};

		const loop = () => {
			const delay = 4000 + Math.random() * 4000;
			setTimeout(() => {
				triggerBlink();
				loop();
			}, delay);
		};

		loop();
		return () => clearTimeout(timeout);
	}, []);

	// Random idle head turns
	useEffect(() => {
		const interval = setInterval(() => {
			const x = (Math.random() - 0.5) * 0.7;
			const y = (Math.random() - 0.5) * 0.7;
			setTargetGaze({ x, y });
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	useFrame(({ clock }) => {
		const t = clock.elapsedTime;

		// Eye mmovement: crisp interpolation
		if (eye) {
			eye.rotation.x += (targetGaze.y - eye.rotation.x) * 0.2;
			eye.rotation.y += (targetGaze.x - eye.rotation.y) * 0.2;
		}

		// Sphere movement: only if eye exceeds +- 5°
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

		// Blinking
		if (lidTop) lidTop.rotation.z = 0.3 * (1 - blinkProgress);
		if (lidBottom) lidBottom.rotation.z = 0.3 * (1 - blinkProgress);

		// const blinkProgress = Math.max(0, Math.sin(t * 2));

		// if (lidTop) lidTop.rotation.z = 0.3 * blinkProgress;
		// if (lidBottom) lidBottom.rotation.z = 0.3 * blinkProgress;

		// // if (lidTop) lidTop.rotation.z = blink > 0.95 ? 0 : 0.3;
		// // if (lidBottom) lidBottom.rotation.z = blink > 0.95 ? 0 : 0.3;
	});

	return <primitive ref={ref} object={scene} {...props} />;
}

// console.log("🔍 Wheatley model structure:");
// scene.traverse((obj) => {
// 	console.log(obj.name);
// });
