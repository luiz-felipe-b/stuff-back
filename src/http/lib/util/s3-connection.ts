import { S3Client, ListObjectsV2Command, ListObjectsV2CommandInput, PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../../../env";

// Configure com suas credenciais do Supabase Storage S3
export const supabaseS3Client = new S3Client({
  forcePathStyle: true,
  region: "sa-east-1", // ajuste para a região do seu projeto
  endpoint: "https://gjmocpoedcoiaxpsnavp.storage.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: env.SUPABASE_S3_ACCESS_KEY_ID!,
    secretAccessKey: env.SUPABASE_S3_SECRET_ACCESS_KEY!,
  },
});

export async function listSupabaseS3Objects(bucket: string, prefix?: string) {
  const input: ListObjectsV2CommandInput = {
    Bucket: bucket,
    Prefix: prefix,
  };
  const command = new ListObjectsV2Command(input);
  const response = await supabaseS3Client.send(command);
  return response.Contents || [];
}

/**
 * Upload a file buffer to Supabase S3 and return the public URL
 */
export async function uploadSupabaseS3Object(bucket: string, key: string, buffer: Buffer, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read',
  });
  await supabaseS3Client.send(command);
  // Construct public URL (adjust if your Supabase S3 public URL differs)
  return `https://gjmocpoedcoiaxpsnavp.storage.supabase.co/storage/v1/object/public/${bucket}/${key}`;
}

/**
 * Delete an object from Supabase S3 bucket
 * @param bucket Nome do bucket
 * @param key Caminho/arquivo
 */
export async function deleteSupabaseS3Object(bucket: string, key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await supabaseS3Client.send(command);
}
