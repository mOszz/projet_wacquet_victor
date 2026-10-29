// Settings read from environment variables (set by Render, see render.yaml).
// The defaults are only meant for a local PostgreSQL.
export const config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl:
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/pollution_db',
};
