import WheatleyScene from "./components/WheatleyScene";
import { Suspense } from "react";
import "./App.css";

function App() {
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
