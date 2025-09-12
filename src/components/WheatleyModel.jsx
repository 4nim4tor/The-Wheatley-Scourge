import { useGLTF } from "@react-three/drei";

export default function WheatleyModel(props) {
	const { scene } = useGLTF("/models/wheatley_portal_2_original.glb");
	return <primitive object={scene} {...props} />;
}
