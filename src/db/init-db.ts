
import { DB_FILE } from "$env/static/private";
import { Sql } from "../lib/sql.ts";
import { readFileSync, rmSync, accessSync } from "node:fs";


console.log("init db");

try {
  accessSync(DB_FILE)
  console.log("deleting old db");
  rmSync(DB_FILE);
} catch (e) {

}

console.log("creating new db");
const db = new Sql(DB_FILE)

console.log("creating tables");
db.run(readFileSync('./src/db/Tables.sql').toString());
console.log("loading init data");
db.run(readFileSync('./src/db/InitData.sql').toString());

console.log("finished");