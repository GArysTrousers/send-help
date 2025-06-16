import { createPool, type Pool, type QueryResult, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";

export class Sql {

  pool: Pool;

  constructor(config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  }) {
    this.pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      namedPlaceholders: true,
    });
  }

  async get<T = any>(query: string, data: Record<string, any> = {}) {
    const res = await this.pool.execute<RowDataPacket[]>(query, data)
    return res[0] as T[]
  }

  async getOne<T = any>(query: string, data: Record<string, any> = {}) {
    const res = await this.pool.execute<RowDataPacket[]>(query, data)
    if (res[0].length > 0)
      return res[0][0] as T
    else
      return null
  }

  async set(query: string, data: any = {}) {
    const res = await this.pool.execute<ResultSetHeader>(query, data)
    return res[0]
  }
}