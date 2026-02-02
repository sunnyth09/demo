import { Favorite, Product } from '../models/sequelize/index.js';

export const toggleFavorite = async (userId, productId) => {
  const existing = await Favorite.findOne({
    where: { userId, productId }
  });

  if (existing) {
    await existing.destroy();
    return { favorited: false, message: "Đã xóa khỏi danh sách yêu thích" };
  } else {
    await Favorite.create({ userId, productId });
    return { favorited: true, message: "Đã thêm vào danh sách yêu thích" };
  }
};

export const getFavorites = async (userId) => {
  return await Favorite.findAll({
    where: { userId },
    include: [
      {
        model: Product,
        as: 'product',
        // attributes: ['id', 'name', 'slug', 'price', 'thumbnail', 'description', 'status']
      }
    ],
    order: [['created_at', 'DESC']]
  });
};
