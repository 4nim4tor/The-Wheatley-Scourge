import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import WheatleyModel from "./WheatleyModel";
import "../styles/WheatleyScreen.css";

useGLTF.preload("/models/wheatley_portal_2_original.glb");

export default function WheatleyScene() {
	return (
		<div className="wheatley-frame">
			<div className="camera-hole" />
			<div className="power-light" />
			<div className="wheatley-screen">
				<Canvas camera={{ position: [0, 0, 5] }}>
					<ambientLight intensity={1} />
					<directionalLight position={[2, 2, 2]} />
					<WheatleyModel scale={0.13} position={[0, 0, 0]} />
					<OrbitControls enableZoom={true} />
				</Canvas>
			</div>
		</div>
	);
}
