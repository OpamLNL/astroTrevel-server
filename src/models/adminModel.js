// Залежності
const newsRepository = require('../repositories/newsRepository');
const gameRepository = require('../repositories/gameRepository');
const tagRepository = require('../repositories/tagRepository');
const commentRepository = require('../repositories/commentRepository');
const likeRepository = require('../repositories/likeRepository');

// Функції для новин
async function getNewsById(newsId) {
    return newsRepository.getNewsById(newsId);
}

async function getAllNews() {
    return newsRepository.getAllNews();
}

async function createNews(newsData) {
    return newsRepository.createNews(newsData);
}

async function updateNews(newsId, newsData) {
    return newsRepository.updateNews(newsId, newsData);
}

async function deleteNews(newsId) {
    return newsRepository.deleteNews(newsId);
}

// Функції для ігор
async function getGameById(gameId) {
    return gameRepository.getGameById(gameId);
}

async function getAllGames() {
    return gameRepository.getAllGames();
}

async function createGame(gameData) {
    return gameRepository.createGame(gameData);
}

async function updateGame(gameId, gameData) {
    return gameRepository.updateGame(gameId, gameData);
}

async function deleteGame(gameId) {
    return gameRepository.deleteGame(gameId);
}

// Функції для тегів
async function getTagById(tagId) {
    return tagRepository.getTagById(tagId);
}

async function getAllTags() {
    return tagRepository.getAllTags();
}

async function createTag(tagData) {
    return tagRepository.createTag(tagData);
}

async function updateTag(tagId, tagData) {
    return tagRepository.updateTag(tagId, tagData);
}

async function deleteTag(tagId) {
    return tagRepository.deleteTag(tagId);
}

// Функції для коментарів
async function getCommentById(commentId) {
    return commentRepository.getCommentById(commentId);
}

async function getAllComments() {
    return commentRepository.getAllComments();
}

async function createComment(commentData) {
    return commentRepository.createComment(commentData);
}

async function updateComment(commentId, commentData) {
    return commentRepository.updateComment(commentId, commentData);
}

async function deleteComment(commentId) {
    return commentRepository.deleteComment(commentId);
}

// Функції для лайків
async function getLikesByNewsId(newsId) {
    return likeRepository.getLikesByNewsId(newsId);
}

async function addLikeToNews(likeData) {
    return likeRepository.addLikeToNews(likeData);
}

async function removeLikeFromNews(likeId) {
    return likeRepository.removeLikeFromNews(likeId);
}

// Експортуємо всі функції
module.exports = {
    getNewsById,
    getAllNews,
    createNews,
    updateNews,
    deleteNews,
    getGameById,
    getAllGames,
    createGame,
    updateGame,
    deleteGame,
    getTagById,
    getAllTags,
    createTag,
    updateTag,
    deleteTag,
    getCommentById,
    getAllComments,
    createComment,
    updateComment,
    deleteComment,
    getLikesByNewsId,
    addLikeToNews,
    removeLikeFromNews
};
