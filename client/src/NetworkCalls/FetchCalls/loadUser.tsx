import {Logger, LogLevel} from '../../Logger/Logger'
export const loadUser = async (username:string, password:string) => {
    try {
        const response = await fetch('http://localhost:5000/homepage/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username:username, password:password })
        });

        if (!response.ok) {
            Logger("Failed to load User " + username, LogLevel.Error);
        }

       return await response.json();
    } catch (error) {
        Logger("Failed to load User:" + username + " error:" + error, LogLevel.Error);
    }
};
