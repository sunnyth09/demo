# Backend Compose Project

Một ứng dụng web full-stack hiện đại được xây dựng với Vue 3 (Frontend) và Node.js/Express (Backend), được đóng gói và quản lý bằng Docker.

## 🚀 Giới Thiệu Về Dự Án

Dự án này mô phỏng một hệ thống thương mại điện tử hoặc quản lý hiện đại với kiến trúc frontend và backend tách biệt. Hệ thống tích hợp các dịch vụ mạnh mẽ để quản lý cơ sở dữ liệu (MySQL) và lưu trữ tệp (MinIO), tất cả được điều phối thông qua Docker Compose giúp việc triển khai và phát triển trở nên dễ dàng.

## 🛠️ Công Nghệ Sử Dụng

### Frontend

- **Framework:** [Vue 3](https://vuejs.org/)
- **Công cụ Build:** [Vite](https://vitejs.dev/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Quản lý trạng thái:** [Pinia](https://pinia.vuejs.org/)
- **Routing:** [Vue Router](https://router.vuejs.org/)
- **UI Components:** ReKa UI, Lucide Icons
- **HTTP Client:** Axios
- **Biểu đồ/Visualization:** Unovis

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Cơ sở dữ liệu:** MySQL
- **Xác thực:** JWT (JSON Web Tokens)
- **Lưu trữ tệp:** MinIO (Tương thích S3)

### Hạ Tầng

- **Containerization:** Docker & Docker Compose
- **Logs:** Dozzle
- **Lưu trữ:** MinIO

## 📋 Yêu Cầu Tiên Quyết

Đảm bảo máy của bạn đã cài đặt các phần mềm sau:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (Tùy chọn, cho việc chạy local không dùng docker)

## 📦 Cài Đặt & Thiết Lập

1. **Clone repository**

   ```bash
   git clone https://github.com/sunnyth09/demo.git
   cd backend-compose
   ```

2. **Biến Môi Trường**
   Copy file `.env.example` thành file `.env` (nếu chưa có) và cấu hình các biến cần thiết.

   ```bash
   cp .env.example .env
   ```

3. **Khởi chạy với Docker (Khuyên dùng)**
   Lệnh này sẽ khởi động toàn bộ Frontend, Backend, MySQL, MinIO, và Dozzle.
   ```bash
   docker-compose up -d --build
   ```

## 🔌 Các Cổng Truy Cập

Sau khi các container đã chạy, bạn có thể truy cập các dịch vụ tại các địa chỉ sau:

| Dịch vụ           | URL                   | Mô tả                                     |
| :---------------- | :-------------------- | :---------------------------------------- |
| **Frontend**      | http://localhost:3001 | Ứng dụng Web chính (Giao diện người dùng) |
| **Backend API**   | http://localhost:3000 | API Server                                |
| **MinIO Console** | http://localhost:9001 | Trang quản lý lưu trữ (Object Storage)    |
| **Dozzle**        | http://localhost:9999 | Xem Logs thời gian thực                   |
| **MySQL**         | `localhost:3309`      | Kết nối Cơ sở dữ liệu                     |

## 💻 Chạy Cục Bộ (Không Dùng Docker)

Nếu bạn muốn chạy từng dịch vụ riêng lẻ mà không dùng Docker:

### Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy server (Đảm bảo MySQL và MinIO đang chạy local hoặc cập nhật file .env):
   ```bash
   npm run dev
   ```

### Frontend

1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển:
   ```bash
   npm run dev
   ```

## 🐳 Tổng Quan Các Dịch Vụ Docker

- **backend**: Node.js API server.
- **frontend**: Vue.js development server.
- **mysql**: Cơ sở dữ liệu quan hệ (Port host 3309 trỏ vào 3306 container).
- **minio**: Lưu trữ đối tượng tương thích S3 dùng cho upload file/ảnh.
- **dozzle**: Công cụ xem log container trực quan trên web.

## 🤝 Đóng Góp

1. Fork dự án
2. Tạo Feature Branch (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi của bạn (`git commit -m 'Thêm tính năng mới'`)
4. Push lên Branch (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request
