import type {  Provider } from "mega-session";
import { DatabaseSync } from "node:sqlite";

export class NodeSqliteProvider implements Provider {

  db: DatabaseSync;

  constructor(db: DatabaseSync) {
    this.db = db
  }

  async init() {

  }

  async deinit() {

  }

  async get(id: string) {
    let res = this.db.prepare("SELECT data FROM session WHERE id = :id").get({ id })
    return res ? res.data as string : null;
  }

  async set(id: string, data: string) {
    let res = this.db.prepare(
      `REPLACE INTO session (id, data) VALUES (:id, :data)`).run({ id, data })
    return !!res.changes;
  }

  async getCount() {
    let res = this.db.prepare("SELECT COUNT(*) FROM session").get({});
    return res ? res.count as number : 0;
  }

  async getAll() {
    let res = this.db.prepare("SELECT id, data as session FROM session").all({})
    return res as {id:string; session:string}[];
  }

  async remove(id: string) {
    let res = this.db.prepare("DELETE FROM session WHERE id = :id").run({ id })
    return !!res;
  }

}