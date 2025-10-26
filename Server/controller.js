const { Json } = require("sequelize/lib/utils");
const pool = require("./db");
const queries = require("./queries");

// NEW: Only for JWT authentication - returns user object or null
const validateUser = (req, res) => {
    const { email, password } = req.body;
    console.log("Entering 'validateUser' with username:" + email);
    
    pool.query(queries.validateUser, [email, password], (error, results) => {
        if (error) {
            console.error("Validation error:", error);
            return res.status(500).json({ error: "Validation failed" });
        }
        
        if (results.rows.length > 0) {
            // Return user object for JWT creation in routes.js
            const user = results.rows[0];
            return res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.status(401).json({ 
                success: false,
                error: "Invalid credentials" 
            });
        }
    });
};

const addUser = (req, res) => {
    const { username, password, email } = req.body;
    console.log("Adding brand new user '" + username + "'");
    
    pool.query(queries.addUser, [username, password, email], (error, results) => {
        if (error) {
            console.error("Add user error:", error);
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
    const { username, password, email } = req.body;
    
    pool.query(queries.createNewGrouyp, [username, password, email], (error, results) => {
        if (error) {
            console.error("Create group error:", error);
            return res.status(500).json({ error: "Failed to create group" });
        }
        res.status(200).json(results.rows);
    });
};

const loadUsers = (req, res) => {
    // Authenticated user available in req.user
    console.log("Loading users. Authenticated user:", req.user.userId);
    
    pool.query(queries.loadUsers, (error, results) => {
        if (error) {
            console.error("Error loading users:", error);
            return res.status(500).json({ error: "Failed to load users" });
        }
        res.status(200).json({ users: results.rows });
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