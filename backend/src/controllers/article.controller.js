import * as ArticleService from "../services/article.service.js";

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const search = req.query.search || null;

    const articles = await ArticleService.getArticles({ limit, offset, search });
    const count = await ArticleService.countArticles(search);

    res.status(200).json({
      status: true,
      data: articles,
      meta: {
        total: count,
        limit,
        offset
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleService.getArticleDetail(id);
    res.status(200).json({
      status: true,
      data: article,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const article = await ArticleService.create(req.body, req.files);
    res.status(201).json({
      status: true,
      message: "Tạo bài viết thành công",
      data: article
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleService.update(id, req.body, req.files);
    res.status(200).json({
      status: true,
      message: "Cập nhật bài viết thành công",
      data: article
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await ArticleService.remove(id);
    res.status(200).json({
      status: true,
      message: "Xóa bài viết thành công"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
