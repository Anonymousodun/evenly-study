import { query } from '../connection';
import { User } from '../../types';

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const result = await query(
    'INSERT INTO users (email, name, password_hash, target_bedtime) VALUES ($1, $2, $3, $4) RETURNING *',
    [user.email, user.name, user.password_hash, user.target_bedtime]
  );
  return result.rows[0];
}

export async function updateUser(user: User): Promise<User> {
  const result = await query(
    'UPDATE users SET name = $1, target_bedtime = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [user.name, user.target_bedtime, user.id]
  );
  return result.rows[0];
}
