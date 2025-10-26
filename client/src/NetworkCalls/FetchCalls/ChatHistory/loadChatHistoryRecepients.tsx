import {Logger, LogLevel} from '../../../Logger/Logger'
import { apiClient } from '../../../utils/apiClient';

export interface ChatHistoryRecipientsResponse {
    success: boolean;
    recepients?: any[];
    error?: string;
}

export const loadChatHistoryRecepients = async (fromUserId: number): Promise<ChatHistoryRecipientsResponse> => {
    try {
        Logger(`Loading chat history recipients for user: ${fromUserId}`, LogLevel.Debug);
        
        // Use POST request with fromUserId in body to match backend expectation
        const response = await apiClient.post<{ recepients: any[] }>('/chat-history/loadRecepients', {
            fromUserId
        });
        
        console.log("response", response);
        if (response.success && response.data) {
            return {
                success: true,
                recepients: response.data.recepients
            };
        } else {
            return {
                success: false,
                error: response.error || 'Failed to load chat history recipients'
            };
        }
    } catch (error) {
        Logger(`Error loading chat history recipients: ${error}`, LogLevel.Error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};
