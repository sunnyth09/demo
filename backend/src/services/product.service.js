import { Product, Category, Review } from "../models/sequelize/index.js";
import { uploadFile, deleteFile } from "./minio.service.js";
import { Op } from "sequelize";
import { getAllChildIds } from "./category.service.js";

/**
 * Kiểm tra khuyến mãi có đang hoạt động không
 * - Nếu không có discount_start/discount_end → giảm giá vĩnh viễn (true)
 * - Nếu có → kiểm tra hiện tại nằm trong khoảng [start, end]
 */
const isDiscountActive = (discount_start, discount_end) => {
  if (!discount_start || !discount_end) return true;
  const now = new Date();
  return now >= new Date(discount_start) && now <= new Date(discount_end);
};

/**
 * Tạo slug từ tên sản phẩm
 */
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // Thay space bằng -
    .replace(/-+/g, '-') // Bỏ nhiều dấu - liên tiếp
    .trim();
};

/**
 * Lấy danh sách sản phẩm với phân trang và lọc theo danh mục
 */
export const getProducts = async ({ limit = 10, offset = 0, category_id = null, search = null }) => {
  const whereClause = {};

  if (category_id) {
    const childIds = await getAllChildIds(category_id);
    whereClause.category_id = { [Op.in]: [category_id, ...childIds] };
  }

  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { author: { [Op.like]: `%${search}%` } },
      { publisher: { [Op.like]: `%${search}%` } }
    ];
  }

  const products = await Product.findAll({
    attributes: ['id', 'name', 'slug', 'sku', 'price', 'original_price', 'discount_start', 'discount_end', 'quantity', 'thumbnail', 'status'],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['name']
      }
    ],
    where: whereClause,
    order: [['id', 'DESC']],
    limit,
    offset
  });

  // Transform để có category_name thay vì object
  return products.map(p => {
    const discountActive = isDiscountActive(p.discount_start, p.discount_end);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      // Nếu hết hạn khuyến mãi → hiển thị giá gốc, ẩn giá giảm
      price: (!discountActive && p.original_price) ? p.original_price : p.price,
      original_price: discountActive ? p.original_price : null,
      discount_start: p.discount_start,
      discount_end: p.discount_end,
      quantity: p.quantity,
      thumbnail: p.thumbnail,
      status: p.status,
      category_name: p.category?.name || null
    };
  });
};

/**
 * Đếm tổng số sản phẩm
 */
export const countProducts = async (category_id = null) => {
  const whereClause = {};
  if (category_id) {
    const childIds = await getAllChildIds(category_id);
    whereClause.category_id = { [Op.in]: [category_id, ...childIds] };
  }
  return await Product.count({ where: whereClause });
};

/**
 * Lấy chi tiết sản phẩm theo ID hoặc slug
 */
export const getProductDetail = async (idOrSlug) => {
  // Kiểm tra xem là ID hay slug
  const isId = !isNaN(idOrSlug);

  const whereClause = isId
    ? { id: parseInt(idOrSlug) }
    : { slug: idOrSlug };

  const product = await Product.findOne({
    where: whereClause,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    ]
  });

  if (!product) {
    throw new Error("Sản phẩm không tồn tại");
  }

  // Convert to plain object
  const result = product.toJSON();

  // Parse images từ JSON string
  if (result.image) {
    try {
      result.images = JSON.parse(result.image);
    } catch (e) {
      result.images = [];
    }
  } else {
    result.images = [];
  }

  // Thêm category_name
  result.category_name = result.category?.name || null;

  // Ẩn giá giảm nếu khuyến mãi đã hết hạn, quay về giá gốc
  if (!isDiscountActive(result.discount_start, result.discount_end)) {
    if (result.original_price) {
      result.price = result.original_price;
    }
    result.original_price = null;
  }

  // Count Reviews
  const reviewCount = await Review.count({
    where: { product_id: product.id }
  });
  result.total_reviews = reviewCount || 0;

  // Xóa field image raw, chỉ giữ images
  delete result.image;

  return result;
};

/**
 * Tạo sản phẩm mới
 */
export const create = async (data, files) => {
  if (!data.name || !data.price) {
    throw new Error("Tên và giá sản phẩm là bắt buộc");
  }

  // Validate category_id exists if provided
  if (data.category_id) {
    const category = await Category.findByPk(data.category_id);
    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }
  }

  // Tạo slug từ tên hoặc dùng slug được cung cấp
  let slug = data.slug ? data.slug : generateSlug(data.name);

  // Kiểm tra slug đã tồn tại chưa
  const existingSlug = await Product.findOne({ where: { slug } });
  if (existingSlug) {
    // Thêm số vào cuối slug
    slug = `${slug}-${Date.now()}`;
  }

  // Upload thumbnail (ảnh đại diện)
  let thumbnailUrl = null;
  if (files?.thumbnail && files.thumbnail[0]) {
    thumbnailUrl = await uploadFile(files.thumbnail[0]);
  }

  // Upload images (ảnh gallery)
  let imageUrls = [];
  if (files?.images && files.images.length > 0) {
    imageUrls = await Promise.all(files.images.map(file => uploadFile(file)));
  }

  const product = await Product.create({
    name: data.name,
    slug: slug,
    sku: data.sku || null,
    price: data.price,
    original_price: data.original_price || null,
    discount_start: data.discount_start || null,
    discount_end: data.discount_end || null,
    quantity: data.quantity || 0,
    description: data.description || null,
    category_id: data.category_id || null,
    thumbnail: thumbnailUrl,
    image: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
    status: data.status || 'active',
    author: data.author || null,
    publisher: data.publisher || null,
    publication_year: data.publication_year || null,
    attributes: data.attributes ? (typeof data.attributes === 'string' ? JSON.parse(data.attributes) : data.attributes) : null
  });

  return product;
};

