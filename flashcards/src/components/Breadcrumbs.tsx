import { Link, useLocation } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
	const location = useLocation();
	let currentLink = "";
	const crumbs = location.pathname
		.split("/")
		.filter((crumb) => crumb !== "")
		.map((crumb) => {
			currentLink += `/${crumb}`;
			return (
				<li className="crumb" key={crumb}>
					<Link to={currentLink}>{crumb}</Link>
				</li>
			);
		});
	return (
		<div className="breadcrumbs text-xl">
			<ul>{crumbs}</ul>
		</div>
	);
};
export default Breadcrumbs;
