import { Category, Product } from "../models/sequelize/index.js";
import { Op, fn, col, literal } from "sequelize";

// Hàm tạo slug từ tên tiếng Việt
const generateSlug = (name) => {
  return name
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

/**
 * Lấy danh sách tất cả danh mục
 * Bao gồm số lượng sản phẩm trong mỗi danh mục
 */
export const getCategories = async () => {
  const categories = await Category.findAll({
    attributes: {
      include: [
        // Đếm số sản phẩm trực tiếp trong danh mục
        [
          literal('(SELECT COUNT(*) FROM products WHERE products.category_id = Category.id)'),
          'productCount'
        ]
      ]
    },
    order: [['id', 'ASC']]
  });

  // Chuyển sang plain object để xử lý logic cộng dồn
  const cats = categories.map(c => c.toJSON());
  const categoryMap = {};

  // Init map
  cats.forEach(cat => {
    cat.directCount = parseInt(cat.productCount || 0);
    cat.totalCount = 0; // Sẽ tính
    cat.children = [];
    categoryMap[cat.id] = cat;
  });

  const rootNodes = [];

  // Build tree
  cats.forEach(cat => {
    if (cat.parent_id && categoryMap[cat.parent_id]) {
      categoryMap[cat.parent_id].children.push(cat);
    } else {
      rootNodes.push(cat);
    }
  });

  // Recursive count
  const calculateTotal = (node) => {
    let sum = node.directCount;
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        sum += calculateTotal(child);
      });
    }
    node.productCount = sum; // Override productCount với tổng số
    return sum;
  };

  rootNodes.forEach(node => calculateTotal(node));

  // Trả về flat list (các node con đã được tính toán trong quá trình đệ quy vì pass by reference)
  // Xóa thuộc tính tạm nếu cần thiết, nhưng giữ lại cũng không sao
  // Frontend nhận 'productCount' là tổng
  
  return cats;
};

/**
 * Lấy chi tiết 1 danh mục theo ID
 */
export const getCategoryDetail = async (id) => {
  const category = await Category.findByPk(id, {
    include: [
      { model: Category, as: 'parent', attributes: ['id', 'name'] },
      { model: Category, as: 'children', attributes: ['id', 'name'] }
    ]
  });
  
  if (!category) {
    throw new Error("Không tìm thấy danh mục");
  }
  
  return category;
};

/**
 * Tạo danh mục mới
 */
export const create = async (data) => {
  if (!data.name) {
    throw new Error("Vui lòng nhập tên danh mục");
  }

  // Auto-generate slug nếu không có
  let slug = data.slug?.trim() || generateSlug(data.name);
  
  // Đảm bảo slug unique
  const existing = await Category.findOne({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const category = await Category.create({
    name: data.name,
    slug,
    description: data.description || '',
    icon: data.icon || '',
    status: data.status !== undefined ? data.status : true,
    parent_id: data.parent_id || null
  });

  return category;
};

/**
 * Cập nhật 1 danh mục
 */
export const update = async (id, data) => {
  // Kiểm tra tồn tại
  const existing = await Category.findByPk(id);
  if (!existing) {
    throw new Error("Không tìm thấy danh mục");
  }

  if (!data.name) {
    throw new Error("Vui lòng nhập tên danh mục");
  }
  
  // Validate parent_id (tránh vòng lặp cha con)
  if (data.parent_id && parseInt(data.parent_id) === parseInt(id)) {
    throw new Error("Không thể chọn chính mình làm cha");
  }

  // Xử lý slug
  let slug = data.slug !== undefined ? data.slug?.trim() : existing.slug;
  if (!slug) {
    slug = generateSlug(data.name);
  }
  
  // Đảm bảo slug unique (trừ chính nó)
  const slugExists = await Category.findOne({ where: { slug, id: { [Op.ne]: id } } });
  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  await existing.update({
    name: data.name,
    slug,
    description: data.description !== undefined ? data.description : existing.description,
    icon: data.icon !== undefined ? data.icon : existing.icon,
    status: data.status !== undefined ? data.status : existing.status,
    parent_id: data.parent_id !== undefined ? data.parent_id : existing.parent_id
  });

  return existing;
};

/**
 * Cập nhật nhiều danh mục cùng lúc
 */
export const bulkUpdate = async (ids, data) => {
  if (!ids || !ids.length) {
    throw new Error("Vui lòng nhập danh sách ID");
  }
  
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Vui lòng nhập dữ liệu cần cập nhật");
  }

  // Filter allowed fields
  const allowedFields = ['name', 'parent_id', 'description', 'image', 'status'];
  const filteredData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      filteredData[key] = data[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new Error("Không có trường hợp lệ để cập nhật");
  }

  await Category.update(filteredData, {
    where: {
      id: { [Op.in]: ids }
    }
  });

  return { ids, data: filteredData };
};

/**
 * Xóa 1 danh mục
 */
export const remove = async (id) => {
  const existing = await Category.findByPk(id);
  if (!existing) {
    throw new Error("Không tìm thấy danh mục");
  }

  // Check for child categories
  const childCount = await Category.count({ where: { parent_id: id } });
  if (childCount > 0) {
    throw new Error(`Không thể xóa: Danh mục có ${childCount} danh mục con. Hãy xóa hoặc chuyển danh mục con trước.`);
  }

  // Check for products in this category
  const productCount = await Product.count({ where: { category_id: id } });
  if (productCount > 0) {
    throw new Error(`Không thể xóa: Danh mục có ${productCount} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.`);
  }
  
  await existing.destroy();
  return true;
};

/**
 * Xóa nhiều danh mục
 */
export const bulkRemove = async (ids) => {
  if (!ids || !ids.length) return;

  // Check for products in any of these categories
  const productCount = await Product.count({
    where: { category_id: { [Op.in]: ids } }
  });
  if (productCount > 0) {
    throw new Error(`Không thể xóa: Có ${productCount} sản phẩm thuộc các danh mục đã chọn.`);
  }

  // Check for child categories
  const childCount = await Category.count({
    where: { parent_id: { [Op.in]: ids } }
  });
  if (childCount > 0) {
    throw new Error(`Không thể xóa: Có ${childCount} danh mục con thuộc các danh mục đã chọn.`);
  }
  
  await Category.destroy({
    where: {
      id: { [Op.in]: ids }
    }
  });
  
  return true;
};

/**
 * Xóa tất cả danh mục
 */
export const removeAll = async () => {
  // Check for products referencing any category
  const productCount = await Product.count({
    where: { category_id: { [Op.ne]: null } }
  });
  if (productCount > 0) {
    throw new Error(`Không thể xóa tất cả: Có ${productCount} sản phẩm đang thuộc các danh mục. Hãy xóa hoặc gỡ danh mục khỏi sản phẩm trước.`);
  }

  await Category.destroy({
    where: {},
    truncate: true
  });
  return true;
};

/**
 * Lấy danh sách ID của tất cả danh mục con (đệ quy)
 */
export const getAllChildIds = async (parentId) => {
  const categories = await Category.findAll({ attributes: ['id', 'parent_id'] });
  
  const childIds = [];
  
  const findChildren = (pid) => {
    categories.forEach(cat => {
      if (parseInt(cat.parent_id) === parseInt(pid)) {
        childIds.push(cat.id);
        findChildren(cat.id); // Đệ quy
      }
    });
  };
  
  findChildren(parseInt(parentId));
  return childIds;
};
