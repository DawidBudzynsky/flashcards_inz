import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	deleteUserProfile,
	getUser,
	toggleUserVisibility,
} from "../requests/user";
import { FlashcardSet, User } from "../types/interfaces";
import { notificationContext } from "../utils/notifications";
import ListItem from "../components/ListItem";
import { toggleSetVisibility } from "../requests/flashcardset";
import { IoEarthOutline, IoLockClosed } from "react-icons/io5";
import handleLogout from "../requests/logout";

const Profile: React.FC = () => {
	const queryClient = useQueryClient();
	const { data: user } = useQuery<User>({
		queryKey: ["user"],
		queryFn: getUser,
	});

	const { mutate: toggleVisibility } = useMutation({
		mutationFn: () => toggleUserVisibility(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["user"] });

			const previousUser = queryClient.getQueryData<User>(["user"]);

			if (previousUser) {
				queryClient.setQueryData(["user"], {
					...previousUser,
					IsPrivate: !previousUser.IsPrivate,
				});
			}

			return { previousUser };
		},
		onError: (_, __, context: any) => {
			queryClient.setQueryData(["user"], context.previousUser);
			notificationContext.notifyError("Was unable to change visibility");
		},
		onSuccess: () => {
			notificationContext.notifySuccess("Visibility Changed");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
	const { mutate: deleteProfile } = useMutation({
		mutationFn: deleteUserProfile,
		onSuccess: () => {
			notificationContext.notifySuccess("User deleted");
			queryClient.invalidateQueries({
				queryKey: ["user"],
			});
			handleLogout();
		},
		onError: () => {
			notificationContext.notifyError("Failed to delete user.");
		},
	});
	const handleDeleteUser = () => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this user? This action cannot be undone."
		);

		if (confirmation) {
			deleteProfile();
		} else {
			notificationContext.notifyError("User deletion canceled.");
		}
	};

	const handleVisibilityChange = () => {
		toggleVisibility();
	};

	const { mutate: toggleSetPrivate } = useMutation({
		mutationFn: (setID: string) => toggleSetVisibility(setID),
		onSuccess: () => {
			notificationContext.notifySuccess("Visibility changed");
			queryClient.invalidateQueries({
				queryKey: ["user"],
			});
		},
		onError: (error: any) => {
			console.error("Failed to toggle private status:", error);
			notificationContext.notifyError("Failed to toggle private status.");
		},
	});

	const handleSetVisibilityChange = (setID: string) => {
		toggleSetPrivate(setID);
	};

	return (
		<div className="md:max-w-5xl w-full mx-auto space-y-8">
			<div className="md:flex flex-col md:w-2/3 mx-auto border-[1px] rounded-3xl m-2">
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
				<div className="text-left p-4 flex justify-between border-r-0 border-b-0 border-l-0 font-semibold border-[1px] h-full">
					<span className="text-3xl p-4">Delete account</span>
					<button
						className="hover:bg-red-700 p-2  rounded-full my-auto"
						onClick={handleDeleteUser}
					>
						Delete
					</button>
				</div>
			</div>

			<div className="md:flex flex-col md:w-2/3 mx-auto border-[1px] rounded-3xl m-2">
				<h1 className="p-2">Your sets</h1>
				{user?.FlashcardsSets.map((set: FlashcardSet) => (
					<div
						key={set.ID}
						className="flex justify-between items-center p-4 border-b-[1px]"
					>
						<ListItem key={set.ID} set={set} />
						<div className="flex items-center">
							<div className="">
								{set?.IsPrivate ? (
									<IoLockClosed className="text-[75px] hidden md:block" />
								) : (
									<IoEarthOutline className="text-[75px] hidden md:block" />
								)}
								<div className="flex md:text-md text-sm justify-center font-bold items-center gap-2">
									<span>Public</span>
									<input
										type="checkbox"
										className="checkbox md:size-5 my-auto"
										checked={!Boolean(set?.IsPrivate)}
										onChange={() =>
											handleSetVisibilityChange(
												String(set.ID)
											)
										}
									/>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default Profile;
