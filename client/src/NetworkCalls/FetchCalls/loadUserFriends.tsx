import {Logger, LogLevel} from '../../Logger/Logger'
import { apiClient } from '../../utils/apiClient';

export const loadUserFriends = async (userId: number) => {
    try {
        const response = await apiClient.post('/loadUserFriends', { userId: userId });
        
        if (response.success) {
            Logger("Successfully loaded friends for user: " + userId, LogLevel.Info);
            return response.data;
        } else {
            Logger(`Failed to load friends for user ${userId}: ${response.error}`, LogLevel.Error);
            throw new Error(response.error || 'Failed to load friends');
        }
    } catch (error) {
        Logger("Failed to load friends for user:" + userId + " error " + error, LogLevel.Error);
        throw error;
    }
};
