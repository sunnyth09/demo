import * as FavoriteService from "../services/favorite.service.js";

export const toggle = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId } = req.body;
    
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const result = await FavoriteService.toggleFavorite(userId, productId);
    res.status(200).json({
      status: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

export const list = async (req, res) => {
  try {
    const userId = req.user.id;
    const favorites = await FavoriteService.getFavorites(userId);
    res.status(200).json({
      status: true,
      data: favorites
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};
