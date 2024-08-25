const { table } = require('./tableNameEnums');
const validateUser = "SELECT * FROM public.\"Users\" WHERE username = $1 and password = $2";

const addUser = "INSERT INTO public.\"Users\" (username, password, email) VALUES ($1, $2, $3)";

const loadUsers = "SELECT * FROM " + table.Users;


const sendFriendRequest = "INSERT INTO " + table.FriendRequest + " (fk_senderuserid, fk_recieveruserid) VALUES ($1, $2)";
console.log("I wonder if I can log query:" + sendFriendRequest);

// SELECT pk_groupid, "fk_adminId", "groupName", groupgame, "groupPlayStyle"
// 	FROM public."tblGroups";

const createNewGroup = "INSERT INTO " + table.tblGroups + "(\"fk_adminId\", \"groupName\", \"groupgame\", \"groupPlayStyle\") VALUES ($1, $2, $3, $4 )";

const loadUserFriendRequests = "SELECT users.username FROM " + table.FriendRequest + " fr inner join " + table.Users + 
" users on users.id = fr.fk_senderuserid where fr.fk_recieveruserid = $1"

const deleteFriendRequest = "DELETE from " + table.FriendRequest + " where fk_recieveruserid = $1"

const insertNewFriend = "INSERT INTO " + table.Friends + "( fk_fromuserid, fk_touserid) VALUES ($1, $2);"



module.exports = {
    validateUser,
    addUser,
    loadUsers,
    sendFriendRequest,
    loadUserFriendRequests,
    deleteFriendRequest,
    insertNewFriend
}