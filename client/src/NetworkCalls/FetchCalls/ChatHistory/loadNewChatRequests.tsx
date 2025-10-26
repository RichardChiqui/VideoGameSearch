import {Logger, LogLevel} from '../../../Logger/Logger'
import { apiClient } from '../../../utils/apiClient';

export interface NewChatRequestsResponse {
    success: boolean;
    newChatRequests?: any[];
    error?: string;
}

export const loadNewChatRequests = async (fromUserId: number): Promise<NewChatRequestsResponse> => {
    try {
        Logger(`Loading new chat requests for user: ${fromUserId}`, LogLevel.Debug);
        
        // Use GET request with fromUserId as URL parameter (RESTful approach)
        const response = await apiClient.get<{ newChatHistoryRequests: any[] }>(`/chat-history/loadNewChatRequests?fromUserId=${fromUserId}`);
        
        console.log("response", response);
        if (response.success && response.data) {
            return {
                success: true,
                newChatRequests: response.data.newChatHistoryRequests
            };
        } else {
            return {
                success: false,
                error: response.error || 'Failed to load new chat requests'
            };
        }
    } catch (error) {
        Logger(`Error loading new chat requests: ${error}`, LogLevel.Error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};
