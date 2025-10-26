import { socketService, MessageData } from './SocketService';
import { Logger, LogLevel } from '../Logger/Logger';
import { createNewMessage, CreateMessageData } from '../NetworkCalls/createCalls/createNewMessage';
import { loadMessages, LoadMessagesRequest } from '../NetworkCalls/FetchCalls/loadMessages';

export interface Message {
  id?: number;
  fromUserId: number;
  toUserId: number;
  message: string;
  timestamp: string;
  username?: string;
}

export interface User {
  id: number;
  username: string;
}

export type MessageCallback = (message: Message) => void;
export type FriendRequestCallback = (data: { fromUserId: number; toUserId: number }) => void;

class MessagingService {
  private messageCallbacks: MessageCallback[] = [];
  private friendRequestCallbacks: FriendRequestCallback[] = [];

  constructor() {
    this.setupSocketListeners();
  }

  /**
   * Setup socket event listeners for messaging
   */
  private setupSocketListeners(): void {
    // Listen for incoming messages
    socketService.on('receive-message', (messageData: MessageData) => {
      Logger('Received message:', LogLevel.Debug);
      const message: Message = {
        ...messageData,
        username: 'Unknown User' // This would be populated from user data
      };
      this.notifyMessageCallbacks(message);
    });

    // Listen for friend requests
    socketService.on('receive-friend-request', (data: { fromUserId: number; toUserId: number }) => {
      Logger('Received friend request:', LogLevel.Debug);
      this.notifyFriendRequestCallbacks(data);
    });

    // Listen for offline receiver events
    socketService.on('offline-reciever', (data: { senderId: number; recevieverId: number }) => {
      Logger('Offline receiver event:', LogLevel.Debug);
      // Handle offline message delivery
      this.handleOfflineMessage(data);
    });
  }

  /**
   * Send a message to another user
   */
  async sendMessage(fromUserId: number, toUserId: number, message: string): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // Always save to database first for persistence
    const messageData: CreateMessageData = {
      fromUserId,
      toUserId,
      message,
      timestamp
    };

    try {
      const dbResult = await createNewMessage(messageData);
      if (dbResult.success) {
        Logger(`Message saved to database with ID: ${dbResult.messageId}`, LogLevel.Info);
      } else {
        Logger(`Failed to save message to database: ${dbResult.error}`, LogLevel.Error);
        // Continue with socket send even if DB save fails
      }
    } catch (error) {
      Logger(`Error saving message to database: ${error}`, LogLevel.Error);
      // Continue with socket send even if DB save fails
    }

    // Send via socket if connected
    if (socketService.isSocketConnected()) {
      const socketMessageData: MessageData = {
        fromUserId,
        toUserId,
        message,
        timestamp
      };

      Logger(`Sending message via socket from ${fromUserId} to ${toUserId}: ${message}`, LogLevel.Info);
      socketService.emit('send-message', socketMessageData);
    } else {
      Logger('Socket not connected, message saved to database only', LogLevel.Warn);
    }
  }

  /**
   * Send a friend request
   */
  sendFriendRequest(fromUserId: number, toUserId: number): void {
    if (!socketService.isSocketConnected()) {
      Logger('Cannot send friend request: Socket not connected', LogLevel.Error);
      return;
    }

    Logger(`Sending friend request from ${fromUserId} to ${toUserId}`, LogLevel.Info);
    socketService.emit('send-link-request', fromUserId, toUserId);
  }

  /**
   * Send both friend request and message (for game invitations)
   */
  async sendGameInvitation(fromUserId: number, toUserId: number, message: string): Promise<void> {
    Logger(`Sending game invitation from ${fromUserId} to ${toUserId}`, LogLevel.Info);
    
    // Send friend request first
    //this.sendFriendRequest(fromUserId, toUserId);
    
    // Then send the message
    await this.sendMessage(fromUserId, toUserId, message);
  }

  /**
   * Subscribe to incoming messages
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.messageCallbacks.indexOf(callback);
      if (index > -1) {
        this.messageCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to friend requests
   */
  onFriendRequest(callback: FriendRequestCallback): () => void {
    this.friendRequestCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.friendRequestCallbacks.indexOf(callback);
      if (index > -1) {
        this.friendRequestCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all message callbacks
   */
  private notifyMessageCallbacks(message: Message): void {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        Logger(`Error in message callback: ${error}`, LogLevel.Error);
      }
    });
  }

  /**
   * Notify all friend request callbacks
   */
  private notifyFriendRequestCallbacks(data: { fromUserId: number; toUserId: number }): void {
    this.friendRequestCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        Logger(`Error in friend request callback: ${error}`, LogLevel.Error);
      }
    });
  }

  /**
   * Load messages from database
   */
  async loadMessages(request: LoadMessagesRequest = {}): Promise<Message[]> {
    try {
      const result = await loadMessages(request);
      if (result.success && result.messages) {
        Logger(`Loaded ${result.messages.length} messages from database`, LogLevel.Info);
        return result.messages;
      } else {
        Logger(`Failed to load messages: ${result.error}`, LogLevel.Error);
        return [];
      }
    } catch (error) {
      Logger(`Error loading messages: ${error}`, LogLevel.Error);
      return [];
    }
  }

  /**
   * Handle offline message delivery
   */
  private handleOfflineMessage(data: { senderId: number; recevieverId: number }): void {
    Logger(`Handling offline message from ${data.senderId} to ${data.recevieverId}`, LogLevel.Debug);
    
    // Message is already saved to database via sendMessage method
    // When the receiver comes online, they can load messages from database
    // In a real app, you might also send push notifications here
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return socketService.isSocketConnected();
  }

  /**
   * Clean up all listeners
   */
  cleanup(): void {
    this.messageCallbacks = [];
    this.friendRequestCallbacks = [];
  }
}

// Export singleton instance
export const messagingService = new MessagingService();
export default messagingService;
