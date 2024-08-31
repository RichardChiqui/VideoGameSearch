import {Logger, LogLevel} from '../../Logger/Logger'
export const createNewMessage = async (fromUserId: number, toUserId: number, message:string) => {
    try {
        const response = await fetch('http://localhost:5000/insertNewMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromUserId: fromUserId,
                toUserId: toUserId,
                message:message
            })
        });

        if (!response.ok) {
            Logger("Failed to create new message from " + fromUserId + " to " + toUserId + " with message:" + message, LogLevel.Error);
        }

        
        return await response.json();
    } catch (error) {
        Logger("Error creating new friend relationship between" +  fromUserId + " to " + toUserId + " error:" + error, LogLevel.Error);
    }
};
