import { json } from "@sveltejs/kit";
import ldap from "ldapjs-promise";
import { LDAP_BASE, LDAP_PASSWORD, LDAP_USER_BASE, LDAP_URL, LDAP_USER } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/db";

export const POST: RequestHandler = async () => {

  const client = ldap.createClient({
    url: [LDAP_URL]
  })
  try {
    await client.bind(LDAP_USER, LDAP_PASSWORD)
  } catch (err) {
    client.destroy()
    throw "Wrong password"
  }

  try {
    let res = await client.searchReturnAll(
      LDAP_USER_BASE,
      {
        filter: `(objectclass=user)`,
        scope: 'sub',
        attributes: ['sAMAccountName', 'userAccountControl', 'givenName', 'sn', 'memberOf', 'displayName', 'mail'],
        paged: true,
      }
    );

    client.destroy()
    for (const u of res.entries) {
      let user = parseLdapUser(u)
      await sql.set(`INSERT INTO user (userId, fn, ln)
        VALUES (:userId, :fn, :ln)
        ON DUPLICATE KEY UPDATE
        fn = :fn, ln = :ln`, user)
    }

    return json({
      numOfUsers: res.entries.length
    })
  }
  catch (err) {
    client.destroy()
    throw err
  }

};

function parseLdapUser(entry: ldap.SearchEntry) {
  let data = {}
  data.groups = []
  for (const a of entry.attributes) {
    if (a.type == "memberOf" && typeof a.values === 'object') {
      // for (const group of a.values) {
      //   if (groups.has(group)) {
      //     data.groups.push(groups.get(group))
      //   }
      // }
    }
    else if (a.values.length == 1) {
      data[a.type] = a.values[0]
    }
  }
  // console.log(data);

  let user = {
    userId: String(data.sAMAccountName),
    fn: String(data.givenName),
    ln: String(data.sn),
    // dn: String(data.displayName),
    // groups: data.groups.join(', '),
    // enabled: Number(!(data.userAccountControl & 0b10))
  }
  // console.log(user);
  return user;
}

