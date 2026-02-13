import { Cart, CartItem, Product, Category } from "../models/sequelize/index.js";

// Helper to get cart with items
const getCartWithItems = async (userId) => {
  let cart = await Cart.findOne({
    where: { user_id: userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'thumbnail', 'slug', 'category_id', 'quantity'],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            ]
          }
        ]
      }
    ]
  });

  if (!cart) {
    cart = await Cart.create({ user_id: userId });
    cart.setDataValue('items', []); // Initialize empty items
  }

  return cart;
};

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await getCartWithItems(req.user.id);
    
    // Format response to match frontend expectation
    const items = cart.items ? cart.items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      thumbnail: item.product.thumbnail,
      slug: item.product.slug,
      category: item.product.category ? item.product.category.name : '',
      quantity: item.quantity,
      stock: item.product.quantity, // Add stock info
      selected: true // Default selected on load, or we could add 'selected' field to DB if needed
    })) : [];

    res.status(200).json({ 
        status: "OK",
        data: items 
    });
  } catch (error) {
    console.error("Result getCart error:", error);
    res.status(500).json({ message: "Lỗi lấy giỏ hàng" });
  }
};

// POST /api/cart/add
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
        }

        let cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }

        const existingItem = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                product_id: productId
            }
        });

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const newTotal = currentQuantity + quantity;

        if (newTotal > product.quantity) {
             return res.status(400).json({ message: `Số lượng vượt quá tồn kho (còn ${product.quantity})` });
        }

        if (existingItem) {
            existingItem.quantity = newTotal;
            await existingItem.save();
        } else {
            await CartItem.create({
                cart_id: cart.id,
                product_id: productId,
                quantity: quantity
            });
        }

        // Return updated cart
        const updatedCart = await getCartWithItems(userId);
        const items = updatedCart.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            thumbnail: item.product.thumbnail,
            slug: item.product.slug,
            category: item.product.category ? item.product.category.name : '',
            quantity: item.quantity,
            stock: item.product.quantity, // Add stock info
            selected: true
        }));

        res.status(200).json({
            status: "OK",
            message: "Đã thêm vào giỏ hàng",
            data: items
        });

    } catch (error) {
        console.error("Result addToCart error:", error);
        res.status(500).json({ message: "Lỗi thêm vào giỏ hàng" });
    }
};

// PUT /api/cart/update
export const updateItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        const item = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                product_id: productId
            }
        });

        if (item) {
            if (quantity > 0) {
                // Optional: Check stock here too for strict backend validation
                const product = await Product.findByPk(productId);
                if (product && quantity > product.quantity) {
                    return res.status(400).json({ message: `Số lượng vượt quá tồn kho (còn ${product.quantity})` });
                }

                item.quantity = quantity;
                await item.save();
            } else {
                await item.destroy();
            }
        }

        res.status(200).json({ status: "OK", message: "Cập nhật giỏ hàng thành công" });
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(500).json({ message: "Lỗi cập nhật giỏ hàng" });
    }
};

// DELETE /api/cart/remove
export const removeItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body; // Can accept via body or query/param

        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (cart) {
            await CartItem.destroy({
                where: {
                    cart_id: cart.id,
                    product_id: productId
                }
            });
        }
        res.status(200).json({ status: "OK", message: "Đã xóa sản phẩm khỏi giỏ" });

    } catch (error) {
        console.error("Remove item error:", error);
        res.status(500).json({ message: "Lỗi xóa sản phẩm" });
    }
};

// DELETE /api/cart/clear
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ where: { user_id: userId } });
        if (cart) {
            await CartItem.destroy({ where: { cart_id: cart.id } });
        }
        res.status(200).json({ status: "OK", message: "Đã xóa giỏ hàng" });
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(500).json({ message: "Lỗi xóa giỏ hàng" });
    }
};

// POST /api/cart/sync
export const syncCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body; // Expecting array of { id, quantity }

        let cart = await Cart.findOne({ where: { user_id: userId } });
        if (!cart) {
            cart = await Cart.create({ user_id: userId });
        }

        if (items && Array.isArray(items) && items.length > 0) {
            for (const localItem of items) {
                const existingItem = await CartItem.findOne({
                    where: {
                        cart_id: cart.id,
                        product_id: localItem.id
                    }
                });

                if (existingItem) {
                    existingItem.quantity += localItem.quantity;
                    await existingItem.save();
                } else {
                    await CartItem.create({
                        cart_id: cart.id,
                        product_id: localItem.id,
                        quantity: localItem.quantity
                    });
                }
            }
        }

        // Return updated cart
        const updatedCart = await getCartWithItems(userId);
        const formattedItems = updatedCart.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            thumbnail: item.product.thumbnail,
            slug: item.product.slug,
            category: item.product.category ? item.product.category.name : '',
            quantity: item.quantity,
            stock: item.product.quantity, // Add stock info
            selected: true
        }));

        res.status(200).json({
            status: "OK",
            message: "Đồng bộ giỏ hàng thành công",
            data: formattedItems
        });

    } catch (error) {
        console.error("Sync cart error:", error);
        res.status(500).json({ message: "Lỗi đồng bộ giỏ hàng" });
    }
};
