import { io, Socket } from 'socket.io-client';
import { Logger, LogLevel } from '../Logger/Logger';

export interface SocketEvents {
  // Connection events
  'user-connected': (userId: number, socketId: string) => void;
  'connect': () => void;
  'disconnect': () => void;
  
  // Friend request events
  'send-link-request': (fromUserId: number, toUserId: number) => void;
  'receive-friend-request': (data: { fromUserId: number; toUserId: number }) => void;
  
  // Message events
  'send-message': (messageData: MessageData) => void;
  'receive-message': (messageData: MessageData) => void;
  
  // Offline events
  'offline-reciever': (data: { senderId: number; recevieverId: number }) => void;
}

export interface MessageData {
  fromUserId: number;
  toUserId: number;
  message: string;
  timestamp: string;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private eventListeners: Map<string, ((...args: any[]) => void)[]> = new Map();

  constructor() {
    this.setupEventCleanup();
  }

  /**
   * Initialize socket connection for a user
   */
  connect(userId: number): Promise<Socket> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket?.connected) {
          Logger('Socket already connected', LogLevel.Debug);
          resolve(this.socket);
          return;
        }

        this.socket = io('http://localhost:5000', {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          Logger(`User ${userId} connected with socket ID: ${this.socket?.id}`, LogLevel.Info);
          this.isConnected = true;
          
          // Notify server about user connection
          if (this.socket?.id) {
            this.emit('user-connected', userId, this.socket.id);
            resolve(this.socket);
          }
        });

        this.socket.on('disconnect', () => {
          Logger(`User ${userId} disconnected`, LogLevel.Debug);
          this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
          Logger(`Socket connection error: ${error.message}`, LogLevel.Error);
          reject(error);
        });

      } catch (error) {
        Logger(`Failed to initialize socket: ${error}`, LogLevel.Error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      Logger('Disconnecting socket', LogLevel.Debug);
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Emit an event to the server
   */
  emit<K extends keyof SocketEvents>(event: K, ...args: Parameters<SocketEvents[K]>): void {
    if (this.socket && this.isConnected) {
      Logger(`Emitting ${event} with data:`, LogLevel.Debug);
      this.socket.emit(event as string, ...args);
    } else {
      Logger(`Cannot emit ${event}: Socket not connected`, LogLevel.Debug);
    }
  }

  /**
   * Listen for events from the server
   */
  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.on(event as string, callback as any);
      
      // Store listener for cleanup
      if (!this.eventListeners.has(event as string)) {
        this.eventListeners.set(event as string, []);
      }
      this.eventListeners.get(event as string)!.push(callback as any);
      
      Logger(`Listening for ${event}`, LogLevel.Debug);
    }
  }

  /**
   * Remove event listener
   */
  off<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event as string, callback as any);
      } else {
        this.socket.off(event as string);
      }
      Logger(`Removed listener for ${event}`, LogLevel.Debug);
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Setup cleanup on page unload
   */
  private setupEventCleanup(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.disconnect();
      });
    }
  }

  /**
   * Clean up all event listeners
   */
  cleanup(): void {
    if (this.socket) {
      this.eventListeners.forEach((listeners, event) => {
        listeners.forEach(listener => {
          this.socket?.off(event, listener);
        });
      });
      this.eventListeners.clear();
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
