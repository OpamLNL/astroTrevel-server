// likesByNewsController.js

const likesByNewsModel = require('../models/likesByNewsModel');

const getLikesByNewsId = async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const likes = await likesByNewsModel.getLikesByNewsId(newsId);
        res.json(likes);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const addLikeToNews = async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const userId = req.body.userId; // Припускаємо, що userId передається у тілі запиту
        const like = await likesByNewsModel.addLikeToNews(newsId, userId);
        res.status(201).json(like);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const removeLikeFromNews = async (req, res) => {
    try {
        const newsId = req.params.newsId;
        const userId = req.body.userId; // Припускаємо, що userId передається у тілі запиту
        const result = await likesModel.removeLikeFromNews(newsId, userId);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getLikesByNewsId,
    addLikeToNews,
    removeLikeFromNews
};
