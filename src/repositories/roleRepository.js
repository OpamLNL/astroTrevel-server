const { query } = require('../config/database');

const getAllRoles = async () => {
    const sql = `SELECT * FROM roles`;
    return await query(sql);
};

module.exports = {
    getAllRoles
};
