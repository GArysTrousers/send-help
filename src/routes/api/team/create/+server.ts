import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    name: z.string(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    await sql.set(`
      INSERT INTO team (name) 
      VALUES (:name)`, body)
  } catch (e) {
    console.log(e)
  }

  return json({});
};
