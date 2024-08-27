import {Logger, LogLevel} from '../../Logger/Logger'
export const createNewFriend = async (fromUserId: number, toUserId: number) => {
    try {
        const response = await fetch('http://localhost:5000/create-new-friend', {
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
            Logger("Failed to create new friend from " + fromUserId + " to " + toUserId, LogLevel.Error);
        }

        
        return await response.json();
    } catch (error) {
        Logger("Error creating new friend relationship between" +  fromUserId + " to " + toUserId + " error:" + error, LogLevel.Error);
    }
};
