import { PgTransaction } from "drizzle-orm/pg-core";
import { db } from "../../db/connection";

export type Database = typeof db;

export type Transaction = PgTransaction<any, any, any>;