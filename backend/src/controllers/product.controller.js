import * as ProductService from "../services/product.service.js";

export const getAll = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const category_id = req.query.category_id ? parseInt(req.query.category_id) : null;
    
    const products = await ProductService.getProducts({ limit, offset, category_id });
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
