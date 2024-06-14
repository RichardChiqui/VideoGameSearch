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
            throw new Error('Failed to create group');
        }

        const data = await response.json();

        console.log("size of data:" + data.users.length);
        return data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};
