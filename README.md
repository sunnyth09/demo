# Backend Compose Project

Một ứng dụng web full-stack hiện đại được xây dựng với Vue 3 (Frontend) và Node.js/Express (Backend), được đóng gói và quản lý bằng Docker.

## 🚀 Giới Thiệu Về Dự Án

Dự án này mô phỏng một hệ thống thương mại điện tử hoặc quản lý hiện đại với kiến trúc frontend và backend tách biệt. Hệ thống tích hợp các dịch vụ mạnh mẽ để quản lý cơ sở dữ liệu (MySQL) và lưu trữ tệp (MinIO), tất cả được điều phối thông qua Docker Compose giúp việc triển khai và phát triển trở nên dễ dàng.

## 📁 Cấu Trúc Dự Án (Folder Structure)

Dự án được ứng dụng mô hình monorepo đơn giản chia thành 2 service chính:

```text
.
├── backend/            # Chứa mã nguồn API Server (Node.js & Express)
│   ├── src/
│   │   ├── controllers/ # Chứa logic xử lý endpoints
│   │   ├── models/      # Định nghĩa Schema Database (Sequelize ORM)
│   │   ├── routes/      # Định nghĩa Routing API
│   │   ├── services/    # Các service cho payment, email, product, logic,...
│   │   └── utils/       # Helpers và middlewares
│   ├── Dockerfile
│   └── package.json
├── frontend/           # Chứa mã nguồn giao diện Web (Vue 3 & Vite)
│   ├── src/
│   │   ├── components/  # Chứa các component tái sử dụng (UI, Table, Form)
│   │   ├── stores/      # Quản lý Global State (Pinia)
│   │   └── views/       # Các màn hình chính (Pages/Admin Pages)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml  # File cấu hình điều phối các Docker Containers
├── .env.example        # File mẫu chứa các biến môi trường
└── README.md           # Tài liệu hướng dẫn sử dụng (You are here)
```

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

- **Runtime:** [Node.js](https://nodejs.org/) (Khuyến nghị v18.x trở lên)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Sequelize](https://sequelize.org/)
- **Cơ sở dữ liệu:** MySQL (v8.0)
- **Xác thực:** JWT (JSON Web Tokens)
- **Lưu trữ tệp:** MinIO (Tương thích S3 API)

### Hạ Tầng

- **Containerization:** Docker & Docker Compose
- **Logs:** Dozzle
- **Lưu trữ:** MinIO

## 📋 Yêu Cầu Tiên Quyết

Đảm bảo máy của bạn đã cài đặt các phần mềm sau:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js v18+](https://nodejs.org/) (Tùy chọn, cho việc chạy local không dùng docker)

## 📦 Cài Đặt & Thiết Lập

### Bước 1: Clone Repository

```bash
git clone https://github.com/sunnyth09/demo.git
cd backend-compose
```

### Bước 2: Thiết lập Biến Môi Trường (Environment Variables)

Copy file `.env.example` thành file `.env` và cập nhật các thông tin bảo mật. Dự án sẽ không chạy nếu thiếu file này.

```bash
cp .env.example .env
```

**Các thông số quan trọng cần lưu ý cấu hình trong file `.env`:**

- `DB_PASS`: Mật khẩu của database MySQL (khớp với docker-compose).
- `JWT_SECRET`: Cấu hình chuỗi bí mật bất kỳ để tạo JWT token (VD: `3ab21e8d...`).
- `MINIO_ROOT_USER` & `MINIO_ROOT_PASSWORD`: Thông tin đăng nhập vào trang quản trị Storage.
- `EMAIL_USER` & `EMAIL_PASS`: (Tùy chọn) Email và App Password (nếu dùng Gmail) để hệ thống gửi mail thông báo/OTP.
- `VNP_TMN_CODE` & `VNP_HASH_SECRET`: (Tùy chọn) Cần thiết để test cổng thanh toán VNPay.
- `GOOGLE_CLIENT_ID` & `FACEBOOK_APP_ID`: (Tùy chọn) Sử dụng cho chức năng Social Login.

### Bước 3: Khởi chạy hệ thống bằng Docker Compose

Lệnh này sẽ tải images, build mã nguồn và khởi động toàn bộ Frontend, Backend, MySQL, MinIO, và Dozzle lên cùng lúc trong nền (detached mode).

```bash
docker-compose up -d --build
```

**Khởi tạo Cơ sở dữ liệu và Dữ liệu mẫu (Migration/Seeding):**

- Dự án sử dụng Sequelize nên cấu trúc bảng (Tables) sẽ tự động tạo/cập nhật (`sync: alter`) khi backend khởi động thành công.
- Nếu bạn cần tạo dữ liệu mẫu (như danh mục, quyền admin), hãy chạy lệnh seeder bên trong container của backend:
  ```bash
  docker exec -it backend npm run db:seed
  ```

## 🔌 Các Cổng Truy Cập Dịch Vụ

Sau khi các container báo trạng thái `Up`, bạn có thể truy cập các thành phần hệ thống tại các địa chỉ sau:

| Dịch vụ           | URL                   | Mô tả                                           |
| :---------------- | :-------------------- | :---------------------------------------------- |
| **Frontend**      | http://localhost:3001 | Ứng dụng Web chính (Giao diện người dùng)       |
| **Backend API**   | http://localhost:3000 | API Server phục vụ Frontend/Mobile              |
| **MinIO Console** | http://localhost:9001 | Trang quản lý lưu trữ File/Ảnh upload           |
| **Dozzle**        | http://localhost:9999 | Giao diện Web xem Terminal Logs trực quan       |
| **MySQL**         | `localhost:3309`      | Cổng kết nối Cơ sở dữ liệu cho DataGrip/DBeaver |

---

## 📜 Các Lệnh Hữu Ích Thường Dùng

Khi phát triển dự án với Docker Compose, dước đây là các lệnh bạn thường xuyên làm việc:

```bash
# Xem log hệ thống thời gian thực của backend
docker-compose logs -f backend

# Khởi động lại duy nhất service backend khi có thay đổi (nếu không dùng hot-reload)
docker-compose restart backend

# Build lại một service cụ thể sau khi thêm thư viện (npm install)
docker-compose up -d --build frontend

# Truy cập vào terminal bash của service
docker exec -it backend bash

# Dừng hệ thống và XÓA TOÀN BỘ dữ liệu Data/Volume (Hãy cẩn thận!)
docker-compose down -v
```

---

## 💻 Chạy Cục Bộ (Không Dùng Docker)

Nếu bạn chỉ muốn dùng Docker cho DB/MinIO và muốn chạy code trên Local cho tiện debug:

1. Đảm bảo MySQL và MinIO đang chạy (Dùng file compose mới hoặc bản có sẵn) và trỏ `DB_HOST`/`MINIO_ENDPOINT` trong `.env` về `localhost`.
2. Mở 2 terminal tại `backend` và `frontend`.
3. Lần lượt chạy:
   ```bash
   npm install
   npm run dev
   ```

## 🤝 Hướng Dẫn Đóng Góp

1. Fork dự án
2. Tạo Feature Branch (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi của bạn (`git commit -m 'Thêm tính năng mới'`)
4. Push lên Branch (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request
