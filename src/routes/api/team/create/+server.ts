import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    name: z.string(),
  })
}

export const POST: RequestHandler = async ({ request, locals }) => {
  permission(locals.session, ['admin'])
  let body = schema.body.parse(await request.json());
  try {
    sql.set(`
      INSERT INTO team (name) 
      VALUES (:name)`, body)
  } catch (e) {
    console.log(e)
  }

  return json({});
};
