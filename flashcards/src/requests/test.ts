import api from "../api/api";

interface CreateTestRequest {
	SetIDs: number[];
	StartDate: string;
	DueDate: string;
	NumQuestions: number;
}
interface AnswersRequest {
	[key: number]: string;
}

export const createTest = async (testData: CreateTestRequest) => {
	const url = `/tests/`;
	return await api.post(url, testData);
};

export const getTestQuestions = async (testID: string) => {
	const url = `/tests/${testID}/questions`;
	return await api.get(url);
};

export const verifyAnswers = async (answers: AnswersRequest) => {
	const url = `/tests/verify`;
	return await api.post(url, answers);
};
