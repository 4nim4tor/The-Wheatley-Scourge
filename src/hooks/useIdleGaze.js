import { useState, useEffect } from "react";

export function useIdleGaze() {
	const [targetGaze, setTargetGaze] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const interval = setInterval(() => {
			const x = (Math.random() - 0.5) * 0.7;
			const y = (Math.random() - 0.5) * 0.7;
			setTargetGaze({ x, y });
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	return targetGaze;
}
