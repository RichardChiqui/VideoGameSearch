import {Logger, LogLevel} from '../../Logger/Logger'
export const sendCreateGroup = async (groupData: any) => {
    try {
        const response = await fetch('http://localhost:5000/create-group', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(groupData)
        });

        if (!response.ok) {
            Logger("Error creating group from database ", LogLevel.Error);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        Logger("Error creating group " + error, LogLevel.Error);
    }
};
