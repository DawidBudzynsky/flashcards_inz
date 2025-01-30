import { useEffect } from "react";
import { IoCog, IoFolderOpen, IoHome, IoMedal } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { ACTIVE_TAB, DEFAULT_TAB, TabNames } from "../utils/constants";

interface SideDrawerProps {
	hidden: boolean;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ hidden }) => {
	const location = useLocation();

	const validTabs = [TabNames.Folders, TabNames.Flashcards, TabNames.Tests];

	useEffect(() => {
		const path = location.pathname.split("/")[1];
		if (validTabs.includes(path)) {
			localStorage.setItem(ACTIVE_TAB, path);
		}
	}, [location]);

	const activeTab = localStorage.getItem(ACTIVE_TAB) || DEFAULT_TAB;

	const menuItems = [
		{ to: "/", icon: <IoHome className="text-xl" />, label: "Home" },
		{
			to: `/${activeTab}`,
			icon: <IoFolderOpen className="text-xl" />,
			label: "My Resources",
		},
		{
			to: "/create",
			icon: <IoCog className="text-xl" />,
			label: "Create New Set",
		},
		{
			to: "/profile",
			icon: <IoMedal className="text-xl" />,
			label: "Profile",
		},
	];

	return (
		<>
			<div
				className={`bg-base-100 fixed left-0 h-full transition-all duration-300 ease-in-out rounded-2xl border-[1px] md:hidden ${
					hidden ? "-translate-x-full" : "translate-x-0"
				}`}
				style={{ zIndex: 1000 }}
			>
				<ul className="menu text-sm font-semibold p-2 space-y-4">
					{menuItems.map((item) => (
						<li key={item.to}>
							<Link
								to={item.to}
								className="flex items-center space-x-2"
							>
								{item.icon}
								{!hidden && <span>{item.label}</span>}
							</Link>
						</li>
					))}
				</ul>
			</div>

			<div
				className={`bg-base-100 shadow-lg my-4 mr-8 transition-all duration-300 ease-in-out rounded-2xl border-[1px] border-b-0 hidden md:block ${
					hidden ? "w-[70px]" : "w-[300px]"
				}`}
			>
				<ul className="menu text-sm font-semibold p-2 space-y-4">
					{menuItems.map((item) => (
						<li key={item.to}>
							<Link
								to={item.to}
								className="flex items-center space-x-2"
							>
								{item.icon}
								{!hidden && <span>{item.label}</span>}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

export default SideDrawer;
