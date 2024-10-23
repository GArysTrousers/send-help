import type { Session } from "mega-session";
import type { DbUser } from "./db";

export interface User extends DbUser {
  type: "admin" | "client";
  teams: number[];
}

export interface AppSession extends Session {
  data: {
    user: User
  }
}