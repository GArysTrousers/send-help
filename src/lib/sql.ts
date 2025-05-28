import { DatabaseSync } from "node:sqlite";

export class Sql {

  db: DatabaseSync;

  constructor(filename: string) {
    this.db = new DatabaseSync(filename)
    this.db.exec('PRAGMA foreign_keys = ON');
    this.db.exec('PRAGMA journal_mode = WAL');
  }

  get<T = any>(query: string, data: Record<string, any> = {}) {
    const rows = this.db.prepare(query).all(data)
    return rows.map(row => ({ ...row }) as T);
  }

  getOne<T = any>(query: string, data: Record<string, any> = {}) {
    const row = this.db.prepare(query).get(data)
    return row ? { ...row } as T : null;
  }

  set(query: string, data: any = {}) {
    const res = this.db.prepare(query).run(data)
    return res
  }

  run(query: string) {
    this.db.exec(query)
  }
}