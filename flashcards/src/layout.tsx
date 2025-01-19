import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className="grid grid-rows-[auto_1fr_auto] h-screen">
			<Navbar />
			<Outlet />
			{/* <Footer /> */}
		</div>
	);
};

export default Layout;
