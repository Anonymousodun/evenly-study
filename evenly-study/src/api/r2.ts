import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import * as SecureStore from 'expo-secure-store';

// Cloudflare R2 credentials live in the OS keychain only. They are never
// sent to the Evenly Study server, never logged, and never leave the phone
// except in direct calls to the user's own R2 endpoint.
const EP_KEY = 'evenly_r2_endpoint';
const BUCKET_KEY = 'evenly_r2_bucket';
const KEY_ID_KEY = 'evenly_r2_key_id';
const SECRET_KEY = 'evenly_r2_secret';

export interface R2Config {
  endpoint: string;
  bucket: string;
  keyId: string;
  secret: string;
}

export async function saveR2Config(cfg: R2Config): Promise<void> {
  await SecureStore.setItemAsync(EP_KEY, cfg.endpoint);
  await SecureStore.setItemAsync(BUCKET_KEY, cfg.bucket);
  await SecureStore.setItemAsync(KEY_ID_KEY, cfg.keyId);
  await SecureStore.setItemAsync(SECRET_KEY, cfg.secret);
}

export async function loadR2Config(): Promise<R2Config | null> {
  try {
    const [endpoint, bucket, keyId, secret] = await Promise.all([
      SecureStore.getItemAsync(EP_KEY),
      SecureStore.getItemAsync(BUCKET_KEY),
      SecureStore.getItemAsync(KEY_ID_KEY),
      SecureStore.getItemAsync(SECRET_KEY),
    ]);
    if (!endpoint || !bucket || !keyId || !secret) return null;
    return { endpoint, bucket, keyId, secret };
  } catch {
    return null;
  }
}

export async function clearR2Config(): Promise<void> {
  for (const k of [EP_KEY, BUCKET_KEY, KEY_ID_KEY, SECRET_KEY]) {
    try {
      await SecureStore.deleteItemAsync(k);
    } catch {
      // Already gone.
    }
  }
}

function clientFor(cfg: R2Config): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: cfg.endpoint,
    credentials: { accessKeyId: cfg.keyId, secretAccessKey: cfg.secret },
  });
}

export function backupFileKey(userId: string): string {
  return `evenly-backup-${userId}.json`;
}

export async function uploadBackup(cfg: R2Config, key: string, json: string): Promise<void> {
  const client = clientFor(cfg);
  await client.send(
    new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: json, ContentType: 'application/json' })
  );
}

export async function downloadBackup(cfg: R2Config, key: string): Promise<string> {
  const client = clientFor(cfg);
  const out = await client.send(new GetObjectCommand({ Bucket: cfg.bucket, Key: key }));
  const body = out.Body as any;
  if (body && typeof body.transformToString === 'function') {
    return await body.transformToString();
  }
  throw new Error('Could not read the backup file.');
}
