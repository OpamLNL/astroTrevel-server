const userRepository = require('../repositories/userRepository');
const { generateTokens } = require('../services/authService');

const getUserById = async (userId) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('Користувача не знайдено');
        }
        return user;
    } catch (error) {
        throw new Error('Помилка отримання користувача: ' + error.message);
    }
};

const getUserByEmail = async (email) => {
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            throw new Error('Користувача не знайдено');
        }
        return user;
    } catch (error) {
        throw new Error('Помилка отримання користувача: ' + error.message);
    }
};

const getAllUsers = async () => {
    try {
        return await userRepository.getAllUsers();
    } catch (error) {
        throw new Error('Помилка отримання списку користувачів: ' + error.message);
    }
};

const createUser = async ({ firebase_uid, email, name, avatar_url }) => {
    try {
        const user = await userRepository.createUser({
            firebase_uid,
            email,
            name,
            avatar_url: avatar_url || '/images/users/default_avatar.png'
        });
        return user;
    } catch (error) {
        throw new Error('Помилка створення користувача: ' + error.message);
    }
};

const createUserAndAuthenticate = async (req, res) => {
    try {
        const { firebase_uid, email, name, avatar_url } = req.body;

        const userData = {
            firebase_uid,
            email,
            name,
            avatar_url: avatar_url || '/images/users/default_avatar.png'
        };

        const newUser = await userRepository.createUser(userData);
        const { accessToken, refreshToken } = generateTokens(newUser.id);

        res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                avatar_url: newUser.avatar_url
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Помилка створення користувача:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateUser = async (userId, userData) => {
    try {
        const updatedUser = await userRepository.updateUser(userId, userData);
        return { id: userId, ...userData };
    } catch (error) {
        throw new Error('Помилка оновлення користувача: ' + error.message);
    }
};

const deleteUser = async (userId) => {
    try {
        await userRepository.deleteUser(userId);
        return { id: userId };
    } catch (error) {
        throw new Error('Помилка видалення користувача: ' + error.message);
    }
};

module.exports = {
    getUserById,
    getUserByEmail,
    getAllUsers,
    createUser,
    createUserAndAuthenticate,
    updateUser,
    deleteUser
};
