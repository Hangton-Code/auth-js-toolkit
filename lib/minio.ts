import { Client } from "minio";

export const minioClient = new Client({
  endPoint: process.env.MINIO_END_POINT as string,
  port: Number(process.env.MINIO_PORT as string),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY as string,
  secretKey: process.env.MINIO_SECRET_KEY as string,
});
