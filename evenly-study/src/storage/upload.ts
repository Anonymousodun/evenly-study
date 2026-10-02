import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import r2 from './r2';

const BUCKET = process.env.R2_BUCKET || 'evenly-study';

export async function uploadFile(key: string, body: Uint8Array | string, contentType: string): Promise<string> {
  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));

  return `https://<account_id>.r2.cloudflarestorage.com/${BUCKET}/${key}`;
}

export async function getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(r2, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
}
