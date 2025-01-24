import React from "react";
import { openModal } from "../../utils/modals";
interface CreateButtonProps {
	title: string;
	modal_id?: string;
	onClick?: () => void;
	className?: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({
	title,
	modal_id = "",
	onClick,
	className = "",
}) => {
	return (
		<button
			className={`bg-gradient-to-l from-blue-500 to-indigo-600 text-white py-2 px-4 rounded hover:bg-blue-500 hover:scale-105 duration-150 ${className}`}
			onClick={() => {
				if (onClick) {
					onClick();
				} else {
					openModal(modal_id);
				}
			}}
		>
			{title}
		</button>
	);
};

export default CreateButton;
