const {Router} = require('express');
const controller = require("./controller");

const router = Router();

router.get('/',(req,res) =>{
    res.send("using new api");
})

router.post('/homepage/login', controller.validateUser)
router.post('/addUser', controller.addUser)
module.exports = router;

//very bad habit
//clientid: re1u4g83bgerarhyme5bvamfon732z
//client secret: lex32kkwol1bnzky76tamh5sd5p6zn