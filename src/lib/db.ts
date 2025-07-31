import { DB_FILE } from "$env/static/private";
import { accessSync, rmSync } from "node:fs";
import { Sql } from "./sql";
import { migrateDb } from "./sqlite-migrator";
import schemaSql from '../db/Schema.sql?raw';
import initDataSql from '../db/InitData.sql?raw';

console.log(DB_FILE);

export function checkDb(dbPath: string, onExist: "migrate" | "delete") {
  try {
    accessSync(dbPath)
    if (onExist === 'migrate') {
      migrateDb(dbPath, schemaSql)
    } else {
      console.log("deleting old db");
      rmSync(dbPath);
    }
  } catch (e) {
    initDb(dbPath)
  }
}

export function initDb(dbPath: string) {
  console.log("creating new db", dbPath);
  const db = new Sql(dbPath)
  console.log("creating tables");
  db.run(schemaSql);
  console.log("loading init data");
  db.run(initDataSql);
}

export const sql = new Sql(DB_FILE)