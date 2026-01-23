# Hướng dẫn sử dụng Sequelize ORM

## 📋 Tổng quan

Project đã được chuyển đổi từ **SQL thuần** sang **Sequelize ORM** để:

- Khai báo trường rõ ràng với DataTypes
- Tự động sync schema khi khởi động
- Validation dữ liệu tích hợp
- Quan hệ giữa các bảng được định nghĩa rõ ràng

## 📁 Cấu trúc mới

```
src/
├── config/
│   ├── db.js                 # Kết nối MySQL cũ (giữ lại nếu cần)
│   └── sequelize.js          # ⭐ Cấu hình Sequelize mới
│
├── models/
│   └── sequelize/            # ⭐ Thư mục chứa Sequelize models
│       ├── index.js          # Export tất cả models + syncDatabase()
│       ├── Category.js       # Model Category
│       ├── Product.js        # Model Product
│       └── User.js           # Model User
│
├── services/                 # ⭐ Đã cập nhật sử dụng Sequelize
│   ├── category.service.js
│   ├── product.service.js
│   ├── user.service.js
│   └── auth.service.js
│
└── index.js                  # ⭐ Khởi động với testConnection + syncDatabase
```

## 🔧 Cách thêm/sửa trường trong Model

### Ví dụ: Thêm trường `color` vào Product

1. **Mở file model**: `src/models/sequelize/Product.js`

2. **Thêm trường mới**:

```javascript
const Product = sequelize.define(
  "Product",
  {
    // ... các trường hiện tại ...

    // ⭐ Thêm trường mới
    color: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Màu sắc sản phẩm",
    },
  },
  {
    tableName: "products",
    timestamps: false,
  },
);
```

3. **Build lại Docker**:

```bash
docker compose up -d --build backend
```

**Hoặc** nếu đang dùng volume mount:

```bash
docker exec backend npm install
# Sequelize sẽ tự động detect thay đổi và sync
```

## 📝 Các DataTypes phổ biến

| DataType        | Mô tả                  | Ví dụ                                   |
| --------------- | ---------------------- | --------------------------------------- |
| `STRING(255)`   | Chuỗi có độ dài tối đa | `name: DataTypes.STRING(255)`           |
| `TEXT`          | Văn bản dài            | `description: DataTypes.TEXT`           |
| `INTEGER`       | Số nguyên              | `quantity: DataTypes.INTEGER`           |
| `DECIMAL(15,2)` | Số thập phân           | `price: DataTypes.DECIMAL(15,2)`        |
| `BOOLEAN`       | True/False             | `status: DataTypes.BOOLEAN`             |
| `DATE`          | Ngày giờ               | `created_at: DataTypes.DATE`            |
| `ENUM`          | Danh sách giá trị      | `role: DataTypes.ENUM('user', 'admin')` |
| `JSON`          | Dữ liệu JSON           | `metadata: DataTypes.JSON`              |

## ⚙️ Cấu hình sync Database

Trong `src/models/sequelize/index.js`:

```javascript
// Sync với alter: true - CẬP NHẬT schema mà KHÔNG mất dữ liệu
await syncDatabase({ alter: true });

// Sync với force: true - XÓA bảng cũ và tạo lại (MẤT DỮ LIỆU!)
await syncDatabase({ force: true });
```

## 🔗 Quan hệ giữa các bảng

```javascript
// Product thuộc về Category (Many-to-One)
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Category có nhiều Product (One-to-Many)
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });

// Category tự tham chiếu (cho danh mục đa cấp)
Category.belongsTo(Category, { as: "parent", foreignKey: "parent_id" });
Category.hasMany(Category, { as: "children", foreignKey: "parent_id" });
```

## 🚀 Workflow khi thay đổi Model

1. **Sửa file model** trong `src/models/sequelize/`
2. **Build lại Docker**: `docker compose up -d --build backend`
3. **Hoàn tất!** Sequelize tự động cập nhật schema

## 📌 Lưu ý quan trọng

1. **Development**: Dùng `alter: true` để tự động sync
2. **Production**: Nên dùng **Migrations** thay vì sync để kiểm soát tốt hơn
3. **Backup**: Luôn backup database trước khi thay đổi lớn
4. **Xóa cột**: Sequelize sync **KHÔNG** tự động xóa cột cũ để bảo vệ dữ liệu
