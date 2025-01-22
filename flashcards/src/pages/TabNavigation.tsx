import { Link } from "react-router-dom";
import { ACTIVE_TAB, TabNames } from "../utils/constants";
import { useEffect } from "react";

const TabNavigation: React.FC = () => {
	const tabs = [
		{ id: TabNames.Flashcards, label: "Sets", path: "/flashcards_sets" },
		{ id: TabNames.Folders, label: "Folders", path: "/folders" },
		{ id: TabNames.Tests, label: "Tests", path: "/tests" },
	];

	const activeTab =
		tabs.find((tab) => location.pathname.includes(tab.path))?.id ||
		localStorage.getItem(ACTIVE_TAB) ||
		TabNames.Flashcards;

	useEffect(() => {
		localStorage.setItem(ACTIVE_TAB, activeTab);
	}, [activeTab]);

	return (
		<div className="flex md:justify-start justify-center my-4 md:py-4">
			<div role="tablist" className="tabs tabs-bordered">
				{tabs.map((tab) => (
					<Link
						key={tab.id}
						to={tab.path}
						role="tab"
						className={`tab text-2xl ${
							activeTab === tab.id ? "tab-active" : ""
						}`}
					>
						{tab.label}
					</Link>
				))}
			</div>
		</div>
	);
};

export default TabNavigation;
