import { Article } from "../models/sequelize/index.js";
import { uploadFile, deleteFile } from "./minio.service.js";
import { Op } from "sequelize";

/**
 * Generate slug from title
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const getArticles = async ({ limit = 10, offset = 0, search = null }) => {
  const whereClause = {};

  if (search) {
    whereClause.title = { [Op.like]: `%${search}%` };
  }

  return await Article.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
};

export const countArticles = async (search = null) => {
  const whereClause = {};
  if (search) {
    whereClause.title = { [Op.like]: `%${search}%` };
  }
  return await Article.count({ where: whereClause });
};

export const getArticleDetail = async (idOrSlug) => {
  const isId = !isNaN(idOrSlug);
  const whereClause = isId ? { id: parseInt(idOrSlug) } : { slug: idOrSlug };

  const article = await Article.findOne({ where: whereClause });

  if (!article) {
    throw new Error("Bài viết không tồn tại");
  }

  // Increment views
  await article.increment('views');

  return article;
};

export const create = async (data, files) => {
  if (!data.title) {
    throw new Error("Tiêu đề bài viết là bắt buộc");
  }

  let slug = data.slug ? data.slug : generateSlug(data.title);
  const existingSlug = await Article.findOne({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${Date.now()}`;
  }

  let thumbnailUrl = null;
  if (files?.thumbnail && files.thumbnail[0]) {
    thumbnailUrl = await uploadFile(files.thumbnail[0]);
  }

  return await Article.create({
    title: data.title,
    slug: slug,
    content: data.content || '',
    excerpt: data.excerpt || '',
    thumbnail: thumbnailUrl,
    status: data.status || 'draft',
  });
};

export const update = async (id, data, files) => {
  const article = await Article.findByPk(id);
  if (!article) throw new Error("Bài viết không tồn tại");

  let slug = article.slug;
  if (data.title && (!data.slug || data.slug === slug)) {
    // Optionally update slug if title changes, but usually better to keep stable unless explicitly changed
    // slug = generateSlug(data.title); 
  }
  if (data.slug && data.slug !== slug) {
    const existingSlug = await Article.findOne({ where: { slug: data.slug } });
    if (existingSlug && existingSlug.id !== parseInt(id)) {
      throw new Error("Slug đã tồn tại");
    }
    slug = data.slug;
  }

  let thumbnailUrl = article.thumbnail;
  if (files?.thumbnail && files.thumbnail[0]) {
    if (article.thumbnail) {
      await deleteFile(article.thumbnail);
    }
    thumbnailUrl = await uploadFile(files.thumbnail[0]);
  }

  await article.update({
    title: data.title || article.title,
    slug: slug,
    content: data.content !== undefined ? data.content : article.content,
    excerpt: data.excerpt !== undefined ? data.excerpt : article.excerpt,
    thumbnail: thumbnailUrl,
    status: data.status || article.status,
  });

  return article;
};

export const remove = async (id) => {
  const article = await Article.findByPk(id);
  if (!article) throw new Error("Bài viết không tồn tại");

  if (article.thumbnail) {
    await deleteFile(article.thumbnail);
  }

  await article.destroy();
  return true;
};
