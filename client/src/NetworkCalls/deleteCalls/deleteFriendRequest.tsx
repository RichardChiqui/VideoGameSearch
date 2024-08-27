import {Logger, LogLevel} from '../../Logger/Logger'
export const deleteFriendRequest = async (userId: number) => {
    try {
        const response = await fetch('http://localhost:5000/deleteFriendRequest', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId }) // Send userId in the request bodys
        });

        if (!response.ok) {
            Logger("Failed to delete new friend relationship for userId " + userId, LogLevel.Error);
        }
       return await response.json();
    } catch (error) {
        Logger("Failed to delete new friend relationship for userId " + userId +  "error:" + error, LogLevel.Error);
    }
};
