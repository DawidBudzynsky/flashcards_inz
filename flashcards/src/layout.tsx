import { Outlet } from "react-router-dom";
import SideDrawer from "./pages/SideDrawer";
import { useState } from "react";
import Navbar from "./components/navbar";
import PageContainer from "./components/PageContainter";

const Layout = () => {
	const [drawerHidden, setDrawerHidden] = useState(true);

	return (
		<main className="base mx-w-screen gap-2 md:px-6 md:pt-5">
			<Navbar toggleDrawer={() => setDrawerHidden(!drawerHidden)} />
			<div className="flex">
				<SideDrawer hidden={drawerHidden} />
				<PageContainer>
					<Outlet />
				</PageContainer>
			</div>
		</main>
	);
};

export default Layout;
