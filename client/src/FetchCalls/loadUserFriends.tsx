export const loadUserFriends = async () => {
    try {
        const response = await fetch('http://localhost:5000/homepage/loadUserFriends', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load users');
        }

        const data = await response.json();

        console.log("size of data:" + data.users.length);
       return data;
    } catch (error) {
        console.error('Error loading users:', error);
        throw error; // Rethrow the error to propagate it to the caller
    }
};
