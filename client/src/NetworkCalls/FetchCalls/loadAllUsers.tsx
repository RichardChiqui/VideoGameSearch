import {Logger, LogLevel} from '../../Logger/Logger'
export const loadAllUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/homepage/loadUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            Logger("Failed to load Users", LogLevel.Error);
        }

       return await response.json();
    } catch (error) {
        Logger("Failed to load Users " + error, LogLevel.Error);
    }
};
