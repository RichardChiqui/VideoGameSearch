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


module.exports ={
    validateUser
}