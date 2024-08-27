import {Logger, LogLevel} from '../../Logger/Logger'
export const loadUserFriends = async (userId: number) => {
    try {
        const response = await fetch('http://localhost:5000/loadUserFriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId })
        });

        if (!response.ok) {
            Logger("Failed to load friends for user:" + userId, LogLevel.Error);
        } else{
            Logger("Success loading " + userId + " friends json:" + response, LogLevel.Debug);
        }

    
       return await response.json();
    } catch (error) {
        Logger("Failed to load friends for user:" + userId + " error " + error, LogLevel.Error);
    }
};
