import {Logger, LogLevel} from '../../Logger/Logger'
export const createNewFriend = async (fromUserId: number, toUserId: number) => {
    try {
        const response = await fetch('http://localhost:5000/send-friendrequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fromUserId: fromUserId,
                toUserId: toUserId
            })
        });

        if (!response.ok) {
            Logger("Failed to create new friend request between " + fromUserId + " to " + toUserId, LogLevel.Error);
        }


      
        return await response.json();
    } catch (error) {
        Logger("Failed to create new friend request " + fromUserId + " to " + toUserId + " error:" + error, LogLevel.Error);
        throw error;
    }
};
