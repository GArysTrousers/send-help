import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "$env/static/private";
import { Sql } from "./sql";


export const sql = new Sql({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
})