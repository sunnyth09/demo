import { ShippingZone } from '../models/sequelize/index.js';
import { Op } from 'sequelize';

class ShippingService {
  /**
   * Lấy tất cả khu vực vận chuyển
   */
  async getAllZones() {
    return await ShippingZone.findAll({
      where: { is_active: true },
      order: [['priority', 'DESC'], ['shipping_fee', 'ASC']]
    });
  }

  /**
   * Lấy tất cả khu vực (bao gồm inactive) - cho admin
   */
  async getAllZonesAdmin() {
    return await ShippingZone.findAll({
      order: [['priority', 'DESC'], ['name', 'ASC']]
    });
  }

  /**
   * Lấy khu vực theo ID
   */
  async getZoneById(id) {
    return await ShippingZone.findByPk(id);
  }

  /**
   * Tạo khu vực mới
   */
  async createZone(data) {
    return await ShippingZone.create(data);
  }

  /**
   * Cập nhật khu vực
   */
  async updateZone(id, data) {
    const zone = await ShippingZone.findByPk(id);
    if (!zone) return null;
    
    await zone.update(data);
    return zone;
  }

  /**
   * Xóa khu vực
   */
  async deleteZone(id) {
    const zone = await ShippingZone.findByPk(id);
    if (!zone) return false;
    
    await zone.destroy();
    return true;
  }

  /**
   * Tính phí ship dựa trên địa chỉ và tổng tiền đơn hàng
   * 
   * @param {string} province - Tỉnh/thành phố
   * @param {string} district - Quận/huyện (optional)
   * @param {number} orderTotal - Tổng tiền đơn hàng
   * @returns {object} { shipping_fee, is_free, zone_name, estimated_days }
   */
  async calculateShippingFee(province, district, orderTotal = 0) {
    // Chuẩn hóa input
    const normalizedProvince = this.normalizeLocation(province);
    const normalizedDistrict = district ? this.normalizeLocation(district) : null;

    // Tìm khu vực phù hợp (ưu tiên theo priority DESC)
    const zones = await ShippingZone.findAll({
      where: { is_active: true },
      order: [['priority', 'DESC']]
    });

    let matchedZone = null;

    for (const zone of zones) {
      // Check district match first (higher priority)
      if (normalizedDistrict && zone.districts) {
        const districts = Array.isArray(zone.districts) ? zone.districts : [];
        const normalizedZoneDistricts = districts.map(d => this.normalizeLocation(d));
        if (normalizedZoneDistricts.some(d => normalizedDistrict.includes(d) || d.includes(normalizedDistrict))) {
          matchedZone = zone;
          break;
        }
      }

      // Check province match
      if (zone.provinces) {
        const provinces = Array.isArray(zone.provinces) ? zone.provinces : [];
        const normalizedZoneProvinces = provinces.map(p => this.normalizeLocation(p));
        if (normalizedZoneProvinces.some(p => normalizedProvince.includes(p) || p.includes(normalizedProvince))) {
          matchedZone = zone;
          break;
        }
      }
    }

    // Nếu không match, dùng zone mặc định (priority thấp nhất hoặc "Các tỉnh khác")
    if (!matchedZone) {
      matchedZone = zones.find(z => 
        z.name.toLowerCase().includes('khác') || 
        z.name.toLowerCase().includes('other')
      ) || zones[zones.length - 1];
    }

    if (!matchedZone) {
      // Fallback nếu không có zone nào
      return {
        shipping_fee: 35000,
        is_free: false,
        zone_name: 'Mặc định',
        estimated_days: '3-5 ngày'
      };
    }

    // Kiểm tra miễn phí ship
    const threshold = matchedZone.free_shipping_threshold || 0;
    const isFree = threshold > 0 && orderTotal >= threshold;

    return {
      shipping_fee: isFree ? 0 : matchedZone.shipping_fee,
      original_fee: matchedZone.shipping_fee,
      is_free: isFree,
      free_threshold: threshold,
      zone_name: matchedZone.name,
      zone_id: matchedZone.id,
      estimated_days: matchedZone.estimated_days
    };
  }

  /**
   * Chuẩn hóa tên địa điểm (bỏ dấu, lowercase)
   */
  normalizeLocation(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }
}

export default new ShippingService();
