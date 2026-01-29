import ShippingService from '../services/shipping.service.js';

// ============ PUBLIC ENDPOINTS ============

/**
 * Lấy danh sách khu vực vận chuyển (public)
 */
export const getShippingZones = async (req, res) => {
  try {
    const zones = await ShippingService.getAllZones();
    res.json({
      status: true,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * Tính phí ship
 * Body: { province, district, order_total }
 */
export const calculateShipping = async (req, res) => {
  try {
    const { province, district, order_total } = req.body;

    if (!province) {
      return res.status(400).json({
        status: false,
        message: 'Vui lòng cung cấp tỉnh/thành phố'
      });
    }

    const result = await ShippingService.calculateShippingFee(
      province,
      district,
      Number(order_total) || 0
    );

    res.json({
      status: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// ============ ADMIN ENDPOINTS ============

/**
 * Admin: Lấy tất cả khu vực (bao gồm inactive)
 */
export const adminGetAllZones = async (req, res) => {
  try {
    const zones = await ShippingService.getAllZonesAdmin();
    res.json({
      status: true,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * Admin: Lấy khu vực theo ID
 */
export const adminGetZoneById = async (req, res) => {
  try {
    const zone = await ShippingService.getZoneById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy khu vực'
      });
    }
    res.json({
      status: true,
      data: zone
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * Admin: Tạo khu vực mới
 */
export const adminCreateZone = async (req, res) => {
  try {
    const { name, provinces, districts, shipping_fee, free_shipping_threshold, priority, estimated_days, is_active } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: 'Tên khu vực là bắt buộc'
      });
    }

    const zone = await ShippingService.createZone({
      name,
      provinces: provinces || [],
      districts: districts || [],
      shipping_fee: shipping_fee || 30000,
      free_shipping_threshold: free_shipping_threshold || 300000,
      priority: priority || 0,
      estimated_days: estimated_days || '2-3 ngày',
      is_active: is_active !== false
    });

    res.status(201).json({
      status: true,
      message: 'Tạo khu vực thành công',
      data: zone
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * Admin: Cập nhật khu vực
 */
export const adminUpdateZone = async (req, res) => {
  try {
    const zone = await ShippingService.updateZone(req.params.id, req.body);
    
    if (!zone) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy khu vực'
      });
    }

    res.json({
      status: true,
      message: 'Cập nhật thành công',
      data: zone
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

/**
 * Admin: Xóa khu vực
 */
export const adminDeleteZone = async (req, res) => {
  try {
    const success = await ShippingService.deleteZone(req.params.id);
    
    if (!success) {
      return res.status(404).json({
        status: false,
        message: 'Không tìm thấy khu vực'
      });
    }

    res.json({
      status: true,
      message: 'Xóa thành công'
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
