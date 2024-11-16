import { AppConfig } from '@/types/AppConfig';

const config: AppConfig = {
  database: {
    databaseUrl: process.env.DATABASE_URL ?? '',
  },
  server: {
    port: 3010,
  },
  api: {
    baseClientUrl: '*',
  },
};

export default config;
