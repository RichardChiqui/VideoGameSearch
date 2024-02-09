const {Router} = require('express');
const controller = require("./controller");

const router = Router();

router.get('/',(req,res) =>{
    res.send("using new api");
})

router.post('/homepage/login', controller.validateUser)
module.exports = router;