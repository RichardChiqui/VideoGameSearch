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
