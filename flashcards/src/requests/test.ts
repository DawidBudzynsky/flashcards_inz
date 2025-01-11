import api from '../api/api';


export const createTest = async (testData: { setIDs: number[], dueDate: string }) => {
    const url = `/tests/`;
    return await api.post(url, testData);
};
