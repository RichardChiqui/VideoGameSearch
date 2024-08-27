import {Logger, LogLevel} from '../../Logger/Logger'
export const loadUserFriendRequests = async (userId: number) => {
    try {
        const response = await fetch('http://localhost:5000/loadUserFriendsRequests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ receiverId: userId })
        });

        if (!response.ok) {
            Logger("Failed to load friendrequests for user:" + userId, LogLevel.Error);
        }

       return await response.json();
    } catch (error) {
        Logger("Failed to load friendrequests for user:" + userId + " error:" + error, LogLevel.Error);
    }
};
