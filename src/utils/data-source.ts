require('dotenv').config();
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import config from 'config';

const databaseConfig = config.get<{
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>('databaseConfig');

export const AppDataSource = new DataSource({
  ...databaseConfig,
  type: 'postgres',
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
