import { useState, useEffect } from "react";

export function useBlinkAnimation() {
	const [blinkProgress, setBlinkProgress] = useState(0);

	useEffect(() => {
		const triggerBlink = () => {
			let start = performance.now();

			const animateBlink = () => {
				const now = performance.now();
				const elapsed = now - start;
				const duration = 400;
				let t = elapsed / duration;

				if (t >= 1) {
					setBlinkProgress(0);
					return;
				}

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
	}, []);

	return blinkProgress;
}
