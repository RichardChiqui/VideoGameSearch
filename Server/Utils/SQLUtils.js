// Helper function to build dynamic update query
function buildUpdateQuery(updates, allowedFields = ['email', 'display_name', 'region', 'profile_description']) {
    const fields = Object.keys(updates).filter(key => 
        updates[key] !== undefined && allowedFields.includes(key)
    );
    
    if (fields.length === 0) {
        throw new Error('No valid fields to update');
    }
    
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = fields.map(field => updates[field]);
    
    return {
        query: `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *;`,
        values
    };
}