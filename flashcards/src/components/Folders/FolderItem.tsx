import React from "react";
import { Folder } from "../../types/interfaces";
import { useDrop } from "react-dnd";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

interface FolderItemProps {
	folder: Folder;
	isActive: boolean;
	onClick: () => void;
	onDrop: (folderId: number, setId: number) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({
	folder,
	isActive,
	onClick,
	onDrop,
}) => {
	const [{ isOver }, dropRef] = useDrop(() => ({
		accept: "flashcard-set",
		drop: (item: { id: number }) => {
			onDrop(folder.ID, item.id);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));
	return (
		<div
			ref={dropRef}
			className={`collapse collapse-arrow join-item bg-base rounded-box border-base ${
				!isOver ? "border-[1px]" : "border-[4px]"
			}`}
		>
			<input
				type="radio"
				name="folder-accordion"
				checked={isActive}
				onChange={onClick}
			/>

			<div className="collapse-title text-xl font-medium flex items-center justify-around">
				{!isActive ? (
					<FaFolder className="mr-4" />
				) : (
					<FaFolderOpen className="mr-4" />
				)}
				{folder.Name}
				<p>{folder.FlashcardsSets.length}</p>
			</div>

			<div className="collapse-content">{folder.Description}</div>
		</div>
	);
};

export default FolderItem;
