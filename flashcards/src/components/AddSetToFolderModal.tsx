import React from "react";
import { useUserData } from "../hooks/userData";
import SetsList from "./SetsList";

const AddSetModal: React.FC = () => {
	const { flashcardSets } = useUserData();

	return (
		<>
			<button
				className="btn flex-1"
				onClick={() =>
					(
						document.getElementById(
							"my_modal_4"
						) as HTMLDialogElement
					)?.showModal()
				}
			>
				Add Set
			</button>
			<dialog id="my_modal_4" className="modal">
				<SetsList sets={flashcardSets} />
				<form method="dialog" className="modal-backdrop">
					<button className="btn">Close</button>
				</form>
			</dialog>
		</>
	);
};

export default AddSetModal;
