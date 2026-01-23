import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: "minio",
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

  // Trả về URL public
  return `http://localhost:9000/${BUCKET}/${filename}`;
};

// Xóa file trên MinIO
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  // Lấy filename từ URL
  const filename = fileUrl.split(`/${BUCKET}/`)[1];
  if (filename) {
    await minioClient.removeObject(BUCKET, filename);
  }
};
