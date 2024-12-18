import { error, json } from '@sveltejs/kit';
import { z } from "zod";
import { sql } from "$lib/db";
import { permission } from '$lib/auth.js';

const schema = {
  body: z.object({
    message: z.string(),
    ticketId: z.number(),
  })
}

export async function POST({ request, locals }) {
  permission(locals.session)
  let body = schema.body.parse(await request.json());
  try {
    await sql.set(`
      INSERT INTO comment (message, ticketId, userId) 
      VALUES (:message, :ticketId, :userId)`, {
        ...body,
        userId: locals.session.data.user.userId
      })
  } catch (e) {
    console.log(e)
  }

  return json({});
};
