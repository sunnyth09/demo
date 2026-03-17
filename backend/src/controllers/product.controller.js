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
    
    // Admin có thể truyền status=all để xem cả sản phẩm inactive
    // Client (public API) sẽ gọi mặc định là active (do service handle)
    const status = req.query.status || 'active';

    const products = await ProductService.getProducts({ limit, offset, category_id, search, status });
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

// ========== BULK ACTIONS ==========

export const bulkUpdateStatus = async (req, res) => {
  try {
    const { productIds, status } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ" });
    }
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ status: false, message: "Trạng thái không hợp lệ" });
    }
    await ProductService.bulkUpdateStatus(productIds, status);
    res.json({ status: true, message: `Cập nhật trạng thái ${productIds.length} sản phẩm thành công` });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const bulkRemove = async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ" });
    }
    await ProductService.bulkRemove(productIds);
    res.json({ status: true, message: `Đã xóa ${productIds.length} sản phẩm (Soft Delete)` });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const bulkRestore = async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ" });
    }
    await ProductService.bulkRestore(productIds);
    res.json({ status: true, message: `Đã khôi phục ${productIds.length} sản phẩm` });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const bulkForceRemove = async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ status: false, message: "Danh sách sản phẩm không hợp lệ" });
    }
    await ProductService.bulkForceRemove(productIds);
    res.json({ status: true, message: `Đã xóa vĩnh viễn ${productIds.length} sản phẩm` });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

