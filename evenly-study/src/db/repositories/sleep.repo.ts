import { query } from '../connection';
import { SleepEntry } from '../../types';

export async function getSleepEntries(userId: string): Promise<SleepEntry[]> {
  const result = await query('SELECT * FROM sleep_entries WHERE user_id = $1 ORDER BY date DESC', [userId]);
  return result.rows;
}

export async function createSleepEntry(entry: Omit<SleepEntry, 'id' | 'created_at'>): Promise<SleepEntry> {
  const result = await query(
    'INSERT INTO sleep_entries (user_id, date, bedtime, wake_time, rest_score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [entry.user_id, entry.date, entry.bedtime, entry.wake_time, entry.rest_score]
  );
  return result.rows[0];
}
