import {Logger, LogLevel} from '../../Logger/Logger'
import { apiClient } from '../../utils/apiClient';

export const loadAllUsers = async () => {
    try {
        // Use the authenticated API client
        const response = await apiClient.get('/homepage/loadUsers');
        
        if (response.success) {
            Logger("Successfully loaded all users", LogLevel.Info);
            return response.data;
        } else {
            Logger(`Failed to load all users: ${response.error}`, LogLevel.Error);
            throw new Error(response.error || 'Failed to load users');
        }
    } catch (error) {
        Logger("Failed to load all Users: " + error, LogLevel.Error);
        throw error;
    }
};
