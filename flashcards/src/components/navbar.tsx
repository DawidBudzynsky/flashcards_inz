import React, { useState, useEffect } from 'react';
import handleLogout from '../requests/logout';
// import { Link } from 'react-router-dom';
// import checkIfLoggedIn from '../requests/check_session';
// import handleLogout from '../requests/logout';



const Navbar: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        window.location.href = "http://localhost:8080/auth?provider=google"
    };

    const checkIfLoggedIn = async () => {
        try {
            const response = await fetch('http://localhost:8080/check-user-logged-in', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };
    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    return (
        <div className="navbar bg-base-100 w-full top-0">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a>Item 1</a></li>
                        <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li>
                        <li><a>Item 3</a></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a href='/'>Home</a></li>
                    <li><a href='/users'>Users</a></li>
                    <li>
                        <a href='/create'>Create</a>
                        {/* <details> */}
                        {/*     <summary>Parent</summary> */}
                        {/*     <ul className="p-2"> */}
                        {/*         <li><a>Submenu 1</a></li> */}
                        {/*         <li><a>Submenu 2</a></li> */}
                        {/*     </ul> */}
                        {/* </details> */}
                    </li>
                    <li><a href='/profile'>Profile</a></li>
                </ul>
            </div>
            <div className="navbar-end">
                {!isLoggedIn ? (
                    <button onClick={handleLogin} className="btn">Sign In</button>
                ) : (
                    <button onClick={handleLogout} className="btn">Sign Out</button>
                )}
            </div>
        </div>
    )
}
export default Navbar;
