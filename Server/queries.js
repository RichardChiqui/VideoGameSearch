const { table } = require('./tableNameEnums');
const validateUser = "SELECT * FROM users WHERE email = $1 and password = $2";

const addUser = "INSERT INTO users (display_name, password, email) VALUES ($1, $2, $3)";

const loadUsers = "SELECT * FROM " + table.Users;


const sendFriendRequest = "INSERT INTO " + table.FriendRequest + " (fk_senderuserid, fk_recieveruserid) VALUES ($1, $2)";

const createNewGroup = "INSERT INTO " + table.tblGroups + "(\"fk_adminId\", \"groupName\", \"groupgame\", \"groupPlayStyle\") VALUES ($1, $2, $3, $4 )";

const loadUserFriendRequests = "SELECT users.id ,users.display_name FROM " + table.FriendRequest + " fr inner join " + table.Users + 
" users on users.id = fr.fk_senderuserid where fr.fk_recieveruserid = $1"

const deleteFriendRequest = "DELETE from " + table.FriendRequest + " where fk_recieveruserid = $1"

const insertNewFriend = "INSERT INTO " + table.Friends + "( fk_fromuserid, fk_touserid) VALUES ($1, $2);"

const loadUserFriends = "SELECT DISTINCT u.id,u.display_name FROM " + table.Friends +" f  join " + table.Users +
                        " u ON u.id = f.fk_fromuserid OR u.id = f.fk_touserid where (f.fk_fromuserid = $1 OR f.fk_touserid = $1) and u.id != $1"

const loadMessages = "SELECT * FROM " + table.Messages + " WHERE fk_fromuserid = $1 and fk_touserid = $2";

const insertNewMessage = "INSERT INTO " + table.Messages + " (fk_fromuserid, fk_touserid, textmessage) VALUES ($1, $2, $3)";

// queries.js
const createLinkRequest = `
    INSERT INTO link_requests (user_id, game_name, skill_level, tags, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
`;

const getLinkRequests = `
    SELECT lr.*, u.email, u.display_name 
    FROM link_requests lr
    JOIN users u ON lr.user_id = u.id
    WHERE lr.status = 'active'
    ORDER BY lr.created_at DESC
`;

const getLinkRequestsByGame = `
    SELECT lr.*, u.email, u.display_name 
    FROM link_requests lr
    JOIN users u ON lr.user_id = u.id
    WHERE lr.game_name = $1 AND lr.status = 'active'
    ORDER BY lr.created_at DESC
`;

const getUserLinkRequests = `
    SELECT * FROM link_requests
    WHERE user_id = $1
    ORDER BY created_at DESC
`;

const updateLinkRequestStatus = `
    UPDATE link_requests
    SET status = $2
    WHERE id = $1
    RETURNING *
`;

const deleteLinkRequest = `
    DELETE FROM link_requests
    WHERE id = $1 AND user_id = $2
`;


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
    insertNewMessage,
    createLinkRequest,
    deleteLinkRequest,
    updateLinkRequestStatus,
    getUserLinkRequests,
    getLinkRequestsByGame,
    getLinkRequests
}