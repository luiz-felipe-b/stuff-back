import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { supabaseS3Client } from "./s3-connection";

/**
 * Gera uma presigned URL para upload no Supabase S3
 * @param bucket Nome do bucket
 * @param key Caminho/arquivo
 * @param expiresIn Segundos de validade da URL (default: 900 = 15min)
 */
export async function generatePresignedUploadUrl(bucket: string, key: string, expiresIn = 900): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    // ContentType pode ser passado pelo cliente no upload
  });
  return getSignedUrl(supabaseS3Client, command, { expiresIn });
}

/**
 * Gera uma presigned URL para download no Supabase S3
 * @param bucket Nome do bucket
 * @param key Caminho/arquivo
 * @param expiresIn Segundos de validade da URL (default: 900 = 15min)
 */
export async function generatePresignedDownloadUrl(bucket: string, key: string, expiresIn = 900): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(supabaseS3Client, command, { expiresIn });
}
