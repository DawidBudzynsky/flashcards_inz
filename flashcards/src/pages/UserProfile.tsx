import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { User, FlashcardSet } from "../types/interfaces";
import { getUser, getUserByID } from "../requests/user";
import ListItem from "../components/ListItem";

const UserProfile: React.FC = () => {
	const { userID } = useParams<{ userID: string }>();

	const {
		data: user,
		isLoading,
		isError,
	} = useQuery<User>({
		queryKey: ["userProfile", userID],
		queryFn: () => getUserByID(userID!),
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error loading user data.</div>;

	return (
		<div className="md:max-w-5xl w-full mx-auto space-y-8">
			<h1 className="text-4xl font-bold">{user?.Username}</h1>
			<p className="text-lg text-gray-600">{user?.Email}</p>

			<div className="md:flex flex-col md:w-2/3 mx-auto border-[1px] rounded-3xl m-2">
				<h1 className="p-2">Public sets</h1>

				{user?.FlashcardsSets.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{user?.FlashcardsSets.map((set: FlashcardSet) => (
							<ListItem set={set} />
						))}
					</div>
				) : (
					<p>No sets available for this user.</p>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
