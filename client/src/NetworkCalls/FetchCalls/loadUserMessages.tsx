import {Logger, LogLevel} from '../../Logger/Logger'
export const loadUserMessages = async (fromUserId:number, toUserId:number ) => {
    try {
        const response = await fetch('http://localhost:5000/loadMessages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromUserId:fromUserId, toUserId:toUserId })
        });

        if (!response.ok) {
            Logger("Failed to load messages " + fromUserId, LogLevel.Error);
        }

       return await response.json();
    } catch (error) {
        Logger("Failed to load messages:" + fromUserId + " error:" + error, LogLevel.Error);
    }
};
