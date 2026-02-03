
import { Review, User, Product, ReviewReport } from "../models/sequelize/index.js";

export const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!product_id || !rating) {
      return res.status(400).json({
        message: "Thiếu thông tin sản phẩm hoặc số sao đánh giá"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Đánh giá phải từ 1 đến 5 sao"
      });
    }

    // Check existing review
    const existingReview = await Review.findOne({
      where: {
        user_id,
        product_id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Bạn đã đánh giá sản phẩm này rồi"
      });
    }

    // Check product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại"
      });
    }

    // Create review
    const newReview = await Review.create({
      user_id,
      product_id,
      rating,
      comment
    });

    // Fetch full review data to return (including user info)
    const review = await Review.findByPk(newReview.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"]
        }
      ]
    });

    return res.status(201).json({
      message: "Đánh giá thành công",
      data: review
    });

  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      message: "Lỗi server khi tạo đánh giá"
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    // Check ownership
    if (review.user_id !== user_id) {
      return res.status(403).json({ message: "Bạn không có quyền sửa đánh giá này" });
    }

    review.rating = rating || review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    await review.save();

    return res.status(200).json({
      message: "Cập nhật đánh giá thành công",
      data: review
    });
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const user_role = req.user.role;

    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    // Allow owner or admin to delete
    if (review.user_id !== user_id && user_role !== 'admin') {
      return res.status(403).json({ message: "Bạn không có quyền xóa đánh giá này" });
    }

    await review.destroy();

    return res.status(200).json({ message: "Xóa đánh giá thành công" });
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const reportReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user_id = req.user.id;

    if (!reason) {
      return res.status(400).json({ message: "Vui lòng nhập lý do báo cáo" });
    }

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    if (review.user_id === user_id) {
      return res.status(400).json({ message: "Bạn không thể báo cáo đánh giá của chính mình" });
    }

    await ReviewReport.create({
      user_id,
      review_id: id,
      reason
    });

    return res.status(201).json({ message: "Đã gửi báo cáo vi phạm" });
  } catch (error) {
    console.error("Report review error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { 
        product_id: productId,
        is_hidden: false 
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      data: reviews
    });

  } catch (error) {
    console.error("Get product reviews error:", error);
    return res.status(500).json({
      message: "Lỗi server khi lấy đánh giá"
    });
  }
};

export const getAllReviewsAdmin = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"]
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "name"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.status(200).json({
      status: true,
      data: reviews
    });
  } catch (error) {
    console.error("Get admin reviews error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const toggleReviewVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    }

    review.is_hidden = !review.is_hidden;
    await review.save();

    return res.status(200).json({
      message: review.is_hidden ? "Đã ẩn đánh giá" : "Đã hiện đánh giá",
      data: review
    });
  } catch (error) {
    console.error("Toggle visibility error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
