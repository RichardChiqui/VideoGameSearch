import { apiClient } from '../../utils/apiClient';
import { Logger, LogLevel } from '../../Logger/Logger';

export interface CreateMessageData {
  fromUserId: number;
  toUserId: number;
  message: string;
  timestamp: string;
}

export interface CreateMessageResponse {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Create a new message in the database
 */
export const createNewMessage = async (messageData: CreateMessageData): Promise<CreateMessageResponse> => {
  try {
    Logger(`Creating new message from ${messageData.fromUserId} to ${messageData.toUserId}`, LogLevel.Debug);
    
    const response = await apiClient.post<{ messageId: number }>('/insertNewMessage', messageData);
    
    if (response.success && response.data) {
      Logger(`Message created successfully with ID: ${response.data.messageId}`, LogLevel.Info);
      return {
        success: true,
        messageId: response.data.messageId
      };
    } else {
      Logger(`Failed to create message: ${response.error}`, LogLevel.Error);
      return {
        success: false,
        error: response.error || 'Failed to create message'
      };
    }
  } catch (error) {
    Logger(`Error creating message: ${error}`, LogLevel.Error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};