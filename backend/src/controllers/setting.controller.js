
import { Setting } from '../models/sequelize/index.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    
    // Convert array of settings to key-value object
    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    res.json({
      status: true,
      message: "Lấy cấu hình thành công",
      data: settingsMap
    });
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi lấy cấu hình"
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // Expect key-value object
    
    // Process each key in the body
    const promises = Object.keys(updates).map(async (key) => {
        const value = updates[key];
        
        const [setting, created] = await Setting.findOrCreate({
            where: { key },
            defaults: { value }
        });

        if (!created) {
            setting.value = value;
            return setting.save();
        }
        return setting;
    });

    await Promise.all(promises);

    res.json({
      status: true,
      message: "Cập nhật cấu hình thành công"
    });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi cập nhật cấu hình"
    });
  }
};
