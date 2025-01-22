export const openModal = (modal_id: string) => {
	(document.getElementById(modal_id) as HTMLDialogElement)?.showModal();
};

export const closeModal = (modal_id: string) => {
	(document.getElementById(modal_id) as HTMLDialogElement)?.close();
};
