import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { messagingService, Message, User } from '../services/MessagingService';
import { receiveFriendRequest, receiveMessage, setNewMessage } from '../ReduxStore/UserstateSlice';
import { Logger, LogLevel } from '../Logger/Logger';

export const useMessaging = () => {
  const dispatch = useDispatch();

  // Send a message to another user
  const sendMessage = useCallback((fromUserId: number, toUserId: number, message: string) => {
    messagingService.sendMessage(fromUserId, toUserId, message);
  }, []);

  // Send a friend request
  const sendFriendRequest = useCallback((fromUserId: number, toUserId: number) => {
    messagingService.sendFriendRequest(fromUserId, toUserId);
  }, []);

  // Send both friend request and message (for game invitations)
  const sendGameInvitation = useCallback((fromUserId: number, toUserId: number, message: string) => {
    messagingService.sendGameInvitation(fromUserId, toUserId, message);
  }, []);

  // Subscribe to incoming messages
  const onMessage = useCallback((callback: (message: Message) => void) => {
    return messagingService.onMessage(callback);
  }, []);

  // Subscribe to friend requests
  const onFriendRequest = useCallback((callback: (data: { fromUserId: number; toUserId: number }) => void) => {
    return messagingService.onFriendRequest(callback);
  }, []);

  // Setup Redux integration
  useEffect(() => {
    // Subscribe to incoming messages and update Redux
    const unsubscribeMessages = messagingService.onMessage((message: Message) => {
      Logger('Processing incoming message for Redux', LogLevel.Debug);
      dispatch(receiveMessage(1));
      dispatch(setNewMessage(message.message));
    });

    // Subscribe to friend requests and update Redux
    const unsubscribeFriendRequests = messagingService.onFriendRequest((data) => {
      Logger('Processing incoming friend request for Redux', LogLevel.Debug);
      dispatch(receiveFriendRequest(1));
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeMessages();
      unsubscribeFriendRequests();
    };
  }, [dispatch]);

  return {
    sendMessage,
    sendFriendRequest,
    sendGameInvitation,
    onMessage,
    onFriendRequest,
    isConnected: messagingService.isConnected()
  };
};
