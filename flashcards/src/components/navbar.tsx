import { Link } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import handleLogout from "../requests/logout";
import { useIsLoggedIn } from "../hooks/useLoggedIn";
import { AUTH_PROVIDER } from "../utils/constants";
interface NavbarProps {
	toggleDrawer: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDrawer }) => {
	const { isLoggedIn } = useIsLoggedIn();

	const handleLogin = () => {
		window.location.href = AUTH_PROVIDER;
	};

	return (
		<div className="navbar bg-base-100 w-full top-0 shadow-xl rounded-2xl border-[1px]">
			{/* Navbar Start */}
			<div className="navbar-start flex items-center">
				{/* Toggle Button for SideDrawer */}
				<button
					className="btn btn-ghost btn-circle mr-2"
					onClick={() => toggleDrawer()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h7"
						/>
					</svg>
				</button>
				<Link to="/" className="btn btn-ghost text-xl">
					UFlashcards
				</Link>
			</div>

			{/* Navbar Center */}
			{/* <div className="navbar-center hidden lg:flex">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/profile">Profile</Link>
					</li>
					<li>
						<Link to="/users">My Resources</Link>
					</li>
					<li>
						<Link to="/create">Create New Set</Link>
					</li>
				</ul>
			</div> */}

			<div className="navbar-center hidden lg:flex">
				<Breadcrumbs />
			</div>

			{/* Navbar End */}
			<div className="navbar-end">
				{isLoggedIn ? (
					<button onClick={handleLogout} className="btn">
						Sign Out
					</button>
				) : (
					<button onClick={handleLogin} className="btn">
						Sign In
					</button>
				)}
			</div>
		</div>
	);
};

export default Navbar;
