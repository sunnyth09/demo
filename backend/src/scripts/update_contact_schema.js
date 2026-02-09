
import { sequelize } from '../config/sequelize.js';
import { QueryTypes } from 'sequelize';

const updateSchema = async () => {
  try {
    console.log(' Bắt đầu cập nhật schema...');
    
    // Kiểm tra cột reply_message
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM contacts LIKE 'reply_message';
    `, { type: QueryTypes.SELECT });

    if (!columns) {
      console.log(' Thêm cột reply_message...');
      await sequelize.query(`
        ALTER TABLE contacts 
        ADD COLUMN reply_message TEXT NULL COMMENT 'Nội dung phản hồi từ admin' AFTER status;
      `);
    } else {
      console.log(' Cột reply_message đã tồn tại.');
    }

    // Kiểm tra cột replied_at
    const [columns2] = await sequelize.query(`
      SHOW COLUMNS FROM contacts LIKE 'replied_at';
    `, { type: QueryTypes.SELECT });

    if (!columns2) {
      console.log(' Thêm cột replied_at...');
      await sequelize.query(`
        ALTER TABLE contacts 
        ADD COLUMN replied_at DATETIME NULL COMMENT 'Thời gian phản hồi' AFTER reply_message;
      `);
    } else {
      console.log(' Cột replied_at đã tồn tại.');
    }

    // Cập nhật giá trị enum cho status nếu cần (MySQL ENUM strict)
    // Lưu ý: Việc thay đổi ENUM trong MySQL phức tạp hơn, 
    // nhưng ở đây ta chỉ cần thêm giá trị mới nếu chưa có.
    // Cách an toàn nhất là thay đổi type column để update enum list.
    console.log(' Cập nhật ENUM status...');
    await sequelize.query(`
      ALTER TABLE contacts 
      MODIFY COLUMN status ENUM('pending', 'replied') DEFAULT 'pending' COMMENT 'Trạng thái: pending (chưa xử lý) hoặc replied (đã phản hồi)';
    `);

    console.log(' Cập nhật schema thành công!');
    process.exit(0);
  } catch (error) {
    console.error(' Lỗi cập nhật schema:', error);
    process.exit(1);
  }
};

updateSchema();
