export interface Message {
    id?: number;
    fromUserId: number;
    toUserId: number;
    message: string;
    timestamp: string;
}