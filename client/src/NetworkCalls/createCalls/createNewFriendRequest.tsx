import {Logger, LogLevel} from '../../Logger/Logger'
import { apiClient } from '../../utils/apiClient';

export const createNewFriend = async (fromUserId: number, toUserId: number) => {
    try {
        const response = await apiClient.post('/send-friendrequest', {
            fromUserId: fromUserId,
            toUserId: toUserId
        });

        if (response.success) {
            Logger("Successfully created friend request from " + fromUserId + " to " + toUserId, LogLevel.Info);
            return response.data;
        } else {
            Logger(`Failed to create friend request from ${fromUserId} to ${toUserId}: ${response.error}`, LogLevel.Error);
            throw new Error(response.error || 'Failed to create friend request');
        }
    } catch (error) {
        Logger("Failed to create new friend request " + fromUserId + " to " + toUserId + " error:" + error, LogLevel.Error);
        throw error;
    }
};
