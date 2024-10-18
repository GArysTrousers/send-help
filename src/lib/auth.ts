import { error } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import { sql } from "./db";
import type { AppSession } from "./types/auth";


export async function authMySql(username: string, password: string) {
  try {
    let user = await sql.getOne(
      `SELECT * FROM user WHERE username = :username`,
      { username }
    )
    if (user) {
      if (!user.passhash || await bcrypt.compare(password, user.passhash)) {
        return {
          userId: user.userId,
          username: user.username,
          type: user.type,
          permissions: user.permissions
        }
      }
    }
  } catch (e) { }
  return null;
}

export async function authLdap(username: string, password: string) {
  try {
    let user = await sql.getOne(
      `SELECT * FROM user WHERE userId = :username`,
      { username }
    )
    if (user) {
      if (true || !user.passhash || await bcrypt.compare(password, user.passhash)) {
        return {
          userId: user.userId,
          fn: user.fn,
          ln: user.ln,
        }
      }
    }
  } catch (e) { }
  return null;
}



export function permission(session: AppSession) {
  if (!session || !session.data.user) throw error(401);
}