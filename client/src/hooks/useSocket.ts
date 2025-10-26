import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Store';
import { socketService } from '../services/SocketService';
import { Logger, LogLevel } from '../Logger/Logger';

export const useSocket = () => {
  const isUserLoggedIn = useSelector((state: RootState) => state.user.isAuthenticated);
  const userId = useSelector((state: RootState) => state.user.userId);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>();

  useEffect(() => {
    if (isUserLoggedIn && userId) {
      Logger(`Initializing socket for user ${userId}`, LogLevel.Debug);
      
      socketService.connect(userId)
        .then((socket) => {
          Logger(`Socket connected successfully for user ${userId}`, LogLevel.Info);
          setIsConnected(true);
          setSocketId(socket.id);
        })
        .catch((error) => {
          Logger(`Failed to connect socket for user ${userId}: ${error}`, LogLevel.Error);
          setIsConnected(false);
        });
    } else {
      Logger('User not logged in, disconnecting socket', LogLevel.Debug);
      socketService.disconnect();
      setIsConnected(false);
      setSocketId(undefined);
    }

    // Cleanup on unmount
    return () => {
      if (!isUserLoggedIn) {
        socketService.disconnect();
      }
    };
  }, [isUserLoggedIn, userId]);

  return {
    socket: socketService.getSocket(),
    isConnected,
    socketId,
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService)
  };
};
