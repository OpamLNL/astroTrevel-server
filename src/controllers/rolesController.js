const roleRepository = require('../repositories/roleRepository');

const getAllRoles = async (req, res) => {
    try {
        const roles = await roleRepository.getAllRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Помилка отримання ролей' });
    }
};

module.exports = {
    getAllRoles
};
