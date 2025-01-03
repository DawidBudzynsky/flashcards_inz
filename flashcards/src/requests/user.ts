import api from '../api/api';
import { Folder, User } from '../types/interfaces';

// Fetch user data
export const getUser = async (): Promise<User> => {
    return await api.get('/users/me');
};

