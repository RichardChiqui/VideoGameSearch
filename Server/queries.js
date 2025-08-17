const { table } = require('./tableNameEnums');
const validateUser = "SELECT * FROM users WHERE username = $1 and password = $2";

const addUser = "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)";

const loadUsers = "SELECT * FROM " + table.Users;


const sendFriendRequest = "INSERT INTO " + table.FriendRequest + " (fk_senderuserid, fk_recieveruserid) VALUES ($1, $2)";

const createNewGroup = "INSERT INTO " + table.tblGroups + "(\"fk_adminId\", \"groupName\", \"groupgame\", \"groupPlayStyle\") VALUES ($1, $2, $3, $4 )";

const loadUserFriendRequests = "SELECT users.id ,users.username FROM " + table.FriendRequest + " fr inner join " + table.Users + 
" users on users.id = fr.fk_senderuserid where fr.fk_recieveruserid = $1"

const deleteFriendRequest = "DELETE from " + table.FriendRequest + " where fk_recieveruserid = $1"

const insertNewFriend = "INSERT INTO " + table.Friends + "( fk_fromuserid, fk_touserid) VALUES ($1, $2);"

const loadUserFriends = "SELECT DISTINCT u.id,u.username FROM " + table.Friends +" f  join " + table.Users +
                        " u ON u.id = f.fk_fromuserid OR u.id = f.fk_touserid where (f.fk_fromuserid = $1 OR f.fk_touserid = $1) and u.id != $1"

const loadMessages = "SELECT * FROM " + table.Messages + " WHERE fk_fromuserid = $1 and fk_touserid = $2";

const insertNewMessage = "INSERT INTO " + table.Messages + " (fk_fromuserid, fk_touserid, textmessage) VALUES ($1, $2, $3)";



module.exports = {
    validateUser,
    addUser,
    loadUsers,
    sendFriendRequest,
    loadUserFriendRequests,
    deleteFriendRequest,
    insertNewFriend,
    loadUserFriends,
    loadMessages,
    insertNewMessage
}