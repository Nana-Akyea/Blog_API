const Joi = require("joi");

const ArticleModel = require("../models/article.model");

const postArticle = async (req, res, next) => {

const articleSchema = Joi.object({
    title: Joi.string().min(5).required(),
    content: Joi.string().min(20).required(),
    author: Joi.string().optional().default("Guest"),
});

const { error, value } = articleSchema.validate(req.body)

if (error) {
    return res.status(400).json({ error: error.details[0].message}, error);
}

        try {
            const { title, content, author } = value;
            const newArticle = new ArticleModel({ 
                title, 
                content, 
                author: author || "Guest"
            });
            await newArticle.save();
            return res.status(201).json({ 
                message: "Article created successfully", 
                data: newArticle})
    } catch (error) {
        console.error(error);
        next(error);
    }
};
 
const getAllArticle = async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const articles = await ArticleModel.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

        return res.status(200).json({
            message: "Articles retrieved successfully",
            data: articles
        })
    } catch (error) {
        console.error(error);
        next(error); 
    }
};

const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`
            })
        }
        return res.status(200).json({
            message: "Article retrieved successfully",
            data: article
        });
    } catch (error) {
         console.error(error);
        next(error);
    } 
};

// GET /articles/search?q=keyword
const searchArticles = async (req, res, next) => {
  try {
    const { q } = req.query;

    // Check if a search keyword was provided
    if (!q || !q.trim()) {
      return res.status(400).json({
        message: 'Please provide a search keyword using ?q=keyword'
      });
    }

    // Search articles using MongoDB text search
    const articles = await Article.find({
      $text: { $search: q.trim() }
    });

    res.status(200).json({
      count: articles.length,
      articles
    });
  } catch (error) {
    next(error);
  }
};

const updateArticleById = async (req, res, next) => {
    
const articleSchema = Joi.object({
    title: Joi.string().min(5).optional(),
    content: Joi.string().min(20).optional(),
    author: Joi.string().optional(),
});

const { error, value } = articleSchema.validate(req.body);

if (error) {
    return res.status(400).json({ error: error.details[0].message}, error);
}
    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            req.params.id,
             { ...req.body },
            { new: true, runValidators: true }
        );
        if (!updatedArticle) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`
            });
        }
        return res.status(200).json({
            message: "Article updated successfully",
            data: updatedArticle
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const deletedArticle = await ArticleModel.findByIdAndDelete(req.params.id);
        if (!deletedArticle) {
            return res.status(404).json({
                message: `Article with ID ${req.params.id} not found`
            });
        }
        return res.status(200).json({
            message: "Article deleted successfully",
            data: deletedArticle
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    postArticle,
    getAllArticle,
    getArticleById,
    searchArticles,
    updateArticleById,
    deleteArticleById
    };