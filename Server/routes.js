const { Router } = require('express');
const controller = require("./controller");
const linkRequestController = require("./Repository/LinkRequests.js");
const jwt = require('jsonwebtoken');
const { authenticateToken, JWT_SECRET } = require('./Authentication/auth.js');

const router = Router();

router.get('/', (req, res) => {
    res.send("using new api");
});

// ===== AUTH ROUTES (Public) =====
// Login route - returns JWT cookie
router.post('/homepage/login', (req, res) => {
    const { email, password } = req.body;
    
    controller.validateUser(req, res, (user) => {
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: "Invalid credentials" 
            });
        }
        
      
        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        // Set HTTP-only cookie
     res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/' // Ensure cookie is available for all routes
        });
        // Return user info
        res.json({ 
            success: true, 
            user: { 
                id: user.id, 
                email: user.email,
                display_name: user.display_name || user.email
            } 
        });
    });
});
// Logout route
router.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
});

// Check if user is authenticated
router.get('/api/me', authenticateToken, (req, res) => {
    res.json({ 
        authenticated: true,
        user: req.user 
    });
});

// Register new user (public)
router.post('/addUser', controller.addUser);

// ===== PROTECTED ROUTES (Require Authentication) =====
router.get('/homepage/loadUsers', authenticateToken, controller.loadUsers);

router.post('/friend_request', authenticateToken, controller.sendFriendRequest);

router.post('/create-group', authenticateToken, controller.createNewGroup);

router.post('/loadUserFriendsRequests', authenticateToken, controller.loadUserFriendRequests);

router.delete('/deleteFriendRequest', authenticateToken, controller.deleteFriendRequest);

router.post('/create-new-friend', authenticateToken, controller.insertNewFriend);

router.post('/loadUserFriends', authenticateToken, controller.loadUserFriends);

router.post('/loadMessages', authenticateToken, controller.loadMessages);

router.post('/insertNewMessage', authenticateToken, controller.insertNewMessage);

// CREATE
router.post("/link-requests",authenticateToken ,linkRequestController.createLinkRequest);

// READ
router.get("/link-requests", authenticateToken,linkRequestController.getLinkRequests);
router.get("/link-requests/game/:gameName", authenticateToken,linkRequestController.getLinkRequestsByGame);
router.get("/link-requests/user", authenticateToken,linkRequestController.getUserLinkRequests);

// UPDATE
router.put("/link-requests/status", authenticateToken,linkRequestController.updateLinkRequestStatus);

// DELETE
router.delete("/link-requests/:id", authenticateToken,linkRequestController.deleteLinkRequest);

module.exports = router;

// TODO: Remove these credentials from code and use environment variables
// clientid: re1u4g83bgerarhyme5bvamfon732z
// client secret: lex32kkwol1bnzky76tamh5sd5p6zn