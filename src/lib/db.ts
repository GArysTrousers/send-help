import { Sql } from "./sql";


export const sql = new Sql({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'send-help',
})