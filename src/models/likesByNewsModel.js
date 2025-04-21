const likesRepository = require('../repositories/likesByNewsRepository');

const getLikesByNewsId = async (newsId) => {
    return await likesRepository.getLikesByNewsId(newsId);
};

const addLikeToNews = async (likeData) => {
    return await likesRepository.addLikeToNews(likeData);
};

const removeLikeFromNews = async (likeId) => {
    return await likesRepository.removeLikeFromNews(likeId);
};

module.exports = {
    getLikesByNewsId,
    addLikeToNews,
    removeLikeFromNews
};
