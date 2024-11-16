import { AppConfig } from '@/types/AppConfig';

const config: AppConfig = {
  database: {
    databaseUrl: process.env.DATABASE_URL ?? '',
  },
  server: {
    port: 8080,
  },
  api: {
    baseClientUrl: `http://localhost:5173`,
  },
};

export default config;
