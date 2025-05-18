// repositories/userRepository.js
const { query } = require('../config/database');

const getUserById = async (id) => {
    const sql = `
        SELECT u.*, r.name AS role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0];
};

const getUserByEmail = async (email) => {
    const sql = `
        SELECT u.*, r.name AS role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.email = ?
    `;
    const results = await query(sql, [email]);
    return results[0];
};

const getUserByUsername = async (username) => {
    const sql = `
        SELECT u.*, r.name AS role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.username = ?
    `;
    const results = await query(sql, [username]);
    return results[0];
};

const getAllUsers = async () => {
    const sql = `
        SELECT u.*, r.name AS role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
    `;
    return await query(sql);
};

const createUser = async (userData) => {
    const sql = `
        INSERT INTO users (firebase_uid, email, name, avatar_url)
        VALUES (?, ?, ?, ?)
    `;
    const result = await query(sql, [
        userData.firebase_uid,
        userData.email,
        userData.name,
        userData.avatar_url
    ]);
    return { id: result.insertId, ...userData };
};

const updateUser = async (id, userData) => {
    const sql = `
        UPDATE users SET email = ?, name = ?, avatar_url = ?
        WHERE id = ?
    `;
    await query(sql, [userData.email, userData.name, userData.avatar_url, id]);
    return { id, ...userData };
};

const deleteUser = async (id) => {
    await query('DELETE FROM user_roles WHERE user_id = ?', [id]);
    await query('DELETE FROM users WHERE id = ?', [id]);
};

const getActiveUsers = async () => {
    const sql = `
        SELECT u.*, r.name AS role
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
    `;
    return await query(sql);
};

const assignRoleToUser = async (userId, roleName) => {
    const roleSql = `SELECT id FROM roles WHERE name = ?`;
    const roles = await query(roleSql, [roleName]);
    if (!roles.length) throw new Error('Роль не знайдена');

    const roleId = roles[0].id;

    const insertSql = `
        INSERT INTO user_roles (user_id, role_id)
        VALUES (?, ?)
    `;
    await query(insertSql, [userId, roleId]);
};

const updateUserRole = async (userId, newRoleName) => {
    const roleSql = `SELECT id FROM roles WHERE name = ?`;
    const roles = await query(roleSql, [newRoleName]);
    if (!roles.length) throw new Error('Роль не знайдена');

    const roleId = roles[0].id;

    // Оновлюємо роль
    const deleteSql = `DELETE FROM user_roles WHERE user_id = ?`;
    await query(deleteSql, [userId]);

    const insertSql = `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`;
    await query(insertSql, [userId, roleId]);
};



module.exports = {
    getUserById,
    getUserByEmail,
    getUserByUsername,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,

    assignRoleToUser,
    updateUserRole,
    getActiveUsers
};
