const commentsRepository = require('../repositories/commentRepository');

const getCommentById = async (commentId) => {
    return await commentsRepository.getCommentById(commentId);
};

const getAllComments = async () => {
    return await commentsRepository.getAllComments();
};

const createComment = async (commentData) => {
    return await commentsRepository.createComment(commentData);
};

const updateComment = async (commentId, commentData) => {
    return await commentsRepository.updateComment(commentId, commentData);
};

const deleteComment = async (commentId) => {
    return await commentsRepository.deleteComment(commentId);
};

module.exports = {
    getCommentById,
    getAllComments,
    createComment,
    updateComment,
    deleteComment
};