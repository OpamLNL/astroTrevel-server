const userRepository = require('../repositories/userRepository');
const { generateTokens } = require('../services/authService');

const getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання користувачів' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userRepository.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання користувача' });
    }
};

const getUserByUsername = async (req, res) => {
    try {
        const user = await userRepository.getUserByUsername(req.params.username);
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання користувача' });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const user = await userRepository.getUserByEmail(req.params.email);
        if (!user) return res.status(404).json({ error: 'Користувача не знайдено' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання користувача' });
    }
};

const createUserAndAuthenticate = async (req, res) => {
    try {
        const userData = req.body;
        const user = await userRepository.createUser(userData);

        await userRepository.assignRoleToUser(user.id, 'USER');

        const tokens = generateTokens(user);
        res.status(201).json({ user, tokens });
    } catch (error) {
        res.status(500).json({ error: 'Помилка створення користувача' });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await userRepository.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення користувача' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await userRepository.deleteUser(req.params.id);
        res.json({ message: 'Користувача видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка видалення користувача' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        await userRepository.updateUserRole(req.params.id, role);
        res.json({ message: 'Роль оновлено' });
    } catch (error) {
        res.status(500).json({ error: 'Помилка оновлення ролі' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    createUserAndAuthenticate,
    updateUser,
    deleteUser,
    updateUserRole
};
