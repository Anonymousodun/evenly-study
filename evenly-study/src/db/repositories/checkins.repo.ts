import { query } from '../connection';
import { DailyCheckIn } from '../../types';

export async function getDailyCheckIns(userId: string): Promise<DailyCheckIn[]> {
  const result = await query('SELECT * FROM daily_checkins WHERE user_id = $1 ORDER BY date DESC', [userId]);
  return result.rows;
}

export async function createDailyCheckIn(checkin: Omit<DailyCheckIn, 'id' | 'created_at'>): Promise<DailyCheckIn> {
  const result = await query(
    'INSERT INTO daily_checkins (user_id, date, mood_score) VALUES ($1, $2, $3) RETURNING *',
    [checkin.user_id, checkin.date, checkin.mood_score]
  );
  return result.rows[0];
}
