import { DB_FILE } from "$env/static/private";
import { Sql } from "./sql";

export const sql = new Sql(DB_FILE)