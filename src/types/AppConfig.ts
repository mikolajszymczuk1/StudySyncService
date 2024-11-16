export type DatabaseConfig = {
  databaseUrl: string;
};

export type ServerConfig = {
  port: number;
};

export type ApiConfig = {
  baseClientUrl: string;
};

export type AppConfig = {
  database: DatabaseConfig;
  server: ServerConfig;
  api: ApiConfig;
};
