const commentsModel = require('../models/commentModel');

// Отримати всі коментарі для певного типу і ID
const getCommentsByTypeAndId = async (req, res) => {
    try {
        const { type, id } = req.params;
        const comments = await commentsModel.getCommentsByTypeAndId(type, id);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error getting comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Створити коментар
const createComment = async (req, res) => {
    try {
        const newComment = await commentsModel.createComment(req.body);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Оновити коментар
const updateComment = async (req, res) => {
    try {
        const updatedComment = await commentsModel.updateComment(req.params.id, req.body);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Видалити коментар
const deleteComment = async (req, res) => {
    try {
        await commentsModel.deleteComment(req.params.id);
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getCommentsByTypeAndId,
    createComment,
    updateComment,
    deleteComment
};
