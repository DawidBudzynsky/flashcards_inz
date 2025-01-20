import React from "react";
interface CreateButtonProps {
	title: string;
	modal_id?: string;
	onClick?: () => void;
}

const CreateButton: React.FC<CreateButtonProps> = ({
	title,
	modal_id = "",
	onClick,
}) => {
	return (
		<button
			className="bg-gradient-to-l from-blue-500 to-indigo-600 text-white py-2 px-4 rounded hover:bg-blue-500 hover:scale-105 duration-150"
			onClick={() => {
				if (onClick) {
					onClick();
				} else {
					(
						document.getElementById(modal_id) as HTMLDialogElement
					)?.showModal();
				}
			}}
		>
			{title}
		</button>
	);
};

export default CreateButton;
