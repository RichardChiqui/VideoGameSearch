const {Router} = require('express');
const controller = require("./controller");

const router = Router();

router.get('/',(req,res) =>{
    res.send("using new api");
})

router.post('/homepage/login', controller.validateUser)
router.post('/addUser', controller.addUser)
router.get('/homepage/loadUsers', controller.loadUsers)

router.post('/friend_request',controller.sendFriendRequest)

router.post('/create-group', controller.createNewGroup);

router.post('/loadUserFriendsRequests', controller.loadUserFriendRequests);

router.delete('/deleteFriendRequest', controller.deleteFriendRequest);


router.post('/create-new-friend', controller.insertNewFriend);

router.post('/loadUserFriends', controller.loadUserFriends);

//router.post('/send-friendrequest'. controller.sendFriendRequest)

module.exports = router;

//very bad habit
//clientid: re1u4g83bgerarhyme5bvamfon732z
//client secret: lex32kkwol1bnzky76tamh5sd5p6zn