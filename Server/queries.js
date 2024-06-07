const { table } = require('./tableNameEnums');
const validateUser = "SELECT * FROM public.\"Users\" WHERE username = $1 and password = $2";

const addUser = "INSERT INTO public.\"Users\" (username, password, email) VALUES ($1, $2, $3)";

const loadUsers = "SELECT * FROM " + table.Users;


const sendFriendRequest = "INSERT INTO " + table.FriendRequest + " (fk_senderUserId, fk_recieverUserId) VALUES ($1, $2)";
console.log("I wonder if I can log query:" + sendFriendRequest);


module.exports = {
    validateUser,
    addUser,
    loadUsers,
    sendFriendRequest
}