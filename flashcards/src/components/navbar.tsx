import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import checkIfLoggedIn from '../requests/check_session';
import handleLogout from '../requests/logout';

// const BasicNavbar: React.FC = () => {
//     return (
//         <nav className="bg-blue-900 text-white px-4 py-3">
//             <div className="container mx-auto flex items-center justify-between">
//                 {/* Logo */}
//                 <div className="text-xl font-bold">
//                     <Link to="/" className="hover:text-blue-300">React App</Link>
//                 </div>
//
//                 {/* Links */}
//                 <div className="space-x-4 flex items-center">
//                     <Link to="/" className="hover:text-blue-300">
//                         Home
//                     </Link>
//                     <Link to="/users" className="hover:text-blue-300">
//                         Users
//                     </Link>
//                     <Link to="/create" className="hover:text-blue-300">
//                         Create
//                     </Link>
//
//                     {/* Dropdown */}
//                     <div className="relative group">
//                         <button className="hover:text-blue-300 focus:outline-none">
//                             More
//                         </button>
//                         <div className="absolute hidden group-hover:block bg-white text-black rounded-lg shadow-lg mt-2">
//                             <Link
//                                 to="/option1"
//                                 className="block px-4 py-2 hover:bg-gray-200"
//                             >
//                                 Option 1
//                             </Link>
//                             <Link
//                                 to="/option2"
//                                 className="block px-4 py-2 hover:bg-gray-200"
//                             >
//                                 Option 2
//                             </Link>
//                             <Link
//                                 to="/option3"
//                                 className="block px-4 py-2 hover:bg-gray-200"
//                             >
//                                 Option 3
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };
//
// export default BasicNavbar;




interface FlowbiteNavbarProps {
    handleLogin: (event: React.MouseEvent<HTMLButtonElement>) => void;
}


const FlowbiteNavbar: React.FC<FlowbiteNavbarProps> = ({ handleLogin }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"></img>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {!isLoggedIn ? (
                        <button onClick={handleLogin} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log in</button>
                    ) : (
                        <button onClick={handleLogout} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log out</button>
                    )}
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="/users" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Users</a>
                        </li>
                        <li>
                            <a href="/create" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Create</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}
export default FlowbiteNavbar;
