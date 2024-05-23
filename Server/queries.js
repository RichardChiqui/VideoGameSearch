const { table } = require('./tableNameEnums');
const validateUser = "SELECT * FROM public.\"Users\" WHERE username = $1 and password = $2";

const addUser = "INSERT INTO public.\"Users\" (username, password, email) VALUES ($1, $2, $3)";

const loadUsers = "SELECT * FROM " + table.Users;
console.log("I wonder if I can log query:" + loadUsers);



module.exports = {
    validateUser,
    addUser,
    loadUsers
}