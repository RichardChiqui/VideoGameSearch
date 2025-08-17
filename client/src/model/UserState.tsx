export interface UserState {
  isAuthenticated: boolean;
  userId: number;
  numberOfCurrentFriendRequests: number;
  numberOfCurrentFriends:number;
  socketId: string | null; // Add socketId field
  numOfMessages: number;
  newMessage:string;
}