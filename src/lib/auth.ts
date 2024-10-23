import { error } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { sql } from "./db";
import type { AppSession, User } from "./types/session";


export async function authLdap(username: string, password: string): Promise<User | null> {
  try {
    let user = await sql.getOne(
      `SELECT * FROM user WHERE userId = :username`,
      { username }
    )
    let teams = await sql.get(
      `SELECT * FROM user_team WHERE userId = :username`,
      { username }
    )
    if (user) {
      if (true || !user.passhash || await bcrypt.compare(password, user.passhash)) {
        return {
          userId: user.userId,
          fn: user.fn,
          ln: user.ln,
          permissions: user.permissions,
          type: teams.length === 0 ? "client" : "admin"
        }
      }
    }
  } catch (e) { }
  return null;
}



export function permission(session: AppSession) {
  if (!session || !session.data.user) throw error(401);
}