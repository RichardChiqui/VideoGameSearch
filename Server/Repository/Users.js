const UpdateUserFields = (req, res) => {
    const userId = req.user.userId;
    const updates = req.body; // { region: 2, profile_description: 'New bio', etc. }

    // Authorization check - ensure user can only update their own profile
    if (req.body.userId && req.body.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized: Cannot update another user's profile" });
    }

    try {
        // Build dynamic query
        const { query, values } = buildUpdateQuery(updates);
        
        // Execute query with userId as the last parameter
        pool.query(query, [...values, userId], (error, results) => {
            if (error) {
                console.error("Error updating user:", error);
                return res.status(500).json({ error: "Failed to update user" });
            }
            
            if (results.rows.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            
            res.status(200).json({ 
                message: "User updated successfully",
                user: results.rows[0] 
            });
        });
    } catch (error) {
        console.error("Error building query:", error);
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    UpdateUserFields
};
