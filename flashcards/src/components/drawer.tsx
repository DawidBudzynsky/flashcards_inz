import React, { useState } from "react";

interface DrawerProps {
	children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div
				tabIndex={0}
				role="button"
				className="btn btn-ghost lg:hidden"
				onClick={toggleDrawer}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>

			<div
				className={`fixed top-0 left-0 h-full bg-base-200 w-64 z-50 transition-transform transform ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0 lg:static`}
			>
				<div className="flex lg:hidden justify-end p-4">
					<button
						className="btn btn-sm btn-circle btn-ghost"
						onClick={toggleDrawer}
					>
						✕
					</button>
				</div>

				<div className="p-4">{children}</div>
			</div>
		</>
	);
};

export default Drawer;
