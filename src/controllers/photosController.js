const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, '..', 'data', 'photos');

exports.getPhotosByType = async (req, res) => {
    const type = req.params.type;

    try {
        if (type === 'all') {
            const files = fs.readdirSync(PHOTOS_DIR).filter(f => f.endsWith('.json'));
            let allPhotos = [];

            for (const file of files) {
                const filePath = path.join(PHOTOS_DIR, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                const json = JSON.parse(content);
                allPhotos = allPhotos.concat(json);
            }


            return res.json(allPhotos);
        }

        const filePath = path.join(PHOTOS_DIR, `${type}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Тип фото не знайдено' });
        }

        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        res.json(data);
    } catch (err) {
        console.error('❌ Помилка при обробці фото:', err);
        res.status(500).json({ error: 'Помилка при читанні фото' });
    }
};
