import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/db";
import { permission } from "$lib/auth";


export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);

  let teams = await sql.get(`SELECT * FROM team`)
  let members = await sql.get(`
    SELECT * FROM user_team u_t
    JOIN user u ON u.userId = u_t.userId`)

    teams = teams.map((team) => ({
      ...team,
      members: members.filter((user) => user.teamId === team.teamId)
    }))

  return json(teams)
};
