import { error } from "@sveltejs/kit";
import { sql } from "./db";
import type { AppSession, User } from "./types/session";
import { LDAP_DOMAIN, LDAP_URL } from "$env/static/private";
import type { DbUser, DbUserTeam } from "./types/db";
import { Client } from "ldapts";


export async function authenticate(username: string, password: string): Promise<User | null> {
  try {
    username = username.toLowerCase()
    let user = sql.getOne<DbUser>(
      `SELECT * FROM user WHERE userId = :username`,
      { username }
    )
    if (user === null) return null;
    if (await ldapAuth(username, password) === false) return null;
    let teams = sql.get<DbUserTeam>(
      `SELECT * FROM user_team WHERE userId = :username`,
      { username }
    )

    return {
      userId: user.userId,
      fn: user.fn,
      ln: user.ln,
      email: user.email,
      permissions: user.permissions,
      type: teams.length === 0 ? "client" : "admin",
      teams: teams.map((v) => (v.teamId)),
      src: user.src
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

async function ldapAuth(username: string, password: string): Promise<boolean> {
  let result = true;
  const client = new Client({
    url: LDAP_URL,
  });
  try {
    await client.bind(`${username}@${LDAP_DOMAIN}`, password)
  } catch (e) {
    console.log(e);
    result = false;
  }
  client.unbind()
  return result;
}

export function permission(session: AppSession, allowed: string[] = []) {
  if (!session || !session.data.user) throw error(401);
  if (allowed.length > 0 && !allowed.includes(session.data.user.type))
    throw error(403);
}