/**
 * Cập nhật sản phẩm
 */
export const update = async (id, data, files) => {
  // Lấy sản phẩm hiện tại
  const existingProduct = await getProductDetail(id);

  if (!data.name || !data.price) {
    throw new Error("Tên và giá sản phẩm là bắt buộc");
  }

  // Xử lý slug
  let slug = existingProduct.slug;
  if (data.slug && data.slug !== existingProduct.slug) {
    // Kiểm tra slug mới có trùng không
    const existingSlug = await Product.findOne({
      where: { slug: data.slug }
    });
    if (existingSlug && existingSlug.id !== parseInt(id)) {
      throw new Error("Slug đã tồn tại");
    }
    slug = data.slug;
  }

  // Xử lý SKU (check unique)
  if (data.sku && data.sku !== existingProduct.sku) {
    const existingSku = await Product.findOne({
      where: { sku: data.sku }
    });
    if (existingSku && existingSku.id !== parseInt(id)) {
      throw new Error("SKU đã tồn tại");
    }
  }

  let thumbnailUrl = existingProduct.thumbnail;
  let imageUrls = null;

  // Nếu có thumbnail mới
  if (files?.thumbnail && files.thumbnail[0]) {
    // Xóa thumbnail cũ
    if (existingProduct.thumbnail) {
      await deleteFile(existingProduct.thumbnail);
    }
    thumbnailUrl = await uploadFile(files.thumbnail[0]);
  }

  // Xử lý images gallery
  const hasNewImages = files?.images && files.images.length > 0;
  const hasExistingImages = data.existing_images !== undefined;

  if (hasNewImages || hasExistingImages) {
    // Danh sách ảnh cũ cần giữ lại (gửi từ frontend)
    let keepImages = [];
    if (hasExistingImages) {
      keepImages = Array.isArray(data.existing_images)
        ? data.existing_images.filter(url => url && url.trim() !== '')
        : (data.existing_images && data.existing_images.trim() !== '' ? [data.existing_images] : []);
    } else if (!hasNewImages) {
      // Không gửi gì → giữ nguyên
      keepImages = existingProduct.images || [];
    }

    // Xóa những ảnh cũ bị loại bỏ
    const oldImages = existingProduct.images || [];
    const removedImages = oldImages.filter(url => !keepImages.includes(url));
    if (removedImages.length > 0) {
      await Promise.all(removedImages.map(url => deleteFile(url)));
    }

    // Upload ảnh mới (nếu có)
    let newUploadedUrls = [];
    if (hasNewImages) {
      newUploadedUrls = await Promise.all(files.images.map(file => uploadFile(file)));
    }

    // Kết hợp: ảnh cũ giữ lại + ảnh mới upload
    const finalImages = [...keepImages, ...newUploadedUrls];
    imageUrls = JSON.stringify(finalImages);
  }

  // Tìm và cập nhật product
  const product = await Product.findByPk(id);
  await product.update({
    name: data.name,
    slug: slug,
    sku: data.sku !== undefined ? data.sku : product.sku,
    price: data.price,
    original_price: data.original_price !== undefined ? data.original_price : product.original_price,
    discount_start: data.discount_start !== undefined ? data.discount_start : product.discount_start,
    discount_end: data.discount_end !== undefined ? data.discount_end : product.discount_end,
    quantity: data.quantity !== undefined ? data.quantity : product.quantity,
    description: data.description !== undefined ? data.description : product.description,
    category_id: data.category_id !== undefined ? data.category_id : product.category_id,
    thumbnail: thumbnailUrl,
    image: imageUrls || product.image,
    status: data.status || product.status,
    author: data.author !== undefined ? data.author : product.author,
    publisher: data.publisher !== undefined ? data.publisher : product.publisher,
    publication_year: data.publication_year !== undefined ? data.publication_year : product.publication_year,
    attributes: data.attributes !== undefined ? (typeof data.attributes === 'string' ? JSON.parse(data.attributes) : data.attributes) : product.attributes
  });

  return product;
};

/**
 * Xóa sản phẩm
 */
export const remove = async (id) => {
  // Với Soft Delete, chúng ta KHÔNG xóa file ảnh ngay lập tức
  // Vì có thể khôi phục lại sản phẩm sau này.
  
  // Thực hiện Soft Delete trong DB (cập nhật deleted_at)
  await Product.destroy({
    where: { id }
  });

  return true;
};

/**
 * Khôi phục sản phẩm đã xóa mềm
 */
export const restore = async (id) => {
  const product = await Product.findOne({
    where: { id },
    paranoid: false // Include soft-deleted records
  });

  if (!product) {
    throw new Error("Không tìm thấy sản phẩm");
  }

  if (!product.deletedAt) {
    throw new Error("Sản phẩm chưa bị xóa, không cần khôi phục");
  }

  await product.restore();
  return product;
};
