import api from '../api/api';

export const getFolderByID = async (folderID: string) => {
    const folderUrl = `/folders/${folderID}`;

    try {
        return await api.get(folderUrl);
    } catch (error) {
        console.error(`Error fetching folder with ID ${folderID}:`, error.message || error);
        throw error;
    }
};


export const deleteFolderByID = async (folderID: string) => {
    const folderUrl = `/folders/${folderID}`;

    try {
        return await api.delete(folderUrl);
    } catch (error) {
        console.error(`Error fetching folder with ID ${folderID}:`, error.message || error);
        throw error;
    }
};

export const createFolder = async (folderData: Partial<Folder>): Promise<Folder> => {
    const folderUrl = '/folders';

    try {
        const response = await api.post(folderUrl, folderData);
        return response;
    } catch (error) {
        console.error('Error creating folder:', error.message || error);
        throw error;
    }
};
