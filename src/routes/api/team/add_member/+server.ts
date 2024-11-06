import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    userId: z.string(),
    teamId: z.number(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    await sql.set(`
      INSERT INTO user_team (userId, teamId) 
      VALUES (:userId, :teamId)`, body)
  } catch (e) {
    console.log(e)
  }

  return json({});
};
