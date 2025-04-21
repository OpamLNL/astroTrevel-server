const userRepository = require('../repositories/userRepository');
const { generateTokens } = require('../services/authService');
const bcrypt = require("bcryptjs");

const getUserByUsername = async (userName) => {

    try {
        const user = await userRepository.getUserByUsername(userName);

        if (!user) {
            throw new Error('Користувач не знайдений.');
        }
        return user;
    } catch (error) {
        throw new Error('Помилка отримання користувача: ' + error.message);
    }
};

const getUserById = async (userId) => {
    try {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new Error('Користувач не знайдений.');
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
            throw new Error('Користувач не знайдений.');
        }
        return user;
    } catch (error) {
        throw new Error('Помилка отримання користувача: ' + error.message);
    }
};

const getAllUsers = async () => {
    try {
        const users = await userRepository.getAllUsers();
        return users;
    } catch (error) {
        throw new Error('Помилка отримання списку користувачів: ' + error.message);
    }
};

const createUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = await userRepository.createUser({
            ...userData,
            password: hashedPassword
        });

        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user: ' + error.message);
    }
};

const createUserAndAuthenticate = async (req, res) => {
    try {
        const { username, email, password, avatar, birth_date, bio, phone_number, language, timezone } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            username,
            email,
            password: hashedPassword,
            avatar: avatar || 'default_avatar.png',
            birth_date: birth_date || null,
            bio: bio || '',
            phone_number: phone_number || null,
            language: language || 'uk',
            timezone: timezone || 'UTC',
            status: 'active',
            last_visit: new Date()
        };

        const newUser = await userRepository.createUser(userData);

        const { accessToken, refreshToken } = generateTokens(newUser.id);

        res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                avatar: newUser.avatar
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
    console.log(userData);
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

const getActiveUsers = async () => {
    try {
        return await userRepository.getActiveUsers();
    } catch (error) {
        throw new Error('Помилка отримання активних користувачів: ' + error.message);
    }
};

module.exports = {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getAllUsers,
    createUserAndAuthenticate,
    createUser,
    updateUser,
    deleteUser,
    getActiveUsers
};
