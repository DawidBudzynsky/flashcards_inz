import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, toggleUserVisibility } from "../requests/user";
import { User } from "../types/interfaces";

const Profile: React.FC = () => {
	const queryClient = useQueryClient();
	const { data: user } = useQuery<User>({
		queryKey: ["user"],
		queryFn: getUser,
	});

	const { mutate: toggleVisibility } = useMutation({
		mutationFn: () => toggleUserVisibility(),
		onMutate: async () => {
			// Cancel ongoing queries for the user
			await queryClient.cancelQueries({ queryKey: ["user"] });

			// Snapshot the previous user data
			const previousUser = queryClient.getQueryData<User>(["user"]);

			// Optimistically update the user's visibility
			if (previousUser) {
				queryClient.setQueryData(["user"], {
					...previousUser,
					IsPrivate: !previousUser.IsPrivate,
				});
			}

			// Return the rollback function
			return { previousUser };
		},
		onError: (_, __, context: any) => {
			// Rollback the state if the mutation fails
			queryClient.setQueryData(["user"], context.previousUser);
		},
		onSuccess: () => {},
		onSettled: () => {
			// Refetch the user data
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	const handleVisibilityChange = () => {
		toggleVisibility();
	};

	return (
		<div className="md:max-w-5xl w-full mx-auto space-y-8">
			<div className="md:flex flex-col justify-between w-5/6 mx-auto border-[1px] rounded-3xl m-2">
				<h2 className="text-3xl p-8">
					Your{" "}
					<span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
						Profile
					</span>
				</h2>
				<div className="text-left p-4 flex flex-col border-r-0 border-b-0 border-l-0 font-semibold border-[1px] h-full">
					<span className="text-3xl p-4">Username</span>
					<span className="px-4 pb-4">{user?.Username}</span>
				</div>

				<div className="text-left p-4 flex flex-col border-r-0 border-b-0 border-l-0 font-semibold border-[1px] h-full">
					<span className="text-3xl p-4">Email</span>
					<span className="px-4 pb-4">{user?.Email}</span>
				</div>

				<div className="text-left p-4 flex justify-between border-r-0 border-b-0 border-l-0 font-semibold border-[1px] h-full">
					<span className="text-3xl p-4">Private account</span>
					<input
						type="checkbox"
						className="toggle hover:bg-blue-700 my-auto"
						checked={Boolean(user?.IsPrivate)}
						onChange={handleVisibilityChange}
					/>
				</div>
			</div>
		</div>
	);
};
export default Profile;
