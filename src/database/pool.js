import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER || 'root',
  password: process.env.PGPASSWORD || 'root',
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5434,
  database: process.env.PGDATABASE || 'task',
});

export default pool