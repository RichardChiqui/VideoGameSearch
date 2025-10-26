const pool = require("../db");
const queries = require("../queries");

// CREATE — Add a new link request
const createLinkRequest = (req, res) => {
    const { game_name, skill_level, tags, description } = req.body;
    const userId = req.user.userId;

    console.log("Iknow why ", req.body);
    console.log("Creating link request for user:", userId);

    let parsedTags = tags;
    try {
        // If it's a string like '["tag1","tag2"]', parse it
        if (typeof tags === "string") {
            parsedTags = JSON.parse(tags);
        }
    } catch (e) {
        console.warn("Tags parsing failed, storing as empty array.");
        parsedTags = [];
    }

    pool.query(
        queries.createLinkRequest,
        [userId, game_name, skill_level, JSON.stringify(parsedTags), description],
        (error, results) => {
            if (error) {
                console.error("Error creating link request:", error);
                return res.status(500).json({ error: "Failed to create link request" });
            }
            res.status(201).json({
                message: "Link request created successfully",
                linkRequest: results.rows[0],
            });
        }
    );
};


// READ — Get all active link requests (global feed)
const getLinkRequests = (req, res) => {
    pool.query(queries.getLinkRequests, (error, results) => {
        if (error) {
            console.error("Error loading link requests:", error);
            return res.status(500).json({ error: "Failed to load link requests" });
        }
        res.status(200).json({ linkRequests: results.rows });
    });
};

// READ — Get active link requests by game name
const getLinkRequestsByGame = (req, res) => {
    const { gameName } = req.params;
    console.log("Fetching link requests for game:", gameName);

    pool.query(queries.getLinkRequestsByGame, [gameName], (error, results) => {
        if (error) {
            console.error("Error fetching link requests by game:", error);
            return res.status(500).json({ error: "Failed to load link requests for game" });
        }
        res.status(200).json({ linkRequests: results.rows });
    });
};

// READ — Get link requests created by the logged-in user
const getUserLinkRequests = (req, res) => {
    const userId = req.user.userId;

    pool.query(queries.getUserLinkRequests, [userId], (error, results) => {
        if (error) {
            console.error("Error loading user link requests:", error);
            return res.status(500).json({ error: "Failed to load your link requests" });
        }
        res.status(200).json({ linkRequests: results.rows });
    });
};

// UPDATE — Update link request status (e.g. deactivate or archive)
const updateLinkRequestStatus = (req, res) => {
    const { id, status } = req.body;
    const userId = req.user.userId;

    // Security check: ensure the user owns the link request before updating
    pool.query("SELECT user_id FROM link_requests WHERE id = $1", [id], (err, result) => {
        if (err || result.rows.length === 0) {
            return res.status(404).json({ error: "Link request not found" });
        }
        if (result.rows[0].user_id !== userId) {
            return res.status(403).json({ error: "Unauthorized: Cannot modify another user's link request" });
        }

        pool.query(queries.updateLinkRequestStatus, [id, status], (error, results) => {
            if (error) {
                console.error("Error updating link request status:", error);
                return res.status(500).json({ error: "Failed to update link request status" });
            }
            res.status(200).json({
                message: "Link request status updated",
                updatedRequest: results.rows[0],
            });
        });
    });
};

// DELETE — Remove a link request
const deleteLinkRequest = (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    pool.query(queries.deleteLinkRequest, [id, userId], (error, results) => {
        if (error) {
            console.error("Error deleting link request:", error);
            return res.status(500).json({ error: "Failed to delete link request" });
        }
        res.status(200).json({ message: "Link request deleted successfully" });
    });
};

module.exports = {
    createLinkRequest,
    getLinkRequests,
    getLinkRequestsByGame,
    getUserLinkRequests,
    updateLinkRequestStatus,
    deleteLinkRequest,
};
