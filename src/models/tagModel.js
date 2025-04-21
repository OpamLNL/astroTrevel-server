const tagsRepository = require('../repositories/tagRepository');

const getTagById = async (tagId) => {
    try {
        const tag = await tagsRepository.getTagById(tagId);
        if (!tag) {
            throw new Error('Тег не знайдено');
        }
        return tag;
    } catch (error) {
        throw error;
    }
};

const getAllTags = async () => {
    try {
        const tags = await tagsRepository.getAllTags();
        return tags;
    } catch (error) {
        throw error;
    }
};

const createTag = async (tagData) => {
    try {
        const newTag = await tagsRepository.createTag(tagData);
        return newTag;
    } catch (error) {
        throw error;
    }
};

const updateTag = async (tagId, tagData) => {
    try {
        const updatedTag = await tagsRepository.updateTag(tagId, tagData);
        return updatedTag;
    } catch (error) {
        throw error;
    }
};

const deleteTag = async (tagId) => {
    try {
        const result = await tagsRepository.deleteTag(tagId);
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getTagById,
    getAllTags,
    createTag,
    updateTag,
    deleteTag
};
