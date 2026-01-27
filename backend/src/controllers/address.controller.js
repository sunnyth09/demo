import * as AddressService from "../services/address.service.js";

export const getMyAddresses = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware auth
    const addresses = await AddressService.getMyAddresses(userId);
    res.status(200).json({
      status: true,
      data: addresses
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const address = await AddressService.createAddress(userId, req.body);
    res.status(201).json({
      status: true,
      message: "Thêm địa chỉ thành công",
      data: address
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const address = await AddressService.updateAddress(userId, id, req.body);
    res.status(200).json({
      status: true,
      message: "Cập nhật địa chỉ thành công",
      data: address
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await AddressService.deleteAddress(userId, id);
    res.status(200).json({
      status: true,
      message: "Xóa địa chỉ thành công"
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};
