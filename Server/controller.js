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


module.exports ={
    validateUser,
    addUser,
    loadUsers
}