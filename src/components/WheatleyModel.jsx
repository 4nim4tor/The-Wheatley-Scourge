import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useBlinkAnimation } from "../hooks/useBlinkAnimation";
import { useIdleGaze } from "../hooks/useIdleGaze";
import { useWheatleyFrame } from "../hooks/useWheatleyFrame";
import { useHandleMotion } from "../hooks/useHandleMotion";
import { useHandlePose } from "../hooks/useHandlePose";

useGLTF.preload("/models/wheatley_portal_2_original.glb");

export default function WheatleyModel(props) {
	const { scene } = useGLTF("/models/wheatley_portal_2_original.glb");

	const eye = scene.getObjectByName("eyeball_eye_010");
	const lidTop = scene.getObjectByName("eyelid_upper_main_061");
	const lidBottom = scene.getObjectByName("eyelid_lower_main_067");
	const handleUpper = scene.getObjectByName("handle_upper_02");
	const handleLower = scene.getObjectByName("handle_lower_04");

	const ref = useRef();
	const targetGaze = useIdleGaze();
	const blinkProgress = useBlinkAnimation();

	useWheatleyFrame({ eye, lidTop, lidBottom, ref, targetGaze, blinkProgress });

	useHandleMotion(handleUpper, handleLower, {
		frequency: 2.5,
		amplitude: 0.08,
		mode: "idle",
	});

	useHandlePose(handleUpper, handleLower, 60);

	return <primitive ref={ref} object={scene} {...props} />;
}
