import * as Minio from "minio";

export const minioClient = new Minio.Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});


const BUCKET = "categories";

// đảm bảo bucket tồn tại
export const initBucket = async () => {
  const exists = await minioClient.bucketExists(BUCKET);
  if (!exists) {
    await minioClient.makeBucket(BUCKET);
  }
};

// upload file lên minio
export const uploadFile = async (file) => {
  await minioClient.putObject(
    BUCKET,
    file.originalname,
    file.buffer
  );

  return `http://localhost:9000/${BUCKET}/${file.originalname}`;
};

// xóa file trên minio
export const deleteFile = async (filename) => {
  await minioClient.removeObject(BUCKET, filename);
};
