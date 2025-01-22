import { Navigate, Outlet } from "react-router-dom";
import { useIsLoggedIn } from "../hooks/useLoggedIn";

const ProtectedRoute: React.FC = () => {
	const { isLoggedIn, isLoading } = useIsLoggedIn();

	if (isLoading) {
		<h1>Loading</h1>;
	}

	return isLoggedIn ? <Outlet /> : <Navigate to={"/Unauthorized"} />;
};

export default ProtectedRoute;
