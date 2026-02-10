# Database Migrations

Hệ thống đã chuyển sang sử dụng Migrations để quản lý thay đổi database.

## Cách thêm cột mới vào DB

1. Chạy lệnh tạo migration:

   ```bash
   npm run migration:generate --name add-new-column-to-product
   ```

2. File migration mới sẽ được tạo trong `src/migrations/XXXXXXXXXXXXXX-add-new-column-to-product.js`. Mở file này và thêm code:

   ```javascript
   module.exports = {
     async up(queryInterface, Sequelize) {
       await queryInterface.addColumn("products", "new_column_name", {
         type: Sequelize.STRING,
         allowNull: true,
       });
     },

     async down(queryInterface, Sequelize) {
       await queryInterface.removeColumn("products", "new_column_name");
     },
   };
   ```

3. Chạy lệnh migrate để áp dụng thay đổi:
   ```bash
   npm run db:migrate
   ```

## Lưu ý

- Không dùng `sync({ alter: true })` nữa.
- Luôn tạo migration cho mọi thay đổi schema.
