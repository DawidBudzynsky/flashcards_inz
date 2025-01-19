import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App.tsx";
import "./index.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<React.StrictMode>
			<DndProvider backend={HTML5Backend}>
				<App />
			</DndProvider>
		</React.StrictMode>
	</BrowserRouter>
);
