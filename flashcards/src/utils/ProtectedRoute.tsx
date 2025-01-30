import { Navigate, Outlet } from "react-router-dom";
import { useIsLoggedIn } from "../hooks/useLoggedIn";

const ProtectedRoute = () => {
	const { isLoggedIn, isFetched } = useIsLoggedIn();

	if (!isFetched || isLoggedIn === undefined) {
		return <h1>Loading...</h1>;
	}

	return isLoggedIn ? <Outlet /> : <Navigate to="/Unauthorized" />;
};

export default ProtectedRoute;
