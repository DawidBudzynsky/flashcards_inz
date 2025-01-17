import React from "react";
interface CreateButtonProps {
	title: string;
	modal_id: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({ title, modal_id }) => {
	return (
		<button
			className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 hover:scale-105 duration-150"
			onClick={() =>
				(
					document.getElementById(modal_id) as HTMLDialogElement
				)?.showModal()
			}
		>
			{title}
		</button>
	);
};

export default CreateButton;
