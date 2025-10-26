import {Logger, LogLevel} from '../../Logger/Logger'
import { apiClient } from '../../utils/apiClient';

export const loadUserFriendRequests = async (userId: number) => {
    try {
        const response = await apiClient.post('/loadUserFriendsRequests', { receiverId: userId });
        
        if (response.success) {
            Logger("Successfully loaded friend requests for user: " + userId, LogLevel.Info);
            return response.data;
        } else {
            Logger(`Failed to load friend requests for user ${userId}: ${response.error}`, LogLevel.Error);
            throw new Error(response.error || 'Failed to load friend requests');
        }
    } catch (error) {
        Logger("Failed to load friendrequests for user:" + userId + " error:" + error, LogLevel.Error);
        throw error;
    }
};
