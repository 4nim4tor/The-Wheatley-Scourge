import { useEffect } from "react";
import { MathUtils } from "three";

export function useHandlePose(handleUpper, handleLower, angle = 20) {
	useEffect(() => {
		if (handleUpper) handleUpper.rotation.z = MathUtils.degToRad(angle);
		if (handleLower) handleLower.rotation.z = MathUtils.degToRad(-angle);
	}, [handleUpper, handleLower, angle]);
}
