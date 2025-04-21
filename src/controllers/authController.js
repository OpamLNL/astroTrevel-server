// authController.js
const bcrypt = require('bcryptjs');
const { getUserByEmail } = require('../controllers/usersController');
const { generateTokens } = require('../services/authService');

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log('req');
    console.log(req.body);
    console.log(email);

    try {


        const user = await getUserByEmail(email);


        if (!user) {
            return res.status(401).json({ message: "Невірний email або пароль" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Невірний email або пароль" });
        }

        const { accessToken, refreshToken } = generateTokens(user.id);
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            role: user.role
        };

        console.log(`Користувач ${user.username} успішно авторизований.`);
        res.json({ user: userData, accessToken, refreshToken });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: "Внутрішня помилка сервера", details: error.message });
    }
};