import { apiClient } from '../../utils/apiClient';
import { Logger, LogLevel } from '../../Logger/Logger';

export interface LoadUserMessagesResponse {
  success: boolean;
  users?: any[];
  messages?: any[];
  error?: string;
}

export const loadUserMessages = async (fromUserId: number, toUserId: number): Promise<LoadUserMessagesResponse> => {
  try {
    Logger(`Loading messages between ${fromUserId} and ${toUserId}`, LogLevel.Debug);
    
    const response = await apiClient.post<{ users: any[]; messages: any[] }>('/loadMessages', {
      fromUserId,
      toUserId
    });
    
    if (response.success && response.data) {
      return {
        success: true,
        users: response.data.users,
        messages: response.data.messages
      };
    } else {
      Logger(`Failed to load messages: ${response.error}`, LogLevel.Error);
      return {
        success: false,
        error: response.error || 'Failed to load messages'
      };
    }
  } catch (error) {
    Logger(`Error loading messages between ${fromUserId} and ${toUserId}: ${error}`, LogLevel.Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
