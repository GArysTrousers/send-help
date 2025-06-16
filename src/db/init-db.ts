import { exit } from "node:process";
import { Sql } from "../lib/sql.ts";
import { readFileSync, rmSync, accessSync } from "node:fs";


console.log("script: init db");

let env = new Map<string, string>();
readFileSync('./.env').toString().split(/\r?\n/).forEach((v) => {
  let key = v.split('=', 1)[0]
  let value = v.slice(v.indexOf('=') + 1)
  env.set(key, value)
})
console.log("DB file:", env.get('DB_FILE'));
const dbFile = env.get('DB_FILE')
if (dbFile === undefined) {
  console.log('no DB_FILE var in .env');
  exit();
}


try {
  accessSync(dbFile)
  console.log("deleting old db");
  rmSync(dbFile);
} catch (e) {

}

console.log("creating new db");
const db = new Sql(dbFile)

console.log("creating tables");
db.run(readFileSync('./src/db/Tables.sql').toString());
console.log("loading init data");
db.run(readFileSync('./src/db/InitData.sql').toString());

console.log("finished");