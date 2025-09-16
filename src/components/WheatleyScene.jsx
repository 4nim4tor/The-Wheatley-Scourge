import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import WheatleyModel from "./WheatleyModel";
import "../styles/WheatleyScreen.css";

export default function WheatleyScene() {
	return (
		<div className="wheatley-frame">
			<div className="camera-hole" />
			<div className="power-light" />
			<div className="wheatley-screen">
				<Canvas camera={{ position: [0, 0, 5] }}>
					<ambientLight intensity={1} />
					<directionalLight position={[2, 2, 2]} />
					<group rotation={[0, -Math.PI / 2, 0]}>
						<WheatleyModel scale={0.13} position={[0, 0, 0]} />
					</group>
					<OrbitControls enableZoom={false} enablePan={false} />
				</Canvas>
			</div>
		</div>
	);
}
