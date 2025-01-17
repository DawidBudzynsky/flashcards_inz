import { useState, useEffect } from "react";
import SetsPresentation from "../components/Presentations/SetsPresentation";
import FoldersPresentation from "../components/Presentations/FoldersPresentation";
import TestsPresentation from "../components/Presentations/TestsPresentation";

// Define the enum for tab names
enum TabNames {
	Flashcards = "flashcards",
	Folders = "folders",
	Tests = "tests",
}

function Users() {
	const savedTab = localStorage.getItem("activeTab") as TabNames | null;
	const initialTab = savedTab || TabNames.Flashcards;

	const [activeTab, setActiveTab] = useState<TabNames>(initialTab);

	const tabComponents: { [key in TabNames]: JSX.Element } = {
		[TabNames.Flashcards]: <SetsPresentation />,
		[TabNames.Folders]: <FoldersPresentation />,
		[TabNames.Tests]: <TestsPresentation />,
	};

	const tabs = [
		{ id: TabNames.Flashcards, label: "Sets" },
		{ id: TabNames.Folders, label: "Folders" },
		{ id: TabNames.Tests, label: "Tests" },
	];

	useEffect(() => {
		localStorage.setItem("activeTab", activeTab);
	}, [activeTab]);

	return (
		<>
			<div className="p-4 max-w-5xl w-full mx-auto">
				<div className="flex justify-center my-4">
					<div role="tablist" className="tabs tabs-bordered">
						{tabs.map((tab) => (
							<a
								role="tab"
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`tab ${
									activeTab === tab.id ? "tab-active" : ""
								}`}
							>
								{" "}
								{tab.label}
							</a>
						))}
					</div>
				</div>

				{tabComponents[activeTab] || <h1>No Tab selected</h1>}
			</div>
		</>
	);
}

export default Users;
