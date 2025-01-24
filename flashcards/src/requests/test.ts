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

export const getUserTests = async () => {
  const url = `/tests/grouped`;
  return await api.get(url);
};

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

export const assignTest = async (token: string | null) => {
  const url = `/tests/testToken?token=${token}`;
  return await api.get(url);
};

export const deleteTestByID = async (testID: number) => {
  const url = `/tests/${testID}`;
  return await api.delete(url);
};

export const seeResults = async (testID: number) => {
  const url = `/tests/${testID}/results`;
  return await api.get(url);
};

export const sseHit = async (testID: number) => {
  const url = `/sse/${testID}`;
  return await api.get(url);
};
