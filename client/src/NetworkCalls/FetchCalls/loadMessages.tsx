import { apiClient } from '../../utils/apiClient';
import { Logger, LogLevel } from '../../Logger/Logger';

export interface Message {
  id: number;
  fromUserId: number;
  toUserId: number;
  message: string;
  timestamp: string;
  username?: string;
}

export interface LoadMessagesRequest {
  fromUserId?: number;
  toUserId?: number;
  limit?: number;
  offset?: number;
}

export interface LoadMessagesResponse {
  success: boolean;
  messages?: Message[];
  error?: string;
}

/**
 * Load messages from the database
 */
export const loadMessages = async (request: LoadMessagesRequest = {}): Promise<LoadMessagesResponse> => {
  try {
    Logger(`Loading messages with params: ${JSON.stringify(request)}`, LogLevel.Debug);
    
    const response = await apiClient.post<{ messages: Message[] }>('/loadMessages', request);
    
    if (response.success && response.data) {
      Logger(`Loaded ${response.data.messages.length} messages successfully`, LogLevel.Info);
      return {
        success: true,
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
    Logger(`Error loading messages: ${error}`, LogLevel.Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};
