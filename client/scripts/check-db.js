const { Client } = require('pg');

(async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('[Check DB] DATABASE_URL is not set');
    process.exit(1);
  }

  console.log('[Check DB] Connecting to database...');
  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    console.log('[Check DB] Connection successful');
    const res = await client.query('SELECT NOW()');
    console.log('[Check DB] Database time:', res.rows[0].now);
  } catch (err) {
    console.error('[Check DB] Connection failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
