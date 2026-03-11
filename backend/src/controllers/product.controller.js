import * as ProductService from "../services/product.service.js";
import { Category } from "../models/sequelize/index.js";

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    let category_id = req.query.category_id ? parseInt(req.query.category_id) : null;
    const category_slug = req.query.category_slug || null;
    const search = req.query.search || null;

    // Nếu có category_slug, resolve thành category_id
    if (!category_id && category_slug) {
      const cat = await Category.findOne({ where: { slug: category_slug }, attributes: ['id'] });
      if (cat) category_id = cat.id;
    }
    
    const products = await ProductService.getProducts({ limit, offset, category_id, search });
    res.status(200).json({
      status: true,
      data: products,
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
    const product = await ProductService.getProductDetail(id);
    res.status(200).json({
      status: true,
      data: product,
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
    // req.files chứa { thumbnail: [...], images: [...] }
    await ProductService.create(req.body, req.files);
    res.status(201).json({
      status: true,
      message: "Thêm sản phẩm thành công"
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
    await ProductService.update(id, req.body, req.files);
    res.status(200).json({
      status: true,
      message: "Cập nhật sản phẩm thành công"
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
    await ProductService.remove(id);
    res.status(200).json({
      status: true,
      message: "Xóa sản phẩm thành công"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

export const restore = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductService.restore(id);
    res.status(200).json({
      status: true,
      message: "Khôi phục sản phẩm thành công",
      data: product
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// ========== SOFT DELETE MANAGEMENT ==========

export const getTrashed = async (req, res) => {
  try {
    const data = await ProductService.getTrashed();
    res.json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const forceRemove = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductService.forceRemove(id);
    res.json({ status: true, message: "Đã xóa vĩnh viễn sản phẩm" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

