import api from "../api/api";
import { Folder } from "../types/interfaces";

export const getFolderByID = async (folderid: string) => {
	const url = `/folders/${folderid}`;
	return await api.get(url);
};

export const deleteFolderByID = async (folderid: string) => {
	const url = `/folders/${folderid}`;
	return await api.delete(url);
};

export const createFolder = async (
	folderData: Partial<Folder>
): Promise<Folder> => {
	const url = "/folders";
	return await api.post(url, folderData);
};

export const editFolder = async (
	folderId: string,
	folderData: Partial<Folder>
): Promise<Folder> => {
	const url = `/folders/${folderId}`;
	return await api.put(url, folderData);
};

export const addSetToFolder = async (
	flashcardsetid: number,
	folderid: number
) => {
	const url = `/flashcards_sets/${flashcardsetid}`;
	return await api.put(url, { FolderID: folderid });
};

export const appendSetToFolder = async (
	flashcardsetid: number,
	folderid: number
) => {
	const url = `/flashcards_sets/add_set_to_folder`;
	return await api.post(url, {
		FlashcardSetID: flashcardsetid,
		FolderID: Number(folderid),
	});
};

export const changeSetFolder = async (
	flashcardsetid: number,
	oldfolderid: number | null,
	folderid: number
) => {
	const url = `/flashcards_sets/changeSetFolder`;
	return await api.post(url, {
		FlashcardSetID: flashcardsetid,
		OldFolderID: Number(oldfolderid),
		FolderID: Number(folderid),
	});
};

export const removeSetFromFolder = async (
	flashcardsetid: number,
	folderid: number
) => {
	const url = `/flashcards_sets/remove_set_from_folder`;
	return await api.post(url, {
		FlashcardSetID: flashcardsetid,
		FolderID: Number(folderid),
	});
};

export const getUserFolders = async () => {
	const url = `/folders/`;
	return await api.get(url);
};
