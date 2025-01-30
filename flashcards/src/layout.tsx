import { Outlet, useLocation } from "react-router-dom";
import SideDrawer from "./pages/SideDrawer";
import { useState } from "react";
import Navbar from "./components/navbar";
import PageContainer from "./components/PageContainter";
import AnimatePage from "./utils/AnimatePage";

const Layout = () => {
  const [drawerHidden, setDrawerHidden] = useState(true);

  const location = useLocation();
  return (
    <main className="base mx-w-screen gap-2 md:px-6 md:pt-5">
      <Navbar toggleDrawer={() => setDrawerHidden(!drawerHidden)} />
      <div className="flex">
        <SideDrawer hidden={drawerHidden} />
        <PageContainer>
          <AnimatePage key={location.key}>
            <Outlet />
          </AnimatePage>
        </PageContainer>
      </div>
    </main>
  );
};

export default Layout;
