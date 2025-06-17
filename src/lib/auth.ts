import { error } from "@sveltejs/kit";
import { sql } from "./db";
import type { AppSession, User } from "./types/session";
import { LDAP_DOMAIN, LDAP_URL } from "$env/static/private";
import type { DbUser, DbUserTeam } from "./types/db";
import { Client } from "ldapts";
import bcrypt from "bcryptjs";


export async function authenticate(username: string, password: string): Promise<User | null> {
  try {
    username = username.toLowerCase()
    let user = sql.getOne<DbUser>(
      `SELECT * FROM user WHERE userId = :username`,
      { username }
    )
    if (user === null) return null;
    if (user.src === 'ldap') {
      if ((await ldapAuth(username, password)) === false) return null;
    } else if (user.src === 'local') {
      if ((await localAuth(user, password)) === false) return null;
    } else {
      return null
    }
    let teams = sql.get<DbUserTeam>(
      `SELECT * FROM user_team WHERE userId = :username`,
      { username }
    )

    return {
      userId: user.userId,
      passhash: null,
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
  if (password === '') return false;
  const client = new Client({
    url: LDAP_URL,
  });
  try {
    await client.bind(`${username}@${LDAP_DOMAIN}`, password);
  } catch (e) {
    // console.log(e);
    result = false;
  }
  client.unbind()
  return result;
}

async function localAuth(user: DbUser, password: string): Promise<boolean> {
  if (user.src !== 'local' || user.passhash === null) return false;
  if (user.passhash === '' && password === '') return true;
  else return (await bcrypt.compare(password, user.passhash));
}

export function permission(session: AppSession, allowed: string[] = []) {
  if (!session || !session.data.user) throw error(401);
  if (allowed.length > 0 && !allowed.includes(session.data.user.type))
    throw error(403);
}
