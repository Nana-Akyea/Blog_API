
const express = require('express');

const {
    postArticle,
    getAllArticle,
    getArticleById,
    searchArticles,
    updateArticleById,
    deleteArticleById
} = require('../controllers/article.controller');

const router = express.Router();

router.post('/articles', postArticle);

router.get('/articles', getAllArticle);

router.get('/articles/:id', getArticleById);

router.get('/articles/search', searchArticles);

router.put('/articles/:id', updateArticleById);

router.delete('/articles/:id', deleteArticleById);

module.exports = router;