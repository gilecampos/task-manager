import pool from "../database/pool.js"

export class Session {
  async create(data) {
    try {
      const queryString = "INSERT INTO sessions(session_id, data, expires_at) VALUES($1, $2, $3) RETURNING *";
      const payload = [data.session_id, data.info, data.expires_at];
      const res = await pool.query(queryString, payload);
      return res.rows[0].session_id;
    } catch (error) {
      console.error("Error insert seession data:", error);
      throw error;
    }
  }
}