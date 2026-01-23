import app from "./app.js";
import { testConnection } from "./config/sequelize.js";
import { syncDatabase } from "./models/sequelize/index.js";

const PORT = process.env.PORT || 3000;

// Khởi động server
const startServer = async () => {
  try {
    // Test kết nối database
    await testConnection();
    
    // Sync database (tự động cập nhật schema khi model thay đổi)
    // Lưu ý: Chỉ sync trong development. Production nên dùng migrations
    await syncDatabase({ alter: true });
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error);
    process.exit(1);
  }
};

startServer();
