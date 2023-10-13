import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { AllMigration1696964528687 } from "./migration/1696964528687-AllMigration";
import { Client } from "./entitities/Client";
import { Banker } from "./entitities/Banker";
import { Transaction } from "./entitities/Transaction";

dotenv.config();

export const PostgreDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Client, Banker, Transaction],
  migrations: [AllMigration1696964528687],
  subscribers: [],
});
