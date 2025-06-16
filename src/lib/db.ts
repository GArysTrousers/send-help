import { DB_FILE } from "$env/static/private";
import { Sql } from "./sql";

console.log(DB_FILE);
export const sql = new Sql(DB_FILE)