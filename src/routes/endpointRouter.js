const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');

const usersController = require('../controllers/usersController');
const authController = require("../controllers/authController");
const equipmentController = require("../controllers/equipmentController");

const locationsController = require('../controllers/locationsController');
const toursController = require('../controllers/toursController');
const postsController = require('../controllers/postsController');
const tagsController = require('../controllers/tagsController');
const photosController = require('../controllers/photosController');
const likesController = require('../controllers/likesController');
const visitController = require('../controllers/visitController');

const { authenticateToken } = require("../services/authService");

// Роут для локального сервера
router.get('/', (req, res) => {
    res.send('Ласкаво просимо на сервер астрономічного туризму!');
});

// Авторизація
router.post('/api/auth/signin', authController.signIn);

// Роути для користувачів
router.get('/api/users/getAll', usersController.getAllUsers);
router.get('/api/users/getUserById/:id', usersController.getUserById);
router.get('/api/users/getUserByUsername/:username', usersController.getUserByUsername);
router.get('/users/getUserByEmail/:email', usersController.getUserByEmail);
router.post('/api/users/create', usersController.createUserAndAuthenticate);
router.put('/api/users/update/:id', authenticate, usersController.updateUser);
router.delete('/api/users/delete/:id', authenticate, usersController.deleteUser);

// ЛОКАЦІЇ
router.get('/api/locations', locationsController.getAllLocations);
router.get('/api/locations/:id', locationsController.getLocationById);
router.post('/api/locations', authenticate, locationsController.createLocation);
router.put('/api/locations/:id', authenticate, locationsController.updateLocation);
router.delete('/api/locations/:id', authenticate, locationsController.deleteLocation);
router.get('/api/locations/:id/tours', locationsController.getToursByLocation);
router.get('/api/locations/:id/tags', locationsController.getTagsByLocation);

// ТУРИ
router.get('/api/tours', toursController.getAllTours);
router.get('/api/tours/upcoming', toursController.getUpcomingTours);
router.get('/api/tours/:id', toursController.getTourById);
router.post('/api/tours', authenticate, toursController.createTour);
router.put('/api/tours/:id', authenticate, toursController.updateTour);
router.delete('/api/tours/:id', authenticate, toursController.deleteTour);
router.get('/api/tours/:id/tags', toursController.getTagsByTour);
router.get('/api/tours/:id/locations', toursController.getLocationsByTour);

// ПОСТИ
router.get('/api/posts', postsController.getAllPosts);
router.get('/api/posts/usersfavorites', authenticate, postsController.getFavoritePostsByUser);

router.get('/api/posts/:id', postsController.getPostById);
router.post('/api/posts', authenticate, postsController.createPost);
router.put('/api/posts/:id', authenticate, postsController.updatePost);
router.delete('/api/posts/:id', authenticate, postsController.deletePost);
router.get('/api/posts/:id/tags', postsController.getTagsByPost);
router.get('/api/posts/:id/likes/count', postsController.getLikesCount);
router.get('/api/posts/:id/status', authenticate, postsController.getUserPostStatus);




router.post('/api/posts/:id/like', authenticate, postsController.likePost);
router.delete('/api/posts/:id/like', authenticate, postsController.unlikePost);
router.post('/api/posts/:id/favorite', authenticate, postsController.addToFavorites);
router.delete('/api/posts/:id/favorite', authenticate, postsController.removeFromFavorites);

// ТЕГИ
router.get('/api/tags', tagsController.getAllTags);
router.get('/api/tags/:id', tagsController.getTagById);
router.post('/api/tags', authenticate, tagsController.createTag);
router.put('/api/tags/:id', authenticate, tagsController.updateTag);
router.delete('/api/tags/:id', authenticate, tagsController.deleteTag);
router.get('/api/tags/:id/locations', tagsController.getLocationsByTag);
router.get('/api/tags/:id/tours', tagsController.getToursByTag);
router.get('/api/tags/:id/posts', tagsController.getPostsByTag);

// Пошук і фільтрація
router.get('/api/search', postsController.searchContent);
router.get('/api/filters', tagsController.filterByTag);

// Фото з NASA
router.get('/api/photos/:type', photosController.getPhotosByType);

// Обладнання
router.get('/api/equipment', equipmentController.getEquipment);

// Лайки
router.get('/api/posts/:id/likes', postsController.getLikesCount);

//  Відвідаю


router.get('/api/visit/locations/:userId', visitController.getPlannedLocations);
router.post('/api/visit/locations', authenticate, visitController.addPlannedLocation);
router.delete('/api/visit/locations', authenticate, visitController.removePlannedLocation);

router.get('/api/visit/tours/:userId', visitController.getPlannedTours);
router.post('/api/visit/tours', authenticate, visitController.addPlannedTour);
router.delete('/api/visit/tours', authenticate, visitController.removePlannedTour);

module.exports = router;
