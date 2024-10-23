import { error } from "@sveltejs/kit";
import bcrypt from "bcryptjs";
import ldap from "ldapjs-promise";
import { sql } from "./db";
import type { AppSession, User } from "./types/session";
import { LDAP_DOMAIN, LDAP_URL } from "$env/static/private";
import type { DbUser, DbUserTeam } from "./types/db";


export async function authenticate(username: string, password: string): Promise<User | null> {
  try {
    if (!(await ldapAuth(username, password))) return null

    let user = await sql.getOne<DbUser>(
      `SELECT * FROM user WHERE userId = :username`,
      { username }
    )
    let teams = await sql.get<DbUserTeam>(
      `SELECT * FROM user_team WHERE userId = :username`,
      { username }
    )
    if (user !== null) {
      return {
        userId: user.userId,
        fn: user.fn,
        ln: user.ln,
        permissions: user.permissions,
        type: teams.length === 0 ? "client" : "admin",
        teams: teams.map((v) => (v.teamId))
      }
    }
  } catch (e) { }
  return null;
}

async function ldapAuth(username: string, password: string): Promise<boolean> {
  let result = true;
  const client = ldap.createClient({
    url: [LDAP_URL]
  })
  try {
    await client.bind(`${username}@${LDAP_DOMAIN}`, password)
  } catch (e) {
    console.log(e);
    result = false;
  }
  client.destroy()
  return result;
}



export function permission(session: AppSession) {
  if (!session || !session.data.user) throw error(401);
}