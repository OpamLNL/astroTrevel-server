const path = require('path');
const fs = require('fs');

exports.getEquipment = (req, res) => {
    const filePath = path.join(__dirname, '../data/photos/equipment.json');
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Помилка читання даних' });
        res.json(JSON.parse(data));
    });
};
