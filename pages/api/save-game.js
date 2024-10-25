// pages/api/save-game.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});  

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { startTime, endTime, players } = req.body;
    const durationSeconds = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert game result
      const gameResult = await client.query(
        `INSERT INTO game_results (start_time, end_time, duration_seconds) 
         VALUES ($1, $2, $3) 
         RETURNING game_id`,
        [startTime, endTime, durationSeconds]
      );

      const gameId = gameResult.rows[0].game_id;

      // Insert player results
      for (const player of players) {
        await client.query(
          `INSERT INTO player_results (game_id, player_name, correct_matches, wrong_attempts)
           VALUES ($1, $2, $3, $4)`,
          [gameId, player.name, player.acertos, player.erros]
        );
      }

      await client.query('COMMIT');
      res.status(200).json({ message: 'Game results saved successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving game results:', error);
    res.status(500).json({ message: 'Error saving game results' });
  }
}