const pool = require("./db");
const queries = require("./queries");

const validateUser = (req,res) => {
    const {username, password } = req.body
    console.log("I am in controller ");
    pool.query(queries.validateUser, [username,password], (error, results) =>{
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const addUser = (req,res) =>{
    const {username, password, email} = req.body
    pool.query(queries.addUser, [username,password,email], (error, results) =>{
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const createNewGroup = (req,res) =>{
    console.log("Creating new group");
    const {username, password, email} = req.body
    pool.query(queries.createNewGrouyp, [username,password,email], (error, results) =>{
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const loadUsers = (req, res) =>{
    //for only loading first 100 users(or all users which ever is smaller)
    console.log("making sure we made it into here");
    pool.query(queries.loadUsers, (error, results) => {
        if (error) {
            // Handle the error gracefully, e.g., send an error response
            console.error("Error loading users:", error);
            res.status(500).json({ error: "Failed to load users" });
        } else {
            // If there are no errors, send the users data in the response
            const users = results.rows;
            res.status(200).json({ users });
        }
    });

}



const sendFriendRequest = (req, res) =>{
    //for only loading first 100 users(or all users which ever is smaller)
    console.log("making sure we made it into here for sending rquests:" + req.body);
    const {senderId, receiverId} = req.body
    console.log("Correct senderid?:" + senderId + " and correct reciever:" + receiverId);
    pool.query(queries.sendFriendRequest,[senderId,receiverId], (error, results) => {
        if (error) {
            // Handle the error gracefully, e.g., send an error response
            console.error("Error sending link request:", error);
            res.status(500).json({ error: "Failed to load users" });
        } else {
            // If there are no errors, send the users data in the response
            const users = results.rows;
            res.status(200).json({ users });
            console.log("all good");
        }
    });

}

const loadUserFriendRequests = (req, res) =>{
    //for only loading first 100 users(or all users which ever is smaller)
    console.log("Attemptiong to load fr" + req.body);
    const {receiverId} = req.body
    console.log( " and correct reciever, we only want receiveer:" + receiverId);
    pool.query(queries.loadUserFriendRequests,[receiverId], (error, results) => {
        if (error) {
            // Handle the error gracefully, e.g., send an error response
            console.error("Error sending link request:", error);
            res.status(500).json({ error: "Failed to load users" });
        } else {
            // If there are no errors, send the users data in the response
            const users = results.rows;
            console.log("all good " + users);
            res.status(200).json({ users });
          
        }
    });

}
// const addUser = (req,res) =>{
//     const {username, password, email} = req.body
//     pool.query(queries.addUser, [username,password,email], (error, results) =>{
//         if (error) throw error;
//         res.status(200).json(results.rows);
//     })
// }

const deleteFriendRequest = (req, res) =>{
    //for only loading first 100 users(or all users which ever is smaller)
    console.log("making sure we made it into here for sending rquests:" + req.body);
    const {fromuserid, touserid} = req.body
    console.log( " and correct reciever, we only want receiveer:" + receiverId);
    pool.query(queries.insertNewFriend,[fromuserid,touserid], (error, results) => {
        if (error) {
            // Handle the error gracefully, e.g., send an error response
            console.error("Error sending link request:", error);
            res.status(500).json({ error: "Failed to load users" });
        } else {
            // If there are no errors, send the users data in the response
            const users = results.rows;
            console.log("all good creating friend  from db" + users);
            res.status(200).json({ users });
          
        }
    });
}

const insertNewFriend = (req, res) =>{
    //for only loading first 100 users(or all users which ever is smaller)
    console.log("Attemptiong to delete fr" + req.body);
    const {receiverId} = req.body
    console.log( " and correct reciever, we only want receiveer:" + receiverId);
    pool.query(queries.deleteFriendRequest,[receiverId], (error, results) => {
        if (error) {
            // Handle the error gracefully, e.g., send an error response
            console.error("Error sending link request:", error);
            res.status(500).json({ error: "Failed to load users" });
        } else {
            // If there are no errors, send the users data in the response
            const users = results.rows;
            console.log("all good dleteing friend request from db" + users);
            res.status(200).json({ users });
          
        }
    });
}

module.exports ={
    validateUser,
    addUser,
    loadUsers,
    sendFriendRequest,
    createNewGroup,
    loadUserFriendRequests,
    deleteFriendRequest,
    insertNewFriend
}