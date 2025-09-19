import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import { useBlinkAnimation } from "../hooks/useBlinkAnimation";
import { useIdleGaze } from "../hooks/useIdleGaze";
import { useWheatleyFrame } from "../hooks/useWheatleyFrame";
import { useHandleMotion } from "../hooks/useHandleMotion";
import { useHandlePose } from "../hooks/useHandlePose";

useGLTF.preload("/models/wheatley_portal_2_original.glb");

export default function WheatleyModel(props) {
	const { scene } = useGLTF("/models/wheatley_portal_2_original.glb");

	const eye = useMemo(() => scene.getObjectByName("eyeball_eye_010"), [scene]);
	const lidTop = useMemo(
		() => scene.getObjectByName("eyelid_upper_main_061"),
		[scene]
	);
	const lidBottom = useMemo(
		() => scene.getObjectByName("eyelid_lower_main_067"),
		[scene]
	);
	const handleUpper = useMemo(
		() => scene.getObjectByName("handle_upper_02"),
		[scene]
	);
	const handleLower = useMemo(
		() => scene.getObjectByName("handle_lower_04"),
		[scene]
	);

	const ref = useRef();

	const idleGaze = useIdleGaze();
	const blinkProgress = useBlinkAnimation();

	const targetGaze = useRef({ x: 0, y: 0 });
	const trackingActive = useRef(false);

	useEffect(() => {
		function handleProximity(e) {
			const { dx, dy, distance } = e.detail;
			if (distance < 250) {
				trackingActive.current = true;
				const factor = Math.min(1, 250 / distance);
				targetGaze.current.x = dx * 0.002 * factor;
				targetGaze.current.y = -dy * 0.002 * factor;
			} else {
				trackingActive.current = false;
			}
		}
		document.addEventListener("wheatley-proximity", handleProximity);
		return () =>
			document.removeEventListener("wheatley-proximity", handleProximity);
	}, []);

	const blendedGaze = useRef({ x: 0, y: 0 });

	useFrame(() => {
		if (trackingActive.current) {
			blendedGaze.current.x +=
				(targetGaze.current.x - blendedGaze.current.x) * 0.1;
			blendedGaze.current.y +=
				(targetGaze.current.y - blendedGaze.current.y) * 0.1;
		} else {
			blendedGaze.current.x = idleGaze.x;
			blendedGaze.current.y = idleGaze.y;
		}
	});

	useWheatleyFrame({
		eye,
		lidTop,
		lidBottom,
		ref,
		targetGaze: blendedGaze.current,
		blinkProgress,
	});

	useHandleMotion(handleUpper, handleLower, {
		frequency: 2.5,
		amplitude: 0.08,
		mode: "idle",
	});

	useHandlePose(handleUpper, handleLower, 60);

	return <primitive ref={ref} object={scene} {...props} />;
}
