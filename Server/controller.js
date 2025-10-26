const { Json } = require("sequelize/lib/utils");
const pool = require("./db");
const queries = require("./queries");

// NEW: Returns user object or null (does NOT send response)
const validateUser = (req, res, callback) => {
    const { email, password } = req.body;
    console.log("Entering 'validateUser' with email:" + email);
    
    pool.query(queries.validateUser, [email, password], (error, results) => {
        if (error) {
            console.error("Validation error:", error);
            return callback(null); // Return null on error
        }
        
        if (results.rows.length > 0) {
            const user = results.rows[0];
            console.log("returning user");
            return callback(user); // Return user object
        } else {
            console.log("returning null");
            return callback(null); // Return null if invalid
        }
    });
};

const addUser = (req, res) => {
    const { email, password, display_name } = req.body;
    console.log("Adding brand new user with email: '" + email + "'");
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    
    pool.query(queries.addUser, [email, password, display_name || email], (error, results) => {
        if (error) {
            console.error("Add user error:", error);
            // Check for duplicate email
            if (error.code === '23505') { // PostgreSQL unique violation
                return res.status(409).json({ error: "Email already exists" });
            }
            return res.status(500).json({ error: "Failed to add user" });
        }
        res.status(200).json({ 
            success: true,
            user: results.rows[0] 
        });
    });
};

const createNewGroup = (req, res) => {
    console.log("Creating new group");
    const { groupName, creatorId } = req.body;
    
    // Security: Verify creatorId matches authenticated user
    if (req.user.userId !== creatorId) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    
    pool.query(queries.createNewGroup, [groupName, creatorId], (error, results) => {
        if (error) {
            console.error("Create group error:", error);
            return res.status(500).json({ error: "Failed to create group" });
        }
        res.status(200).json({ 
            success: true,
            group: results.rows[0] 
        });
    });
};

const loadUsers = (req, res) => {
    // Authenticated user available in req.user
    console.log("Loading all users. Authenticated user:", req.user.email);
    
    pool.query(queries.loadUsers, (error, results) => {
        if (error) {
            console.error("Error loading users:", error);
            return res.status(500).json({ error: "Failed to load users" });
        }
        
        // Remove sensitive data before sending
        const sanitizedUsers = results.rows.map(user => ({
            id: user.id,
            email: user.email,
            display_name: user.display_name || user.email
        }));
        
        res.status(200).json({ users: sanitizedUsers });
    });
};

const sendFriendRequest = (req, res) => {
    const { senderId, receiverId } = req.body;
    console.log("Entering 'sendFriendRequest' for sender " + senderId + " and receiverId " + receiverId);
    
    // Security: Verify senderId matches authenticated user
    if (req.user.userId !== senderId) {
        return res.status(403).json({ error: "Unauthorized: Cannot send request on behalf of another user" });
    }
    
    pool.query(queries.sendFriendRequest, [senderId, receiverId], (error, results) => {
        if (error) {
            console.error("Error sending friend request:", error);
            return res.status(500).json({ error: "Failed to send friend request" });
        }
        res.status(200).json({ 
            success: true,
            data: results.rows 
        });
    });
};

const loadUserFriendRequests = (req, res) => {
    const { receiverId } = req.body;
    console.log("Loading friend requests for receiver:" + receiverId);
    
    // Security: Verify receiverId matches authenticated user
    if (req.user.userId !== receiverId) {
        return res.status(403).json({ error: "Unauthorized: Cannot view another user's friend requests" });
    }
    
    pool.query(queries.loadUserFriendRequests, [receiverId], (error, results) => {
        if (error) {
            console.error("Error loading friend requests:", error);
            return res.status(500).json({ error: "Failed to load friend requests" });
        }
        res.status(200).json({ users: results.rows });
    });
};

const deleteFriendRequest = (req, res) => {
    const { userId } = req.body;
    console.log("Deleting friend request for userId:" + userId);
    
    pool.query(queries.deleteFriendRequest, [userId], (error, results) => {
        if (error) {
            console.error("Error deleting friend request:", error);
            return res.status(500).json({ error: "Failed to delete friend request" });
        }
        res.status(200).json({ 
            success: true,
            data: results.rows 
        });
    });
};

const insertNewFriend = (req, res) => {
    const { fromUserId, toUserId } = req.body;
    console.log("Creating new friendship fromUserId:" + fromUserId + " toUserId:" + toUserId);
    
    // Security: Verify fromUserId matches authenticated user
    if (req.user.userId !== fromUserId) {
        return res.status(403).json({ error: "Unauthorized: Cannot create friendship on behalf of another user" });
    }
    
    pool.query(queries.insertNewFriend, [fromUserId, toUserId], (error, results) => {
        if (error) {
            console.error("Error creating friend:", error);
            return res.status(500).json({ error: "Failed to create friend" });
        }
        res.status(200).json({ 
            success: true,
            data: results.rows 
        });
    });
};

const loadUserFriends = (req, res) => {
    const { userId } = req.body;
    console.log("Loading friends for userId:" + userId);
    
    // Security: Verify userId matches authenticated user
    if (req.user.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized: Cannot view another user's friends" });
    }
    
    pool.query(queries.loadUserFriends, [userId], (error, results) => {
        if (error) {
            console.error("Error loading friends:", error);
            return res.status(500).json({ error: "Failed to load friends" });
        }
        res.status(200).json({ users: results.rows });
    });
};

const insertNewMessage = (req, res) => {
    const { fromUserId, toUserId, message } = req.body;
    console.log("Inserting message from:" + fromUserId + " to:" + toUserId);
    
    // Security: Verify fromUserId matches authenticated user
    if (req.user.userId !== fromUserId) {
        return res.status(403).json({ error: "Unauthorized: Cannot send message on behalf of another user" });
    }
    
    pool.query(queries.insertNewMessage, [fromUserId, toUserId, message], (error, results) => {
        if (error) {
            console.error("Error inserting message:", error);
            return res.status(500).json({ error: "Failed to send message" });
        }
        res.status(200).json({ 
            success: true,
            data: results.rows 
        });
    });
};

const loadMessages = (req, res) => {
    const { fromUserId, toUserId } = req.body;
    console.log("Loading messages between:" + fromUserId + " and " + toUserId);
    
    // Security: Verify user is part of the conversation
    if (req.user.userId !== fromUserId && req.user.userId !== toUserId) {
        return res.status(403).json({ error: "Unauthorized: Cannot view messages from this conversation" });
    }
    
    pool.query(queries.loadMessages, [fromUserId, toUserId], (error, results) => {
        if (error) {
            console.error("Error loading messages:", error);
            return res.status(500).json({ error: "Failed to load messages" });
        }
        res.status(200).json({ users: results.rows });
    });
};

module.exports = {
    validateUser,
    addUser,
    loadUsers,
    sendFriendRequest,
    createNewGroup,
    loadUserFriendRequests,
    deleteFriendRequest,
    insertNewFriend,
    loadUserFriends,
    insertNewMessage,
    loadMessages
};