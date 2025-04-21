const newsRepository = require('../repositories/newsRepository');

const getNewsById = async (newsId) => {
    return await newsRepository.getNewsById(newsId);
};

const getAllNews = async () => {
    return await newsRepository.getAllNews();
};

const createNews = async (newsData) => {
    return await newsRepository.createNews(newsData);
};

const updateNews = async (newsId, newsData) => {
    return await newsRepository.updateNews(newsId, newsData);
};

const deleteNews = async (newsId) => {
    return await newsRepository.deleteNews(newsId);
};

module.exports = {
    getNewsById,
    getAllNews,
    createNews,
    updateNews,
    deleteNews
};