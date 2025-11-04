const { Router } = require('express');
const UsersRepo = require('../Repository/Users.js');
const jwt = require('jsonwebtoken');
const { authenticateToken, JWT_SECRET } = require('../Authentication/auth.js');

const router = Router();

router.post("/update",authenticateToken ,UsersRepo.UpdateUserFields);

module.exports = router;
