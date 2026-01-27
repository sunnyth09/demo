import { Address } from "../models/sequelize/index.js";

/**
 * Lấy danh sách địa chỉ của user
 */
export const getMyAddresses = async (userId) => {
  return await Address.findAll({
    where: { user_id: userId },
    order: [['is_default', 'DESC'], ['createdAt', 'DESC']]
  });
};

/**
 * Tạo địa chỉ mới (Giới hạn 5 địa chỉ)
 */
export const createAddress = async (userId, data) => {
  // 1. Kiểm tra số lượng địa chỉ hiện tại
  const count = await Address.count({ where: { user_id: userId } });
  
  if (count >= 5) {
    throw new Error("Bạn chỉ có thể thêm tối đa 5 địa chỉ");
  }

  // 2. Nếu đây là địa chỉ đầu tiên, set default = true
  let isDefault = data.is_default || false;
  if (count === 0) {
    isDefault = true;
  }

  // 3. Nếu set default = true, bỏ default của các địa chỉ khác
  if (isDefault && count > 0) {
    await Address.update({ is_default: false }, { where: { user_id: userId } });
  }

  // 4. Tạo địa chỉ
  const address = await Address.create({
    user_id: userId,
    name: data.name,
    phone: data.phone,
    city: data.city,
    district: data.district,
    ward: data.ward,
    street: data.street,
    is_default: isDefault
  });

  return address;
};

/**
 * Cập nhật địa chỉ
 */
export const updateAddress = async (userId, addressId, data) => {
  const address = await Address.findOne({
    where: { id: addressId, user_id: userId }
  });

  if (!address) {
    throw new Error("Địa chỉ không tồn tại");
  }

  // Nếu set default = true, cập nhật các địa chỉ khác
  if (data.is_default && !address.is_default) {
    await Address.update({ is_default: false }, { where: { user_id: userId } });
  }

  await address.update(data);
  return address;
};

/**
 * Xóa địa chỉ
 */
export const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOne({
    where: { id: addressId, user_id: userId }
  });

  if (!address) {
    throw new Error("Địa chỉ không tồn tại");
  }

  await address.destroy();
  return true;
};
