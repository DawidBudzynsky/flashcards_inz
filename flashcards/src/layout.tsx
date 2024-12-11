import Navbar from './components/navbar';
import Footer from './components/footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='grid grid-rows-[auto_1fr_auto] h-screen'>
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Layout;

