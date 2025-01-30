import { useParams, useNavigate } from "react-router-dom";
import {
	deleteSetByID,
	getFlashcardSetByID,
	toggleSetVisibility,
} from "../requests/flashcardset";
import { Flashcard } from "../types/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dateToString } from "../utils/showDate";
import { toggleFlashcardTracking } from "../requests/flashcard";
import { notificationContext } from "../utils/notifications";
import CreateButton from "../components/Buttons/CreateButton";
import {
	IoBookmarks,
	IoBookmarksOutline,
	IoEarthOutline,
	IoLockClosed,
} from "react-icons/io5";
import { PiCardsBold } from "react-icons/pi";
import { useEffect } from "react";

const FlashcardSetView: React.FC = () => {
	const navigate = useNavigate();
	const { setId: setID } = useParams<{ setId: string }>();
	const queryClient = useQueryClient();

	const {
		data: data,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["flashcardSet", setID],
		queryFn: () => getFlashcardSetByID(setID!),
		enabled: !!setID,
	});

	useEffect(() => {
		if (setID) {
			refetch();
		}
	}, [setID, refetch]);

	const { mutate: deleteSet } = useMutation({
		mutationFn: () => deleteSetByID(setID!),
		onSuccess: () => {
			notificationContext.notifySuccess("Set deleted successfully.");
			navigate(-1);
		},
		onError: (error: any) => {
			notificationContext.notifyError(
				`Failed to delete set: ${
					error?.message || "An unexpected error occurred."
				}`
			);
		},
	});

	const handleToggleVisibility = async () => {
		toggleSetPrivate();
	};

	const { mutate: toggleSetPrivate } = useMutation({
		mutationFn: () => toggleSetVisibility(setID!),
		onSuccess: () => {
			notificationContext.notifySuccess("Visibility changed");
			queryClient.invalidateQueries({
				queryKey: ["flashcardSet", setID],
			});
		},
		onError: () => {
			notificationContext.notifyError("Failed to toggle private status.");
		},
	});

	const handleDelete = async () => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this set?"
		);
		if (confirmation) {
			deleteSet();
		}
	};

	const handleEdit = () => {
		navigate(`/flashcards_sets/${setID}/edit`);
	};

	const handleLearning = () => {
		navigate(`/flashcards_sets/${setID}/learn`);
	};

	const { mutate: toggleTracking } = useMutation({
		mutationFn: (cardID: number) => toggleFlashcardTracking(cardID),
		onSuccess: (_, cardID) => {
			if (data?.set?.Flashcards) {
				data.set.Flashcards = data.set.Flashcards.map(
					(flashcard: Flashcard) =>
						flashcard.ID === cardID
							? { ...flashcard, Tracking: !flashcard.Tracking }
							: flashcard
				);
			}
		},
		onError: (error: any) => {
			console.error("Error toggling tracking:", error);
		},
	});

	const handleTracking = (cardID: number) => {
		toggleTracking(cardID);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!data || !data.set) {
		return <div>Error: Flashcard set not found.</div>;
	}

	return (
		<div className="md:px-20 lg:max-w-7xl lg:mx-auto">
			<div className="flex md:justify-between md:text-5xl text-3xl justify-center md:my-4 bg-base-100">
				<div className="flex flex-col text-start">
					<h1 className="font-bold">{data.set?.Title}</h1>
					<span className="text-sm text-gray-600">
						Created: {dateToString(data.set?.CreatedAt)}
					</span>
					<div className="md:flex flex-col md:text-4xl text-base-300 text-2xl justify-start flex-wrap pt-2">
						<p className="">Description: </p>
						<p>{data.set?.Description}</p>
					</div>
				</div>
				<div className="">
					{data.set?.IsPrivate ? (
						<IoLockClosed className="text-[150px] hidden md:block" />
					) : (
						<IoEarthOutline className="text-[150px] hidden md:block" />
					)}
					<div className="flex md:text-3xl text-sm justify-center font-bold items-center gap-2">
						{data.isOwner && (
							<>
								<span>Public</span>
								<input
									type="checkbox"
									className="checkbox md:size-12 my-auto"
									checked={!Boolean(data.set?.IsPrivate)}
									onChange={handleToggleVisibility}
								/>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="flex justify-start mb-4 md:gap-16 gap-2">
				<CreateButton
					title="Learn"
					className={"btn flex-1"}
					onClick={handleLearning}
				/>
				<CreateButton title="Track All" className="btn flex-1" />
				{data.isOwner ? (
					<>
						<button className="btn flex-1" onClick={handleEdit}>
							Edit
						</button>
						<button className="btn flex-1" onClick={handleDelete}>
							Remove
						</button>
					</>
				) : (
					<></>
				)}
			</div>

			<div className="border-[1px] rounded-3xl space-y-4">
				<h1 className="text-3xl font-bold pt-4">
					Flashcards in this set
				</h1>
				{data?.set.Flashcards.map(
					(flashcard: Flashcard, index: number) => (
						<div className="flex space-x-2 md:mx-16 border-t-[1px] md:border-0">
							<div className="w-full p-4 md:border-[1px] rounded-3xl space-y-5">
								<div className="flex font-bold justify-between gap-4">
									<PiCardsBold className="size-[50px]" />
									<div className="my-auto">
										Card {index + 1}
									</div>

									{data.isOwner && (
										<label className="md:hidden">
											{Boolean(flashcard.Tracking) ? (
												<IoBookmarks className="mx-auto size-[40px]" />
											) : (
												<IoBookmarksOutline className="mx-auto size-[40px]" />
											)}

											<input
												type="checkbox"
												className="checkbox hidden mx-auto"
												checked={Boolean(
													flashcard.Tracking
												)}
												value={index}
												onChange={() =>
													handleTracking(flashcard.ID)
												}
											/>
										</label>
									)}
								</div>

								<div className="flex justify-between md:space-x-24">
									<input
										className="input input-bordered w-full"
										disabled
										type="text"
										placeholder="Question"
										value={flashcard.Question}
									/>
									<input
										className="input input-bordered w-full"
										disabled
										type="text"
										placeholder="Question"
										value={flashcard.Answer}
									/>
								</div>
							</div>

							{data.isOwner && (
								<div className="hidden md:flex bg-base-100 p-2 py-auto justify-center space-y-4 flex-col md:border-[1px] rounded-2xl">
									<label className="flex flex-col items-center space-y-4 cursor-pointer">
										{Boolean(flashcard.Tracking) ? (
											<IoBookmarks className="mx-auto size-[40px]" />
										) : (
											<IoBookmarksOutline className="mx-auto size-[40px]" />
										)}

										<input
											type="checkbox"
											className="checkbox hidden mx-auto"
											checked={Boolean(
												flashcard.Tracking
											)}
											value={index}
											onChange={() =>
												handleTracking(flashcard.ID)
											}
										/>
										<span className="hidden md:block">
											Tracking
										</span>
									</label>
								</div>
							)}
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default FlashcardSetView;
