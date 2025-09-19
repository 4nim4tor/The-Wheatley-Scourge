import WheatleyScene from "./components/WheatleyScene";
import { Suspense, useEffect } from "react";
import { initWheatleySensors } from "./engine/wheatleySensors";
import "./App.css";

function App() {
	useEffect(() => {
		initWheatleySensors(); // <-- sets up all the listeners once
	}, []);

	return (
		<>
			<h1>The Wheatley Scourge</h1>
			<Suspense fallback={<div>Loading Wheatley...</div>}>
				<WheatleyScene />
			</Suspense>
		</>
	);
}

export default App;
