const roleRepository = require('../repositories/roleRepository');
const userRepository = require('../repositories/userRepository');

// Отримати всі ролі
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleRepository.getAllRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання ролей' });
    }
};

// Отримати роль за firebase_uid користувача
const getRoleByFirebaseUid = async (req, res) => {
    try {
        const firebaseUid = req.user.user_id;
        const role = await roleRepository.getRoleByUserFirebaseUid(firebaseUid);

        if (!role) {
            return res.status(404).json({ error: 'Роль не знайдена' });
        }

        res.json({ role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка сервера при отриманні ролі' });
    }
};

// Оновити роль користувачу
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { roleId } = req.body;

        const user = await userRepository.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Користувач не знайдений' });
        }

        await roleRepository.updateUserRole(userId, roleId);
        res.json({ message: 'Роль оновлено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Помилка при оновленні ролі' });
    }
};

module.exports = {
    getAllRoles,
    getRoleByFirebaseUid,
    updateUserRole
};
