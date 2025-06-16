import { json } from "@sveltejs/kit";
import { LDAP_PASSWORD, LDAP_URL, LDAP_USER, LDAP_USER_BASES } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/db";
import { Client, type Entry } from "ldapts";

export const POST: RequestHandler = async () => {

  const client = new Client({
    url: LDAP_URL,
  });
  try {
    await client.bind(LDAP_USER, LDAP_PASSWORD)
  } catch (err) {
    await client.unbind()
    throw "Wrong password"
  }

  const bases = LDAP_USER_BASES.split('|')
  let numOfUsers = 0

  try {
    for (const userBase of bases) {
      let res = await client.search(
        userBase,
        {
          filter: `(objectclass=user)`,
          scope: 'sub',
          attributes: ['sAMAccountName', 'userAccountControl', 'givenName', 'sn', 'memberOf', 'displayName', 'mail'],
          paged: true,
        }
      );

      res.searchEntries

      for (const u of res.searchEntries) {
        let user = parseLdapUser(u)
        sql.set(`INSERT INTO user (userId, fn, ln, email, src)
          VALUES (:userId, :fn, :ln, :email, :src)
          ON CONFLICT (userId) DO UPDATE SET
          fn = :fn, ln = :ln, email = :email, src = :src`, user)
        numOfUsers += 1;
      }
    }
  }
  catch (err) {
    client.unbind()
    throw err
  }

  client.unbind()

  return json(String(numOfUsers))
}

function parseLdapUser(entry: Entry) {
  let user = {
    userId: String(entry.sAMAccountName),
    fn: String(entry.givenName),
    ln: String(entry.sn),
    email: String(entry.mail),
    src: 'ldap',
  }
  return user;
}

