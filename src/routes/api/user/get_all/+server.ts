import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { sql } from "$lib/db";
import { permission } from "$lib/auth";


export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session);

  let res = await sql.get(`
  SELECT * FROM user`)

  return json(res)
};
