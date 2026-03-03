import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "minio",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

const BUCKET = "products";

// Đảm bảo bucket tồn tại và có policy public
export const initBucket = async () => {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
    // Đặt policy public để có thể truy cập ảnh từ bên ngoài
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET}/*`],
        },
      ],
    };
    await minioClient.setBucketPolicy(BUCKET, JSON.stringify(policy));
  }
};

// Upload file lên MinIO
export const uploadFile = async (file) => {
  // Tạo tên file unique với timestamp
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.originalname}`;

  await minioClient.putObject(BUCKET, filename, file.buffer, file.size, {
    "Content-Type": file.mimetype,
  });

  // Trả về tên file (Object Key) thay vì URL đầy đủ
  return filename;
};

// Lấy URL đầy đủ từ tên file
export const getFullUrl = (filename) => {
  if (!filename) return null;
  // Nếu filename đã là URL absolute cũ (với IP hardcoded), extract relative path
  if (filename.startsWith("http")) {
    // Ví dụ: http://192.168.10.6:3001/minio/products/image.webp -> /minio/products/image.webp
    try {
      const url = new URL(filename);
      return url.pathname; // Trả về relative path
    } catch (e) {
      return filename;
    }
  }
  
  const host = process.env.MINIO_PUBLIC_URL || "/minio";
  return `${host}/${BUCKET}/${filename}`;
};

// Xóa file trên MinIO
export const deleteFile = async (filename) => {
  if (!filename) return;
  
  try {
    // Nếu là URL bên ngoài (không chứa /minio) thì bỏ qua không xóa
    if (filename.startsWith("http") && !filename.includes("/minio")) {
      return;
    }

    // Tách lấy chính xác tên file (Object Key) ở cuối chuỗi
    let objectKey = filename;
    const url = new URL(filename, "http://localhost"); // Dummy base URL
    const parts = url.pathname.split('/');
    objectKey = parts[parts.length - 1];

    if (!objectKey) return;

    // Xóa file bằng object key
    await minioClient.removeObject(BUCKET, objectKey);
  } catch (error) {
    console.error("Lỗi xóa file khỏi MinIO:", error.message);
  }
};
